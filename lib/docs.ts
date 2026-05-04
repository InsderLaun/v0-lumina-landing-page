// Curated documentation catalog for /docs page.
// Every path is a real .md file in the canonical repos. Verified at:
//   /tmp/lp-s2 LUMINA-PROTOCOL @ 6a3ce42
//   /tmp/lumina-api-bulk lumina-api with docs/skills/ from PR #7+8
// Do NOT add a path that doesn't exist on `main` of its repo — the card
// would 404 the user.

export type DocRepo = 'lumina-api' | 'LUMINA-PROTOCOL' | 'v0-lumina-landing-page'
export type DocCategory =
  | 'getting-started'
  | 'agents'
  | 'contracts'
  | 'security'
  | 'development'
  | 'tokenomics'

export interface DocEntry {
  title: string
  description: string
  repo: DocRepo
  path: string
  category: DocCategory
}

export const REPO_URLS: Record<DocRepo, string> = {
  'lumina-api': 'https://github.com/org-lumina/lumina-api',
  'LUMINA-PROTOCOL': 'https://github.com/org-lumina/LUMINA-PROTOCOL',
  'v0-lumina-landing-page': 'https://github.com/org-lumina/v0-lumina-landing-page',
}

export const ORG_URL = 'https://github.com/org-lumina'

export const CATEGORIES = [
  { id: 'getting-started', label: '🚀 Getting Started' },
  { id: 'agents', label: '🤖 For AI Agents' },
  { id: 'contracts', label: '🔐 Smart Contracts' },
  { id: 'security', label: '🛡️ Security & Audits' },
  { id: 'development', label: '🔧 Development' },
  { id: 'tokenomics', label: '📊 Tokenomics & Economics' },
] as const

export function buildDocUrl(entry: DocEntry): string {
  return `${REPO_URLS[entry.repo]}/blob/main/${entry.path}`
}

