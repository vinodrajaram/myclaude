'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { clsx } from 'clsx'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const PERSONAS = [
  {
    username: 'analyst',
    name: 'Alex Chen',
    role: 'ANALYST',
    description: 'Deal analysis, pipeline management, document generation',
  },
  {
    username: 'vp',
    name: 'Sarah Mitchell',
    role: 'VP',
    description: 'Full access + Signal intelligence, market monitoring',
  },
  {
    username: 'ibc',
    name: 'James Okafor',
    role: 'IBC',
    description: 'Compliance monitoring, regulatory tracking, audit tools',
  },
  {
    username: 'md',
    name: 'Diana Reeves',
    role: 'MD',
    description: 'Complete access including Talent and portfolio oversight',
  },
]

const ROLE_COLORS: Record<string, string> = {
  ANALYST: 'border-gold/30 text-gold',
  VP: 'border-gold/50 text-gold-bright',
  IBC: 'border-border-bright text-meridian-text/60',
  MD: 'border-gold text-gold-bright',
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function fillPersona(persona: (typeof PERSONAS)[0]) {
    setUsername(persona.username)
    setPassword('demo')
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials. Use username + "demo" as password.')
      } else {
        router.push('/')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-0.5 h-8 bg-gold rounded-full" />
            <h1 className="font-display text-4xl font-semibold tracking-[0.15em] text-meridian-text">
              MERIDIAN
            </h1>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase text-text-muted/60">
            Investment Banking Intelligence
          </p>
        </div>

        {/* Gold rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        {/* Persona cards */}
        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-widest uppercase text-text-muted/60">
            Sign in as
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PERSONAS.map((persona) => (
              <button
                key={persona.username}
                onClick={() => fillPersona(persona)}
                className={clsx(
                  'p-3 rounded-sm bg-surface border text-left transition-all hover:border-border-bright hover:bg-surface-2 space-y-1.5 group',
                  username === persona.username
                    ? 'border-gold/50 bg-surface-2'
                    : 'border-border-base',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-meridian-text font-medium">{persona.name}</span>
                  <Badge
                    variant="outline"
                    className={clsx('text-[10px] px-1.5 py-0 font-mono', ROLE_COLORS[persona.role])}
                  >
                    {persona.role}
                  </Badge>
                </div>
                <p className="text-[11px] text-text-muted leading-snug">{persona.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-surface border-border-base text-meridian-text placeholder:text-text-muted font-mono text-sm focus-visible:ring-gold focus-visible:border-gold/60"
            autoComplete="username"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface border-border-base text-meridian-text placeholder:text-text-muted font-mono text-sm focus-visible:ring-gold focus-visible:border-gold/60"
            autoComplete="current-password"
          />

          {error && (
            <p className="text-xs font-mono text-destructive px-1">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending || !username}
            className="w-full bg-gold text-bg hover:bg-gold-bright font-mono text-sm tracking-wide"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-[11px] font-mono text-text-muted/40">
          All credentials use password: demo
        </p>
      </div>
    </div>
  )
}
