'use client'

import { useEffect, useState } from 'react'

export interface TutorialSidebarItem {
  id: string
  number: number
  title: string
}

export function TutorialSidebar({
  items,
  mode,
}: {
  items: TutorialSidebarItem[]
  mode: 'human' | 'agent'
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const elements = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiveId(visible.target.id)
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  return (
    <aside className="rd-tut-sidebar" aria-label={`${mode} flow steps`}>
      <div className="rd-tut-sidebar-eyebrow">
        {mode === 'human' ? 'HUMAN FLOW' : 'AGENT FLOW'}
      </div>
      <nav>
        <ol className="rd-tut-sidebar-list">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={
                  activeId === it.id
                    ? 'rd-tut-sidebar-link is-active'
                    : 'rd-tut-sidebar-link'
                }
              >
                <span className="rd-tut-sidebar-num">
                  {String(it.number).padStart(2, '0')}
                </span>
                <span className="rd-tut-sidebar-title">{it.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
