import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Shield, LogOut, Upload } from "lucide-react"

export default function ProfessionalProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and settings</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Data</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Your photo will be displayed on your profile</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128&query=professional" alt="Profile photo" />
                  <AvatarFallback className="text-2xl">MP</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Change
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
                <div className="mt-6 w-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                      <span className="text-sm text-muted-foreground">Current status</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Team A</Badge>
                      <span className="text-sm text-muted-foreground">Current team</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Morning</Badge>
                      <span className="text-sm text-muted-foreground">Default shift</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your registration details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your full name" defaultValue="Maria Pereira" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">SSN/ID</Label>
                      <Input id="cpf" placeholder="000-00-0000" defaultValue="123-45-6789" disabled />
                      <p className="text-xs text-muted-foreground">ID number cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="(000) 000-0000" defaultValue="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        defaultValue="maria.pereira@email.com"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Input id="address" placeholder="Street, number, apt" defaultValue="123 Flower Street, Apt 45" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="00000" defaultValue="12345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Your city" defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" defaultValue="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Neighborhood</Label>
                      <Input id="neighborhood" placeholder="Your neighborhood" defaultValue="Downtown" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Change Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices where your account is logged in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">This device</h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Current
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Android Smartphone • New York, NY</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Connected now</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Windows Computer</h4>
                      <Button variant="ghost" size="sm" className="h-8 text-destructive">
                        End
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Chrome • New York, NY</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Last access: yesterday at 3:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  End all other sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
