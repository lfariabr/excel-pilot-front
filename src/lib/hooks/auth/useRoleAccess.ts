import { useSession } from 'next-auth/react'

export type UserRole = 'admin' | 'concierge' | 'manager' | 'casual'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

/**
 * Hook to check user roles and permissions
 */
export const useRoleAccess = () => {
  const { data: session } = useSession()
  const user = session?.user as User | null

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const hasMinimumRole = (minRole: UserRole): boolean => {
    if (!user) return false

    const roleHierarchy: Record<UserRole, number> = {
      'casual': 0,
      'manager': 1,
      'concierge': 2,
      'admin': 3
    }

    return roleHierarchy[user.role] >= roleHierarchy[minRole]
  }

  const canAccessAdminPanel = (): boolean => {
    return hasRole(['admin', 'concierge'])
  }

  const canManageUsers = (): boolean => {
    return hasRole('admin')
  }

  const canManageTasks = (): boolean => {
    return hasRole(['admin', 'manager', 'concierge'])
  }

  return {
    user,
    role: user?.role,
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    canAccessAdminPanel,
    canManageUsers,
    canManageTasks,
    isAuthenticated: !!session
  }
}
