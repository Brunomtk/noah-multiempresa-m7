"use client"

import { useState } from "react"
import { Bell, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/admin/admin-sidebar"

export function AdminHeader() {
  const { toggleSidebar } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="h-16 border-b border-[#2a3349] bg-[#1a2234] px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-gray-400 hover:text-white hover:bg-[#2a3349]"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-[300px] bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a3349] relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="sr-only">Notificações</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a3349]">
              <User className="h-5 w-5" />
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1a2234] border-[#2a3349] text-white">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2a3349]" />
            <DropdownMenuItem className="hover:bg-[#2a3349] cursor-pointer">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#2a3349] cursor-pointer">Configurações</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a3349]" />
            <DropdownMenuItem className="hover:bg-[#2a3349] cursor-pointer">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
