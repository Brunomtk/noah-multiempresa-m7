"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Facebook, Github, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-500">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#1a2234] border-[#2a3349] text-white"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white">
            Senha
          </Label>
          <Link href="/esqueci-senha" className="text-sm text-[#06b6d4] hover:text-[#0891b2]">
            Esqueci minha senha
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#1a2234] border-[#2a3349] text-white"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          className="border-[#2a3349] data-[state=checked]:bg-[#06b6d4]"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <Label htmlFor="remember" className="text-sm text-gray-400">
          Lembrar-me
        </Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-[#2a3349]" />
        <span className="text-xs text-gray-400">ou continue com</span>
        <Separator className="flex-1 bg-[#2a3349]" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="border-[#2a3349] text-white hover:bg-[#1a2234]">
          <Github className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="border-[#2a3349] text-white hover:bg-[#1a2234]">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.97.41c-.24-.6-.6-1.13-1.08-1.49.89.31 1.66.9 2.22 1.63l.83-.55zM12 4c.97 0 1.89.25 2.71.68-.52.32-1.09.52-1.71.52s-1.19-.2-1.71-.52C12.11 4.25 13.03 4 14 4h-2zm-3.33 3.39c-.48.36-.84.89-1.08 1.49l-1.97-.41c.56-.73 1.33-1.32 2.22-1.63l.83.55zM4 12c0-1.68.59-3.22 1.58-4.42l1.92.55c-.21.92-.18 1.88.1 2.77L6.94 12l.66 1.11c-.28.88-.31 1.84-.1 2.77l-1.92.55C4.59 15.22 4 13.68 4 12zm4.67 6.61c.48-.36.84-.89 1.08-1.49l1.97.41c-.56.73-1.33 1.32-2.22 1.63l-.83-.55zm5.66 0l-.83.55c-.89-.31-1.66-.9-2.22-1.63l1.97-.41c.24.6.6 1.13 1.08 1.49zM12 20c-.97 0-1.89-.25-2.71-.68.52-.32 1.09-.52 1.71-.52s1.19.2 1.71.52c-.82.43-1.74.68-2.71.68zm6.75-1.97l-1.92-.55c.21-.92.18-1.88-.1-2.77L17.06 12l-.66-1.11c.28-.88.31-1.84.1-2.77l1.92-.55C19.41 8.78 20 10.32 20 12s-.59 3.22-1.58 4.42l-.67.61z"
            />
          </svg>
        </Button>
        <Button variant="outline" className="border-[#2a3349] text-white hover:bg-[#1a2234]">
          <Facebook className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Não tem uma conta?{" "}
          <Link href="/criar-conta" className="text-[#06b6d4] hover:text-[#0891b2]">
            Criar conta
          </Link>
        </p>
      </div>
    </form>
  )
}
