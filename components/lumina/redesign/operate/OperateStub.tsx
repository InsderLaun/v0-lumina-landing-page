// Minimal page stub used by FASE 1 children routes. FASE 2/3 replace each
// of these with the full <HumanProductsView>, <ShieldDetailView>, etc.

interface OperateStubProps {
  title: string
  subtitle: string
}

export function OperateStub({ title, subtitle }: OperateStubProps) {
  return (
    <div style={{ padding: '40px 32px', maxWidth: 720 }}>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-3)',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        OPERATE · {title.toUpperCase()}
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontWeight: 300,
          fontSize: 36,
          letterSpacing: '-0.02em',
          color: 'var(--rd-text)',
          marginBottom: 8,
        }}
      >
        {title}
      </h1>
      <p style={{ color: 'var(--rd-text-2)', fontSize: 14, lineHeight: 1.55 }}>{subtitle}</p>
    </div>
  )
}
