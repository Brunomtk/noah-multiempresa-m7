"use client"

import { useState, useEffect } from "react"
import { MapPin, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LocationStatusProps {
  targetAddress: string
  onLocationUpdate?: (location: { lat: number; lng: number; accuracy: number }) => void
}

export function LocationStatus({ targetAddress, onLocationUpdate }: LocationStatusProps) {
  const [location, setLocation] = useState<{
    lat: number
    lng: number
    accuracy: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada neste dispositivo")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setLocation(newLocation)
        setLoading(false)

        // Simulate distance calculation (in a real app, you'd use a geocoding service)
        const simulatedDistance = Math.random() * 100 // 0-100 meters
        setDistance(simulatedDistance)

        onLocationUpdate?.(newLocation)
      },
      (error) => {
        setError("Não foi possível obter sua localização")
        setLoading(false)
        console.error("Geolocation error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const getLocationStatus = () => {
    if (loading) return { status: "loading", message: "Obtendo localização..." }
    if (error) return { status: "error", message: error }
    if (distance === null) return { status: "unknown", message: "Localização desconhecida" }

    if (distance <= 50) {
      return { status: "success", message: "Você está no local correto" }
    } else if (distance <= 100) {
      return { status: "warning", message: `Você está a ${Math.round(distance)}m do local` }
    } else {
      return { status: "error", message: `Você está muito longe (${Math.round(distance)}m)` }
    }
  }

  const locationStatus = getLocationStatus()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Status da Localização
            </h3>
            <Badge
              variant={
                locationStatus.status === "success"
                  ? "default"
                  : locationStatus.status === "warning"
                    ? "secondary"
                    : "destructive"
              }
            >
              {locationStatus.status === "loading" ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : locationStatus.status === "success" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {locationStatus.status === "success"
                ? "No local"
                : locationStatus.status === "warning"
                  ? "Próximo"
                  : locationStatus.status === "loading"
                    ? "Carregando"
                    : "Distante"}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Endereço do serviço:</p>
            <p>{targetAddress}</p>
          </div>

          <div
            className={`p-3 rounded-md border ${
              locationStatus.status === "success"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                : locationStatus.status === "warning"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300"
                  : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300"
            }`}
          >
            <p className="text-sm font-medium">{locationStatus.message}</p>
            {location && <p className="text-xs mt-1 opacity-75">Precisão: ±{Math.round(location.accuracy)}m</p>}
          </div>

          {error && (
            <button onClick={getCurrentLocation} className="text-sm text-primary hover:underline">
              Tentar novamente
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
