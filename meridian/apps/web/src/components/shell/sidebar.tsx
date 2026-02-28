'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
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
import { clsx } from 'clsx'
import { MODULES, type Module } from '@/config/modules'
import { useRBAC } from '@/components/providers/rbac-provider'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

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

function ModuleLink({ mod, accessible }: { mod: Module; accessible: boolean }) {
  const pathname = usePathname()
  const Icon = ICON_MAP[mod.icon]
  const isActive = pathname === `/${mod.id}`
  const isPhase2 = mod.phase === 2

  return (
    <Link
      href={accessible ? `/${mod.id}` : '#'}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors relative group',
        isActive
          ? 'bg-surface-2 text-meridian-text border-l-2 border-gold pl-[10px]'
          : 'border-l-2 border-transparent',
        !isActive && accessible && 'hover:bg-surface-2 hover:text-meridian-text',
        isPhase2 ? 'opacity-40' : 'opacity-100',
        !accessible && 'cursor-default',
      )}
      onClick={accessible ? undefined : (e) => e.preventDefault()}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-text-muted" />}
      <span className={clsx(isActive ? 'text-meridian-text' : 'text-text-muted')}>{mod.label}</span>
      {isPhase2 && (
        <Badge
          variant="outline"
          className="ml-auto text-[10px] px-1.5 py-0 border-gold/40 text-gold/60"
        >
          P2
        </Badge>
      )}
    </Link>
  )
}

export function Sidebar() {
  const { data: session } = useSession()
  const { canAccess, role } = useRBAC()
  const router = useRouter()

  const phase1 = MODULES.filter((m) => m.phase === 1)
  const phase2 = MODULES.filter((m) => m.phase === 2)

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
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface border-r border-border-base flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border-base">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-6 bg-gold rounded-full" />
          <span className="font-display text-2xl font-semibold tracking-[0.12em] text-meridian-text">
            MERIDIAN
          </span>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-mono font-medium tracking-widest uppercase text-text-muted/60">
            Phase 1
          </p>
          {phase1.map((mod) => (
            <ModuleLink key={mod.id} mod={mod} accessible={canAccess(mod.id)} />
          ))}
        </div>

        <Separator className="my-4 mx-3 bg-border-base" />

        <div className="px-3 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-mono font-medium tracking-widest uppercase text-text-muted/60">
            Phase 2
          </p>
          {phase2.map((mod) => (
            <ModuleLink key={mod.id} mod={mod} accessible={canAccess(mod.id)} />
          ))}
        </div>
      </ScrollArea>

      {/* User Footer */}
      <div className="border-t border-border-base p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-surface-2 border border-border-bright">
            <AvatarFallback className="text-xs font-mono text-text-muted bg-transparent">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-meridian-text truncate">{session?.user?.name}</p>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-gold/40 text-gold font-mono"
            >
              {role}
            </Badge>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full text-xs text-text-muted hover:text-meridian-text transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
