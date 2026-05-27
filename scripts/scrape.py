import asyncio
import aiohttp
from bs4 import BeautifulSoup
import logging
import json
import os
from typing import List, Dict, Any, Optional
import re # Added import for re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AiBotScraper:
    def __init__(self, base_url: str = "https://ai-bot.cn"):
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.tools_database_path = os.path.join('src', 'data', 'ai-tools-database.ts')
        self.existing_tools = self._load_existing_tools()

    def _load_existing_tools(self) -> Dict[str, Any]:
        """Loads existing tools from the TypeScript file."""
        if not os.path.exists(self.tools_database_path):
            return {}
        try:
            with open(self.tools_database_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract the JSON array part from the TypeScript file
                json_str_match = re.search(r'export const aiTools: AiTool\[\] = (\[.*?\]);', content, re.DOTALL)
                if json_str_match:
                    json_str = json_str_match.group(1).strip()
                    tools_list = json.loads(json_str)
                    return {tool['title']: tool for tool in tools_list}
                else:
                    logger.warning(f"Could not find 'aiTools' array in {self.tools_database_path}")
                    return {}
        except (FileNotFoundError, json.JSONDecodeError) as e:
            logger.warning(f"Could not load existing tools from {self.tools_database_path}: {e}")
            return {}

    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetches the content of a given URL."""
        try:
            async with aiohttp.ClientSession(headers=self.headers) as session:
                async with session.get(url) as response:
                    response.raise_for_status()  # Raise an exception for HTTP errors
                    return await response.text()
        except aiohttp.ClientError as e:
            logger.error(f"Error fetching {url}: {e}")
            return None

    def parse_categories_from_ai_tools_page(self, html: str) -> List[Dict[str, str]]:
        """Parses category names and anchors from the /ai-tools page sidebar."""
        soup = BeautifulSoup(html, 'html.parser')
        categories = []
        try:
            sidebar = soup.find('div', id='sidebar')
            if sidebar:
                menu_inner = sidebar.find('div', class_='sidebar-menu-inner')
                if menu_inner:
                    # Find all direct <li> children of the first <ul> in sidebar-menu-inner
                    # This captures main categories and also the <li> that contains sub-categories
                    main_ul = menu_inner.find('ul')
                    if main_ul:
                        for li_tag in main_ul.find_all('li', recursive=True): # Use recursive=True to get nested li's
                            a_tag = li_tag.find('a', href=True)
                            if a_tag and a_tag.find('span') and a_tag['href'].startswith('https://ai-bot.cn/#term-'):
                                category_name = a_tag.find('span').get_text(strip=True)
                                category_anchor = a_tag['href']
                                categories.append({"name": category_name, "anchor": category_anchor})
                    else:
                        logger.warning("Main category ul not found within sidebar-menu-inner.")
                else:
                    logger.warning("sidebar-menu-inner not found within sidebar.")
            else:
                logger.warning("Sidebar with id='sidebar' not found.")
        except Exception as e:
            logger.error(f"Error parsing categories: {e}")
        return categories

    def parse_tools_from_ai_tools_page(self, html: str) -> List[Dict[str, Any]]:
        """
        Parses AI tools from the /ai-tools page.
        All tools are expected to be on this single page.
        """
        soup = BeautifulSoup(html, 'html.parser')
        tools = []
        try:
            list_content = soup.find('div', class_='col-lg-9 col-md-12 list-content')
            if list_content:
                tool_cards = list_content.find_all('div', class_='url-card card')
                for card in tool_cards:
                    title_tag = card.find('div', class_='url-info').find('div', class_='text-sm')
                    tool_url_tag = card.find('a', class_='url-card-btn', href=True)
                    logo_tag = card.find('div', class_='url-img').find('img')
                    description_tag = card.find('p', class_='text-xs text-muted')
                    
                    title = title_tag.get_text(strip=True) if title_tag else "Unknown Title"
                    
                    if title in self.existing_tools:
                        logger.info(f"Skipping existing tool: {title}")
                        continue

                    tool_url = self.base_url + tool_url_tag['href'] if tool_url_tag and tool_url_tag['href'].startswith('/') else (tool_url_tag['href'] if tool_url_tag else '#')
                    logo = logo_tag['data-src'] if logo_tag and logo_tag.has_attr('data-src') else (self.base_url + logo_tag['src'] if logo_tag and logo_tag['src'].startswith('/') else (logo_tag['src'] if logo_tag else ''))
                    description = description_tag.get_text(strip=True) if description_tag else ''

                    # Extract all tags and determine the primary category
                    raw_tags = [tag.get_text(strip=True) for tag in card.find_all('a', class_='tool-tag')]
                    category_name = raw_tags[0] if raw_tags else "未分类" # Assume the first tag is the primary category
                    
                    # Remove the primary category from the general tags list if it's explicitly set as the category
                    tags = [tag for tag in raw_tags if tag != category_name]


                    tools.append({
                        "title": title,
                        "url": tool_url,
                        "logo": logo,
                        "description": description,
                        "category": category_name,
                        "tags": tags
                    })
            else:
                logger.warning("List content div with class 'col-lg-9 col-md-12 list-content' not found.")
        except Exception as e:
            logger.error(f"Error parsing tools from AI Tools page: {e}")
        return tools

    async def scrape_all_tools(self) -> List[Dict[str, Any]]:
        """Scrapes all tools from the /ai-tools page."""
        ai_tools_page_url = f"{self.base_url}/ai-tools"
        logger.info(f"Fetching AI Tools page: {ai_tools_page_url}")
        ai_tools_html = await self.fetch_page(ai_tools_page_url)

        if not ai_tools_html:
            logger.error("Failed to fetch /ai-tools page. Cannot scrape tools.")
            return []

        categories = self.parse_categories_from_ai_tools_page(ai_tools_html)
        if categories:
            logger.info(f"Found {len(categories)} categories: {[c['name'] for c in categories]}")
        else:
            logger.warning("No categories found on /ai-tools page using current selectors.")

        new_tools = self.parse_tools_from_ai_tools_page(ai_tools_html)
        
        # Additional logic for pagination if needed (not implemented yet, assuming single page for now)
        
        return new_tools

    def update_tools_database(self, new_tools: List[Dict[str, Any]]):
        """Updates the ai-tools-database.ts file with new tools."""
        if not new_tools:
            logger.info("No new tools to add to the database.")
            return

        current_tools_list = list(self.existing_tools.values())
        updated_tools_list = current_tools_list + new_tools

        # Ensure unique tools by title
        seen_titles = set()
        deduplicated_tools = []
        for tool in updated_tools_list:
            if tool['title'] not in seen_titles:
                deduplicated_tools.append(tool)
                seen_titles.add(tool['title'])
            else:
                logger.debug(f"Duplicate tool '{tool['title']}' found and skipped during update.")


        # Format for TypeScript export
        ts_content = f"""// This file is automatically generated by scripts/scrape.py
// Do not edit this file directly.
import {{ AiTool }} from '@/types';

export const aiTools: AiTool[] = {json.dumps(deduplicated_tools, indent=2, ensure_ascii=False)};
"""
        os.makedirs(os.path.dirname(self.tools_database_path), exist_ok=True)
        with open(self.tools_database_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        logger.info(f"Updated {self.tools_database_path} with {len(deduplicated_tools)} tools.")


    async def run(self):
        """Main method to run the scraper."""
        logger.info(f"Starting AI-Bot.cn scraping from {self.base_url}")
        new_tools = await self.scrape_all_tools()
        if new_tools:
            self.update_tools_database(new_tools)
            logger.info(f"Scraping complete. Added {len(new_tools)} new tools.")
        else:
            logger.info("Scraping complete. No new tools were added.")

if __name__ == "__main__":
    import re # Added import for re
    scraper = AiBotScraper()
    asyncio.run(scraper.run())
