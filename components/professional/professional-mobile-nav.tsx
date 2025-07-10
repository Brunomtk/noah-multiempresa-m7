"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NoahLogo } from "@/components/noah-logo"
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Home,
  MessageSquare,
  Package,
  BarChart,
  Bell,
  History,
  User,
  Menu,
} from "lucide-react"

export function ProfessionalMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/professional/dashboard",
      active: pathname === "/professional/dashboard",
    },
    {
      label: "Check",
      icon: CheckCircle,
      href: "/professional/check",
      active: pathname === "/professional/check",
    },
    {
      label: "Schedule",
      icon: Calendar,
      href: "/professional/schedule",
      active: pathname === "/professional/schedule",
    },
    {
      label: "Feedback",
      icon: ClipboardList,
      href: "/professional/feedback",
      active: pathname === "/professional/feedback",
    },
    {
      label: "Materials",
      icon: Package,
      href: "/professional/materials",
      active: pathname === "/professional/materials",
    },
    {
      label: "Performance",
      icon: BarChart,
      href: "/professional/performance",
      active: pathname === "/professional/performance",
    },
    {
      label: "Chat",
      icon: MessageSquare,
      href: "/professional/chat",
      active: pathname === "/professional/chat",
    },
    {
      label: "History",
      icon: History,
      href: "/professional/history",
      active: pathname === "/professional/history",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/professional/notifications",
      active: pathname === "/professional/notifications",
    },
    {
      label: "Profile",
      icon: User,
      href: "/professional/profile",
      active: pathname === "/professional/profile",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#0f172a] border-r border-[#2a3349] w-[280px]">
        <div className="flex h-16 items-center px-6 border-b border-[#2a3349]">
          <Link href="/professional/dashboard" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <NoahLogo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Noah Pro</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="space-y-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  route.active ? "bg-[#06b6d4] text-white" : "text-gray-400 hover:bg-[#1a2234] hover:text-white",
                )}
              >
                <route.icon className="h-5 w-5 flex-shrink-0" />
                <span>{route.label}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-[#2a3349] p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#06b6d4] flex items-center justify-center text-white font-semibold">
              P
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Professional</p>
              <p className="text-xs text-gray-400 truncate">pro@company.com</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
