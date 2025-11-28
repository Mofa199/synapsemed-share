"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  Target,
  Eye,
  EyeOff,
  Send
} from "lucide-react";

export default function AdminExamSimulationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterField, setFilterField] = useState("all");

  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    field: "MEDICAL",
    duration: 1800,
    totalQuestions: 5,
    passingScore: 70,
    difficulty: "INTERMEDIATE",
    category: "",
    isPublic: true
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exam-simulations');
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    try {
      const response = await fetch('/api/exam-simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam)
      });

      if (response.ok) {
        toast({
          title: "Exam created!",
          description: "The exam simulation has been created successfully"
        });
        setShowCreateDialog(false);
        fetchExams();
        // Reset form
        setNewExam({
          title: "",
          description: "",
          field: "MEDICAL",
          duration: 1800,
          totalQuestions: 5,
          passingScore: 70,
          difficulty: "INTERMEDIATE",
          category: "",
          isPublic: true
        });
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error",
        description: "Failed to create exam",
        variant: "destructive"
      });
    }
  };

  const handleToggleVisibility = (exam: any) => {
    toast({
      title: exam.isPublic ? "Exam made private" : "Exam made public",
      description: exam.isPublic 
        ? "Only assigned students can access this exam" 
        : "All students can now access this exam"
    });
    // In real app, this would update the database
  };

  const handleDelete = (examId: string) => {
    toast({
      title: "Exam deleted",
      description: "The exam simulation has been removed"
    });
    // In real app, this would call the API
  };

  const handleAssignExam = () => {
    toast({
      title: "Exam assigned!",
      description: "Students will be notified about this assignment"
    });
    setShowAssignDialog(false);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = filterField === "all" || exam.field === filterField;
    return matchesSearch && matchesField;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam simulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Simulations</h1>
            <p className="text-gray-600">Manage and assign exam simulations to students</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Exam
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select value={filterField} onValueChange={setFilterField}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="MEDICAL">Medical</SelectItem>
                <SelectItem value="NURSING">Nursing</SelectItem>
                <SelectItem value="PHARMACY">Pharmacy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold">{exams.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Public Exams</p>
                <p className="text-2xl font-bold">{exams.filter(e => e.isPublic).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Private Exams</p>
                <p className="text-2xl font-bold">{exams.filter(e => !e.isPublic).length}</p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Exams</p>
                <p className="text-2xl font-bold">{exams.filter(e => e.isActive).length}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">{exam.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={exam.isPublic ? "default" : "secondary"}>
                    {exam.isPublic ? "Public" : "Private"}
                  </Badge>
                  <Badge variant={exam.isActive ? "default" : "outline"}>
                    {exam.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.floor(exam.duration / 60)} min
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 mr-1" />
                    {exam.totalQuestions} questions
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{exam.field}</Badge>
                  <Badge variant="outline">{exam.difficulty}</Badge>
                  <Badge variant="outline">{exam.category}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedExam(exam);
                      setShowAssignDialog(true);
                    }}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleToggleVisibility(exam)}
                  >
                    {exam.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => router.push(`/admin/content/exam-simulations/${exam.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(exam.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Exam Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Exam Simulation</DialogTitle>
            <DialogDescription>
              Set up a new exam simulation for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                value={newExam.title}
                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                placeholder="e.g., USMLE Step 1 Practice Exam"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newExam.description}
                onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                placeholder="Describe the exam..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field">Field</Label>
                <Select value={newExam.field} onValueChange={(value) => setNewExam({ ...newExam, field: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEDICAL">Medical</SelectItem>
                    <SelectItem value="NURSING">Nursing</SelectItem>
                    <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={newExam.difficulty} onValueChange={(value) => setNewExam({ ...newExam, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newExam.duration / 60}
                  onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) * 60 })}
                />
              </div>
              <div>
                <Label htmlFor="questions">Number of Questions</Label>
                <Input
                  id="questions"
                  type="number"
                  value={newExam.totalQuestions}
                  onChange={(e) => setNewExam({ ...newExam, totalQuestions: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newExam.category}
                  onChange={(e) => setNewExam({ ...newExam, category: e.target.value })}
                  placeholder="e.g., Cardiology"
                />
              </div>
              <div>
                <Label htmlFor="passing">Passing Score (%)</Label>
                <Input
                  id="passing"
                  type="number"
                  value={newExam.passingScore}
                  onChange={(e) => setNewExam({ ...newExam, passingScore: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newExam.isPublic}
                onChange={(e) => setNewExam({ ...newExam, isPublic: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Make this exam public (all students can access)
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExam}>
              Create Exam
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Exam Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Exam</DialogTitle>
            <DialogDescription>
              Assign {selectedExam?.title} to specific students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="student">Select Student(s)</Label>
              <Input
                id="student"
                placeholder="Search students by name or email..."
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignExam}>
              <Send className="h-4 w-4 mr-2" />
              Assign Exam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
