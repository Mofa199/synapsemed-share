"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Send, Users, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmailManagementPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)
  const [sendType, setSendType] = useState("single")
  
  const [singleEmailData, setSingleEmailData] = useState({
    to: "",
    subject: "",
    content: ""
  })
  
  const [bulkEmailData, setBulkEmailData] = useState({
    recipients: "",
    subject: "",
    content: ""
  })

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "LECTURER") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const handleSingleEmailChange = (field: string, value: string) => {
    setSingleEmailData(prev => ({ ...prev, [field]: value }))
  }

  const handleBulkEmailChange = (field: string, value: string) => {
    setBulkEmailData(prev => ({ ...prev, [field]: value }))
  }

  const handleSendSingleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: singleEmailData.to,
          subject: singleEmailData.subject,
          content: singleEmailData.content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Email sent successfully!",
        })
        // Reset form
        setSingleEmailData({ to: "", subject: "", content: "" })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSendBulkEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      // Convert recipients string to array
      const recipients = bulkEmailData.recipients
        .split(",")
        .map(email => email.trim())
        .filter(email => email.length > 0)

      const response = await fetch("/api/admin/email/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject: bulkEmailData.subject,
          content: bulkEmailData.content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Sent ${data.data?.success || 0} emails successfully!`,
        })
        // Reset form
        setBulkEmailData({ recipients: "", subject: "", content: "" })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send bulk emails",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending bulk emails:", error)
      toast({
        title: "Error",
        description: "Failed to send bulk emails. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Email Management</h1>
          <p className="text-gray-600">Send emails to users and manage email templates</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Email
                </CardTitle>
                <CardDescription>
                  Send single or bulk emails to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label>Send Type</Label>
                  <Select value={sendType} onValueChange={setSendType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select send type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Email</SelectItem>
                      <SelectItem value="bulk">Bulk Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sendType === "single" ? (
                  <form onSubmit={handleSendSingleEmail} className="space-y-6">
                    <div>
                      <Label htmlFor="to">To *</Label>
                      <Input
                        id="to"
                        type="email"
                        value={singleEmailData.to}
                        onChange={(e) => handleSingleEmailChange("to", e.target.value)}
                        placeholder="recipient@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={singleEmailData.subject}
                        onChange={(e) => handleSingleEmailChange("subject", e.target.value)}
                        placeholder="Email subject"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={singleEmailData.content}
                        onChange={(e) => handleSingleEmailChange("content", e.target.value)}
                        placeholder="Email content"
                        rows={8}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSending} className="bg-[#213874] hover:bg-[#1a6ac3]">
                      {isSending ? (
                        <>
                          <Send className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSendBulkEmail} className="space-y-6">
                    <div>
                      <Label htmlFor="recipients">Recipients *</Label>
                      <Textarea
                        id="recipients"
                        value={bulkEmailData.recipients}
                        onChange={(e) => handleBulkEmailChange("recipients", e.target.value)}
                        placeholder="Enter email addresses separated by commas&#10;user1@example.com, user2@example.com"
                        rows={4}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter multiple email addresses separated by commas
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="bulkSubject">Subject *</Label>
                      <Input
                        id="bulkSubject"
                        value={bulkEmailData.subject}
                        onChange={(e) => handleBulkEmailChange("subject", e.target.value)}
                        placeholder="Email subject"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bulkContent">Content *</Label>
                      <Textarea
                        id="bulkContent"
                        value={bulkEmailData.content}
                        onChange={(e) => handleBulkEmailChange("content", e.target.value)}
                        placeholder="Email content"
                        rows={8}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSending} className="bg-[#213874] hover:bg-[#1a6ac3]">
                      {isSending ? (
                        <>
                          <Send className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Bulk Email
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Email Statistics
                </CardTitle>
                <CardDescription>
                  Track email sending performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sent</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Successful</span>
                    <span className="font-semibold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Failed</span>
                    <span className="font-semibold text-red-600">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Predefined email templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Welcome Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Password Reset
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Course Completion
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    New Content Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}