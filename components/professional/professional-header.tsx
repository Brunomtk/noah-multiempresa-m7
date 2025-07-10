"use client"
import Link from "next/link"
import { Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProfessionalMobileNav } from "@/components/professional/professional-mobile-nav"
import { NoahLogo } from "@/components/noah-logo"

export function ProfessionalHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center md:hidden">
        <ProfessionalMobileNav />
        <Link href="/professional/dashboard" className="ml-2 flex items-center gap-2">
          <NoahLogo className="h-6 w-6" />
          <span className="font-bold">Noah Pro</span>
        </Link>
      </div>

      <div className="w-full flex-1 md:grow-0 md:w-[200px] lg:w-[300px]">
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}
