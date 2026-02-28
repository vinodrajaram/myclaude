import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const PERSONAS = [
  { id: '1', username: 'analyst', password: 'demo', role: 'ANALYST', name: 'Alex Chen', persona: 'analyst' },
  { id: '2', username: 'vp', password: 'demo', role: 'VP', name: 'Sarah Mitchell', persona: 'vp' },
  { id: '3', username: 'ibc', password: 'demo', role: 'IBC', name: 'James Okafor', persona: 'ibc' },
  { id: '4', username: 'md', password: 'demo', role: 'MD', name: 'Diana Reeves', persona: 'md' },
]

const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = PERSONAS.find(
          (u) => u.username === credentials?.username && u.password === credentials?.password,
        )
        if (!user) return null
        return {
          id: user.id,
          name: user.name,
          email: `${user.username}@meridian.internal`,
          role: user.role,
          persona: user.persona,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role
        token.persona = (user as { persona: string }).persona
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      session.user.persona = token.persona as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
