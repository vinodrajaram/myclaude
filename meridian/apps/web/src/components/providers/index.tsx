'use client'

import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RBACProvider } from './rbac-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RBACProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </RBACProvider>
    </SessionProvider>
  )
}
