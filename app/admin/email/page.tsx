"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Mail, 
  Send, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  FileText,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "welcome" | "notification" | "general"
  createdAt: Date
  usageCount: number
}

interface EmailHistory {
  id: string
  to: string[]
  subject: string
  status: "sent" | "failed" | "pending"
  sentAt: Date
  recipientCount: number
}

export default function EmailManagementPage() {
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("compose")
  const [isLoading, setIsLoading] = useState(false)
  
  // Email composition state
  const [recipients, setRecipients] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [emailType, setEmailType] = useState<"single" | "bulk">("single")
  
  // Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "tpl1",
      name: "Welcome Email",
      subject: "Welcome to SynapseMed!",
      content: `Dear {name},

Welcome to SynapseMed, your comprehensive medical education platform!

Here are some things you can do to get started:
• Complete your profile setup
• Explore our extensive course library  
• Join study groups and discussions
• Take practice exams and simulations

Best regards,
The SynapseMed Team`,
      type: "welcome",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      usageCount: 156
    },
    {
      id: "tpl2", 
      name: "Course Completion",
      subject: "Congratulations on completing {courseName}!",
      content: `Congratulations {name}!

You have successfully completed the course: {courseName}

Your final score: {score}%
Course duration: {duration}

Keep up the excellent work!

The SynapseMed Team`,
      type: "notification",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      usageCount: 89
    }
  ])
  
  // Email history
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([
    {
      id: "email1",
      to: ["all-students@synapsemed.co.tz"],
      subject: "New Course Available: Advanced Cardiology",
      status: "sent",
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      recipientCount: 234
    },
    {
      id: "email2",
      to: ["welcome-batch-2024@synapsemed.co.tz"],
      subject: "Welcome to SynapseMed!",
      status: "sent", 
      sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      recipientCount: 45
    }
  ])

  const handleSendEmail = async () => {
    if (!recipients.trim() || !subject.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const recipientList = emailType === "bulk" 
        ? recipients.split(',').map(email => email.trim()).filter(email => email)
        : [recipients.trim()]

      const endpoint = emailType === "bulk" ? "/api/admin/email" : "/api/admin/email"
      const method = emailType === "bulk" ? "PUT" : "POST"
      
      const body = emailType === "bulk" 
        ? { recipients: recipientList, subject, content }
        : { to: recipientList[0], subject, content, type: "general" }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Email ${emailType === "bulk" ? "broadcast" : ""} sent successfully`,
        })
        
        // Add to history
        const newHistoryItem: EmailHistory = {
          id: Date.now().toString(),
          to: recipientList,
          subject,
          status: "sent",
          sentAt: new Date(),
          recipientCount: recipientList.length
        }
        setEmailHistory(prev => [newHistoryItem, ...prev])
        
        // Clear form
        setRecipients("")
        setSubject("")
        setContent("")
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseTemplate = (template: EmailTemplate) => {
    setSubject(template.subject)
    setContent(template.content)
    setActiveTab("compose")
    
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been applied`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "sent":
        return <Badge className="bg-green-50 text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>
      case "failed":
        return <Badge className="bg-red-50 text-red-600"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#213874] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#213874] rounded-lg flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          Email Management
        </h1>
        <p className="text-gray-600 mt-2">Send emails and manage communication with users</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white p-1 shadow-sm">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Compose Email Tab */}
        <TabsContent value="compose">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Type Selection */}
              <div className="flex gap-4">
                <Button
                  variant={emailType === "single" ? "default" : "outline"}
                  onClick={() => setEmailType("single")}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Single Email
                </Button>
                <Button
                  variant={emailType === "bulk" ? "default" : "outline"}
                  onClick={() => setEmailType("bulk")}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Bulk Email
                </Button>
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label htmlFor="recipients">
                  {emailType === "single" ? "Recipient Email" : "Recipients (comma-separated)"}
                </Label>
                <Input
                  id="recipients"
                  type="email"
                  placeholder={emailType === "single" 
                    ? "user@example.com" 
                    : "user1@example.com, user2@example.com, ..."
                  }
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                />
                <p className="text-xs text-gray-500">
                  You can use variables like {"{name}"}, {"{courseName}"}, {"{score}"} in templates
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline">
                  Save as Template
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSendEmail} disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send {emailType === "bulk" ? "Bulk " : ""}Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Used {template.usageCount} times</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">SUBJECT</Label>
                      <p className="text-sm font-medium">{template.subject}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">CONTENT PREVIEW</Label>
                      <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      Created {template.createdAt.toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Email History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Subject</th>
                      <th className="text-left p-3">Recipients</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Sent At</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailHistory.map((email) => (
                      <tr key={email.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 max-w-xs">
                          <p className="font-medium truncate">{email.subject}</p>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">{email.recipientCount} recipients</span>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(email.status)}
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {email.sentAt.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">SMTP Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>SMTP Server</Label>
                      <Input placeholder="smtp.gmail.com" />
                    </div>
                    <div>
                      <Label>Port</Label>
                      <Input placeholder="587" />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input placeholder="your-email@gmail.com" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Default Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>From Name</Label>
                      <Input placeholder="SynapseMed Team" />
                    </div>
                    <div>
                      <Label>Reply-To Email</Label>
                      <Input placeholder="noreply@synapsemed.co.tz" />
                    </div>
                    <div>
                      <Label>Daily Email Limit</Label>
                      <Input placeholder="1000" type="number" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}