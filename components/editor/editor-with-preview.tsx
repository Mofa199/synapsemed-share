"use client"

import { useState } from 'react'
import { CKEditor } from './ckeditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Save, Eye, Edit, FileText } from 'lucide-react'

interface EditorWithPreviewProps {
  initialContent?: string
  title?: string
  onSave?: (content: string) => Promise<boolean>
  onCancel?: () => void
  readOnly?: boolean
  showPreview?: boolean
  placeholder?: string
  height?: number
}

export function EditorWithPreview({
  initialContent = '',
  title = 'Content Editor',
  onSave,
  onCancel,
  readOnly = false,
  showPreview = true,
  placeholder = 'Start writing your content...',
  height = 500
}: EditorWithPreviewProps) {
  const [content, setContent] = useState(initialContent)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      const success = await onSave(content)
      if (success) {
        toast({
          title: "Success",
          description: "Content saved successfully",
        })
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const getWordCount = () => {
    const text = stripHtml(content)
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharCount = () => {
    return stripHtml(content).length
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#213874]">{title}</h2>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {getWordCount()} words
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getCharCount()} characters
            </Badge>
            {!readOnly && (
              <Badge className={content !== initialContent ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                {content !== initialContent ? 'Unsaved changes' : 'Saved'}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showPreview && (
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              {isPreview ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          )}
          
          {!readOnly && onSave && (
            <Button
              onClick={handleSave}
              disabled={isSaving || content === initialContent}
              className="bg-[#213874] hover:bg-[#1a6ac3] flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
          
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Editor/Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {isPreview ? (
              <>
                <Eye className="h-5 w-5" />
                Preview
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Editor
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <div 
              className="prose prose-lg max-w-none"
              style={{ minHeight: `${height}px` }}
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500 italic">No content to preview</p>' }}
            />
          ) : (
            <CKEditor
              value={content}
              onChange={setContent}
              placeholder={placeholder}
              height={height}
              readOnly={readOnly}
              config={{
                // Medical education specific configuration
                toolbar: {
                  items: [
                    'heading', '|',
                    'bold', 'italic', 'underline', '|',
                    'fontSize', 'fontColor', '|',
                    'alignment', '|',
                    'numberedList', 'bulletedList', '|',
                    'outdent', 'indent', '|',
                    'link', 'blockQuote', 'insertTable', '|',
                    'code', 'codeBlock', '|',
                    'specialCharacters', '|',
                    'undo', 'redo'
                  ]
                },
                heading: {
                  options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Title', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Section', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Subsection', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Sub-subsection', class: 'ck-heading_heading4' }
                  ]
                }
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Editor Guidelines for Medical Content */}
      {!readOnly && !isPreview && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Writing Guidelines for Medical Content</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p>• Use clear, professional medical terminology</p>
              <p>• Structure content with appropriate headings and subheadings</p>
              <p>• Include relevant examples and case studies where appropriate</p>
              <p>• Use tables for drug information, dosages, and comparisons</p>
              <p>• Add blockquotes for important clinical notes or warnings</p>
              <p>• Keep paragraphs concise and focused on single concepts</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}