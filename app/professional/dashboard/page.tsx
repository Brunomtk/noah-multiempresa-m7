"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, Calendar, AlertTriangle, CheckSquare, User, FileText, CheckCircle2, XCircle, Timer } from 'lucide-react'
import { useEffect, useState } from "react"
import { 
  getProfessionalAppointments, 
  getCheckRecords, 
  getInternalFeedback,
  type ProfessionalAppointment,
  type CheckRecord,
  type InternalFeedback
} from "@/lib/api/professional-dashboard"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

export default function ProfessionalDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<ProfessionalAppointment[]>([])
  const [checkRecords, setCheckRecords] = useState<CheckRecord[]>([])
  const [feedbacks, setFeedbacks] = useState<InternalFeedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      // Load today's appointments
      const today = new Date()
      const startDate = format(today, 'yyyy-MM-dd')
      const endDate = format(today, 'yyyy-MM-dd')
      
      const [appointmentsRes, checkRecordsRes, feedbacksRes] = await Promise.all([
        getProfessionalAppointments({
          professionalId: user.id,
          startDate: startDate + 'T00:00:00',
          endDate: endDate + 'T23:59:59',
          pageSize: 10
        }),
        getCheckRecords({
          professionalId: user.id,
          pageSize: 10
        }),
        getInternalFeedback({
          professionalId: user.id,
          pageSize: 5
        })
      ])

      setAppointments(appointmentsRes.results || [])
      setCheckRecords(checkRecordsRes.results || [])
      setFeedbacks(feedbacksRes.data || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: number, type: 'appointment' | 'check' | 'feedback') => {
    if (type === 'check') {
      switch (status) {
        case 0: return <Badge variant="outline">Pending</Badge>
        case 1: return <Badge className="bg-blue-500">Checked In</Badge>
        case 2: return <Badge className="bg-green-500">Completed</Badge>
        default: return <Badge variant="outline">Unknown</Badge>
      }
    }
    
    if (type === 'feedback') {
      switch (status) {
        case 0: return <Badge variant="destructive">Open</Badge>
        case 1: return <Badge className="bg-yellow-500">In Progress</Badge>
        case 2: return <Badge className="bg-green-500">Resolved</Badge>
        default: return <Badge variant="outline">Unknown</Badge>
      }
    }

    return <Badge variant="outline">Status {status}</Badge>
  }

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 0: return <Badge variant="outline">Low</Badge>
      case 1: return <Badge className="bg-yellow-500">Medium</Badge>
      case 2: return <Badge variant="destructive">High</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const todayAppointments = appointments.length
  const completedToday = checkRecords.filter(record => record.status === 2).length
  const pendingCheckIns = checkRecords.filter(record => record.status === 0).length
  const openFeedbacks = feedbacks.filter(feedback => feedback.status === 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hello, {user?.name || 'Professional'}</h2>
          <p className="text-muted-foreground">
            Dashboard | {format(new Date(), "EEEE, MMMM do, yyyy", { locale: enUS })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/professional/schedule')}>
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
          <Button onClick={() => router.push('/professional/check')} variant="outline">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Check-in/out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {completedToday} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCheckIns}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting check-in
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Feedbacks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openFeedbacks}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border dark:border-slate-700">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access main features quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/professional/schedule')}
            >
              <Calendar className="h-6 w-6" />
              <span>Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/professional/check')}
            >
              <CheckCircle2 className="h-6 w-6" />
              <span>Check-in/out</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/professional/feedback')}
            >
              <FileText className="h-6 w-6" />
              <span>Feedback</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/professional/profile')}
            >
              <User className="h-6 w-6" />
              <span>Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card className="border dark:border-slate-700">
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
          <CardDescription>Your appointments for today</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments for today
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.title}</TableCell>
                    <TableCell>{appointment.customer.name}</TableCell>
                    <TableCell>
                      {format(new Date(appointment.start), 'HH:mm')} - {format(new Date(appointment.end), 'HH:mm')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{appointment.address}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => router.push('/professional/check')}>
                        Check-in
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Check Records */}
      <Card className="border dark:border-slate-700">
        <CardHeader>
          <CardTitle>Check Records</CardTitle>
          <CardDescription>Recent check-in and check-out history</CardDescription>
        </CardHeader>
        <CardContent>
          {checkRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No check records found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Service Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.customerName}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.address}</TableCell>
                    <TableCell>
                      {record.checkInTime ? format(new Date(record.checkInTime), 'MM/dd HH:mm') : '-'}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime ? format(new Date(record.checkOutTime), 'MM/dd HH:mm') : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status, 'check')}</TableCell>
                    <TableCell>{record.serviceType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Internal Feedback */}
      <Card className="border dark:border-slate-700">
        <CardHeader>
          <CardTitle>Internal Feedback</CardTitle>
          <CardDescription>Your recent feedback and requests</CardDescription>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No feedback found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.title}</TableCell>
                    <TableCell>{feedback.category}</TableCell>
                    <TableCell>{getPriorityBadge(feedback.priority)}</TableCell>
                    <TableCell>{getStatusBadge(feedback.status, 'feedback')}</TableCell>
                    <TableCell>{format(new Date(feedback.date), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => router.push('/professional/feedback')}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
