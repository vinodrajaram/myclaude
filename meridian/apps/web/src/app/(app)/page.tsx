import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getDefaultRoute } from '@/lib/rbac'
import type { Role } from '@/lib/rbac'

export default async function RootAppPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role as Role
  redirect(getDefaultRoute(role))
}