export const DOCS: DocEntry[] = [
  // ─── 🚀 GETTING STARTED ──────────────────────────────────────
  {
    title: 'Protocol README',
    description: 'High-level overview of the Lumina parametric insurance protocol and how the contracts fit together.',
    repo: 'LUMINA-PROTOCOL',
    path: 'README.md',
    category: 'getting-started',
  },
  {
    title: 'API server README',
    description: 'How to run the lumina-api locally, environment variables, and the public + agent endpoint surface.',
    repo: 'lumina-api',
    path: 'README.md',
    category: 'getting-started',
  },
  {
    title: 'AI Agent Quick Start',
    description: 'Five-minute path from zero to first policy purchase via the API. Read this before anything else if you operate a bot.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/AI-AGENT-QUICK-START.md',
    category: 'getting-started',
  },

  // ─── 🤖 FOR AI AGENTS ────────────────────────────────────────
  {
    title: 'Configure API client',
    description: 'Env vars, base URL, x-api-key header, retry strategy. The setup any agent needs before calling other endpoints.',
    repo: 'lumina-api',
    path: 'docs/skills/configure-api-client.md',
    category: 'agents',
  },
  {
    title: 'Generate API key',
    description: 'How to obtain an agent API key (admin-only today, self-service on roadmap). Format, storage, rate limits.',
    repo: 'lumina-api',
    path: 'docs/skills/generate-api-key.md',
    category: 'agents',
  },
  {
    title: 'Buy policy as Agent',
    description: 'Relayer pattern. Agent posts an authenticated request; the API pays gas and calls purchasePolicyFor on-chain.',
    repo: 'lumina-api',
    path: 'docs/skills/buy-policy-agent.md',
    category: 'agents',
  },
  {
    title: 'Redeem matured bond via API',
    description: 'Agent-side BondVault.redeemBond — POST /api/v1/redeem with epochId + usdAmount. Returns LUMINA to the holder.',
    repo: 'lumina-api',
    path: 'docs/skills/redeem-via-api.md',
    category: 'agents',
  },
  {
    title: 'SKILL spec V4.1 (canonical)',
    description: 'The full canonical skill specification consumed by AI agents. Lists every operation an agent can perform.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/SKILL-V4.1.md',
    category: 'agents',
  },

  // ─── 🔐 SMART CONTRACTS ──────────────────────────────────────
  {
    title: 'Deploy V5 checklist',
    description: 'Pre-deploy invariants, dependency order, and post-deploy verification for the V5.x family of contracts.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/deployment/DEPLOY-V5-CHECKLIST.md',
    category: 'contracts',
  },
  {
    title: 'Deploy V5 order',
    description: 'Exact deployment sequence (token → vault → router → shields) with rationale for ordering and constructor args.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/deployment/DEPLOY-V5-ORDER.md',
    category: 'contracts',
  },
  {
    title: 'Deploy environment variables',
    description: 'Reference of all env vars needed for deploy + post-deploy scripts. Source values for production-ready configs.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/deployment/ENV-VARIABLES.md',
    category: 'contracts',
  },
  {
    title: 'V1 deprecated contracts',
    description: 'Inventory of legacy V1/V2 contracts no longer in scope, with migration notes to V5.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/V1-DEPRECATED-CONTRACTS.md',
    category: 'contracts',
  },

  // ─── 🛡️ SECURITY & AUDITS ────────────────────────────────────
  {
    title: 'SECURITY policy',
    description: 'Vulnerability reporting process, scope, and bounty information for the protocol.',
    repo: 'LUMINA-PROTOCOL',
    path: 'SECURITY.md',
    category: 'security',
  },
  {
    title: 'Security audit V4 (latest)',
    description: 'Most recent full audit of the V5.x contract suite. Findings, severity ratings, remediation status.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/SECURITY-AUDIT-V4.md',
    category: 'security',
  },
  {
    title: 'Phase 4 audit report',
    description: 'Phase 4 internal audit covering the bond + marketplace flow. Cross-checks against contract source.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/PHASE4-AUDIT-REPORT.md',
    category: 'security',
  },
  {
    title: 'Threat model',
    description: 'Adversarial framing — who can attack what, oracle manipulation surfaces, governance assumptions.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/audit/THREAT-MODEL.md',
    category: 'security',
  },
  {
    title: 'Anti-fraud playbook',
    description: 'Operational guide for detecting and responding to abuse patterns (spam policies, oracle manipulation attempts).',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/ANTI-FRAUD-PLAYBOOK.md',
    category: 'security',
  },

  // ─── 🔧 DEVELOPMENT ──────────────────────────────────────────
  {
    title: 'Access control matrix',
    description: 'Every privileged role across the protocol — who can call what, who holds the keys, with rotation policies.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/ACCESS-CONTROL-MATRIX.md',
    category: 'development',
  },
  {
    title: 'Daily operations runbook',
    description: 'Day-to-day operator tasks: monitoring, periodic verifications, alerts triage.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/runbooks/DAILY-OPERATIONS-RUNBOOK.md',
    category: 'development',
  },
  {
    title: 'Incident response runbook',
    description: 'Step-by-step guide for triaging and recovering from production incidents (RPC down, oracle stale, contract pause).',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/runbooks/INCIDENT-RESPONSE-RUNBOOK.md',
    category: 'development',
  },
  {
    title: 'Roles and responsibilities',
    description: 'Governance + operational roles defined: who signs what, decision frameworks, escalation paths.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/governance/ROLES-AND-RESPONSIBILITIES.md',
    category: 'development',
  },

  // ─── 📊 TOKENOMICS & ECONOMICS ───────────────────────────────
  {
    title: 'Roadmap V5',
    description: 'Forward-looking roadmap for the V5 family: token launch, marketplace, automation, cross-chain.',
    repo: 'LUMINA-PROTOCOL',
    path: 'docs/ROADMAP-V5.md',
    category: 'tokenomics',
  },
  {
    title: 'Protocol changelog',
    description: 'Version-by-version change log. What shipped when, contract upgrades, breaking changes.',
    repo: 'LUMINA-PROTOCOL',
    path: 'CHANGELOG.md',
    category: 'tokenomics',
  },
]
