import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Camera, Clock, CheckCircle } from "lucide-react"

export default function ProfessionalFeedback() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Post-Visit Feedback</h2>
        <p className="text-muted-foreground">Record incidents or observations after service completion</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>Services completed in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Residential Cleaning</h4>
                    <p className="text-sm text-muted-foreground">Today, 9:00 AM - 11:00 AM</p>
                    <p className="text-sm">456 Palm Street - Garden District</p>
                  </div>
                </div>
                <Button size="sm">Feedback</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Commercial Cleaning</h4>
                    <p className="text-sm text-muted-foreground">Yesterday, 2:00 PM - 5:00 PM</p>
                    <p className="text-sm">789 Commercial Ave - Downtown</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                  Submitted
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Residential Cleaning</h4>
                    <p className="text-sm text-muted-foreground">05/24, 10:00 AM - 12:00 PM</p>
                    <p className="text-sm">321 Oak Street - Garden District</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                  Submitted
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>Report incidents or observations about the service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Service Details</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400">Residential Cleaning</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">456 Palm Street - Garden District</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">Today, 9:00 AM - 11:00 AM</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occurrence-type">Incident Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locked">Locked location</SelectItem>
                  <SelectItem value="absent">Client absent</SelectItem>
                  <SelectItem value="equipment">Faulty equipment</SelectItem>
                  <SelectItem value="animal">Loose animal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" placeholder="Describe the incident in detail" rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo (optional)</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">Click to take a photo or upload</p>
              </div>
            </div>

            <Button className="w-full">Submit Feedback</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
          <CardDescription>Previously submitted feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">Commercial Cleaning</h4>
                  <p className="text-sm text-muted-foreground">Yesterday, 2:00 PM - 5:00 PM</p>
                </div>
                <Badge>Faulty equipment</Badge>
              </div>
              <p className="text-sm mb-2">
                The vacuum cleaner had issues during use, making a strange noise and losing power. I managed to complete
                the service using other equipment.
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Submitted on 05/25/2025, 5:12 PM</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">Residential Cleaning</h4>
                  <p className="text-sm text-muted-foreground">05/24, 10:00 AM - 12:00 PM</p>
                </div>
                <Badge>Loose animal</Badge>
              </div>
              <p className="text-sm mb-2">
                The client left the dog loose during the entire service, which made cleaning some areas difficult. The
                animal is docile but very energetic.
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Submitted on 05/24/2025, 12:15 PM</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
