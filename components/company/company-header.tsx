"use client"

import { Bell, User } from "lucide-react"
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
import Link from "next/link"

export function CompanyHeader() {
  return (
    <header className="h-16 border-b border-[#2a3349] bg-[#1a2234] px-6">
      <div className="flex h-full items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Tech Solutions Ltd</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">Professional Plan</p>
            <Badge className="bg-green-500 text-xs">Active</Badge>
            <Link href="/company/plan" className="text-xs text-[#06b6d4] hover:underline">
              Renews in 15 days
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-[#2a3349]">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#06b6d4]">
              3
            </Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a3349]">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1a2234] border-[#2a3349] text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2a3349]" />
              <DropdownMenuItem className="hover:bg-[#2a3349]">Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#2a3349]">Settings</DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#2a3349]">
                <Link href="/company/plan">Manage Plan</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2a3349]" />
              <DropdownMenuItem className="hover:bg-[#2a3349] text-red-400">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
