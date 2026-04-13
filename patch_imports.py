import os
import glob
import re

api_dir = os.path.join('app', 'api')
files = glob.glob(os.path.join(api_dir, '**/*.ts'), recursive=True)

pattern = re.compile(r"import\s+{\s*getServerSession\s*}\s+from\s+['\"]next-auth(?:/next)*['\"]")
replacement = "import { getServerSession } from '@/lib/server-auth'"

changed_count = 0

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content, num_subs = pattern.subn(replacement, content)
    
    if num_subs > 0:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        changed_count += 1
        print(f"Updated {file}")

print(f"Total files updated: {changed_count}")
