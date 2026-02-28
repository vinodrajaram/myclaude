import 'next-auth'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role: string
    persona: string
  }
  interface Session {
    user: {
      role: string
      persona: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    persona: string
  }
}
