'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !isDark
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('meridian-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('meridian-theme', 'light')
    }
    setIsDark(next)
  }

  return (
    <button
      onClick={toggle}
      className="text-text-muted hover:text-meridian-text transition-colors p-1"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
