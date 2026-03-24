import os
import re

# 定义docs目录路径
docs_dir = r'd:\git\SaltFishGC.github.io\docs'

# 检查文件是否有frontmatter
def has_frontmatter(content):
    return content.strip().startswith('---')

# 从文件名提取标题
def extract_title(filename):
    # 移除.md后缀
    title = filename[:-3]
    # 替换下划线和连字符为空格
    title = re.sub(r'[_-]', ' ', title)
    # 首字母大写
    title = title.title()
    return title

# 遍历所有md文件
for root, dirs, files in os.walk(docs_dir):
    for file in files:
        if file.endswith('.md'):
            file_path = os.path.join(root, file)
            
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # 检查是否有frontmatter
            if not has_frontmatter(content):
                # 提取标题
                title = extract_title(file)
                # 生成frontmatter
                frontmatter = f"---\ntitle: {title}\ndate: 2026-3-24\n---\n\n"
                # 新内容
                new_content = frontmatter + content
                # 写回文件
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Added frontmatter to: {file_path}')

print('\nDone!')