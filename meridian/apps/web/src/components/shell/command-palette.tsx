'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Command } from 'cmdk'
import { create } from 'zustand'
import {
  Brain,
  GitMerge,
  FileText,
  Radio,
  Shield,
  TrendingUp,
  Network,
  Archive,
  Users,
  LogOut,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MODULES } from '@/config/modules'
import { useRBAC } from '@/components/providers/rbac-provider'

interface PaletteStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const usePaletteStore = create<PaletteStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  GitMerge,
  FileText,
  Radio,
  Shield,
  TrendingUp,
  Network,
  Archive,
  Users,
}

export function CommandPalette() {
  const router = useRouter()
  const { isOpen, close, toggle } = usePaletteStore()
  const { canAccess } = useRBAC()

  // Global Cmd+K handler
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  const handleNavigate = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router],
  )

  const handleSignOut = useCallback(async () => {
    close()
    await signOut({ redirect: false })
    router.push('/login')
  }, [close, router])

  const accessibleModules = MODULES.filter((m) => canAccess(m.id))
  const phase2Modules = MODULES.filter((m) => m.phase === 2 && !canAccess(m.id))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="p-0 max-w-lg bg-surface border-border-base overflow-hidden">
        <Command className="bg-transparent" shouldFilter={true}>
          <div className="flex items-center border-b border-border-base px-4">
            <Command.Input
              placeholder="Search modules or actions..."
              className="flex-1 py-4 bg-transparent text-sm text-meridian-text placeholder:text-text-muted outline-none font-mono"
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto py-2">
            <Command.Empty className="py-8 text-center text-sm text-text-muted font-mono">
              No results found.
            </Command.Empty>

            {/* Navigate group */}
            <Command.Group
              heading="Navigate"
              className="px-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-text-muted/60 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
            >
              {accessibleModules.map((mod) => {
                const Icon = ICON_MAP[mod.icon]
                return (
                  <Command.Item
                    key={mod.id}
                    value={`${mod.label} ${mod.tagline}`}
                    onSelect={() => handleNavigate(`/${mod.id}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted hover:text-meridian-text hover:bg-surface-2 aria-selected:bg-surface-2 aria-selected:text-meridian-text transition-colors"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{mod.label}</p>
                      <p className="text-[11px] text-text-muted/60 truncate font-mono">{mod.tagline}</p>
                    </div>
                    {mod.phase === 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-gold/40 text-gold/60"
                      >
                        P2
                      </Badge>
                    )}
                  </Command.Item>
                )
              })}

              {/* Phase 2 inaccessible modules (still navigable but badged) */}
              {phase2Modules.map((mod) => {
                const Icon = ICON_MAP[mod.icon]
                return (
                  <Command.Item
                    key={mod.id}
                    value={`${mod.label} ${mod.tagline}`}
                    onSelect={() => handleNavigate(`/${mod.id}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted/40 hover:text-text-muted hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{mod.label}</p>
                      <p className="text-[11px] text-text-muted/40 truncate font-mono">{mod.tagline}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-gold/40 text-gold/60"
                    >
                      Phase 2
                    </Badge>
                  </Command.Item>
                )
              })}
            </Command.Group>

            {/* Actions group */}
            <Command.Group
              heading="Actions"
              className="px-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-text-muted/60 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
            >
              <Command.Item
                value="sign out logout"
                onSelect={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-text-muted hover:text-meridian-text hover:bg-surface-2 aria-selected:bg-surface-2 aria-selected:text-meridian-text transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="text-sm">Sign out</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
