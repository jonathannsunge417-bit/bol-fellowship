'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Users, Calendar, Megaphone, Package, GraduationCap, Image, ArrowRight } from 'lucide-react'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    updates: 0,
    assets: 0,
    alumni: 0,
    gallery: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const [
        { count: members },
        { count: events },
        { count: updates },
        { count: assets },
        { count: alumni },
        { count: gallery },
      ] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('updates').select('*', { count: 'exact', head: true }),
        supabase.from('assets').select('*', { count: 'exact', head: true }),
        supabase.from('alumni').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
      ])

      // Animate the numbers
      animateValue('members', members || 0)
      animateValue('events', events || 0)
      animateValue('updates', updates || 0)
      animateValue('assets', assets || 0)
      animateValue('alumni', alumni || 0)
      animateValue('gallery', gallery || 0)

      setLoading(false)
    }

    loadStats()
  }, [])

  function animateValue(key: string, end: number) {
    let start = 0
    const duration = 800
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      setStats((prev) => ({ ...prev, [key]: Math.floor(start) }))
    }, 16)
  }

  const cards = [
    { label: 'Members', count: stats.members, href: '/dashboard/members', icon: Users, color: 'from-blue-500 to-blue-600', delay: 'delay-0' },
    { label: 'Events', count: stats.events, href: '/dashboard/events', icon: Calendar, color: 'from-indigo-500 to-indigo-600', delay: 'delay-75' },
    { label: 'Updates', count: stats.updates, href: '/dashboard/updates', icon: Megaphone, color: 'from-amber-500 to-amber-600', delay: 'delay-100' },
    { label: 'Assets', count: stats.assets, href: '/dashboard/assets', icon: Package, color: 'from-emerald-500 to-emerald-600', delay: 'delay-150' },
    { label: 'Alumni', count: stats.alumni, href: '/dashboard/alumni', icon: GraduationCap, color: 'from-purple-500 to-purple-600', delay: 'delay-200' },
    { label: 'Gallery', count: stats.gallery, href: '/dashboard/gallery', icon: Image, color: 'from-rose-500 to-rose-600', delay: 'delay-300' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[var(--muted)]">
          Welcome back to Bread of Life Campus Fellowship admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent ${card.delay}`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--muted)] group-hover:text-white/80 transition-colors">
                    {card.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight group-hover:text-white transition-colors">
                    {loading ? '—' : card.count}
                  </p>
                </div>
                <div className={`rounded-xl bg-gradient-to-br ${card.color} p-3.5 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="relative z-10 mt-5 flex items-center text-sm font-medium text-[var(--primary)] group-hover:text-white transition-colors">
                Manage
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Common tasks you can do right away</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/members"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:opacity-90 hover:shadow-lg"
          >
            <Users className="h-4 w-4" />
            Add Member
          </Link>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--secondary)] hover:shadow-md"
          >
            <Calendar className="h-4 w-4" />
            New Event
          </Link>
          <Link
            href="/dashboard/updates"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--secondary)] hover:shadow-md"
          >
            <Megaphone className="h-4 w-4" />
            Post Update
          </Link>
          <Link
            href="/dashboard/gallery"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--secondary)] hover:shadow-md"
          >
            <Image className="h-4 w-4" />
            Add Photo
          </Link>
        </div>
      </div>
    </div>
  )
}