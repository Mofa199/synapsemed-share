"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface StudySession {
  id: string
  title: string
  description?: string
  sessionType: string
  date: Date | string
  startTime: string
  duration: number
}

interface SessionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  session?: StudySession | null
  mode: 'create' | 'edit'
}

export function SessionDialog({ isOpen, onClose, onSave, session, mode }: SessionDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: session?.title || '',
    description: session?.description || '',
    sessionType: session?.sessionType || 'VIDEO',
    date: session?.date ? new Date(session.date).toISOString().split('T')[0] : '',
    startTime: session?.startTime || '09:00',
    duration: session?.duration || 60
  })

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.date || !formData.startTime) {
      toast({
        title: "Validation Error",
        description: "Title, date, and time are required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const url = '/api/user/sessions'
      const method = mode === 'create' ? 'POST' : 'PUT'
      const body = mode === 'edit' ? { ...formData, id: session?.id } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Session ${mode === 'create' ? 'scheduled' : 'updated'} successfully`,
        })
        onSave()
        onClose()
      } else {
        throw new Error('Failed to save session')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} session`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Schedule Study Session' : 'Edit Study Session'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Plan your next study session' 
              : 'Update your study session details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Cardiology Review"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What will you study in this session?"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="sessionType">Session Type</Label>
            <select
              id="sessionType"
              value={formData.sessionType}
              onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="VIDEO">Video</option>
              <option value="READING">Reading</option>
              <option value="QUESTIONS">Practice Questions</option>
              <option value="PRACTICE">Practice</option>
              <option value="REVIEW">Review</option>
              <option value="EXAM_PREP">Exam Prep</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              step="15"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Schedule Session' : 'Update Session'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
