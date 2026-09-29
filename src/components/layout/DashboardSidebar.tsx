'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Package,
  Calendar,
  Image,
  Megaphone,
  LogOut,
  Church,
  Menu,
  X,
  Settings,
  Music,
  Mail,
  Video,
  CalendarDays,
  Images,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/members', label: 'Members', icon: Users },
  { href: '/dashboard/alumni', label: 'Alumni', icon: GraduationCap },
  { href: '/dashboard/assets', label: 'Assets', icon: Package },
  { href: '/dashboard/events', label: 'Events', icon: Calendar },
  { href: '/dashboard/gallery', label: 'Gallery', icon: Image },
  { href: '/dashboard/updates', label: 'Updates', icon: Megaphone },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/sermons', label: 'Sermons', icon: Music },
  { href: '/dashboard/messages', label: 'Messages', icon: Mail },
  { href: '/dashboard/videos', label: 'Videos', icon: Video },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/slides', label: 'Home Slider', icon: Images },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-5 border-b border-[var(--border)]">
        <Church className="h-6 w-6 text-[var(--primary)]" />
        <span className="font-semibold text-sm">BOL Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed left-4 top-4 z-50 flex items-center justify-center rounded-lg bg-[var(--primary)] p-2.5 text-white shadow-lg md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--border)] bg-white dark:bg-slate-900 transition-transform md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>
    </>
  )
}