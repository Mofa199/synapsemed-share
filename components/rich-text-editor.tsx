"use client"

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the CKEditor wrapper since it requires the window object (fails during SSR)
const CKEditorWrapper = dynamic(
  () => import('./ckeditor-wrapper').then(mod => mod.default),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-[200px] border border-gray-300 rounded-lg animate-pulse bg-gray-50 flex items-center justify-center p-4">
        Loading rich text editor...
      </div>
    ) 
  }
)

interface RichTextEditorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value = '', onChange, placeholder = 'Start typing...', className = '' }: RichTextEditorProps) {
  return (
    <div className={`overflow-hidden prose-sm max-w-none ${className}`}>
      <CKEditorWrapper value={value} onChange={onChange} placeholder={placeholder} />
      <style jsx global>{`
        /* Overriding CKEditor default styles to make it fit nicely with the app theme */
        .ck-editor__editable_inline {
          min-height: 250px;
          padding: 1rem 1.5rem !important;
        }
        .ck-toolbar {
          border-top-left-radius: 0.5rem !important;
          border-top-right-radius: 0.5rem !important;
          background-color: #f9fafb !important;
        }
        .ck-editor__main .ck-content {
          border-bottom-left-radius: 0.5rem !important;
          border-bottom-right-radius: 0.5rem !important;
        }
      `}</style>
    </div>
  )
}