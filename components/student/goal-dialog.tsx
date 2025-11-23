"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "lucide-react"

interface StudyGoal {
  id: string
  title: string
  description?: string
  progress: number
  dueDate?: Date | string
  priority: string
  category?: string
  tags: string
  completed: boolean
}

interface GoalDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  goal?: StudyGoal | null
  mode: 'create' | 'edit'
}

export function GoalDialog({ isOpen, onClose, onSave, goal, mode }: GoalDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    dueDate: goal?.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : '',
    priority: goal?.priority || 'MEDIUM',
    category: goal?.category || '',
    tags: goal?.tags || ''
  })

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const url = '/api/user/goals'
      const method = mode === 'create' ? 'POST' : 'PUT'
      const body = mode === 'edit' ? { ...formData, id: goal?.id } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Goal ${mode === 'create' ? 'created' : 'updated'} successfully`,
        })
        onSave()
        onClose()
      } else {
        throw new Error('Failed to save goal')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} goal`,
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
            {mode === 'create' ? 'Create New Goal' : 'Edit Goal'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Set a new study goal to track your progress' 
              : 'Update your study goal details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Complete Cardiology Module"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add details about this goal..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Cardiology, Anatomy"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., exam prep, review"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create Goal' : 'Update Goal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
