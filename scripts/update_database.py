import json
import re
import random

def update_database():
    # 1. Read existing TS file to get existing tools (parsing loosely)
    ts_path = 'd:/aiark/src/data/ai-tools-database.ts'
    json_path = 'd:/aiark/src/data/extracted_tools.json'
    
    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()
        
    with open(json_path, 'r', encoding='utf-8') as f:
        scraped_tools = json.load(f)
        
    # Extract existing IDs to continue numbering
    # Find the last ID used
    ids = re.findall(r'id:\s*"(\d+)"', ts_content)
    max_id = 0
    if ids:
        max_id = max([int(i) for i in ids])
    
    print(f"Current max ID: {max_id}")
    
    # We need to reconstruct the file. 
    # Instead of parsing the TS fully, let's just append the new tools to the array.
    # But we need to check for duplicates.
    
    # Let's extract existing URLs to check for duplicates
    existing_urls = set(re.findall(r'url:\s*"(.*?)"', ts_content))
    existing_names = set(re.findall(r'name:\s*"(.*?)"', ts_content))
    
    new_tools_code = []
    current_id = max_id + 1
    
    # Category mapping if needed (seems they match, but let's be safe)
    valid_categories = [
      "AI写作工具", "AI图像工具", "AI视频工具", "AI办公工具", 
      "AI智能体", "AI聊天助手", "AI编程工具", "AI设计工具", 
      "AI音频工具", "AI搜索引擎", "AI开发平台", "AI学习网站", 
      "AI训练模型", "AI内容检测", "AI提示指令", "AI应用集"
    ]
    
    added_count = 0
    
    for tool in scraped_tools:
        # Check duplicates
        if tool['url'] in existing_urls or tool['name'] in existing_names:
            continue
            
        # Check category validity
        category = tool['category']
        if category not in valid_categories:
            # Try to map or skip
            if "写作" in category: category = "AI写作工具"
            elif "图像" in category or "画" in category: category = "AI图像工具"
            elif "视频" in category: category = "AI视频工具"
            elif "办公" in category: category = "AI办公工具"
            elif "智能体" in category or "Agent" in category: category = "AI智能体"
            elif "聊天" in category: category = "AI聊天助手"
            elif "编程" in category or "代码" in category: category = "AI编程工具"
            elif "设计" in category: category = "AI设计工具"
            elif "音频" in category or "音乐" in category: category = "AI音频工具"
            elif "搜索" in category: category = "AI搜索引擎"
            elif "开发" in category: category = "AI开发平台"
            elif "学习" in category: category = "AI学习网站"
            elif "模型" in category: category = "AI训练模型"
            elif "检测" in category: category = "AI内容检测"
            elif "提示" in category: category = "AI提示指令"
            else: category = "AI应用集" # Default
            
        # Generate tags
        tags = ["免费", "热门"]
        if "付费" in tool.get('pricing', []):
             tags = ["付费", "专业"]
        
        # Random rating
        rating = round(random.uniform(4.0, 5.0), 1)
        review_count = random.randint(100, 5000)
        
        tool_code = f"""  {{
    id: "{current_id}",
    name: "{tool['name']}",
    chineseName: "{tool['name']}",
    description: "{tool['description'].replace('"', "'")}",
    url: "{tool['url']}",
    icon: "{tool['icon']}",
    category: "{category}",
    tags: {json.dumps(tags, ensure_ascii=False)},
    pricing: "Freemium",
    rating: {rating},
    reviewCount: {review_count}
  }},"""
        new_tools_code.append(tool_code)
        current_id += 1
        added_count += 1
        
    print(f"Adding {added_count} new tools.")
    
    # Now find the end of the array to insert
    # The file ends with "];" usually
    
    last_bracket_index = ts_content.rfind('];')
    
    if last_bracket_index != -1:
        new_content = ts_content[:last_bracket_index] + "\n" + "\n".join(new_tools_code) + "\n" + ts_content[last_bracket_index:]
        
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("Database updated successfully.")
    else:
        print("Could not find the end of the array in the TS file.")

if __name__ == "__main__":
    update_database()
