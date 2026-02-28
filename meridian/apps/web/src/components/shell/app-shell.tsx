'use client'

import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { CommandPalette } from './command-palette'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <TopBar />
      <CommandPalette />
      <main className="ml-[240px] pt-14 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
