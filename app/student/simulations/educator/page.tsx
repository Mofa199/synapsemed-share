"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell
} from 'recharts'
import {
  Users, BookOpen, TrendingUp, Target, Award, CheckCircle,
  BarChart3, Eye, Plus, Search, Filter
} from "lucide-react"

export default function EducatorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  
  const metrics = {
    totalLearners: 156,
    activeCases: 12,
    completionRate: 78.5,
    avgScore: 82.3,
    totalCompletions: 1247
  }
  
  const chartData = [
    { name: 'Heart Failure', score: 84.2, attempts: 89 },
    { name: 'Acute MI', score: 79.1, attempts: 67 },
    { name: 'Pneumonia', score: 88.7, attempts: 124 }
  ]
  
  const learners = [
    {
      name: "Alice Johnson",
      cohort: "Year 3",
      casesCompleted: 7,
      casesAttempted: 8,
      avgFinalDxScore: 91.2,
      status: "Excellent"
    },
    {
      name: "Marcus Chen", 
      cohort: "Year 3",
      casesCompleted: 5,
      casesAttempted: 6,
      avgFinalDxScore: 78.9,
      status: "Good"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#213874] flex items-center gap-3">
              <div className="w-10 h-10 bg-[#213874] rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              Educator Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Patient simulation performance analytics</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="learners">Learners</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Learners</p>
                      <p className="text-3xl font-bold text-[#213874]">{metrics.totalLearners}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Cases</p>
                      <p className="text-3xl font-bold text-[#213874]">{metrics.activeCases}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-3xl font-bold text-[#213874]">{metrics.completionRate}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Score</p>
                      <p className="text-3xl font-bold text-[#213874]">{metrics.avgScore}%</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completions</p>
                      <p className="text-3xl font-bold text-[#213874]">{metrics.totalCompletions}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Final Diagnostic Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#213874" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#213874" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learners" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Learner Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Learner</th>
                        <th className="text-left p-3">Cohort</th>
                        <th className="text-center p-3">Cases</th>
                        <th className="text-center p-3">Final Dx Score</th>
                        <th className="text-center p-3">Status</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {learners.map((learner, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{learner.name}</td>
                          <td className="p-3">
                            <Badge variant="outline">{learner.cohort}</Badge>
                          </td>
                          <td className="p-3 text-center">
                            {learner.casesCompleted}/{learner.casesAttempted}
                          </td>
                          <td className="p-3 text-center font-semibold text-green-600">
                            {learner.avgFinalDxScore}%
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="bg-green-50 text-green-600">
                              {learner.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}