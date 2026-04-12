const fs = require('fs');
const files = ['components/editor/ckeditor.tsx', 'components/editor/editor-with-preview.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Unescape double quotes and backslashes that were accidentally stringified
  content = content.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
