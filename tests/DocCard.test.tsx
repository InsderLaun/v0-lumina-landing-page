import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocCard } from '../components/lumina/redesign/DocCard'

describe('DocCard', () => {
  it('renders title, description, and an external link with the given href', () => {
    render(
      <DocCard
        title="Test Doc"
        description="A short description for the test."
        href="https://example.com/doc"
      />,
    )
    expect(screen.getByRole('heading', { level: 4, name: /test doc/i })).toBeInTheDocument()
    expect(screen.getByText(/a short description for the test/i)).toBeInTheDocument()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/doc')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('shows the badge label when provided', () => {
    render(
      <DocCard
        title="Doc with badge"
        description="desc"
        href="https://example.com/x"
        badge="new"
      />,
    )
    expect(screen.getByText(/^new$/i)).toBeInTheDocument()
  })

  it('shows repo chip text when provided', () => {
    render(
      <DocCard
        title="Doc with repo"
        description="desc"
        href="https://example.com/y"
        repo="lumina-api"
      />,
    )
    expect(screen.getByText('lumina-api')).toBeInTheDocument()
  })
})
