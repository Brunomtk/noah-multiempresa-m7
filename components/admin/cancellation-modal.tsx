"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Building2, AlertCircle, DollarSign } from "lucide-react"

interface CancellationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cancellation: any
  isEditing: boolean
  onSave: (data: any) => void
}

export function CancellationModal({ open, onOpenChange, cancellation, isEditing, onSave }: CancellationModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [formData, setFormData] = useState({
    appointmentId: "",
    customer: {
      id: "",
      name: "",
      email: "",
      phone: "",
    },
    professional: {
      id: "",
      name: "",
      specialty: "",
    },
    company: {
      id: "",
      name: "",
    },
    service: "",
    originalDate: "",
    originalTime: "",
    price: 0,
    cancelledBy: "customer",
    reason: "",
    status: "pending",
    refundStatus: "pending",
    refundAmount: "",
    notes: "",
    policyApplied: "",
  })

  useEffect(() => {
    if (cancellation && isEditing) {
      setFormData({
        appointmentId: cancellation.appointmentId || "",
        customer: cancellation.customer || { id: "", name: "", email: "", phone: "" },
        professional: cancellation.professional || { id: "", name: "", specialty: "" },
        company: cancellation.company || { id: "", name: "" },
        service: cancellation.service || "",
        originalDate: cancellation.originalDate || "",
        originalTime: cancellation.originalTime || "",
        price: cancellation.price || 0,
        cancelledBy: cancellation.cancelledBy || "customer",
        reason: cancellation.reason || "",
        status: cancellation.status || "pending",
        refundStatus: cancellation.refundStatus || "pending",
        refundAmount: cancellation.refundAmount?.toString() || "",
        notes: cancellation.notes || "",
        policyApplied: cancellation.policyApplied || "",
      })
    } else {
      setFormData({
        appointmentId: "",
        customer: {
          id: "",
          name: "",
          email: "",
          phone: "",
        },
        professional: {
          id: "",
          name: "",
          specialty: "",
        },
        company: {
          id: "",
          name: "",
        },
        service: "",
        originalDate: "",
        originalTime: "",
        price: 0,
        cancelledBy: "customer",
        reason: "",
        status: "pending",
        refundStatus: "pending",
        refundAmount: "",
        notes: "",
        policyApplied: "",
      })
    }
    setActiveTab("details")
  }, [cancellation, isEditing, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: Number(formData.price),
      refundAmount: formData.refundAmount ? Number(formData.refundAmount) : undefined,
    })
  }

  const calculateRefundAmount = () => {
    const price = Number(formData.price)

    if (!price) return

    let refundPercentage = 0

    // Lógica de cálculo baseada em políticas
    switch (formData.cancelledBy) {
      case "professional":
      case "company":
        // 100% de reembolso se cancelado pelo profissional ou empresa
        refundPercentage = 100
        setFormData({
          ...formData,
          policyApplied: "Cancelamento pelo profissional ou empresa: 100% de reembolso",
        })
        break
      case "customer":
        // Verificar quanto tempo antes do agendamento foi cancelado
        const appointmentDate = new Date(`${formData.originalDate}T${formData.originalTime}`)
        const now = new Date()
        const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hoursDifference > 24) {
          // Mais de 24h de antecedência: 90% de reembolso
          refundPercentage = 90
          setFormData({
            ...formData,
            policyApplied: "Cancelamento com mais de 24h de antecedência: 90% de reembolso",
          })
        } else if (hoursDifference > 1) {
          // Entre 1h e 24h de antecedência: 70% de reembolso
          refundPercentage = 70
          setFormData({
            ...formData,
            policyApplied: "Cancelamento com menos de 24h de antecedência: 70% de reembolso",
          })
        } else {
          // Menos de 1h de antecedência: sem reembolso
          refundPercentage = 0
          setFormData({
            ...formData,
            policyApplied: "Cancelamento com menos de 1h de antecedência: sem reembolso",
          })
        }
        break
      default:
        refundPercentage = 0
    }

    const refundAmount = ((price * refundPercentage) / 100).toFixed(2)
    setFormData({
      ...formData,
      refundAmount: refundAmount,
      refundStatus: refundPercentage > 0 ? "pending" : "not_applicable",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cancelamento" : "Registrar Novo Cancelamento"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-[#0f172a] border border-[#2a3349]">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#2a3349]">
              Detalhes do Agendamento
            </TabsTrigger>
            <TabsTrigger value="cancellation" className="data-[state=active]:bg-[#2a3349]">
              Informações do Cancelamento
            </TabsTrigger>
            <TabsTrigger value="refund" className="data-[state=active]:bg-[#2a3349]">
              Reembolso
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações do Agendamento</h3>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentId">ID do Agendamento</Label>
                    <Input
                      id="appointmentId"
                      value={formData.appointmentId}
                      onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Serviço</Label>
                    <Input
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalDate">Data</Label>
                      <Input
                        id="originalDate"
                        type="date"
                        value={formData.originalDate}
                        onChange={(e) => setFormData({ ...formData, originalDate: e.target.value })}
                        className="bg-[#0f172a] border-[#2a3349] text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalTime">Horário</Label>
                      <Input
                        id="originalTime"
                        type="time"
                        value={formData.originalTime}
                        onChange={(e) => setFormData({ ...formData, originalTime: e.target.value })}
                        className="bg-[#0f172a] border-[#2a3349] text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Valor do Serviço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Participantes</h3>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3349] rounded-full">
                          <User className="h-5 w-5 text-[#06b6d4]" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Cliente</p>
                          <Input
                            value={formData.customer.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customer: { ...formData.customer, name: e.target.value },
                              })
                            }
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                            placeholder="Nome do cliente"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pl-10">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Email</p>
                          <Input
                            type="email"
                            value={formData.customer.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customer: { ...formData.customer, email: e.target.value },
                              })
                            }
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                            placeholder="Email"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Telefone</p>
                          <Input
                            value={formData.customer.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customer: { ...formData.customer, phone: e.target.value },
                              })
                            }
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                            placeholder="Telefone"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3349] rounded-full">
                          <User className="h-5 w-5 text-[#06b6d4]" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Profissional</p>
                          <Input
                            value={formData.professional.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                professional: { ...formData.professional, name: e.target.value },
                              })
                            }
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                            placeholder="Nome do profissional"
                            required
                          />
                        </div>
                      </div>

                      <div className="pl-10">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Especialidade</p>
                          <Input
                            value={formData.professional.specialty}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                professional: { ...formData.professional, specialty: e.target.value },
                              })
                            }
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                            placeholder="Especialidade"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3349] rounded-full">
                          <Building2 className="h-5 w-5 text-[#06b6d4]" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm text-gray-400">Empresa</p>
                          <Input
                            value={formData.company.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                company: { ...formData.company, name: e.target.value },
                              })
                            }
                            className="bg-[#1a2234] border-[#2a3349] text-white"
                            placeholder="Nome da empresa"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#2a3349]"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="bg-[#06b6d4] hover:bg-[#0891b2]"
                  onClick={() => setActiveTab("cancellation")}
                >
                  Próximo
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cancellation" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detalhes do Cancelamento</h3>

                  <div className="space-y-2">
                    <Label htmlFor="cancelledBy">Cancelado por</Label>
                    <Select
                      value={formData.cancelledBy}
                      onValueChange={(value: "customer" | "professional" | "company" | "system") =>
                        setFormData({ ...formData, cancelledBy: value })
                      }
                    >
                      <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                        <SelectValue placeholder="Selecione quem cancelou" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                        <SelectItem value="customer">Cliente</SelectItem>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo do Cancelamento</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="bg-[#0f172a] border-[#2a3349] text-white min-h-[120px]"
                      placeholder="Descreva o motivo do cancelamento"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status do Cancelamento</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "pending" | "approved" | "rejected") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Adicionais</h3>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-[#0f172a] border-[#2a3349] text-white min-h-[120px]"
                      placeholder="Observações adicionais sobre o cancelamento"
                    />
                  </div>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Lembrete de Política</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Cancelamentos feitos pelo cliente com menos de 24h de antecedência podem estar sujeitos a
                            taxas. Cancelamentos feitos pelo profissional ou empresa geralmente resultam em reembolso
                            total.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#2a3349]"
                  onClick={() => setActiveTab("details")}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="bg-[#06b6d4] hover:bg-[#0891b2]"
                  onClick={() => {
                    calculateRefundAmount()
                    setActiveTab("refund")
                  }}
                >
                  Próximo
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="refund" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações de Reembolso</h3>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#2a3349] rounded-full">
                            <DollarSign className="h-5 w-5 text-[#06b6d4]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Valor do Serviço</p>
                            <p className="text-xl font-semibold">R$ {Number(formData.price).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="refundStatus">Status do Reembolso</Label>
                    <Select
                      value={formData.refundStatus}
                      onValueChange={(value: "pending" | "processed" | "not_applicable") =>
                        setFormData({ ...formData, refundStatus: value })
                      }
                    >
                      <SelectTrigger className="bg-[#0f172a] border-[#2a3349] text-white">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="processed">Processado</SelectItem>
                        <SelectItem value="not_applicable">Não Aplicável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refundAmount">Valor do Reembolso (R$)</Label>
                    <Input
                      id="refundAmount"
                      type="number"
                      step="0.01"
                      value={formData.refundAmount}
                      onChange={(e) => setFormData({ ...formData, refundAmount: e.target.value })}
                      className="bg-[#0f172a] border-[#2a3349] text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Política Aplicada</h3>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-[#06b6d4] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Política de Cancelamento</p>
                          <Textarea
                            value={formData.policyApplied}
                            onChange={(e) => setFormData({ ...formData, policyApplied: e.target.value })}
                            className="bg-[#1a2234] border-[#2a3349] text-white mt-2"
                            placeholder="Descreva a política aplicada a este cancelamento"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Tempo até o Agendamento</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {formData.originalDate && formData.originalTime
                              ? (() => {
                                  const appointmentDate = new Date(`${formData.originalDate}T${formData.originalTime}`)
                                  const now = new Date()
                                  const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

                                  if (hoursDifference < 0) {
                                    return "O agendamento já passou."
                                  } else if (hoursDifference < 1) {
                                    return "Menos de 1 hora até o agendamento."
                                  } else if (hoursDifference < 24) {
                                    return `Aproximadamente ${Math.floor(hoursDifference)} horas até o agendamento.`
                                  } else {
                                    return `Aproximadamente ${Math.floor(hoursDifference / 24)} dias e ${Math.floor(hoursDifference % 24)} horas até o agendamento.`
                                  }
                                })()
                              : "Defina a data e hora do agendamento para calcular."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="bg-[#2a3349] my-6" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#2a3349]"
                    onClick={() => setActiveTab("cancellation")}
                  >
                    Voltar
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#2a3349] text-gray-400 hover:text-white hover:bg-[#2a3349]"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2]">
                    {isEditing ? "Salvar Alterações" : "Registrar Cancelamento"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
