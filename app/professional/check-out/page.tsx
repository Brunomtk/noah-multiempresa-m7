import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, Clock, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function ProfessionalCheckOut() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Check-out</h2>
        <p className="text-muted-foreground">Register the completion of your service</p>
      </div>

      <Tabs defaultValue="photos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="photos">Photos & Confirmation</TabsTrigger>
          <TabsTrigger value="details">Service Details</TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Register Check-out</CardTitle>
              <CardDescription>
                Take photos of the location after cleaning and confirm service completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="before-photo">Location Photo (Before)</Label>
                  <div className="border rounded-md p-1">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Photo taken at check-in</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="after-photo">Location Photo (After)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">Click to take a photo or upload</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  placeholder="Describe how the service went, difficulties encountered, or other important observations"
                  rows={4}
                />
              </div>
              <Button className="w-full">Confirm Check-out</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Location</CardTitle>
              <CardDescription>Confirm you are at the correct service location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Location map</p>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    You are at the correct location
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400">Location confirmed for check-out</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Information about the current appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time:</span>
                  <span className="text-sm">2:30 PM - 4:30 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-sm">123 Flower Street - Downtown</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Client:</h4>
                <p className="text-sm">John Smith</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Service Type:</h4>
                <p className="text-sm">Residential Cleaning</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Check-in completed:</h4>
                <p className="text-sm">2:32 PM (2 minutes late)</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Time elapsed:</h4>
                <p className="text-sm">1h 28min</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
