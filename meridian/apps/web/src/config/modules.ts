export type ModuleId =
  | 'intelligence'
  | 'pipeline'
  | 'forge'
  | 'signal'
  | 'compliance'
  | 'credit'
  | 'connect'
  | 'memory'
  | 'talent'

export interface Module {
  id: ModuleId
  label: string
  icon: string
  phase: 1 | 2
  tagline: string
  roles: string[]
  capabilities: string[]
}

export const MODULES: Module[] = [
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: 'Brain',
    phase: 1,
    tagline: 'AI-powered market intelligence and deal sourcing',
    roles: ['ANALYST', 'VP', 'MD'],
    capabilities: ['Company screening', 'Market mapping', 'Deal flow analysis', 'Sector themes'],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: 'GitMerge',
    phase: 1,
    tagline: 'End-to-end deal pipeline and workflow management',
    roles: ['ANALYST', 'VP', 'MD'],
    capabilities: ['Deal tracking', 'Stage management', 'Task assignment', 'Pipeline analytics'],
  },
  {
    id: 'forge',
    label: 'Forge',
    icon: 'FileText',
    phase: 1,
    tagline: 'AI-assisted document generation and review',
    roles: ['ANALYST', 'VP', 'MD'],
    capabilities: ['CIM drafting', 'Pitch decks', 'Model narration', 'Document review'],
  },
  {
    id: 'signal',
    label: 'Signal',
    icon: 'Radio',
    phase: 1,
    tagline: 'Real-time market signals and relationship intelligence',
    roles: ['VP', 'MD'],
    capabilities: ['News monitoring', 'Relationship mapping', 'Signal alerts', 'Market triggers'],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: 'Shield',
    phase: 1,
    tagline: 'Regulatory compliance and deal monitoring',
    roles: ['IBC'],
    capabilities: ['Regulatory tracking', 'Deal compliance', 'Audit trails', 'Risk flags'],
  },
  {
    id: 'credit',
    label: 'Credit',
    icon: 'TrendingUp',
    phase: 2,
    tagline: 'Integrated credit analysis and underwriting',
    roles: ['ANALYST', 'VP', 'MD'],
    capabilities: ['Credit modeling', 'Covenant tracking', 'Rating analysis', 'Debt structuring'],
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: 'Network',
    phase: 2,
    tagline: 'LP and counterparty relationship management',
    roles: ['ANALYST', 'VP', 'MD'],
    capabilities: ['LP portal', 'Counterparty CRM', 'Meeting tracking', 'Intro facilitation'],
  },
  {
    id: 'memory',
    label: 'Memory',
    icon: 'Archive',
    phase: 2,
    tagline: 'Institutional knowledge base and deal history',
    roles: ['ANALYST', 'VP', 'MD'],
    capabilities: ['Deal archive', 'Knowledge search', 'Lesson capture', 'Precedent library'],
  },
  {
    id: 'talent',
    label: 'Talent',
    icon: 'Users',
    phase: 2,
    tagline: 'Portfolio company talent and org management',
    roles: ['VP', 'MD'],
    capabilities: ['Org charts', 'Talent pipeline', 'Hiring tracking', 'Compensation benchmarks'],
  },
]

export function getModule(id: ModuleId): Module | undefined {
  return MODULES.find((m) => m.id === id)
}
