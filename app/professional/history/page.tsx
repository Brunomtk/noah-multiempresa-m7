import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Search, Eye, XCircle } from "lucide-react"

export default function ProfessionalHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Service History</h2>
        <p className="text-muted-foreground">View all your completed services</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search by client or address..." className="pl-8 w-full sm:w-[300px]" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="30">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="residential">Residential</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="post-construction">Post-Construction</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">May 2023</CardTitle>
                <div className="text-sm text-muted-foreground">12 services</div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-4">
                {/* Service 1 */}
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                        <span className="text-sm text-muted-foreground">05/25/2023</span>
                      </div>
                      <h3 className="font-semibold">Residential Cleaning</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Flores Residential, Apt 302</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">09:00 - 12:00</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">5.0</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Service 2 */}
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                        <span className="text-sm text-muted-foreground">05/23/2023</span>
                      </div>
                      <h3 className="font-semibold">Commercial Cleaning</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Central Office, 5th floor</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">14:00 - 17:00</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">4.0</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Service 3 */}
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                        <span className="text-sm text-muted-foreground">05/21/2023</span>
                      </div>
                      <h3 className="font-semibold">Post-Construction Cleaning</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Green View Condominium, Block B, Apt 101</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">08:00 - 13:00</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">5.0</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Service 4 */}
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Canceled
                        </Badge>
                        <span className="text-sm text-muted-foreground">05/18/2023</span>
                      </div>
                      <h3 className="font-semibold">Residential Cleaning</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Tree Park Residential, House 15</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">10:00 - 12:00</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Client absent</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Service 5 */}
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                        <span className="text-sm text-muted-foreground">05/15/2023</span>
                      </div>
                      <h3 className="font-semibold">Commercial Cleaning</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Total Health Clinic, Reception and Offices</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">19:00 - 22:00</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mt-6">
                <Button variant="outline">Load more</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="residential" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Residential Cleanings</CardTitle>
              <CardDescription>History of services in residential properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Content filtered by residential cleanings will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commercial Cleanings</CardTitle>
              <CardDescription>History of services in commercial establishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Content filtered by commercial cleanings will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post-construction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post-Construction Cleanings</CardTitle>
              <CardDescription>History of services in locations after construction or renovation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Content filtered by post-construction cleanings will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
