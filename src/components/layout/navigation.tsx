"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Home, BarChart3, Search, MessageSquare, Settings, Key, LogOut, Users, Shield } from "lucide-react"
import { cn } from "@/lib/utils/cnUtils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRoleAccess } from "@/lib/hooks/auth/useRoleAccess"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home, roles: ['admin', 'concierge', 'manager', 'casual'] },
  { href: "/tasks", label: "Tasks", icon: BarChart3, roles: ['admin', 'concierge', 'manager'] },
  { href: "/search", label: "Search", icon: Search, roles: ['admin', 'concierge', 'manager', 'casual'] },
  { href: "/chat", label: "Ask AI", icon: MessageSquare, roles: ['admin', 'concierge', 'manager', 'casual'] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ['admin', 'concierge', 'manager', 'casual'] },
]

const adminItems = [
  { href: "/admin/users", label: "User Management", icon: Users, roles: ['admin'] },
  { href: "/admin/system", label: "System Settings", icon: Shield, roles: ['admin', 'concierge'] },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [logoutLoading, setLogoutLoading] = React.useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { hasAnyRole, canAccessAdminPanel, user, role } = useRoleAccess()

  const isAuthenticated = !!session?.user
  const isLoading = status === 'loading'

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  // Filter navigation items based on user role
  const visibleNavItems = navigationItems.filter(item =>
    hasAnyRole(item.roles as any)
  )

  const visibleAdminItems = adminItems.filter(item =>
    hasAnyRole(item.roles as any)
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg excel-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="font-semibold tracking-tight text-gray-900">ExcelPilot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "excel-nav-item",
                    isActive ? "excel-nav-active" : "excel-nav-inactive"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Admin Panel Access */}
            {canAccessAdminPanel() && visibleAdminItems.length > 0 && (
              <>
                <div className="h-6 w-px bg-gray-300 mx-2" />
                {visibleAdminItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "excel-nav-item",
                        isActive ? "excel-nav-active" : "excel-nav-inactive"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name || user?.email || 'User'}</span>
                      <span className="text-xs text-muted-foreground capitalize">{role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={logoutLoading}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutLoading ? 'Signing out...' : 'Sign out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="excel-nav-item">
                <Key className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "excel-nav-item",
                      isActive ? "excel-nav-active" : "excel-nav-inactive"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile Admin Items */}
              {canAccessAdminPanel() && visibleAdminItems.length > 0 && (
                <>
                  <div className="pt-2 border-t">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Administration
                    </div>
                    {visibleAdminItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "excel-nav-item",
                            isActive ? "excel-nav-active" : "excel-nav-inactive"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Mobile Auth Actions */}
              <div className="pt-2 border-t">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="excel-nav-item w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{logoutLoading ? 'Signing out...' : 'Sign out'}</span>
                  </button>
                ) : (
                  <Link href="/login" className="excel-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <Key className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
