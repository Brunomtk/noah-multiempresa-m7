"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, MapPin, User, Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react"
import {
  getCheckRecords,
  createCheckRecord,
  updateCheckRecord,
  deleteCheckRecord,
  performCheckIn,
  performCheckOut,
  getProfessionals,
  getCustomers,
  getTeams,
  getAppointments,
} from "@/lib/api/check-records"
import { getCompanyId } from "@/lib/api/utils"
import type { CheckRecord } from "@/types/check-record"

export default function CheckManagementPage() {
  const [checkRecords, setCheckRecords] = useState<CheckRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<CheckRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<CheckRecord | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [companyId, setCompanyId] = useState<number | null>(null)

  // Form data for creating/editing records
  const [formData, setFormData] = useState({
    professionalId: "",
    professionalName: "",
    customerId: "",
    customerName: "",
    appointmentId: "",
    address: "",
    teamId: "",
    teamName: "",
    serviceType: "",
    notes: "",
  })

  // Dropdown data
  const [professionals, setProfessionals] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    // Initialize company ID on client side only
    const id = getCompanyId()
    setCompanyId(id)
  }, [])

  useEffect(() => {
    if (companyId) {
      loadCheckRecords()
      loadDropdownData()
    }
  }, [companyId])

  useEffect(() => {
    filterRecords()
  }, [checkRecords, searchTerm, statusFilter, typeFilter])

  const loadCheckRecords = async () => {
    if (!companyId) return

    try {
      setLoading(true)
      const records = await getCheckRecords({ companyId })
      setCheckRecords(records)
    } catch (error) {
      console.error("Error loading check records:", error)
      // Set mock data for development
      setCheckRecords([
        {
          id: "1",
          professionalId: "1",
          professionalName: "João Silva",
          companyId: companyId,
          customerId: "1",
          customerName: "Cliente A",
          appointmentId: "1",
          address: "Rua das Flores, 123 - São Paulo, SP",
          teamId: "1",
          teamName: "Equipe Alpha",
          checkInTime: new Date().toISOString(),
          checkOutTime: null,
          status: "checked-in",
          serviceType: "Limpeza Residencial",
          notes: "Check-in realizado com sucesso",
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        },
        {
          id: "2",
          professionalId: "2",
          professionalName: "Maria Santos",
          companyId: companyId,
          customerId: "2",
          customerName: "Cliente B",
          appointmentId: "2",
          address: "Av. Paulista, 456 - São Paulo, SP",
          teamId: "2",
          teamName: "Equipe Beta",
          checkInTime: new Date(Date.now() - 3600000).toISOString(),
          checkOutTime: new Date().toISOString(),
          status: "completed",
          serviceType: "Limpeza Comercial",
          notes: "Serviço concluído",
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadDropdownData = async () => {
    if (!companyId) return

    try {
      const [professionalsData, customersData, teamsData, appointmentsData] = await Promise.all([
        getProfessionals(companyId),
        getCustomers(companyId),
        getTeams(companyId),
        getAppointments(companyId),
      ])

      setProfessionals(professionalsData)
      setCustomers(customersData)
      setTeams(teamsData)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error loading dropdown data:", error)
      // Set mock data for development
      setProfessionals([
        { id: "1", name: "João Silva" },
        { id: "2", name: "Maria Santos" },
      ])
      setCustomers([
        { id: "1", name: "Cliente A" },
        { id: "2", name: "Cliente B" },
      ])
      setTeams([
        { id: "1", name: "Equipe Alpha" },
        { id: "2", name: "Equipe Beta" },
      ])
      setAppointments([
        { id: "1", title: "Limpeza Residencial - Cliente A" },
        { id: "2", title: "Limpeza Comercial - Cliente B" },
      ])
    }
  }

  const filterRecords = () => {
    let filtered = checkRecords

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.serviceType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    if (typeFilter !== "all") {
      if (typeFilter === "check-in") {
        filtered = filtered.filter((record) => record.checkInTime && !record.checkOutTime)
      } else if (typeFilter === "check-out") {
        filtered = filtered.filter((record) => record.checkOutTime)
      }
    }

    setFilteredRecords(filtered)
  }

  const handleCreateRecord = async () => {
    if (!companyId) return

    try {
      const newRecord = await createCheckRecord({
        ...formData,
        companyId,
      })
      setCheckRecords([...checkRecords, newRecord])
      setIsCreateModalOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating check record:", error)
    }
  }

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return

    try {
      const updatedRecord = await updateCheckRecord(selectedRecord.id, formData)
      setCheckRecords(checkRecords.map((record) => (record.id === selectedRecord.id ? updatedRecord : record)))
      setIsEditModalOpen(false)
      setSelectedRecord(null)
      resetForm()
    } catch (error) {
      console.error("Error updating check record:", error)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteCheckRecord(id)
      setCheckRecords(checkRecords.filter((record) => record.id !== id))
    } catch (error) {
      console.error("Error deleting check record:", error)
    }
  }

  const handleCheckIn = async (recordData: any) => {
    if (!companyId) return

    try {
      const newRecord = await performCheckIn({
        ...recordData,
        companyId,
      })
      setCheckRecords([...checkRecords, newRecord])
    } catch (error) {
      console.error("Error performing check-in:", error)
    }
  }

  const handleCheckOut = async (id: string) => {
    try {
      const updatedRecord = await performCheckOut(id)
      setCheckRecords(checkRecords.map((record) => (record.id === id ? updatedRecord : record)))
    } catch (error) {
      console.error("Error performing check-out:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      professionalId: "",
      professionalName: "",
      customerId: "",
      customerName: "",
      appointmentId: "",
      address: "",
      teamId: "",
      teamName: "",
      serviceType: "",
      notes: "",
    })
  }

  const openEditModal = (record: CheckRecord) => {
    setSelectedRecord(record)
    setFormData({
      professionalId: record.professionalId,
      professionalName: record.professionalName,
      customerId: record.customerId || "",
      customerName: record.customerName || "",
      appointmentId: record.appointmentId || "",
      address: record.address || "",
      teamId: record.teamId || "",
      teamName: record.teamName || "",
      serviceType: record.serviceType || "",
      notes: record.notes || "",
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (record: CheckRecord) => {
    setSelectedRecord(record)
    setIsViewModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return <Badge variant="default">Check-in</Badge>
      case "completed":
        return <Badge variant="secondary">Concluído</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("pt-BR")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando registros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Check-in/Check-out</h1>
          <p className="text-gray-600">Gerencie os registros de entrada e saída dos profissionais</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Registro</DialogTitle>
              <DialogDescription>Preencha os dados para criar um novo registro de check-in/check-out</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="professional">Profissional</Label>
                <Select
                  value={formData.professionalId}
                  onValueChange={(value) => {
                    const professional = professionals.find((p) => p.id === value)
                    setFormData({
                      ...formData,
                      professionalId: value,
                      professionalName: professional?.name || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customer">Cliente</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => {
                    const customer = customers.find((c) => c.id === value)
                    setFormData({
                      ...formData,
                      customerId: value,
                      customerName: customer?.name || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="team">Equipe</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => {
                    const team = teams.find((t) => t.id === value)
                    setFormData({
                      ...formData,
                      teamId: value,
                      teamName: team?.name || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointment">Agendamento</Label>
                <Select
                  value={formData.appointmentId}
                  onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um agendamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {appointment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Digite o endereço do serviço"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="serviceType">Tipo de Serviço</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="Digite o tipo de serviço"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Digite observações adicionais"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateRecord}>Criar Registro</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por profissional, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="checked-in">Check-in</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="check-in">Apenas Check-in</SelectItem>
                  <SelectItem value="check-out">Apenas Check-out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Check-in/Check-out</CardTitle>
          <CardDescription>{filteredRecords.length} registro(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {record.professionalName}
                    </div>
                  </TableCell>
                  <TableCell>{record.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {record.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatDateTime(record.checkInTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatDateTime(record.checkOutTime)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openViewModal(record)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteRecord(record.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {record.checkInTime && !record.checkOutTime && (
                        <Button variant="default" size="sm" onClick={() => handleCheckOut(record.id)}>
                          Check-out
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Registro</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Profissional</Label>
                <p className="text-sm text-gray-600">{selectedRecord.professionalName}</p>
              </div>
              <div>
                <Label>Cliente</Label>
                <p className="text-sm text-gray-600">{selectedRecord.customerName}</p>
              </div>
              <div>
                <Label>Equipe</Label>
                <p className="text-sm text-gray-600">{selectedRecord.teamName}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
              </div>
              <div className="col-span-2">
                <Label>Endereço</Label>
                <p className="text-sm text-gray-600">{selectedRecord.address}</p>
              </div>
              <div>
                <Label>Check-in</Label>
                <p className="text-sm text-gray-600">{formatDateTime(selectedRecord.checkInTime)}</p>
              </div>
              <div>
                <Label>Check-out</Label>
                <p className="text-sm text-gray-600">{formatDateTime(selectedRecord.checkOutTime)}</p>
              </div>
              <div className="col-span-2">
                <Label>Tipo de Serviço</Label>
                <p className="text-sm text-gray-600">{selectedRecord.serviceType}</p>
              </div>
              <div className="col-span-2">
                <Label>Observações</Label>
                <p className="text-sm text-gray-600">{selectedRecord.notes || "Nenhuma observação"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription>Atualize os dados do registro de check-in/check-out</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-professional">Profissional</Label>
              <Select
                value={formData.professionalId}
                onValueChange={(value) => {
                  const professional = professionals.find((p) => p.id === value)
                  setFormData({
                    ...formData,
                    professionalId: value,
                    professionalName: professional?.name || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-customer">Cliente</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => {
                  const customer = customers.find((c) => c.id === value)
                  setFormData({
                    ...formData,
                    customerId: value,
                    customerName: customer?.name || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Digite o endereço do serviço"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-serviceType">Tipo de Serviço</Label>
              <Input
                id="edit-serviceType"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                placeholder="Digite o tipo de serviço"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Digite observações adicionais"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRecord}>Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
