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
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const { toggleSidebar } = useSidebar()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfileClick = () => {
    router.push("/admin/settings")
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

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
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-[300px] bg-[#0f172a] border-[#2a3349] text-white focus-visible:ring-[#06b6d4]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a3349]">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-[#2a3349] hover:bg-[#374151]">
              {user?.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-[#06b6d4] flex items-center justify-center text-white text-sm font-medium">
                  {user?.name ? getUserInitials(user.name) : "U"}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1a2234] border-[#2a3349] text-white">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{user?.name || "User"}</p>
                <p className="text-xs leading-none text-gray-400">{user?.email || "user@example.com"}</p>
                <p className="text-xs leading-none text-gray-500 capitalize">{user?.role || "user"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2a3349]" />
            <DropdownMenuItem className="text-white hover:bg-[#2a3349] cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a3349]" />
            <DropdownMenuItem
              className="text-red-400 hover:bg-[#2a3349] hover:text-red-300 cursor-pointer"
              onClick={handleLogout}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
