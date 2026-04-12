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

declare global {
  interface Window {
    CKEDITOR: any
  }
}

export function CKEditor({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  height = 400,
  readOnly = false,
  config = {}
}: CKEditorProps) {
  const containerRef = useRef<HTMLTextAreaElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const editorInstanceRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load CKEditor 4 script from CDN if not already loaded
    const scriptId = 'ckeditor-4-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement

    const initEditor = () => {
      if (!window.CKEDITOR || !containerRef.current) return

      // Use Full build from CDN for maximum features
      const editorConfig = {
        height,
        placeholder: placeholder,
        // Free version configuration
        versionCheck: false,
        extraPlugins: 'uploadimage,image2,codesnippet,justify,colorbutton,font',
        removeButtons: 'About',
        ...config
      }

      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy(true)
      }

      const instance = window.CKEDITOR.replace(containerRef.current, editorConfig)
      editorInstanceRef.current = instance

      instance.on('instanceReady', () => {
        setIsLoaded(true)
        if (value) instance.setData(value)
        if (readOnly) instance.setReadOnly(true)
      })

      instance.on('change', () => {
        const data = instance.getData()
        if (onChange) onChange(data)
      })
    }

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js'
      script.async = true
      script.onload = () => {
        initEditor()
      }
      script.onerror = () => {
        toast({
          title: "Editor Error",
          description: "Failed to load the CKEditor 4 script from CDN.",
          variant: "destructive",
        })
      }
      document.head.appendChild(script)
    } else {
      if (window.CKEDITOR) {
        initEditor()
      } else {
        script.onload = () => initEditor()
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy(true)
        editorInstanceRef.current = null
      }
    }
  }, [])

  // Update editor content when value prop changes, but only if it's different from current editor data
  useEffect(() => {
    if (editorInstanceRef.current && isLoaded) {
      const currentData = editorInstanceRef.current.getData()
      if (value !== currentData) {
        editorInstanceRef.current.setData(value || '')
      }
    }
  }, [value, isLoaded])

  // Update read-only mode
  useEffect(() => {
    if (editorInstanceRef.current && isLoaded) {
      editorInstanceRef.current.setReadOnly(readOnly)
    }
  }, [readOnly, isLoaded])

  return (
    <div className="ck-editor-4-wrapper" style={{ minHeight: `${height}px` }}>
      {!isLoaded && (
        <div 
          className="flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50" 
          style={{ height: `${height}px` }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#213874] mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading Free Editor...</p>
          </div>
        </div>
      )}
      <textarea 
        ref={containerRef} 
        style={{ display: 'none', visibility: 'hidden' }}
        defaultValue={value}
      />
    </div>
  )
}