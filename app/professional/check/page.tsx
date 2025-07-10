"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, MapPin, Briefcase, CheckCircle, LogOut } from "lucide-react"
import { PhotoCapture } from "@/components/professional/photo-capture"
import { LocationStatus } from "@/components/professional/location-status"
import { useToast } from "@/hooks/use-toast"

interface ServiceDetails {
  id: string
  client: string
  address: string
  time: string
  serviceType: string
  notes: string
  status: "scheduled" | "checked-in" | "completed"
  checkInTime?: string
  checkInPhoto?: string
  checkOutPhoto?: string
}

export default function ProfessionalCheck() {
  const { toast } = useToast()
  const [currentService, setCurrentService] = useState<ServiceDetails>({
    id: "SRV-001",
    client: "Maria Silva",
    address: "Rua das Flores, 123 - Apartamento 45 - Centro",
    time: "14:30 - 16:30",
    serviceType: "Limpeza Residencial",
    notes: "Apartamento no 3º andar. Tem um cachorro pequeno e amigável. Chaves com a portaria.",
    status: "scheduled",
  })

  const [checkInPhoto, setCheckInPhoto] = useState<string>("")
  const [checkOutPhoto, setCheckOutPhoto] = useState<string>("")
  const [checkInNotes, setCheckInNotes] = useState<string>("")
  const [checkOutNotes, setCheckOutNotes] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckIn = async () => {
    if (!checkInPhoto) {
      toast({
        title: "Foto obrigatória",
        description: "Por favor, tire uma foto do local antes de fazer o check-in.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const now = new Date()
      setCurrentService((prev) => ({
        ...prev,
        status: "checked-in",
        checkInTime: now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        checkInPhoto,
      }))

      toast({
        title: "Check-in realizado!",
        description: "Você fez check-in com sucesso. Bom trabalho!",
      })
    } catch (error) {
      toast({
        title: "Erro no check-in",
        description: "Não foi possível realizar o check-in. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCheckOut = async () => {
    if (!checkOutPhoto) {
      toast({
        title: "Foto obrigatória",
        description: "Por favor, tire uma foto do local após o serviço.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCurrentService((prev) => ({
        ...prev,
        status: "completed",
        checkOutPhoto,
      }))

      toast({
        title: "Check-out realizado!",
        description: "Serviço concluído com sucesso. Obrigado pelo seu trabalho!",
      })
    } catch (error) {
      toast({
        title: "Erro no check-out",
        description: "Não foi possível realizar o check-out. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = () => {
    switch (currentService.status) {
      case "scheduled":
        return <Badge variant="outline">Agendado</Badge>
      case "checked-in":
        return <Badge variant="secondary">Em Andamento</Badge>
      case "completed":
        return <Badge className="bg-green-600">Concluído</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getElapsedTime = () => {
    if (!currentService.checkInTime) return null

    const checkInTime = new Date()
    checkInTime.setHours(Number.parseInt(currentService.checkInTime.split(":")[0]))
    checkInTime.setMinutes(Number.parseInt(currentService.checkInTime.split(":")[1]))

    const now = new Date()
    const elapsed = now.getTime() - checkInTime.getTime()
    const hours = Math.floor(elapsed / (1000 * 60 * 60))
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}min`
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check de Serviço</h1>
          <p className="text-muted-foreground">Gerencie seu check-in e check-out</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Detalhes do Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Cliente:</span>
                <span>{currentService.client}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Horário:</span>
                <span>{currentService.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tipo:</span>
                <span>{currentService.serviceType}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">Endereço:</span>
                  <p className="text-muted-foreground">{currentService.address}</p>
                </div>
              </div>
              {currentService.checkInTime && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Check-in:</span>
                  <span>{currentService.checkInTime}</span>
                  {getElapsedTime() && (
                    <Badge variant="outline" className="ml-2">
                      {getElapsedTime()}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {currentService.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Observações:</h4>
                <p className="text-sm text-muted-foreground">{currentService.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Location Status */}
      <LocationStatus targetAddress={currentService.address} />

      {/* Check-in Section */}
      {currentService.status === "scheduled" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Check-in
            </CardTitle>
            <CardDescription>Confirme sua chegada ao local e tire uma foto do ambiente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PhotoCapture
              label="Foto do Local (Antes)"
              onPhotoCapture={setCheckInPhoto}
              onPhotoRemove={() => setCheckInPhoto("")}
              capturedPhoto={checkInPhoto}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações (Opcional)</label>
              <Textarea
                placeholder="Alguma observação sobre o local ou condições encontradas..."
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleCheckIn} className="w-full" size="lg" disabled={isProcessing || !checkInPhoto}>
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Check-in
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Check-out Section */}
      {currentService.status === "checked-in" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Check-out
            </CardTitle>
            <CardDescription>Finalize o serviço e tire uma foto do resultado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show check-in photo for reference */}
            {currentService.checkInPhoto && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Foto do Check-in (Referência)</label>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={currentService.checkInPhoto || "/placeholder.svg"}
                      alt="Check-in photo"
                      className="w-full h-32 object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            <PhotoCapture
              label="Foto do Local (Depois)"
              onPhotoCapture={setCheckOutPhoto}
              onPhotoRemove={() => setCheckOutPhoto("")}
              capturedPhoto={checkOutPhoto}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Relatório do Serviço</label>
              <Textarea
                placeholder="Descreva como foi o serviço, dificuldades encontradas ou outras observações importantes..."
                value={checkOutNotes}
                onChange={(e) => setCheckOutNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleCheckOut} className="w-full" size="lg" disabled={isProcessing || !checkOutPhoto}>
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Confirmar Check-out
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed Service Summary */}
      {currentService.status === "completed" && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              Serviço Concluído
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-400">
              Parabéns! Você concluiu o serviço com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentService.checkInPhoto && (
                <div>
                  <h4 className="font-medium mb-2">Foto do Check-in</h4>
                  <img
                    src={currentService.checkInPhoto || "/placeholder.svg"}
                    alt="Check-in"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              {currentService.checkOutPhoto && (
                <div>
                  <h4 className="font-medium mb-2">Foto do Check-out</h4>
                  <img
                    src={currentService.checkOutPhoto || "/placeholder.svg"}
                    alt="Check-out"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => (window.location.href = "/professional/dashboard")}>
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
