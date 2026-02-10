import asyncio
import aiohttp
import aiofiles
import os
import sys
import argparse
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import json
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

class WebScraper:
    def __init__(self, start_urls, output_dir, depth=2, max_pages=100, concurrent=10, timeout=30, user_agent=None, allowed_domains=None, save_html=False):
        self.start_urls = start_urls
        self.output_dir = output_dir
        self.depth = depth
        self.max_pages = max_pages
        self.concurrent = concurrent
        self.timeout = timeout
        self.user_agent = user_agent or "Mozilla/5.0 (compatible; AIArkScraper/1.0)"
        self.allowed_domains = set(allowed_domains) if allowed_domains else set()
        self.save_html = save_html
        
        self.visited_urls = set()
        self.queued_urls = set()
        self.pages_scraped = 0
        self.errors = {}
        self.metadata = {
            "start_time": datetime.now().isoformat(),
            "pages": []
        }
        
        # Initialize allowed domains from start URLs if not provided
        if not self.allowed_domains:
            for url in start_urls:
                domain = urlparse(url).netloc
                self.allowed_domains.add(domain)

    async def fetch(self, session, url):
        try:
            async with session.get(url, timeout=self.timeout, headers={"User-Agent": self.user_agent}) as response:
                if response.status != 200:
                    self.errors[url] = f"HTTP {response.status}"
                    return None
                return await response.text()
        except Exception as e:
            self.errors[url] = str(e)
            return None

    def extract_links(self, html, base_url):
        soup = BeautifulSoup(html, 'html.parser')
        links = set()
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            full_url = urljoin(base_url, href)
            parsed = urlparse(full_url)
            
            # Clean URL (remove fragment)
            clean_url = parsed.scheme + "://" + parsed.netloc + parsed.path
            if parsed.query:
                clean_url += "?" + parsed.query
                
            if parsed.netloc in self.allowed_domains:
                links.add(clean_url)
        return links

    async def save_page(self, url, content):
        parsed = urlparse(url)
        domain = parsed.netloc
        path = parsed.path.strip('/')
        if not path:
            path = "index"
        elif path.endswith('/'):
            path = path + "index"
            
        # Create safe filename
        safe_path = os.path.join(self.output_dir, domain, path)
        if self.save_html:
            file_path = safe_path + ".html"
        else:
            file_path = safe_path + ".txt"
            
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        try:
            async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
                if self.save_html:
                    await f.write(content)
                else:
                    soup = BeautifulSoup(content, 'html.parser')
                    # Remove unwanted elements
                    for element in soup(['script', 'style', 'nav', 'footer', 'iframe', 'svg']):
                        element.decompose()
                    text = soup.get_text(separator='\n\n')
                    
                    # Basic cleaning
                    lines = [line.strip() for line in text.splitlines()]
                    clean_text = '\n'.join(line for line in lines if line)
                    
                    header = f"URL: {url}\nScraped: {datetime.now().isoformat()}\n\n{'='*80}\n\n"
                    await f.write(header + clean_text)
            
            self.metadata["pages"].append({
                "url": url,
                "file_path": file_path,
                "timestamp": datetime.now().isoformat()
            })
            return True
        except Exception as e:
            logger.error(f"Error saving {url}: {e}")
            return False

    async def process_url(self, session, url, current_depth):
        if url in self.visited_urls or self.pages_scraped >= self.max_pages:
            return set()
        
        logger.info(f"Scraping: {url} (Depth: {current_depth})")
        self.visited_urls.add(url)
        
        content = await self.fetch(session, url)
        if not content:
            return set()
            
        await self.save_page(url, content)
        self.pages_scraped += 1
        
        if current_depth < self.depth:
            return self.extract_links(content, url)
        return set()

    async def run(self):
        os.makedirs(self.output_dir, exist_ok=True)
        
        async with aiohttp.ClientSession() as session:
            queue = [(url, 0) for url in self.start_urls]
            self.queued_urls.update(self.start_urls)
            
            while queue and self.pages_scraped < self.max_pages:
                # Process a batch of URLs concurrently
                batch_size = min(self.concurrent, len(queue))
                batch = queue[:batch_size]
                queue = queue[batch_size:]
                
                tasks = []
                for url, depth in batch:
                    tasks.append(self.process_url(session, url, depth))
                
                results = await asyncio.gather(*tasks)
                
                # Add new links to queue
                for links in results:
                    for link in links:
                        if link not in self.visited_urls and link not in self.queued_urls:
                            queue.append((link, depth + 1))
                            self.queued_urls.add(link)
        
        # Save metadata
        self.metadata["end_time"] = datetime.now().isoformat()
        self.metadata["pages_scraped"] = self.pages_scraped
        self.metadata["errors"] = self.errors
        
        with open(os.path.join(self.output_dir, "_metadata.json"), 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, indent=2)
            
        logger.info(f"Scraping completed. {self.pages_scraped} pages scraped.")

async def main():
    parser = argparse.ArgumentParser(description="Web Scraper")
    parser.add_argument("urls", nargs="+", help="Start URLs")
    parser.add_argument("output_dir", help="Output directory")
    parser.add_argument("--depth", type=int, default=2, help="Depth to follow links")
    parser.add_argument("--max-pages", type=int, default=100, help="Maximum pages to scrape")
    parser.add_argument("--concurrent", type=int, default=10, help="Concurrent requests")
    parser.add_argument("--save-html", action="store_true", help="Save raw HTML instead of text")
    
    args = parser.parse_args()
    
    scraper = WebScraper(
        start_urls=args.urls,
        output_dir=args.output_dir,
        depth=args.depth,
        max_pages=args.max_pages,
        concurrent=args.concurrent,
        save_html=args.save_html
    )
    
    await scraper.run()

if __name__ == "__main__":
    asyncio.run(main())