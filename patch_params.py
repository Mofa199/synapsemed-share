import os
import glob
import re

api_dir = os.path.join('app')
files = glob.glob(os.path.join(api_dir, '**/*.ts'), recursive=True) + glob.glob(os.path.join(api_dir, '**/*.tsx'), recursive=True)

# Replace type { params: { id: string } } with { params: Promise<{ id: string }> }
# And change const id = params.id to const { id } = await params
# Or const { id } = params to const { id } = await params

changed_files = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
        
    # Check for Next.js 15 breaking route handler types:
    # { params }: { params: { id: string } } -> { params }: { params: Promise<{ id: string }> }
    content = re.sub(r"\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*([a-zA-Z0-9_]+)\s*:\s*string\s*\}\s*\}", r"{ params }: { params: Promise<{ \1: string }> }", content)

    # Check for Next.js 15 breaking route handler types with Any:
    # { params }: any -> { params }: { params: Promise<any> }
    # Let's target the exact ones causing errors

    # Replace usages:
    # const conceptId = params.id -> const conceptId = (await params).id
    content = re.sub(r"=\s*params\.([a-zA-Z0-9_]+)", r"= (await params).\1", content)
    
    # Destructuring:
    # const { id } = params -> const { id } = await params
    content = re.sub(r"const\s+\{\s*([a-zA-Z0-9_,\s]+)\s*\}\s*=\s*params", r"const { \1 } = await params", content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        changed_files += 1
        print(f"Updated {file}")

print(f"Updated {changed_files} files.")
