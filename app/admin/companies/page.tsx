"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { CompanyModal } from "@/components/admin/company-modal"
import { CompanyDetailsModal } from "@/components/admin/company-details-modal"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCompanies } from "@/hooks/use-companies"
import type { Company } from "@/types"

export default function CompaniesPage() {
  const {
    companies,
    isLoading,
    error,
    pagination,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    setFilters,
    getCompanyById,
  } = useCompanies()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const initializedRef = useRef(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      fetchCompanies(1, 10)
    }
  }, [fetchCompanies])

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    setFilters({ status, search: searchQuery })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters({ status: statusFilter, search: value })
    }, 500)
  }

  const handleAddCompany = async (data: any) => {
    const result = await createCompany({
      name: data.name,
      cnpj: data.cnpj,
      responsible: data.responsible,
      email: data.email,
      phone: data.phone,
      status: 1,
      planId: data.planId,
    })

    if (result) {
      setIsModalOpen(false)
      toast({
        title: "Company added successfully",
        description: `${data.name} has been added to the system.`,
      })
    }
  }

  const handleEditCompany = async (data: any) => {
    if (!selectedCompany) return

    const result = await updateCompany(selectedCompany.id, {
      name: data.name,
      cnpj: data.cnpj,
      responsible: data.responsible,
      email: data.email,
      phone: data.phone,
      planId: data.planId,
    })

    if (result) {
      setSelectedCompany(null)
      setIsModalOpen(false)
      toast({
        title: "Company updated successfully",
        description: `${data.name} has been updated.`,
      })
    }
  }

  const handleDeleteCompany = async () => {
    if (companyToDelete) {
      const success = await deleteCompany(companyToDelete.id)
      if (success) {
        toast({
          title: "Company deleted successfully",
          description: `${companyToDelete.name} has been removed from the system.`,
          variant: "destructive",
        })
      }
      setCompanyToDelete(null)
    }
  }

  const handleViewDetails = async (company: Company) => {
    const fullCompany = await getCompanyById(company.id)
    if (fullCompany) {
      setSelectedCompany(fullCompany)
      setIsDetailsModalOpen(true)
    }
  }

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    fetchCompanies(page, pagination.itemsPerPage, statusFilter, searchQuery)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Company Management</h1>
            <p className="text-gray-400">Manage all active companies in the system.</p>
          </div>
          <Button
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={() => {
              setSelectedCompany(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Company
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or CNPJ..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full md:w-[300px] bg-[#1a2234] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => handleStatusFilterChange("all")}
              className={
                statusFilter === "all"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
              }
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              onClick={() => handleStatusFilterChange("active")}
              className={
                statusFilter === "active"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
              }
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              onClick={() => handleStatusFilterChange("inactive")}
              className={
                statusFilter === "inactive"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-white"
                  : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
              }
            >
              Inactive
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-[#2a3349] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1a2234]">
              <TableRow className="border-[#2a3349] hover:bg-[#2a3349]">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">CNPJ</TableHead>
                <TableHead className="text-white">Plan</TableHead>
                <TableHead className="text-white">Responsible</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && companies.length === 0 ? (
                <TableRow className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell colSpan={6} className="text-center py-8 text-red-400">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id} className="border-[#2a3349] hover:bg-[#1a2234] bg-[#0f172a]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#2a3349] p-1.5 rounded-md">
                          <Building2 className="h-4 w-4 text-[#06b6d4]" />
                        </div>
                        {company.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{company.cnpj}</TableCell>
                    <TableCell className="text-gray-400">{company.planName || company.plan?.name || "N/A"}</TableCell>
                    <TableCell className="text-gray-400">{company.responsible}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          company.status === 1 ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                        }
                      >
                        {company.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(company)}
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(company)}
                              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a3349]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setCompanyToDelete(company)}
                              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-[#2a3349]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Page <span className="font-medium text-white">{pagination.currentPage}</span> of{" "}
              <span className="font-medium text-white">{pagination.totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
              >
                Previous
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    page === pagination.currentPage
                      ? "border-[#2a3349] bg-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white"
                      : "border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
                  }
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="border-[#2a3349] text-white hover:bg-[#2a3349] hover:text-white bg-transparent"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <CompanyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCompany(null)
          }}
          onSubmit={selectedCompany ? handleEditCompany : handleAddCompany}
          company={selectedCompany}
        />

        <CompanyDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedCompany(null)
          }}
          company={selectedCompany}
        />

        <AlertDialog open={!!companyToDelete} onOpenChange={() => setCompanyToDelete(null)}>
          <AlertDialogContent className="bg-[#1a2234] border-[#2a3349] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the company{" "}
                <span className="font-semibold text-white">{companyToDelete?.name}</span> from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#2a3349] text-white hover:bg-[#2a3349]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCompany}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
