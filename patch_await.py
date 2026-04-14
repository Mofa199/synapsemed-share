import os
import glob
import re

api_dir = os.path.join('app')
files = glob.glob(os.path.join(api_dir, '**/*.tsx'), recursive=True) + glob.glob(os.path.join('components', '**/*.tsx'), recursive=True)

changed_files = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # If it's a client component, `await` is illegal at the top level
    is_client = 'use client' in content or '"use client"' in content or "'use client'" in content
    
    if is_client and ('await params' in content):
        # We need to ensure React is imported if we are using React.use
        if 'import React' not in content and 'import * as React' not in content:
            # simple inject at top
            content = 'import React from "react";\n' + content
            
        content = content.replace('= (await params).', '= React.use(params).')
        content = content.replace('= await params', '= React.use(params)')

    # Also handle the case where it's a Server Component but the function wasn't async!
    # If the file has `await params` but the function is `export default function`, it needs to be `export default async function`
    if not is_client and 'await params' in content:
        content = re.sub(r'export default function ([A-Za-z0-9_]+)\(', r'export default async function \1(', content)
        content = re.sub(r'export function ([A-Za-z0-9_]+)\(', r'export async function \1(', content)
        # Handle const Page = ({ params }) => { ...}
        content = re.sub(r'const ([A-Za-z0-9_]+) = \(\{', r'const \1 = async ({', content)

    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        changed_files += 1
        print(f"Updated {file}")

print(f"Updated {changed_files} files.")
