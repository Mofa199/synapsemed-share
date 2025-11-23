"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import {
  User,
  Bell,
  Shield,
  Palette,
  BookOpen,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Moon,
  Sun,
} from "lucide-react"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Settings state
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    courseUpdates: true,
    achievementAlerts: true,
    weeklyProgress: false,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showProgress: true,
    showBadges: true,
    allowMessages: true,
    dataCollection: true,
  })

  const [learningSettings, setLearningSettings] = useState({
    preferredLanguage: "english",
    studyField: user?.field || "medical",
    difficultyLevel: "intermediate",
    studyGoal: "2",
    autoplay: true,
    soundEffects: true,
  })

  const [displaySettings, setDisplaySettings] = useState({
    theme: "light",
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
  })

  // Load settings from API on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsDataLoading(true)
      
      // Fetch user preferences
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Update settings with fetched data
          const data = result.data
          
          // For now, we'll use default values since the API returns mock data
          // In a real implementation, we would populate the state with actual user preferences
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsDataLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match!",
        variant: "destructive",
      })
      return
    }

    if (accountSettings.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long!",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, we would call an API to change the password
      // For now, we'll simulate this
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Password updated successfully!",
      })
      setAccountSettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Save all settings to the API
      const settingsData = {
        notifications: notificationSettings,
        privacy: privacySettings,
        learning: learningSettings,
        display: displaySettings
      }
      
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: "Success",
            description: "Settings saved successfully!",
          })
        }
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, we would call an API to export user data
      // For now, we'll simulate this
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Success",
        description: "Your data export has been sent to your email address.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
    )

    if (!confirmation) return

    const secondConfirmation = window.prompt('Please type "DELETE" to confirm account deletion:')

    if (secondConfirmation !== "DELETE") {
      toast({
        title: "Cancelled",
        description: "Account deletion cancelled.",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, we would call an API to delete the account
      // For now, we'll simulate this
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Success",
        description: "Account deletion request submitted. You will receive a confirmation email.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213874] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#213874] mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="space-y-8">
            {/* Account Settings */}
            <Card className="animate-in slide-in-from-left duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Update your account information and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user?.name || ""} disabled />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email || ""} disabled />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={accountSettings.currentPassword}
                          onChange={(e) => setAccountSettings((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={accountSettings.newPassword}
                          onChange={(e) => setAccountSettings((prev) => ({ ...prev, newPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={
                      isLoading ||
                      !accountSettings.currentPassword ||
                      !accountSettings.newPassword ||
                      !accountSettings.confirmPassword
                    }
                    className="bg-[#213874] hover:bg-[#1a6ac3]"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="animate-in slide-in-from-left duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Study Reminders</Label>
                      <p className="text-sm text-gray-600">Get reminded about your study schedule</p>
                    </div>
                    <Switch
                      checked={notificationSettings.studyReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, studyReminders: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Course Updates</Label>
                      <p className="text-sm text-gray-600">Notifications about new content and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.courseUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, courseUpdates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Achievement Alerts</Label>
                      <p className="text-sm text-gray-600">Get notified when you earn badges or reach milestones</p>
                    </div>
                    <Switch
                      checked={notificationSettings.achievementAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, achievementAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Progress Report</Label>
                      <p className="text-sm text-gray-600">Receive weekly summaries of your learning progress</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyProgress}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, weeklyProgress: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, marketingEmails: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="animate-in slide-in-from-left duration-1000">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={privacySettings.profileVisibility}
                      onValueChange={(value) => setPrivacySettings((prev) => ({ ...prev, profileVisibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                        <SelectItem value="students">
                          Students Only - Only other students can see your profile
                        </SelectItem>
                        <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Progress</Label>
                      <p className="text-sm text-gray-600">Allow others to see your learning progress</p>
                    </div>
                    <Switch
                      checked={privacySettings.showProgress}
                      onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, showProgress: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Badges</Label>
                      <p className="text-sm text-gray-600">Display your earned badges on your profile</p>
                    </div>
                    <Switch
                      checked={privacySettings.showBadges}
                      onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, showBadges: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Messages</Label>
                      <p className="text-sm text-gray-600">Let other students send you messages</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowMessages}
                      onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, allowMessages: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Data Collection</Label>
                      <p className="text-sm text-gray-600">Allow us to collect usage data to improve the platform</p>
                    </div>
                    <Switch
                      checked={privacySettings.dataCollection}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({ ...prev, dataCollection: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Preferences */}
            <Card className="animate-in slide-in-from-right duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Learning Preferences
                </CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Language</Label>
                    <Select
                      value={learningSettings.preferredLanguage}
                      onValueChange={(value) => setLearningSettings((prev) => ({ ...prev, preferredLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Study Field</Label>
                    <Select
                      value={learningSettings.studyField}
                      onValueChange={(value) => setLearningSettings((prev) => ({ ...prev, studyField: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="nursing">Nursing</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select
                      value={learningSettings.difficultyLevel}
                      onValueChange={(value) => setLearningSettings((prev) => ({ ...prev, difficultyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Daily Study Goal (hours)</Label>
                    <Select
                      value={learningSettings.studyGoal}
                      onValueChange={(value) => setLearningSettings((prev) => ({ ...prev, studyGoal: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Autoplay Videos</Label>
                      <p className="text-sm text-gray-600">Automatically play the next video in a sequence</p>
                    </div>
                    <Switch
                      checked={learningSettings.autoplay}
                      onCheckedChange={(checked) => setLearningSettings((prev) => ({ ...prev, autoplay: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sound Effects</Label>
                      <p className="text-sm text-gray-600">Play sounds for achievements and interactions</p>
                    </div>
                    <Switch
                      checked={learningSettings.soundEffects}
                      onCheckedChange={(checked) => setLearningSettings((prev) => ({ ...prev, soundEffects: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="animate-in slide-in-from-right duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Display & Accessibility
                </CardTitle>
                <CardDescription>Customize the appearance and accessibility of the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={displaySettings.theme}
                      onValueChange={(value) => setDisplaySettings((prev) => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="auto">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Auto
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={displaySettings.fontSize}
                      onValueChange={(value) => setDisplaySettings((prev) => ({ ...prev, fontSize: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Reduced Motion</Label>
                      <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                    </div>
                    <Switch
                      checked={displaySettings.reducedMotion}
                      onCheckedChange={(checked) => setDisplaySettings((prev) => ({ ...prev, reducedMotion: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">High Contrast</Label>
                      <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      checked={displaySettings.highContrast}
                      onCheckedChange={(checked) => setDisplaySettings((prev) => ({ ...prev, highContrast: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="animate-in slide-in-from-right duration-1000">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Export your data or delete your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Export Your Data</h3>
                    <p className="text-blue-700 text-sm mb-4">
                      Download a copy of all your data including progress, achievements, and account information.
                    </p>
                    <Button
                      onClick={handleExportData}
                      disabled={isLoading}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                    <p className="text-red-700 text-sm mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end animate-in slide-in-from-bottom duration-500">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                size="lg"
                className="bg-[#213874] hover:bg-[#1a6ac3]"
              >
                {isLoading ? (
                  <>
                    <Save className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}