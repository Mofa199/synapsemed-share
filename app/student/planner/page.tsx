"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GoalDialog } from "@/components/student/goal-dialog";
import { SessionDialog } from "@/components/student/session-dialog";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2,
  Play,
  FileText,
  HelpCircle,
  Book,
  PenTool,
  CalendarDays
} from "lucide-react";
import Link from "next/link";

export default function StudyPlanner() {
  const { toast } = useToast()
  const [studyGoals, setStudyGoals] = useState<any[]>([]);
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [editingSession, setEditingSession] = useState<any | null>(null);

  useEffect(() => {
    fetchGoals()
    fetchSessions()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/user/goals')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudyGoals(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions?upcoming=true')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudySessions(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  const handleAddGoal = () => {
    setEditingGoal(null)
    setGoalDialogOpen(true)
  }

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal)
    setGoalDialogOpen(true)
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await fetch(`/api/user/goals?id=${goalId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        })
        fetchGoals()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      })
    }
  }

  const toggleGoalCompletion = async (goal: any) => {
    try {
      const response = await fetch('/api/user/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goal, completed: !goal.completed })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: goal.completed ? "Goal marked as incomplete" : "Goal completed! 🎉",
        })
        fetchGoals()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      })
    }
  }

  const handleScheduleSession = () => {
    setEditingSession(null)
    setSessionDialogOpen(true)
  }

  const handleEditSession = (session: any) => {
    setEditingSession(session)
    setSessionDialogOpen(true)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      const response = await fetch(`/api/user/sessions?id=${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Session deleted successfully",
        })
        fetchSessions()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      })
    }
  }

  const handleCreateStudyPlan = () => {
    toast({
      title: "Coming Soon",
      description: "AI-powered study plan generator is under development!",
    })
  }

  const handleViewCalendar = () => {
    toast({
      title: "Calendar View",
      description: "Full calendar view coming soon!",
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
        <p className="text-gray-600">Plan and track your medical education journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Goals */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Study Goals
                  </CardTitle>
                  <CardDescription>Track your learning objectives</CardDescription>
                </div>
                <Button onClick={handleAddGoal} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : studyGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No goals yet. Create your first study goal!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studyGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGoalCompletion(goal.id)}
                          className="p-0 mr-2"
                        >
                          <CheckCircle 
                            className={`h-5 w-5 ${goal.completed ? 'text-green-500' : 'text-gray-300'}`} 
                          />
                        </Button>
                        <h3 className={`font-medium ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                          {goal.title}
                        </h3>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Progress: {goal.progress}%</span>
                      <span>Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No due date'}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-500" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled study time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : studySessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No scheduled sessions. Plan your study time!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studySessions.map((session) => (
                  <div key={session.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{session.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                          <Clock className="h-4 w-4 ml-2 mr-1" />
                          <span>{session.startTime}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {session.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        {session.sessionType === "VIDEO" && <Play className="h-4 w-4 text-red-500 mr-1" />}
                        {session.sessionType === "QUESTIONS" && <HelpCircle className="h-4 w-4 text-blue-500 mr-1" />}
                        {session.sessionType === "READING" && <FileText className="h-4 w-4 text-green-500 mr-1" />}
                        {session.sessionType === "PRACTICE" && <PenTool className="h-4 w-4 text-purple-500 mr-1" />}
                        {session.sessionType === "REVIEW" && <Book className="h-4 w-4 text-orange-500 mr-1" />}
                        {session.sessionType === "EXAM_PREP" && <Target className="h-4 w-4 text-red-600 mr-1" />}
                        <span className="text-xs text-gray-600">{session.sessionType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditSession(session)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))}
                  <Button className="w-full" variant="outline" onClick={handleScheduleSession}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline" onClick={handleCreateStudyPlan}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Study Plan
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleAddGoal}>
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleViewCalendar}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <GoalDialog
        isOpen={goalDialogOpen}
        onClose={() => setGoalDialogOpen(false)}
        onSave={() => {
          fetchGoals()
          setGoalDialogOpen(false)
        }}
        goal={editingGoal}
        mode={editingGoal ? 'edit' : 'create'}
      />

      <SessionDialog
        isOpen={sessionDialogOpen}
        onClose={() => setSessionDialogOpen(false)}
        onSave={() => {
          fetchSessions()
          setSessionDialogOpen(false)
        }}
        session={editingSession}
        mode={editingSession ? 'edit' : 'create'}
      />
    </div>
  );
}