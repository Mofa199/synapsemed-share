import glob
import os
import re

def fix_directives():
    files = glob.glob('app/**/*.tsx', recursive=True) + glob.glob('app/**/*.ts', recursive=True)
    count = 0
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Check if 'use client' is present but not at the very top
        lines = content.strip().split('\n')
        if not lines: continue
        
        has_use_client = any('use client' in line for line in lines[:5])
        is_at_top = lines[0].strip().startswith(('"use client"', "'use client'"))
        
        if has_use_client and not is_at_top:
            print(f"Fixing {f}...")
            # Extract use client
            clean_lines = []
            directive = ""
            for line in lines:
                if ('"use client"' in line or "'use client'" in line) and not directive:
                    directive = line.strip()
                else:
                    clean_lines.append(line)
            
            if directive:
                new_content = directive + "\n" + "\n".join(clean_lines)
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1
    
    print(f"Done! Fixed {count} files.")

if __name__ == "__main__":
    fix_directives()
