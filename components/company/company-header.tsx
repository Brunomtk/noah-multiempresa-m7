"use client"

import { Bell, LogOut, Settings, UserCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useCompanySidebar } from "./company-sidebar-context"

export function CompanyHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toggleSidebar } = useCompanySidebar()

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Get user role display
  const getRoleDisplay = (role: number) => {
    switch (role) {
      case 1:
        return "Admin"
      case 2:
        return "Company Manager"
      case 3:
        return "Professional"
      default:
        return "User"
    }
  }

  // Get status display
  const getStatusDisplay = (status: number) => {
    switch (status) {
      case 1:
        return { text: "Active", color: "bg-green-500" }
      case 2:
        return { text: "Inactive", color: "bg-red-500" }
      case 3:
        return { text: "Pending", color: "bg-yellow-500" }
      default:
        return { text: "Unknown", color: "bg-gray-500" }
    }
  }

  const statusInfo = user?.status ? getStatusDisplay(user.status) : { text: "Active", color: "bg-green-500" }

  return (
    <header className="h-14 sm:h-16 border-b border-[#2a3349] bg-[#1a2234] px-3 sm:px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-[#2a3349] h-8 w-8"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-white truncate">
              {user?.name ? `Welcome, ${user.name.split(" ")[0]}` : "Company Dashboard"}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs sm:text-sm text-gray-400">
                {user?.role ? getRoleDisplay(user.role) : "Company User"}
              </p>
              <Badge className={`${statusInfo.color} text-xs`}>{statusInfo.text}</Badge>
              <Link href="/company/plan" className="text-xs text-[#06b6d4] hover:underline hidden sm:inline">
                Manage Plan
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-400 hover:text-white hover:bg-[#2a3349] h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center bg-[#06b6d4] text-xs">
              3
            </Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-[#2a3349] px-2 sm:px-3 h-8 sm:h-10"
              >
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-[#06b6d4] text-white text-xs font-semibold">
                    {user?.name ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                {user?.name && (
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1a2234] border-[#2a3349] text-white">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-400">{user?.email || "user@company.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2a3349]" />
              <DropdownMenuItem asChild className="hover:bg-[#2a3349] cursor-pointer">
                <Link href="/company/profile" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#2a3349] cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#2a3349] cursor-pointer">
                <Link href="/company/plan" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Plan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2a3349]" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-[#2a3349] text-red-400 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
