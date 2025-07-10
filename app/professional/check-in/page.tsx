import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, Clock, AlertTriangle } from "lucide-react"

export default function ProfessionalCheckIn() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Check-in</h2>
        <p className="text-muted-foreground">Register your arrival at the service location</p>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="details">Service Details</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="space-y-4">
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
              <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    You are 50 meters away from the service location
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Make sure you are at the correct address before checking in
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Register Check-in</CardTitle>
              <CardDescription>Take a photo of the location (optional) and confirm your arrival</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">Location Photo (Before)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">Click to take a photo or upload</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Any observations about the location?" />
                </div>
              </div>
              <Button className="w-full">Confirm Check-in</Button>
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
                <h4 className="text-sm font-medium">Notes:</h4>
                <p className="text-sm">Apartment on 3rd floor. Has a small friendly dog.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
