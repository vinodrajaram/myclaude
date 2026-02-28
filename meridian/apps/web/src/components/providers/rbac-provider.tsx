'use client'

import { createContext, useContext, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { canAccess, type Role } from '@/lib/rbac'

interface RBACContextValue {
  role: Role | null
  canAccess: (moduleId: string) => boolean
}

const RBACContext = createContext<RBACContextValue>({
  role: null,
  canAccess: () => false,
})

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const role = (session?.user?.role as Role) ?? null

  const checkAccess = useCallback(
    (moduleId: string) => {
      if (!role) return false
      return canAccess(role, moduleId)
    },
    [role],
  )

  return (
    <RBACContext.Provider value={{ role, canAccess: checkAccess }}>
      {children}
    </RBACContext.Provider>
  )
}

export function useRBAC() {
  return useContext(RBACContext)
}
