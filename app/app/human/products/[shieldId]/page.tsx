import { notFound } from 'next/navigation'
import { ShieldDetailView } from '@/components/lumina/redesign/operate/ShieldDetailView'
import { SHIELD_BY_SLUG, SHIELDS } from '@/lib/operate/products'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return SHIELDS.map((s) => ({ shieldId: s.slug }))
}

export default async function ShieldDetailPage({
  params,
}: {
  params: Promise<{ shieldId: string }>
}) {
  const { shieldId } = await params
  const shield = SHIELD_BY_SLUG[shieldId]
  if (!shield) notFound()
  return <ShieldDetailView shield={shield} />
}
