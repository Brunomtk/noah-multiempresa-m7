"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, User, CreditCard, Calendar } from "lucide-react"
import type { Company } from "@/types"

interface CompanyDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  company: Company | null
}

export function CompanyDetailsModal({ isOpen, onClose, company }: CompanyDetailsModalProps) {
  if (!company) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#06b6d4]" />
            Company Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">Complete information about the company</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <Badge
              variant="outline"
              className={
                company.status === "active" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
              }
            >
              {company.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">CNPJ</span>
                </div>
                <p className="font-medium">{company.cnpj}</p>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Responsible</span>
                </div>
                <p className="font-medium">{company.responsible}</p>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="font-medium">{company.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Plan</span>
                </div>
                <p className="font-medium">{company.planName}</p>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Phone</span>
                </div>
                <p className="font-medium">{company.phone}</p>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Member Since</span>
                </div>
                <p className="font-medium">
                  {new Date(company.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#2a3349]">
            <h4 className="font-medium mb-2">Additional Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Monthly Appointments:</span>
                <span className="ml-2">45</span>
              </div>
              <div>
                <span className="text-gray-400">Active Addresses:</span>
                <span className="ml-2">3</span>
              </div>
              <div>
                <span className="text-gray-400">Total Professionals:</span>
                <span className="ml-2">12</span>
              </div>
              <div>
                <span className="text-gray-400">Average Rating:</span>
                <span className="ml-2">4.8/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
