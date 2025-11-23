"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  StickyNote, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Pin, 
  PinOff,
  Save,
  X,
  Calendar,
  Tag,
  BookOpen
} from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

interface NotesPanelProps {
  className?: string
}

export function NotesPanel({ className = "" }: NotesPanelProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
    isPinned: false
  })

  const categories = ["all", "General", "Anatomy", "Pharmacology", "Study Plans", "Clinical Notes", "Research"]

  useEffect(() => {
    fetchNotes()
  }, [searchTerm, selectedCategory])

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      
      const response = await fetch(`/api/user/notes?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setNotes(result.data.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/user/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Note created successfully",
        })
        resetForm()
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      })
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return

    try {
      const response = await fetch('/api/user/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...noteForm, id: editingNote.id })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Note updated successfully",
        })
        resetForm()
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/user/notes?id=${noteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Note deleted successfully",
        })
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const handleTogglePin = async (note: Note) => {
    try {
      const response = await fetch('/api/user/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, isPinned: !note.isPinned })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: note.isPinned ? "Note unpinned" : "Note pinned",
        })
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setNoteForm({
      title: "",
      content: "",
      category: "General",
      tags: "",
      isPinned: false
    })
    setIsCreating(false)
    setEditingNote(null)
  }

  const startEdit = (note: Note) => {
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
      isPinned: note.isPinned
    })
    setEditingNote(note)
    setIsCreating(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNotes = notes
    .sort((a, b) => {
      // Pinned notes first, then by updated date
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-yellow-500" />
            My Notes ({notes.length})
          </CardTitle>
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="bg-[#213874] hover:bg-[#1a6ac3]"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#213874] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Create/Edit Note Form */}
        {isCreating && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-blue-900">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </h3>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Note title..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <select
                    id="category"
                    value={noteForm.category}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                <Textarea
                  id="content"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your note here..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                <Input
                  id="tags"
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Tags (comma separated)..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={noteForm.isPinned}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, isPinned: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Pin className="h-4 w-4" />
                  Pin this note
                </label>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={editingNote ? handleUpdateNote : handleCreateNote}
                    className="bg-[#213874] hover:bg-[#1a6ac3]"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {editingNote ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No notes found matching your criteria' 
                  : 'No notes yet. Create your first note to get started!'
                }
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} className={`transition-all duration-200 hover:shadow-md ${
                note.isPinned ? 'border-yellow-200 bg-yellow-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                        {note.isPinned && (
                          <Pin className="h-3 w-3 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {note.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePin(note)}
                        className="h-8 w-8 p-0"
                      >
                        {note.isPinned ? (
                          <PinOff className="h-3 w-3" />
                        ) : (
                          <Pin className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                    {note.content}
                  </p>
                  
                  {note.tags && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="h-3 w-3 text-gray-400" />
                      {note.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}