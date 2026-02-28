'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/shell/theme-toggle'
import { MODULES } from '@/config/modules'
import { usePaletteStore } from '@/components/shell/command-palette'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRBAC } from '@/components/providers/rbac-provider'

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { role } = useRBAC()
  const openPalette = usePaletteStore((s) => s.open)

  const moduleId = pathname.replace('/', '')
  const currentModule = MODULES.find((m) => m.id === moduleId)

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'ME'

  async function handleSignOut() {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <header className="fixed left-[240px] right-0 top-0 h-14 bg-bg/90 backdrop-blur-sm border-b border-border-base flex items-center px-6 gap-4 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-mono tracking-widest uppercase text-text-muted">
          MERIDIAN
        </span>
        {currentModule && (
          <>
            <span className="text-text-muted/40 text-xs">/</span>
            <span className="text-xs font-mono tracking-widest uppercase text-meridian-text">
              {currentModule.label}
            </span>
          </>
        )}
      </div>

      {/* Search Trigger */}
      <button
        onClick={openPalette}
        className="flex-1 max-w-xs flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border-base hover:border-border-bright transition-colors text-left"
      >
        <Search className="h-3.5 w-3.5 text-text-muted shrink-0" />
        <span className="text-xs font-mono text-text-muted flex-1">Search or jump to...</span>
        <kbd className="text-[10px] font-mono text-text-muted/60 bg-surface-2 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-3 ml-auto">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Bell */}
        <button className="text-text-muted hover:text-meridian-text transition-colors p-1">
          <Bell className="h-4 w-4" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
            <Avatar className="h-7 w-7 bg-surface-2 border border-border-bright">
              <AvatarFallback className="text-[11px] font-mono text-text-muted bg-transparent">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs text-meridian-text">{session?.user?.name}</span>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 border-gold/40 text-gold font-mono"
              >
                {role}
              </Badge>
            </div>
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-surface border-border-base"
          >
            <div className="px-3 py-2">
              <p className="text-sm text-meridian-text">{session?.user?.name}</p>
              <p className="text-xs text-text-muted font-mono">{role}</p>
            </div>
            <DropdownMenuSeparator className="bg-border-base" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-text-muted hover:text-meridian-text cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
