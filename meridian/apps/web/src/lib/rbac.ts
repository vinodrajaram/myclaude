import { MODULES, type ModuleId } from '@/config/modules'

export type Role = 'ANALYST' | 'VP' | 'MD' | 'IBC'

export const ROLES: Role[] = ['ANALYST', 'VP', 'MD', 'IBC']

export function canAccess(role: Role, moduleId: ModuleId | string): boolean {
  const mod = MODULES.find((m) => m.id === moduleId)
  if (!mod) return false
  return mod.roles.includes(role)
}

export function getDefaultRoute(role: Role): string {
  if (role === 'IBC') return '/compliance'
  return '/intelligence'
}

export function getAccessibleModules(role: Role) {
  return MODULES.filter((m) => canAccess(role, m.id))
}
