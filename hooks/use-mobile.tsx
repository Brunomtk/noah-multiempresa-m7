"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verificação inicial
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Verificar no carregamento
    checkIfMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIfMobile)

    // Limpar listener ao desmontar
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}
