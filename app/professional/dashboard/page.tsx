import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, AlertTriangle, CheckSquare } from "lucide-react"

export default function ProfessionalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hello, Maria Silva</h2>
          <p className="text-muted-foreground">Shift: Morning | Team: Alpha | Monday, May 26, 2025</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Service</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">14:30</div>
            <p className="text-xs text-muted-foreground">Today</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">123 Flower Street - Downtown</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Residential Cleaning</span>
              </div>
              <Button className="w-full mt-2">Check In</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <Badge variant="outline">1/2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <Badge variant="outline">1/2</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2">
                View Full Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Pending Items</p>
            <div className="mt-4 space-y-2">
              <div className="p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Remember to complete the feedback after your service.
                </p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300">You have a pending material request.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border dark:border-slate-700">
          <CardHeader>
            <CardTitle>Today's Services</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                    <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Residential Cleaning</h4>
                    <p className="text-sm text-muted-foreground">09:00 - 11:00</p>
                    <p className="text-sm">456 Palm Street - Garden District</p>
                  </div>
                </div>
                <Badge className="bg-green-500 mt-2 sm:mt-0">Completed</Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Residential Cleaning</h4>
                    <p className="text-sm text-muted-foreground">14:30 - 16:30</p>
                    <p className="text-sm">123 Flower Street - Downtown</p>
                  </div>
                </div>
                <Badge variant="outline" className="mt-2 sm:mt-0">
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
