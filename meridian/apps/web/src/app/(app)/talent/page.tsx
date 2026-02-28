import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { canAccess, getDefaultRoute, type Role } from '@/lib/rbac'
import { getModule } from '@/config/modules'
import { ModulePlaceholder } from '@/components/ui/module-placeholder'

export default async function TalentPage() {
  const session = await auth()
  if (!session) redirect('/login')
  const role = session.user.role as Role
  if (!canAccess(role, 'talent')) redirect(getDefaultRoute(role))

  const mod = getModule('talent')!
  return <ModulePlaceholder module={mod} />
}
