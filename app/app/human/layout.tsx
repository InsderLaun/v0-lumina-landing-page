import '@/components/lumina/redesign/redesign.css'
import { ReactNode } from 'react'
import { AppShell } from '@/components/lumina/redesign/operate/AppShell'

export const dynamic = 'force-dynamic'

export default function HumanLayout({ children }: { children: ReactNode }) {
  return <AppShell role="human">{children}</AppShell>
}
