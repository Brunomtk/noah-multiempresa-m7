import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ProfessionalPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Performance</h2>
        <p className="text-muted-foreground">Track your metrics and ratings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-green-500">+2</span>
              <span className="text-xs text-muted-foreground">compared to previous week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= 4.8 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-green-500">+0.2</span>
              <span className="text-xs text-muted-foreground">compared to previous week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32h</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-amber-500">80%</span>
              <span className="text-xs text-muted-foreground">of weekly workload</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
              <CardDescription>Performance from 05/20 to 05/26</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Punctuality</span>
                  <span className="text-sm">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Service Completion</span>
                  <span className="text-sm">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Client Satisfaction</span>
                  <span className="text-sm">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Weekly Highlights</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Excellent work! You completed 100% of services on time.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        Attention: you had 1 delay of 5 minutes this week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Ratings</CardTitle>
              <CardDescription>Client comments about your services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Residential Cleaning</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Excellent service! The professional was very attentive and careful with all details. My house looks
                  impeccable."
                </p>
                <div className="mt-2 text-xs text-muted-foreground">Client: Flores Residence - 05/25/2023</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Commercial Cleaning</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Very good service. Just needed a bit more attention to the windows, but overall it was great."
                </p>
                <div className="mt-2 text-xs text-muted-foreground">Client: Central Office - 05/23/2023</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Post-Construction Cleaning</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Impeccable work! Managed to remove all construction debris and left the apartment ready for use.
                  Highly recommended!"
                </p>
                <div className="mt-2 text-xs text-muted-foreground">Client: Green View Condominium - 05/21/2023</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly History</CardTitle>
              <CardDescription>Performance evolution over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-end justify-between gap-2">
                {[65, 70, 75, 68, 72, 80, 85, 82, 88, 90, 92, 95].map((value, i) => (
                  <div key={i} className="relative h-full flex flex-col justify-end items-center">
                    <div className="w-8 bg-primary/80 rounded-t-sm" style={{ height: `${value}%` }}></div>
                    <span className="text-xs mt-2">{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <div className="text-xs text-muted-foreground">Week 1</div>
                <div className="text-xs text-muted-foreground">Week 2</div>
                <div className="text-xs text-muted-foreground">Week 3</div>
                <div className="text-xs text-muted-foreground">Week 4</div>
              </div>
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/80 rounded-sm"></div>
                  <span className="text-sm">Performance Index (%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Goals</CardTitle>
              <CardDescription>Tracking of established goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Completed Services</span>
                  </div>
                  <span className="text-sm">42/50</span>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 50 services/month</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Average Rating</span>
                  </div>
                  <span className="text-sm">4.7/5.0</span>
                </div>
                <Progress value={94} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 4.5 stars</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Punctuality</span>
                  </div>
                  <span className="text-sm">96%</span>
                </div>
                <Progress value={96} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 95% punctuality</p>
              </div>

              <div className="pt-4 border-t mt-4">
                <h4 className="text-sm font-medium mb-2">Summary</h4>
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    You are meeting all goals established for this month! Keep up the good work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Your performance compared to team average</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client Ratings</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-xs text-green-500">(+0.3)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={96} className="h-2 flex-1" />
                <div className="h-4 w-px bg-gray-300"></div>
                <Progress value={90} className="h-2 flex-1 bg-gray-200" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>You</span>
                <span>Team Average: 4.5</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Services per Week</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">12</span>
                  <span className="text-xs text-green-500">(+1)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={92} className="h-2 flex-1" />
                <div className="h-4 w-px bg-gray-300"></div>
                <Progress value={85} className="h-2 flex-1 bg-gray-200" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>You</span>
                <span>Team Average: 11</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Punctuality</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">95%</span>
                  <span className="text-xs text-amber-500">(−2%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={95} className="h-2 flex-1" />
                <div className="h-4 w-px bg-gray-300"></div>
                <Progress value={97} className="h-2 flex-1 bg-gray-200" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>You</span>
                <span>Team Average: 97%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
