"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { BookOpen, FileText, Pill, Award, Plus, Settings, Users, Mail, Newspaper, Video } from "lucide-react"
import Link from "next/link"

export default function ContentManagementPage() {
  const { user } = useAuth()

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const contentTypes = [
    {
      title: "Topics",
      description: "Manage learning topics and subjects",
      icon: Settings,
      count: "24 topics",
      addLink: "/admin/content/topics/add",
      manageLink: "/admin/content/topics",
    },
    {
      title: "Books",
      description: "Manage textbooks and reference materials",
      icon: BookOpen,
      count: "2,847 books",
      addLink: "/admin/content/books/add",
      manageLink: "/admin/content/books",
    },
    {
      title: "Articles",
      description: "Manage research articles and papers",
      icon: FileText,
      count: "15,632 articles",
      addLink: "/admin/content/articles/add",
      manageLink: "/admin/content/articles",
    },
    {
      title: "Drugs",
      description: "Manage pharmacology database",
      icon: Pill,
      count: "1,234 drugs",
      addLink: "/admin/content/drugs/add",
      manageLink: "/admin/content/drugs",
    },
    {
      title: "Badges",
      description: "Manage achievement badges",
      icon: Award,
      count: "156 badges",
      addLink: "/admin/content/badges/add",
      manageLink: "/admin/content/badges",
    },
    {
      title: "Simulations",
      description: "Manage patient simulations and interactive cases",
      icon: Users,
      count: "12 simulations",
      addLink: "/admin/content/simulations/add",
      manageLink: "/admin/content/simulations",
    },
    {
      title: "Magazines",
      description: "Manage medical journals and magazines",
      icon: Newspaper,
      count: "84 magazines",
      addLink: "/admin/content/magazines/add",
      manageLink: "/admin/content/magazines",
    },
    {
      title: "Videos",
      description: "Manage video lectures and demonstrations",
      icon: Video,
      count: "324 videos",
      addLink: "/admin/content/videos/add",
      manageLink: "/admin/content/videos",
    },
    {
      title: "Email",
      description: "Send emails and manage templates",
      icon: Mail,
      count: "Email management",
      addLink: "/admin/content/email",
      manageLink: "/admin/content/email",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">Content Management</h1>
          <p className="text-gray-600">Manage all educational content and resources</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => (
            <Card key={type.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#213874] rounded-lg flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  {type.title}
                </CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{type.count}</p>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-[#213874] hover:bg-[#1a6ac3]">
                      <Link href={type.addLink}>
                        <Plus className="w-4 h-4 mr-2" />
                        {type.title === "Email" ? "Manage" : "Add New"}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={type.manageLink}>Manage</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}