import { BarChart3,
    Home,
    MessageSquare,
    Search,
    Settings,
    Shield,
    Users 
} from "lucide-react"

export const navigationItems = [
    { href: "/", label: "Home", icon: Home, roles: ['admin', 'concierge', 'manager', 'casual'] },
    { href: "/dashboard", label: "Dash", icon: BarChart3, roles: ['admin', 'concierge', 'manager', 'casual'] },
    { href: "/tasks", label: "Tasks", icon: BarChart3, roles: ['admin', 'concierge', 'manager'] },
    // { href: "/search", label: "Search", icon: Search, roles: ['admin', 'concierge', 'manager', 'casual'] },
    { href: "/chat", label: "Ask AI", icon: MessageSquare, roles: ['admin', 'concierge', 'manager', 'casual'] },
    { href: "/settings", label: "Settings", icon: Settings, roles: ['admin', 'concierge', 'manager', 'casual'] },
  ]
  
export const adminItems = [
    { href: "/admin/users", label: "User Management", icon: Users, roles: ['admin'] },
    { href: "/admin/system", label: "System Settings", icon: Shield, roles: ['admin', 'concierge'] },
  ]