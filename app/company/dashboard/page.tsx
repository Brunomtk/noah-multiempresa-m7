"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  Package,
  CalendarIcon,
  CreditCard,
  CheckCheck,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Overview of your cleaning services</p>
      </div>

      {/* Plan Summary */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-[#06b6d4]" />
              Professional Plan
            </CardTitle>
            <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Renewal Date</span>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  15 days left
                </Badge>
              </div>
              <p className="text-white font-medium">June 10, 2025</p>
              <div className="h-1.5 w-full bg-[#0f172a] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: "50%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Payment Status</span>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  <CheckCheck className="mr-1 h-3 w-3" />
                  Paid
                </Badge>
              </div>
              <p className="text-white font-medium">Last payment: May 10, 2025</p>
              <p className="text-sm text-gray-400">Next payment: June 10, 2025</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Quick Actions</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="sm" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white w-full justify-between">
                  <Link href="/company/plan">
                    View Plan Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-[#2a3349] text-white hover:bg-[#2a3349] w-full justify-between"
                >
                  <Link href="/company/payments">
                    Payment History
                    <CreditCard className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="mt-4 pt-4 border-t border-[#2a3349]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Plan Features</span>
              <Badge variant="outline" className="text-[#06b6d4] border-[#06b6d4]/30">
                <Shield className="mr-1 h-3 w-3" />
                Professional
              </Badge>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">Unlimited Appointments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">10 Team Members</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">GPS Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">Client Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">Email Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">White Labeling</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Scheduled This Week</CardTitle>
            <Calendar className="h-4 w-4 text-[#06b6d4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">3 more than last week</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-gray-400">62.5% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">Next service tomorrow</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2234] border-[#2a3349]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-gray-400">Great performance!</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#06b6d4]" />
            Important Notices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg border border-[#2a3349]">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-[#06b6d4] rounded-full animate-pulse" />
              <div>
                <p className="text-white font-medium">Next Cleaning Service</p>
                <p className="text-sm text-gray-400">Tomorrow at 9:00 AM - Team Alpha</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-[#06b6d4] hover:text-white hover:bg-[#2a3349]">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-white font-medium">Plan Renewal Upcoming</p>
                <p className="text-sm text-gray-400">Your Professional Plan renews in 15 days</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-yellow-500 hover:text-white hover:bg-[#2a3349]">
              <Link href="/company/plan">
                Manage Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button asChild className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              <Link href="/company/schedule">View Schedule</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#2a3349] text-white hover:bg-[#2a3349]">
              <Link href="/company/reschedule">Reschedule Service</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#2a3349] text-white hover:bg-[#2a3349]">
              <Link href="/company/feedback">Request Support</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#2a3349] text-white hover:bg-[#2a3349]">
              <Link href="/company/reviews">Rate Last Service</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Chart */}
      <Card className="bg-[#1a2234] border-[#2a3349]">
        <CardHeader>
          <CardTitle className="text-white">Service Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full" />
                <span className="text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">62.5%</span>
                <div className="w-32 h-2 bg-[#0f172a] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "62.5%" }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full" />
                <span className="text-gray-400">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">37.5%</span>
                <div className="w-32 h-2 bg-[#0f172a] rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: "37.5%" }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full" />
                <span className="text-gray-400">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">0%</span>
                <div className="w-32 h-2 bg-[#0f172a] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
