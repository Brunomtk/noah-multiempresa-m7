"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Building, Calendar, FileText } from "lucide-react"
import type { Customer } from "@/types/customer"

interface CustomerDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
}

export function CustomerDetailsModal({ open, onOpenChange, customer }: CustomerDetailsModalProps) {
  if (!customer) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-[#0f172a] border-[#2a3349]">
            <CardHeader>
              <CardTitle className="text-white text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Name</span>
                  </div>
                  <p className="text-white font-medium">{customer.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="text-white">{customer.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Document</span>
                  </div>
                  <p className="text-white">{customer.document}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <p className="text-white">{customer.phone || "Not provided"}</p>
                </div>
              </div>

              {customer.address && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Address</span>
                  </div>
                  <p className="text-white">{customer.address}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-sm">Status</span>
                </div>
                <Badge variant={customer.status === 1 ? "default" : "secondary"}>
                  {customer.status === 1 ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          {customer.company && (
            <Card className="bg-[#0f172a] border-[#2a3349]">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">Company Name</span>
                    </div>
                    <p className="text-white font-medium">{customer.company.name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">CNPJ</span>
                    </div>
                    <p className="text-white">{customer.company.document}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Company Email</span>
                    </div>
                    <p className="text-white">{customer.company.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Company Phone</span>
                    </div>
                    <p className="text-white">{customer.company.phone}</p>
                  </div>
                </div>

                {customer.company.address && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Company Address</span>
                    </div>
                    <p className="text-white">{customer.company.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informações de Sistema */}
          <Card className="bg-[#0f172a] border-[#2a3349]">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Created at</span>
                  </div>
                  <p className="text-white">{formatDate(customer.createdDate)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Updated at</span>
                  </div>
                  <p className="text-white">{formatDate(customer.updatedDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
