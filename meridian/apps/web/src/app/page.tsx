import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getDefaultRoute, type Role } from '@/lib/rbac'

export default async function RootPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role as Role
  redirect(getDefaultRoute(role))
}
