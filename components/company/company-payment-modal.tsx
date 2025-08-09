"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check, CreditCard, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCompanyPayments } from "@/hooks/use-company-payments"

export function CompanyPaymentModal({ children }: { children: React.ReactNode }) {
  const { addPayment } = useCompanyPayments()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(0)
  const [method, setMethod] = useState<0 | 1 | 2 | 3>(0)
  const [reference, setReference] = useState(`REF-PAG-${Date.now()}`)
  const [planId, setPlanId] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !dueDate || !planId) return

    setIsSubmitting(true)
    try {
      await addPayment({
        amount: Number.parseFloat(amount),
        dueDate,
        paymentDate: paymentDate || undefined,
        status,
        method,
        reference,
        planId: Number.parseInt(planId),
      })

      // Reset form
      setAmount("")
      setDueDate("")
      setPaymentDate("")
      setStatus(0)
      setMethod(0)
      setReference(`REF-PAG-${Date.now()}`)
      setPlanId("")
      setNotes("")
      setOpen(false)
    } catch (error) {
      console.error("Error creating payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateReference = () => {
    setReference(`REF-PAG-${Date.now()}`)
  }

  const setDueDateToday = () => {
    const today = new Date()
    setDueDate(today.toISOString().split("T")[0])
  }

  const setDueDatePlus30 = () => {
    const today = new Date()
    const plus30 = new Date(today)
    plus30.setDate(today.getDate() + 30)
    setDueDate(plus30.toISOString().split("T")[0])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1a2234] border-[#2a3349] text-white">
        <DialogHeader>
          <DialogTitle>Criar Novo Pagamento</DialogTitle>
          <DialogDescription className="text-gray-400">
            Insira os detalhes do pagamento abaixo para criar um novo registro de pagamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-[#0f172a]">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#2a3349]">
                Detalhes do Pagamento
              </TabsTrigger>
              <TabsTrigger value="options" className="data-[state=active]:bg-[#2a3349]">
                Opções
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">
                    Referência <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateReference}
                      className="bg-[#0f172a] border-[#2a3349]"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Valor <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 bg-[#0f172a] border-[#2a3349]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="due-date">
                      Data de Vencimento <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={setDueDateToday}
                        className="h-6 text-xs bg-[#0f172a] border-[#2a3349]"
                      >
                        Hoje
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={setDueDatePlus30}
                        className="h-6 text-xs bg-[#0f172a] border-[#2a3349]"
                      >
                        +30 dias
                      </Button>
                    </div>
                  </div>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#0f172a] border-[#2a3349]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Data do Pagamento</Label>
                  <Input
                    id="payment-date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="bg-[#0f172a] border-[#2a3349]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-id">
                  Plano <span className="text-red-500">*</span>
                </Label>
                <Select value={planId} onValueChange={setPlanId} required>
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349]">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="1">Plano Básico</SelectItem>
                    <SelectItem value="2">Plano Profissional</SelectItem>
                    <SelectItem value="3">Plano Empresarial</SelectItem>
                    <SelectItem value="4">Plano Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">
                  Método de Pagamento <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={method.toString()}
                  onValueChange={(value) => setMethod(Number.parseInt(value) as 0 | 1 | 2 | 3)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="credit_card" className="border-[#2a3349]" />
                    <Label htmlFor="credit_card" className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> Cartão de Crédito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="debit_card" className="border-[#2a3349]" />
                    <Label htmlFor="debit_card" className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> Cartão de Débito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="bank_transfer" className="border-[#2a3349]" />
                    <Label htmlFor="bank_transfer" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> Transferência
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="pix" className="border-[#2a3349]" />
                    <Label htmlFor="pix" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> PIX
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={status.toString()}
                  onValueChange={(value) => setStatus(Number.parseInt(value) as 0 | 1 | 2 | 3)}
                  required
                >
                  <SelectTrigger className="bg-[#0f172a] border-[#2a3349]">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2234] border-[#2a3349]">
                    <SelectItem value="0">Pendente</SelectItem>
                    <SelectItem value="1">Pago</SelectItem>
                    <SelectItem value="2">Vencido</SelectItem>
                    <SelectItem value="3">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === 0 && (
                <Alert className="bg-[#0f172a] border-amber-500/50 text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Este pagamento será marcado como pendente e pode ser atualizado posteriormente.
                  </AlertDescription>
                </Alert>
              )}

              {status === 1 && (
                <Alert className="bg-[#0f172a] border-green-500/50 text-green-500">
                  <Check className="h-4 w-4" />
                  <AlertDescription>Este pagamento será marcado como concluído.</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="options" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Digite observações sobre o pagamento..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] bg-[#0f172a] border-[#2a3349]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="send-receipt" className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4]" />
                <Label htmlFor="send-receipt">Enviar recibo para o cliente</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-[#0f172a] border-[#2a3349]"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#06b6d4] hover:bg-[#0891b2]" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Pagamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
