'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/videos', label: 'Videos' },
  { href: '/calendar', label: 'Calendar' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--primary)]">
          <img src="/logo.png" alt="Bread of Life CF" className="h-9 w-9 object-contain" />
          <span className="hidden sm:inline">Bread of Life CF</span>
          <span className="sm:hidden">BOL CF</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-[var(--accent)] text-[var(--primary)]'
                  : 'text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Admin Login
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 text-[var(--muted)] hover:bg-[var(--secondary)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-[var(--border)] md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium',
                  pathname === link.href
                    ? 'bg-[var(--accent)] text-[var(--primary)]'
                    : 'text-[var(--muted)] hover:bg-[var(--secondary)]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md bg-[var(--primary)] px-3 py-2 text-center text-sm font-medium text-white"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}