import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { canAccess, getDefaultRoute, type Role } from '@/lib/rbac'
import { getModule } from '@/config/modules'
import { ModulePlaceholder } from '@/components/ui/module-placeholder'

export default async function ConnectPage() {
  const session = await auth()
  if (!session) redirect('/login')
  const role = session.user.role as Role
  if (!canAccess(role, 'connect')) redirect(getDefaultRoute(role))

  const mod = getModule('connect')!
  return <ModulePlaceholder module={mod} />
}
