"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Edit,
  Camera,
  Trophy,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Star,
  Save,
  Upload,
  Phone,
  Building,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Country codes for phone number selection
const countryCodes = [
  { code: "+1", name: "United States" },
  { code: "+1", name: "Canada" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+91", name: "India" },
  { code: "+255", name: "Tanzania" },
  { code: "+254", name: "Kenya" },
  { code: "+256", name: "Uganda" },
  { code: "+250", name: "Rwanda" },
  { code: "+257", name: "Burundi" },
  { code: "+251", name: "Ethiopia" },
  { code: "+234", name: "Nigeria" },
  { code: "+27", name: "South Africa" },
  { code: "+20", name: "Egypt" },
  { code: "+92", name: "Pakistan" },
  { code: "+86", name: "China" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+34", name: "Spain" },
  { code: "+46", name: "Sweden" },
  { code: "+47", name: "Norway" },
  { code: "+45", name: "Denmark" },
  { code: "+31", name: "Netherlands" },
  { code: "+32", name: "Belgium" },
  { code: "+41", name: "Switzerland" },
  { code: "+43", name: "Austria" },
  { code: "+358", name: "Finland" },
  { code: "+354", name: "Iceland" },
]

// Medical schools (example list)
const medicalSchools = [
  "Harvard Medical School",
  "Johns Hopkins School of Medicine",
  "Mayo Clinic Alix School of Medicine",
  "Stanford University School of Medicine",
  "University of Cambridge School of Clinical Medicine",
  "University of Oxford Medical Sciences Division",
  "Imperial College London School of Medicine",
  "University College London Medical School",
  "King's College London School of Medicine",
  "University of Edinburgh Medical School",
  "University of Glasgow College of Medical, Veterinary & Life Sciences",
  "University of Toronto Faculty of Medicine",
  "McGill University Faculty of Medicine",
  "University of British Columbia Faculty of Medicine",
  "University of Melbourne Medical School",
  "University of Sydney Medical School",
  "University of Queensland School of Medicine",
  "Monash University Faculty of Medicine",
  "University of Cape Town Faculty of Health Sciences",
  "University of Witwatersrand Faculty of Health Sciences",
  "Makerere University College of Health Sciences",
  "University of Nairobi School of Medicine",
  "Muhimbili University of Health and Allied Sciences",
  "Kilimanjaro Christian Medical University College",
  "Mzumbe University School of Public Health and Social Sciences",
  // Add more schools as needed
]

export default function ProfilePage() {
  const { user, updateUser, uploadAvatar } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for real data from API
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
    university: "",
    graduationYear: "",
    specialization: "",
    linkedIn: "",
    twitter: "",
    website: "",
    // New fields
    medicalSchool: "",
    country: "",
    phoneCode: "+255", // Default to Tanzania
    phoneNumber: "",
  })

  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    badges: 0,
    coursesCompleted: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    averageScore: 0,
    rank: 0,
  })

  const [recentAchievements, setRecentAchievements] = useState<any[]>([])
  const [studyProgress, setStudyProgress] = useState<any[]>([])
  const [userBadges, setUserBadges] = useState<any[]>([])

  useEffect(() => {
    // Fetch real profile data
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const { data } = result

          // Update profile data
          setProfileData({
            name: data.user.name,
            email: data.user.email,
            bio: "",
            location: "",
            university: "",
            graduationYear: "",
            specialization: "",
            linkedIn: "",
            twitter: "",
            website: "",
            medicalSchool: "",
            country: "",
            phoneCode: "+255",
            phoneNumber: "",
          })

          // Update stats
          setStats({
            totalPoints: data.gamification.points,
            level: data.gamification.level,
            badges: data.gamification.totalBadges,
            coursesCompleted: data.gamification.completedItems,
            studyStreak: data.gamification.streak,
            totalStudyTime: 0, // We'll need to fetch this separately
            averageScore: data.gamification.completionRate,
            rank: 0, // We'll need to calculate this
          })

          // Update achievements
          if (data.recentBadges && Array.isArray(data.recentBadges)) {
            setRecentAchievements(data.recentBadges.slice(0, 5).map((badge: any) => ({
              name: badge.name,
              date: new Date(badge.earnedAt).toLocaleDateString(),
              icon: badge.icon || "🏆"
            })))
          } else if (data.badges && Array.isArray(data.badges)) {
            // Fallback to badges if recentBadges is missing
            setRecentAchievements(data.badges.slice(0, 5).map((badge: any) => ({
              name: badge.name,
              date: new Date(badge.earnedAt).toLocaleDateString(),
              icon: badge.icon || "🏆"
            })))
          }

          // Update badges
          if (data.badges && Array.isArray(data.badges)) {
            setUserBadges(data.badges)
          }

          // Fetch study progress
          fetchStudyProgress(data.user.id)
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      })
    }
  }

  const fetchStudyProgress = async (userId: string) => {
    try {
      const response = await fetch(`/api/progress?userId=${userId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Group progress by subject/module
          const progressBySubject: any = {}

          result.data.forEach((progress: any) => {
            // For now, we'll create mock subjects since we don't have the full curriculum structure
            const subject = progress.resourceType || "General"
            if (!progressBySubject[subject]) {
              progressBySubject[subject] = {
                subject,
                total: 0,
                completed: 0,
                progress: 0
              }
            }
            progressBySubject[subject].total += 1
            if (progress.status === 'COMPLETED') {
              progressBySubject[subject].completed += 1
            }
          })

          // Calculate progress percentages
          Object.keys(progressBySubject).forEach(key => {
            const subject = progressBySubject[key]
            subject.progress = subject.total > 0 ? Math.round((subject.completed / subject.total) * 100) : 0
          })

          setStudyProgress(Object.values(progressBySubject))
        }
      }
    } catch (error) {
      console.error('Error fetching study progress:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213874] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          // Add other fields as needed
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          updateUser(result.data)
          setIsEditing(false)
          toast({
            title: "Success",
            description: "Profile updated successfully!",
          })
        }
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingAvatar(true)
    try {
      await uploadAvatar(file)
      toast({
        title: "Success",
        description: "Avatar updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar and Basic Info */}
            <Card className="animate-in slide-in-from-left duration-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-[#213874] text-white text-2xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white shadow-md hover:shadow-lg transition-shadow"
                      onClick={handleAvatarClick}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? <Upload className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <div className="mt-4">
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="text-center font-semibold"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-[#213874]">{profileData.name}</h2>
                    )}
                    <p className="text-gray-600">{profileData.email}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge className="bg-[#f3ab1b] text-[#213874]">Level {stats.level}</Badge>
                      <Badge variant="outline">{user?.field}</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="w-full bg-[#213874] hover:bg-[#1a6ac3]"
                        >
                          {isLoading ? (
                            <>
                              <Save className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="w-full bg-[#213874] hover:bg-[#1a6ac3]">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="animate-in slide-in-from-left duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[#213874]/10 rounded-lg hover:bg-[#213874]/20 transition-colors">
                    <div className="text-2xl font-bold text-[#213874]">{stats.totalPoints}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center p-3 bg-[#f3ab1b]/10 rounded-lg hover:bg-[#f3ab1b]/20 transition-colors">
                    <div className="text-2xl font-bold text-[#213874]">{stats.badges}</div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                  <div className="text-center p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                    <div className="text-2xl font-bold text-[#213874]">{stats.studyStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                    <div className="text-2xl font-bold text-[#213874]">#{stats.rank}</div>
                    <div className="text-sm text-gray-600">Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="animate-in slide-in-from-left duration-1000">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#f3ab1b]" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-gray-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="animate-in slide-in-from-right duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={3}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            className="pl-10"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={profileData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.name}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="medicalSchool">Medical School</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={profileData.medicalSchool}
                            onValueChange={(value) => handleInputChange("medicalSchool", value)}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select your medical school" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicalSchools.map((school) => (
                                <SelectItem key={school} value={school}>
                                  {school}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="graduationYear"
                            type="number"
                            min="1900"
                            max="2030"
                            value={profileData.graduationYear}
                            onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                            className="pl-10"
                            placeholder="e.g., 2025"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <div className="flex gap-2">
                          <Select
                            value={profileData.phoneCode}
                            onValueChange={(value) => handleInputChange("phoneCode", value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phoneNumber"
                              type="tel"
                              value={profileData.phoneNumber}
                              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                              className="pl-10"
                              placeholder="Phone number"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <div className="relative">
                          <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="specialization"
                            value={profileData.specialization}
                            onChange={(e) => handleInputChange("specialization", e.target.value)}
                            className="pl-10"
                            placeholder="Your medical specialization"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">{profileData.bio || "No bio available."}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Location:</span>
                        <span>{profileData.location || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Country:</span>
                        <span>{profileData.country || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Medical School:</span>
                        <span>{profileData.medicalSchool || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Graduation:</span>
                        <span>{profileData.graduationYear || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Phone:</span>
                        <span>{profileData.phoneCode} {profileData.phoneNumber || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Specialization:</span>
                        <span>{profileData.specialization || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Study Progress */}
            <Card className="animate-in slide-in-from-right duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Progress
                </CardTitle>
                <CardDescription>Your progress across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {studyProgress.length > 0 ? (
                    studyProgress.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{subject.subject}</h4>
                          <div className="text-sm text-gray-600">
                            {subject.completed}/{subject.total} modules
                          </div>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                        <div className="text-right text-sm text-gray-600">{subject.progress}%</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No study progress data available.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="animate-in slide-in-from-right duration-1000">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Score</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#f3ab1b]" />
                      <span className="font-semibold">{stats.averageScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Courses Completed</span>
                    <span className="font-semibold">{stats.coursesCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Current Rank</span>
                    <Badge className="bg-[#213874] text-white">#{stats.rank}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-in slide-in-from-right duration-1200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Study Time</span>
                    <span className="font-semibold">{stats.totalStudyTime}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-semibold">12h 30m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Daily Average</span>
                    <span className="font-semibold">1h 45m</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges Collection */}
            <Card className="animate-in slide-in-from-right duration-1500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#f3ab1b]" />
                  Badge Collection
                </CardTitle>
                <CardDescription>Your earned achievements and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userBadges.length > 0 ? (
                    userBadges.map((badge, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-gradient-to-br from-[#f3ab1b]/10 to-[#213874]/10 rounded-lg hover:from-[#f3ab1b]/20 hover:to-[#213874]/20 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="w-12 h-12 bg-[#f3ab1b] rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Award className="w-6 h-6 text-[#213874]" />
                        </div>
                        <p className="text-sm font-medium text-[#213874]">{badge.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center col-span-4 py-4">No badges earned yet.</p>
                  )}
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Award className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Next Badge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}