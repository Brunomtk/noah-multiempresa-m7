"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState<{
    profile: boolean
    account: boolean
    notifications: boolean
    security: boolean
    system: boolean
  }>({
    profile: false,
    account: false,
    notifications: false,
    security: false,
    system: false,
  })

  const handleSave = (section: keyof typeof loading) => {
    setLoading({ ...loading, [section]: true })

    // Simulate API call
    setTimeout(() => {
      setLoading({ ...loading, [section]: false })
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings loading={loading.profile} onSave={() => handleSave("profile")} />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings loading={loading.account} onSave={() => handleSave("account")} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings loading={loading.notifications} onSave={() => handleSave("notifications")} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings loading={loading.security} onSave={() => handleSave("security")} />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings loading={loading.system} onSave={() => handleSave("system")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSettings({ loading, onSave }: { loading: boolean; onSave: () => void }) {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=100&width=100&query=user")
  const [name, setName] = useState("Admin User")
  const [email, setEmail] = useState("admin@noah.com")
  const [phone, setPhone] = useState("+55 11 99999-9999")
  const [bio, setBio] = useState("Noah platform administrator")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and how you appear on the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#2a3349]"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                onClick={() => document.getElementById("profile-image")?.click()}
              >
                +
              </Button>
              <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <p className="text-sm text-gray-400">Click to change</p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-md border border-[#2a3349] bg-[#1a2234] px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function AccountSettings({ loading, onSave }: { loading: boolean; onSave: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Language and Region</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en-US">
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="America/New_York">
                <SelectTrigger>
                  <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">New York (GMT-4)</SelectItem>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Date and Time Format</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-format">Date format</Label>
              <Select defaultValue="MM/dd/yyyy">
                <SelectTrigger>
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-format">Time format</Label>
              <Select defaultValue="12h">
                <SelectTrigger>
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 hours (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Export</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline">Export account data (CSV)</Button>
            <Button variant="outline">Export account data (JSON)</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function NotificationSettings({ loading, onSave }: { loading: boolean; onSave: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Control how and when you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-appointments">Appointments</Label>
                <p className="text-sm text-gray-400">Receive emails about new appointments and changes</p>
              </div>
              <Switch id="email-appointments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-cancellations">Cancellations</Label>
                <p className="text-sm text-gray-400">Receive emails about appointment cancellations</p>
              </div>
              <Switch id="email-cancellations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-reviews">Reviews</Label>
                <p className="text-sm text-gray-400">Receive emails about new reviews</p>
              </div>
              <Switch id="email-reviews" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-marketing">Marketing</Label>
                <p className="text-sm text-gray-400">Receive emails about news and promotions</p>
              </div>
              <Switch id="email-marketing" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">System Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-appointments">Appointments</Label>
                <p className="text-sm text-gray-400">Receive system notifications about new appointments</p>
              </div>
              <Switch id="system-appointments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-messages">Messages</Label>
                <p className="text-sm text-gray-400">Receive system notifications about new messages</p>
              </div>
              <Switch id="system-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-alerts">Alerts</Label>
                <p className="text-sm text-gray-400">Receive important system alerts</p>
              </div>
              <Switch id="system-alerts" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Summaries and Reports</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-summary">Daily summary</Label>
                <p className="text-sm text-gray-400">Receive a daily summary of activities</p>
              </div>
              <Switch id="daily-summary" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-report">Weekly report</Label>
                <p className="text-sm text-gray-400">Receive a weekly report with statistics</p>
              </div>
              <Switch id="weekly-report" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthly-report">Monthly report</Label>
                <p className="text-sm text-gray-400">Receive a detailed monthly report</p>
              </div>
              <Switch id="monthly-report" defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function SecuritySettings({ loading, onSave }: { loading: boolean; onSave: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked)
    if (checked && !showTwoFactorSetup) {
      setShowTwoFactorSetup(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your password and security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (newPassword === confirmPassword) {
                  toast({
                    title: "Password changed",
                    description: "Your password has been changed successfully.",
                  })
                  setCurrentPassword("")
                  setNewPassword("")
                  setConfirmPassword("")
                } else {
                  toast({
                    title: "Error",
                    description: "Passwords do not match.",
                    variant: "destructive",
                  })
                }
              }}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Change password
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Enable two-factor authentication</Label>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
            </div>

            {showTwoFactorSetup && (
              <div className="mt-4 p-4 border border-[#2a3349] rounded-md">
                <h4 className="font-medium mb-2">Set up two-factor authentication</h4>
                <p className="text-sm text-gray-400 mb-4">Scan the QR code below with your authentication app</p>

                <div className="flex flex-col items-center mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=200&query=QR code for 2FA setup"
                    alt="QR Code"
                    className="w-48 h-48 mb-4"
                  />
                  <p className="text-sm font-mono bg-[#0f172a] p-2 rounded">ABCD-EFGH-IJKL-MNOP</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification code</Label>
                  <div className="flex gap-2">
                    <Input id="verification-code" placeholder="Enter 6-digit code" />
                    <Button
                      onClick={() => {
                        toast({
                          title: "2FA enabled",
                          description: "Two-factor authentication enabled successfully.",
                        })
                        setShowTwoFactorSetup(false)
                      }}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <div className="space-y-3">
            <div className="bg-[#1a2234] p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Chrome on Windows</p>
                  <p className="text-sm text-gray-400">São Paulo, Brazil • Active now</p>
                </div>
                <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">Current</div>
              </div>
              <p className="text-xs text-gray-400">Last access: May 26, 2025, 02:29</p>
            </div>

            <div className="bg-[#1a2234] p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Safari on iPhone</p>
                  <p className="text-sm text-gray-400">Rio de Janeiro, Brazil • 2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  End
                </Button>
              </div>
              <p className="text-xs text-gray-400">Last access: May 26, 2025, 00:15</p>
            </div>

            <Button variant="outline" className="w-full">
              End all other sessions
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function SystemSettings({ loading, onSave }: { loading: boolean; onSave: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Manage general system settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-gray-400">Choose the interface theme</p>
              </div>
              <Select defaultValue="dark">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sidebar">Sidebar</Label>
                <p className="text-sm text-gray-400">Sidebar behavior</p>
              </div>
              <Select defaultValue="expanded">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expanded">Expanded</SelectItem>
                  <SelectItem value="collapsed">Collapsed</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-gray-400">Enable interface animations</p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appointments</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="default-duration">Default duration</Label>
                <p className="text-sm text-gray-400">Default duration for new appointments</p>
              </div>
              <Select defaultValue="60">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select a duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1 hour 30 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="calendar-view">Calendar view</Label>
                <p className="text-sm text-gray-400">Default calendar view</p>
              </div>
              <Select defaultValue="week">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-confirm">Auto-confirmation</Label>
                <p className="text-sm text-gray-400">Automatically confirm new appointments</p>
              </div>
              <Switch id="auto-confirm" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Integrations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="google-calendar">Google Calendar</Label>
                <p className="text-sm text-gray-400">Sync with Google Calendar</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Not connected</span>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="outlook">Microsoft Outlook</Label>
                <p className="text-sm text-gray-400">Sync with Microsoft Outlook</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Not connected</span>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="slack">Slack</Label>
                <p className="text-sm text-gray-400">Receive notifications on Slack</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-500">Connected</span>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Advanced</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug-mode">Debug mode</Label>
                <p className="text-sm text-gray-400">Enable detailed logs for troubleshooting</p>
              </div>
              <Switch id="debug-mode" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cache">Clear cache</Label>
                <p className="text-sm text-gray-400">Clear application cached data</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Cache cleared",
                    description: "Application cache has been cleared successfully.",
                  })
                }}
              >
                Clear cache
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reset">Reset settings</Label>
                <p className="text-sm text-gray-400">Restore all settings to default</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Settings reset",
                    description: "All settings have been restored to default.",
                  })
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
