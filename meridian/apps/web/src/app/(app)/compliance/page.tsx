import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { canAccess, type Role } from '@/lib/rbac'
import { getModule } from '@/config/modules'
import { ModulePlaceholder } from '@/components/ui/module-placeholder'

export default async function CompliancePage() {
  const session = await auth()
  if (!session) redirect('/login')
  const role = session.user.role as Role
  // Non-IBC roles can't access compliance — redirect them to their default
  if (!canAccess(role, 'compliance')) {
    redirect(role === 'ANALYST' || role === 'VP' || role === 'MD' ? '/intelligence' : '/login')
  }

  const mod = getModule('compliance')!
  return <ModulePlaceholder module={mod} />
}
