import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, AlertTriangle, Star, DollarSign, MessageSquare } from "lucide-react"

export default function ProfessionalNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">Track alerts and important messages</p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Today</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notification 1 */}
                <div className="flex gap-4 p-3 bg-muted/30 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">New appointment</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        New
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have a new service scheduled for tomorrow at 2:00 PM at 120 Central Street.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Today, 10:15</span>
                      <Button variant="ghost" size="sm" className="h-8">
                        View details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notification 2 */}
                <div className="flex gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Check-in confirmed</h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Confirmed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your check-in at Flores Residential was successfully recorded at 09:02.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Today, 09:05</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Yesterday</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notification 3 */}
                <div className="flex gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">New rating received</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      You received a 5-star rating from Central Office client. "Excellent service, thank you very much!"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Yesterday, 18:30</span>
                      <Button variant="ghost" size="sm" className="h-8">
                        View rating
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notification 4 */}
                <div className="flex gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">New message from supervisor</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mark Smith sent a message: "Remember to complete the feedback after today's service."
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Yesterday, 16:45</span>
                      <Button variant="ghost" size="sm" className="h-8">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>This week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notification 5 */}
                <div className="flex gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Material reminder</h4>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Reminder
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Don't forget to request cleaning supplies replenishment by Friday.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">05/22, 09:00</span>
                      <Button variant="ghost" size="sm" className="h-8">
                        Request now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notification 6 */}
                <div className="flex gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Payment processed</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your payment for the week of 05/20 to 05/26 has been processed successfully.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">05/20, 18:00</span>
                      <Button variant="ghost" size="sm" className="h-8">
                        View details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center mt-6">
              <Button variant="outline">Load more notifications</Button>
            </div>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unread notifications</CardTitle>
                <CardDescription>Alerts and messages you haven't viewed yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Content filtered by unread notifications will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="important" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Important notifications</CardTitle>
                <CardDescription>Alerts and messages marked as important</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Content filtered by important notifications will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
