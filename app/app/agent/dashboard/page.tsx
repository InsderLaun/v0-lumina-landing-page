import { AgentDashboardView } from '@/components/lumina/redesign/operate/AgentDashboardView'
import { ApiHealthWidget } from '@/components/lumina/redesign/operate/ApiHealthWidget'
import { AgentQuickStart } from '@/components/lumina/redesign/operate/AgentQuickStart'
import { LifecycleHint } from '@/components/lumina/redesign/operate/LifecycleHint'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Lumina · Agent Dashboard' }

export default function AgentDashboardPage() {
  return (
    <>
      <ApiHealthWidget />
      <AgentQuickStart />
      <LifecycleHint variant="agent" />
      <AgentDashboardView />
    </>
  )
}
