"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  CreditCard,
  Bell,
  UserCheck,
  MapPin,
  Menu,
  CheckSquare,
  Package,
  XCircle,
  User,
} from "lucide-react"
import { NoahLogo } from "@/components/noah-logo"

const menuItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/company/schedule",
    icon: Calendar,
  },
  {
    title: "Check Management",
    href: "/company/check-management",
    icon: CheckSquare,
  },
  {
    title: "Clients",
    href: "/company/clients",
    icon: Users,
  },
  {
    title: "Teams",
    href: "/company/teams",
    icon: Users,
  },
  {
    title: "Professionals",
    href: "/company/professionals",
    icon: UserCheck,
  },
  {
    title: "Payments",
    href: "/company/payments",
    icon: CreditCard,
  },
  {
    title: "Plan",
    href: "/company/plan",
    icon: Package,
  },
  {
    title: "Cancellations",
    href: "/company/cancellations",
    icon: XCircle,
  },
  {
    title: "Feedback",
    href: "/company/feedback",
    icon: MessageSquare,
  },
  {
    title: "GPS Tracking",
    href: "/company/gps-tracking",
    icon: MapPin,
  },
  {
    title: "Profile",
    href: "/company/profile",
    icon: User,
  },
  {
    title: "Notifications",
    href: "/company/notifications",
    icon: Bell,
  },
]

interface CompanySidebarProps {
  className?: string
}

export function CompanySidebar({ className }: CompanySidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden border-r bg-muted/40 md:block", className)}>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link className="flex items-center gap-2 font-semibold" href="/company/dashboard">
              <NoahLogo className="h-6 w-6" />
              <span>Noah Platform</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-2 py-4">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 px-3",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link className="flex items-center gap-2 font-semibold" href="/company/dashboard">
                <NoahLogo className="h-6 w-6" />
                <span>Noah Platform</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-2 py-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 px-3",
                      pathname === item.href && "bg-accent text-accent-foreground",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
