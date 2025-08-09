"use client"
import { CompanyCancellationsProvider } from "@/contexts/company-cancellations-context"
import { CompanyCancellationsContent } from "@/components/company/company-cancellations-content"

// Sample data for cancellations
const cancellations = [
  {
    id: "CAN-1001",
    client: "Sarah Johnson",
    service: "Regular Cleaning",
    date: "2025-05-20",
    time: "09:00 AM",
    status: "Refunded",
    reason: "Client Schedule Conflict",
    professional: "Maria Garcia",
    refundAmount: "$75.00",
    createdAt: "2025-05-18T14:30:00",
  },
  {
    id: "CAN-1002",
    client: "Robert Williams",
    service: "Deep Cleaning",
    date: "2025-05-22",
    time: "01:00 PM",
    status: "Rescheduled",
    reason: "Professional Unavailable",
    professional: "James Wilson",
    refundAmount: "$0.00",
    createdAt: "2025-05-19T10:15:00",
  },
  {
    id: "CAN-1003",
    client: "Emily Davis",
    service: "Move-out Cleaning",
    date: "2025-05-23",
    time: "10:00 AM",
    status: "Cancelled",
    reason: "Client Dissatisfaction",
    professional: "Ana Martinez",
    refundAmount: "$120.00",
    createdAt: "2025-05-20T09:45:00",
  },
  {
    id: "CAN-1004",
    client: "Michael Brown",
    service: "Regular Cleaning",
    date: "2025-05-24",
    time: "02:30 PM",
    status: "Partial Refund",
    reason: "Weather Conditions",
    professional: "David Thompson",
    refundAmount: "$45.00",
    createdAt: "2025-05-21T16:20:00",
  },
  {
    id: "CAN-1005",
    client: "Jennifer Miller",
    service: "Window Cleaning",
    date: "2025-05-25",
    time: "11:00 AM",
    status: "Rescheduled",
    reason: "Client Request",
    professional: "Sofia Rodriguez",
    refundAmount: "$0.00",
    createdAt: "2025-05-22T08:30:00",
  },
  {
    id: "CAN-1006",
    client: "Daniel Wilson",
    service: "Deep Cleaning",
    date: "2025-05-26",
    time: "09:30 AM",
    status: "Cancelled",
    reason: "System Error",
    professional: "John Smith",
    refundAmount: "$150.00",
    createdAt: "2025-05-23T13:10:00",
  },
]

export default function CompanyCancellationsPage() {
  return (
    <CompanyCancellationsProvider>
      <CompanyCancellationsContent />
    </CompanyCancellationsProvider>
  )
}
