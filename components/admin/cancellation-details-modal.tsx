"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  User,
  Building2,
  AlertCircle,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  FileText,
  MessageSquare,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface CancellationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cancellation: any
}

export function CancellationDetailsModal({ open, onOpenChange, cancellation }: CancellationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  if (!cancellation) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Aprovado
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pendente
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejeitado
          </Badge>
        )
      default:
        return null
    }
  }

  const getRefundBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Processado
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pendente
          </Badge>
        )
      case "not_applicable":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            N/A
          </Badge>
        )
      default:
        return null
    }
  }

  const getCancelledByIcon = (cancelledBy: string) => {
    switch (cancelledBy) {
      case "customer":
        return <User className="h-5 w-5" />
      case "professional":
        return <User className="h-5 w-5" />
      case "company":
        return <Building2 className="h-5 w-5" />
      case "system":
        return <Clock className="h-5 w-5" />
      default:
        return null
    }
  }

  const getCancelledByLabel = (cancelledBy: string) => {
    switch (cancelledBy) {
      case "customer":
        return "Cliente"
      case "professional":
        return "Profissional"
      case "company":
        return "Empresa"
      case "system":
        return "Sistema"
      default:
        return cancelledBy
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const handleSendNotification = () => {
    toast({
      title: "Notificação enviada",
      description: `Uma notificação foi enviada para ${cancellation.customer.name}.`,
    })
  }

  const handleProcessRefund = () => {
    toast({
      title: "Reembolso processado",
      description: `O reembolso de R$ ${cancellation.refundAmount?.toFixed(2)} foi processado com sucesso.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a2234] border-[#2a3349] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Cancelamento #{cancellation.id} - {cancellation.appointmentId}
            <div className="ml-2">{getStatusBadge(cancellation.status)}</div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-[#0f172a] border border-[#2a3349]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2a3349]">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-[#2a3349]">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="refund" className="data-[state=active]:bg-[#2a3349]">
              Reembolso
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-[#2a3349]">
              Ações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            {/* Status Section */}
            <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(cancellation.status)}
                <div>
                  <p className="text-sm text-gray-400">Status do Cancelamento</p>
                  <div className="mt-1">{getStatusBadge(cancellation.status)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Status do Reembolso</p>
                  <div className="mt-1">{getRefundBadge(cancellation.refundStatus)}</div>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2a3349] rounded-full">
                      <User className="h-5 w-5 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Cliente</p>
                      <p className="font-medium">{cancellation.customer.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2a3349] rounded-full">
                      <Calendar className="h-5 w-5 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Data Original</p>
                      <p className="font-medium">
                        {new Date(cancellation.originalDate).toLocaleDateString("pt-BR")} às {cancellation.originalTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2a3349] rounded-full">
                      <DollarSign className="h-5 w-5 text-[#06b6d4]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Valor do Reembolso</p>
                      <p className="font-medium">
                        {cancellation.refundAmount ? `R$ ${cancellation.refundAmount.toFixed(2)}` : "Sem reembolso"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-[#2a3349]" />

            {/* Cancellation Reason */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Motivo do Cancelamento</h3>
              <Card className="bg-[#0f172a] border-[#2a3349]">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-[#2a3349] rounded">{getCancelledByIcon(cancellation.cancelledBy)}</div>
                        <p className="text-sm text-gray-400">
                          Cancelado por: {getCancelledByLabel(cancellation.cancelledBy)}
                        </p>
                      </div>
                      <p className="text-sm">{cancellation.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Histórico</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-[#06b6d4] rounded-full"></div>
                    <div className="w-0.5 h-16 bg-[#2a3349]"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Agendamento criado</p>
                    <p className="text-sm text-gray-400">
                      {new Date(cancellation.originalDate).toLocaleDateString("pt-BR")} - Agendamento confirmado
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-0.5 h-16 bg-[#2a3349]"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Cancelamento solicitado</p>
                    <p className="text-sm text-gray-400">
                      {new Date(cancellation.cancelledAt).toLocaleString("pt-BR")} - Por{" "}
                      {getCancelledByLabel(cancellation.cancelledBy)}
                    </p>
                  </div>
                </div>
                {cancellation.status !== "pending" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          cancellation.status === "approved" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Cancelamento {cancellation.status === "approved" ? "aprovado" : "rejeitado"}
                      </p>
                      <p className="text-sm text-gray-400">{new Date().toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {cancellation.status === "pending" && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-6">
            {/* Appointment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações do Agendamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#0f172a] border-[#2a3349]">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">ID do Agendamento</p>
                        <p className="font-medium">{cancellation.appointmentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Serviço</p>
                        <p className="font-medium">{cancellation.service}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Valor</p>
                        <p className="font-medium">R$ {cancellation.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Data e Hora</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="font-medium">
                            {new Date(cancellation.originalDate).toLocaleDateString("pt-BR")} às{" "}
                            {cancellation.originalTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-5 w-5 text-[#06b6d4]" />
                        <p className="font-medium">Informações do Cliente</p>
                      </div>
                      <div className="space-y-2 pl-8">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p>{cancellation.customer.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p>{cancellation.customer.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p>{cancellation.customer.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-5 w-5 text-[#06b6d4]" />
                        <p className="font-medium">Informações do Profissional</p>
                      </div>
                      <div className="space-y-2 pl-8">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p>{cancellation.professional.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <p>{cancellation.professional.specialty}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator className="bg-[#2a3349]" />

            {/* Cancellation Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Detalhes do Cancelamento</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Cancelado em</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{new Date(cancellation.cancelledAt).toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Cancelado por</p>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-[#2a3349] rounded">{getCancelledByIcon(cancellation.cancelledBy)}</div>
                      <p className="font-medium">{getCancelledByLabel(cancellation.cancelledBy)}</p>
                    </div>
                  </div>
                </div>

                <Card className="bg-[#0f172a] border-[#2a3349]">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Motivo do Cancelamento</p>
                      <div className="p-3 bg-[#1a2234] rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-sm">{cancellation.reason}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {cancellation.notes && (
                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Observações</p>
                        <div className="p-3 bg-[#1a2234] rounded-lg">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                            <p className="text-sm">{cancellation.notes}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="refund" className="mt-4 space-y-6">
            {/* Refund Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações de Reembolso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#0f172a] border-[#2a3349]">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Valor do Serviço</p>
                          <p className="text-xl font-semibold">R$ {cancellation.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f172a] border-[#2a3349]">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Valor do Reembolso</p>
                          <p className="text-xl font-semibold">
                            {cancellation.refundAmount ? `R$ ${cancellation.refundAmount.toFixed(2)}` : "Sem reembolso"}
                          </p>
                        </div>
                      </div>
                      {getRefundBadge(cancellation.refundStatus)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {cancellation.policyApplied && (
                <Card className="bg-[#0f172a] border-[#2a3349] mt-4">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-[#06b6d4] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Política Aplicada</p>
                        <p className="text-sm text-gray-400 mt-1">{cancellation.policyApplied}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {cancellation.refundStatus === "pending" && cancellation.refundAmount > 0 && (
                <div className="mt-4">
                  <Button className="bg-[#06b6d4] hover:bg-[#0891b2]" onClick={handleProcessRefund}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Processar Reembolso
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ações de Cancelamento</h3>

                {cancellation.status === "pending" ? (
                  <div className="space-y-4">
                    <Card className="bg-[#0f172a] border-[#2a3349]">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Aprovar Cancelamento</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Aprovar este cancelamento e processar o reembolso conforme a política aplicada.
                            </p>
                            <Button className="mt-3 bg-green-500 hover:bg-green-600">Aprovar Cancelamento</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0f172a] border-[#2a3349]">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Rejeitar Cancelamento</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Rejeitar este cancelamento. O agendamento permanecerá ativo.
                            </p>
                            <Button className="mt-3 bg-red-500 hover:bg-red-600">Rejeitar Cancelamento</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[#0f172a] border-[#2a3349]">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {cancellation.status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            Cancelamento {cancellation.status === "approved" ? "Aprovado" : "Rejeitado"}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Este cancelamento já foi {cancellation.status === "approved" ? "aprovado" : "rejeitado"}.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comunicação</h3>

                <Card className="bg-[#0f172a] border-[#2a3349]">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[#06b6d4] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Enviar Notificação</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Enviar uma notificação por email para o cliente sobre o status do cancelamento.
                        </p>
                        <Button className="mt-3 bg-[#06b6d4] hover:bg-[#0891b2]" onClick={handleSendNotification}>
                          Enviar Notificação
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f172a] border-[#2a3349]">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[#06b6d4] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Reagendar</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Criar um novo agendamento para este cliente com os mesmos detalhes.
                        </p>
                        <Button className="mt-3 bg-[#06b6d4] hover:bg-[#0891b2]">Reagendar Serviço</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
