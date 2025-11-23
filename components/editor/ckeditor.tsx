"use client"

import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface CKEditorProps {
  value?: string
  onChange?: (data: string) => void
  placeholder?: string
  height?: number
  readOnly?: boolean
  config?: any
}

export function CKEditor({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  height = 400,
  readOnly = false,
  config = {}
}: CKEditorProps) {
  const editorRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [editor, setEditor] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    let editorInstance: any = null

    const initEditor = async () => {
      try {
        // Dynamically import CKEditor
        const { default: ClassicEditor } = await import('@ckeditor/ckeditor5-build-classic')
        
        if (editorRef.current) {
          const editorConfig = {
            placeholder,
            height,
            
            // Toolbar configuration
            toolbar: {
              items: [
                'heading', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                'alignment', '|',
                'numberedList', 'bulletedList', '|',
                'outdent', 'indent', '|',
                'todoList', '|',
                'link', 'blockQuote', 'insertTable', '|',
                'code', 'codeBlock', '|',
                'horizontalLine', '|',
                'specialCharacters', '|',
                'undo', 'redo'
              ],
              shouldNotGroupWhenFull: true
            },
            
            // Heading configuration
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
              ]
            },
            
            // Font size configuration
            fontSize: {
              options: [
                'tiny',
                'small',
                'default',
                'big',
                'huge'
              ]
            },
            
            // Table configuration
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
              ]
            },
            
            // Link configuration
            link: {
              decorators: {
                addTargetToExternalLinks: {
                  mode: 'automatic',
                  callback: (url: string) => /^(https?:)?\\/\\/.+/.test(url),
                  attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  }
                }
              }
            },
            
            // Security settings
            htmlSupport: {
              allow: [
                {
                  name: /.*/,
                  attributes: true,
                  classes: true,
                  styles: true
                }
              ],
              disallow: [
                {
                  name: 'script'
                },
                {
                  name: 'iframe',
                  attributes: 'src'
                }
              ]
            },
            
            // Remove unsafe elements
            htmlEmbed: {
              showPreviews: true,
              sanitizeHtml: (inputHtml: string) => {
                // Basic HTML sanitization
                const cleanHtml = inputHtml
                  .replace(/<script[^>]*>.*?<\\/script>/gi, '')
                  .replace(/on\\w+=\"[^\"]*\"/gi, '')
                  .replace(/javascript:/gi, '')
                return cleanHtml
              }
            },
            
            // Additional security
            removePlugins: ['MediaEmbed'],
            
            // Custom configuration
            ...config
          }

          editorInstance = await ClassicEditor.create(editorRef.current, editorConfig)
          
          // Set initial value
          if (value) {
            editorInstance.setData(value)
          }
          
          // Set read-only mode
          if (readOnly) {
            editorInstance.enableReadOnlyMode('readonly-mode')
          }
          
          // Listen for changes
          editorInstance.model.document.on('change:data', () => {
            const data = editorInstance.getData()
            onChange?.(data)
          })
          
          setEditor(editorInstance)
          setIsLoaded(true)
          
        }
      } catch (error) {
        console.error('Error initializing CKEditor:', error)
        toast({
          title: \"Editor Error\",
          description: \"Failed to load the text editor. Please refresh the page.\",
          variant: \"destructive\",
        })
      }
    }

    initEditor()

    return () => {
      if (editorInstance && editorInstance.destroy) {
        editorInstance.destroy()
          .catch((error: any) => console.error('Error destroying editor:', error))
      }
    }
  }, [])

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getData()) {
      editor.setData(value || '')
    }
  }, [value, editor])

  // Update read-only mode
  useEffect(() => {
    if (editor) {
      if (readOnly) {
        editor.enableReadOnlyMode('readonly-mode')
      } else {
        editor.disableReadOnlyMode('readonly-mode')
      }
    }
  }, [readOnly, editor])

  return (
    <div className=\"ck-editor-wrapper\">
      {!isLoaded && (
        <div 
          className=\"flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50\" 
          style={{ height: `${height}px` }}
        >
          <div className=\"text-center\">
            <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-[#213874] mx-auto mb-2\"></div>
            <p className=\"text-sm text-gray-500\">Loading editor...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={editorRef}
        style={{ 
          minHeight: `${height}px`,
          display: isLoaded ? 'block' : 'none'
        }}
      />
      
      <style jsx global>{`
        .ck-editor-wrapper .ck-editor__editable {
          min-height: ${height}px;
          max-height: ${height * 2}px;
          overflow-y: auto;
        }
        
        .ck-editor-wrapper .ck-editor__main {
          color: #374151;
        }
        
        .ck-editor-wrapper .ck-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          background: #f9fafb;
        }
        
        .ck-editor-wrapper .ck-editor__editable {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top: none;
        }
        
        .ck-editor-wrapper .ck-editor__editable:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .ck-editor-wrapper .ck-balloon-panel {
          z-index: 9999;
        }
        
        .ck-editor-wrapper .ck-tooltip {
          z-index: 9999;
        }
        
        /* Medical content styling */
        .ck-editor-wrapper .ck-content {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        .ck-editor-wrapper .ck-content h1,
        .ck-editor-wrapper .ck-content h2,
        .ck-editor-wrapper .ck-content h3,
        .ck-editor-wrapper .ck-content h4 {
          color: #213874;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .ck-editor-wrapper .ck-content h1 {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
        
        .ck-editor-wrapper .ck-content h2 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        
        .ck-editor-wrapper .ck-content h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
        
        .ck-editor-wrapper .ck-content h4 {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        
        .ck-editor-wrapper .ck-content p {
          margin-bottom: 1rem;
          line-height: 1.625;
        }
        
        .ck-editor-wrapper .ck-content ul,
        .ck-editor-wrapper .ck-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .ck-editor-wrapper .ck-content li {
          margin-bottom: 0.25rem;
        }
        
        .ck-editor-wrapper .ck-content blockquote {
          border-left: 4px solid #f3ab1b;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          background: #fefdf8;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        .ck-editor-wrapper .ck-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        
        .ck-editor-wrapper .ck-content table td,
        .ck-editor-wrapper .ck-content table th {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
        }
        
        .ck-editor-wrapper .ck-content table th {
          background: #f9fafb;
          font-weight: 600;
          color: #213874;
        }
        
        .ck-editor-wrapper .ck-content code {
          background: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        .ck-editor-wrapper .ck-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .ck-editor-wrapper .ck-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
      `}</style>
    </div>
  )
}