import type { Module } from '@/config/modules'
import { Badge } from '@/components/ui/badge'

interface ModulePlaceholderProps {
  module: Module
}

export function ModulePlaceholder({ module: mod }: ModulePlaceholderProps) {
  const isPhase2 = mod.phase === 2

  return (
    <div className="relative min-h-[60vh] flex flex-col">
      {/* Phase 2 overlay */}
      {isPhase2 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/60 backdrop-blur-sm rounded-lg border border-border-base">
          <div className="text-center space-y-3">
            <div className="w-1 h-12 bg-gold/40 mx-auto rounded-full" />
            <p className="font-display text-2xl text-meridian-text/60">Available in Phase 2</p>
            <p className="text-sm text-text-muted font-mono">Coming in the next release cycle</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={isPhase2 ? 'opacity-30 pointer-events-none' : undefined}>
        {/* Header */}
        <div className="space-y-4 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-0.5 h-12 bg-gold rounded-full mt-1" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-5xl font-medium text-meridian-text tracking-wide">
                  {mod.label}
                </h1>
                <Badge
                  variant="outline"
                  className="border-gold/40 text-gold font-mono text-xs"
                >
                  Phase {mod.phase}
                </Badge>
              </div>
              <p className="text-text-muted font-sans text-base">{mod.tagline}</p>
            </div>
          </div>

          {/* Gold rule */}
          <div className="h-px bg-gradient-to-r from-gold/40 via-gold/10 to-transparent ml-5" />
        </div>

        {/* Capabilities grid */}
        <div className="ml-5">
          <p className="text-[10px] font-mono tracking-widest uppercase text-text-muted/60 mb-4">
            Capabilities
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mod.capabilities.map((cap) => (
              <div
                key={cap}
                className="px-4 py-3 rounded-sm bg-surface border border-border-base text-sm text-text-muted hover:border-border-bright hover:text-meridian-text transition-colors"
              >
                {cap}
              </div>
            ))}
          </div>

          {/* Placeholder content area */}
          <div className="mt-10 rounded-md bg-surface border border-border-base p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-2">
              <div className="w-8 h-px bg-gold/40 mx-auto" />
              <p className="text-sm font-mono text-text-muted/60">
                Module content will render here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
