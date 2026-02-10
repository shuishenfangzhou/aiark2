import os
import json
from bs4 import BeautifulSoup

def parse_html():
    file_path = 'd:/aiark/temp_scrape/ai-bot.cn/index.html'
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    
    tools_data = []
    
    # Find all category sections
    # Based on observation: <h4 class="text-gray text-lg m-0"> contains category name
    # The tools are in the following <div class="row">
    
    category_headers = soup.find_all('h4', class_='text-gray text-lg m-0')
    
    print(f"Found {len(category_headers)} categories.")
    
    for header in category_headers:
        category_name = header.get_text().strip()
        
        # The icon is usually inside the h4, we might want to skip it or clean the text
        # The text might be like "AI写作工具", but get_text() will include the icon class text if any (usually empty for <i>)
        
        # Find the parent container that holds this header, then look for the next sibling row
        # Actually, looking at the HTML:
        # <div class="d-flex flex-fill align-items-center mb-4">...</div>
        # <div class="row io-mx-n2">...</div>
        
        header_container = header.find_parent('div', class_='d-flex')
        if not header_container:
            continue
            
        tools_row = header_container.find_next_sibling('div', class_='row')
        if not tools_row:
            continue
            
        tool_cards = tools_row.find_all('div', class_='url-card')
        
        print(f"Category: {category_name}, Tools: {len(tool_cards)}")
        
        for card in tool_cards:
            try:
                # Name
                name_tag = card.find('strong')
                name = name_tag.get_text().strip() if name_tag else "Unknown"
                
                # Description
                desc_tag = card.find('p', class_='overflowClip_1')
                description = desc_tag.get_text().strip() if desc_tag else ""
                
                # URL
                link_tag = card.find('a', class_='card')
                url = link_tag.get('data-url') if link_tag and link_tag.get('data-url') else ""
                if not url and link_tag:
                    url = link_tag.get('href')
                
                # Icon
                img_tag = card.find('img')
                icon = ""
                if img_tag:
                    icon = img_tag.get('data-src')
                    if not icon:
                        icon = img_tag.get('src')
                
                # Pricing (Not explicitly in the card, usually requires detail page, defaulting to Free/Freemium)
                pricing = "Freemium" 
                
                tool = {
                    "name": name,
                    "description": description,
                    "url": url,
                    "icon": icon,
                    "category": category_name,
                    "pricing": [pricing],
                    "features": []
                }
                
                tools_data.append(tool)
            except Exception as e:
                print(f"Error parsing card: {e}")
                continue

    output_path = 'd:/aiark/src/data/extracted_tools.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(tools_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully extracted {len(tools_data)} tools to {output_path}")

if __name__ == "__main__":
    parse_html()
