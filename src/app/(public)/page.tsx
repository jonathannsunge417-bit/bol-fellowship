import HeroSlider from '@/components/HeroSlider'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Calendar, Megaphone, ArrowRight, MapPin } from 'lucide-react'

export const revalidate = 60

async function getSlides() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

async function getUpcomingEvents() {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

async function getLatestUpdates() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('updates')
      .select('*')
      .order('date_posted', { ascending: false })
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [slides, events, updates] = await Promise.all([
    getSlides(),
    getUpcomingEvents(),
    getLatestUpdates(),
  ])

  return (
    <div>
      {/* Hero with Slider */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
                Kapasa Makasa University
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Bread of Life Campus Fellowship
              </h1>
              <p className="mt-6 text-lg text-blue-100 sm:text-xl">
                Growing in faith, serving with love, and building a Christ-centered community on campus.
                Join us as we seek to know Jesus and make Him known.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20 transition"
                >
                  Visit Us
                </Link>
              </div>
            </div>

            <div>
              <HeroSlider slides={slides} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="border-b border-[var(--border)] bg-[var(--secondary)]/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <h3 className="font-semibold text-[var(--primary)]">Our Mission</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                To make disciples of Jesus Christ among university students through fellowship, teaching, and service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--primary)]">Our Vision</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                A vibrant campus community transformed by the Gospel and impacting the nation for Christ.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--primary)]">Our Values</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Faith, Love, Integrity, Excellence, and Community in all we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
          </div>
          <Link href="/events" className="text-sm font-medium text-[var(--primary)] hover:underline">
            View all →
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-[var(--muted)]">No upcoming events at this time.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {event.photo_url ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={event.photo_url}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-white/50" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-semibold text-lg group-hover:text-[var(--primary)] transition">
                    {event.title}
                  </h3>

                  <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(event.event_date)}
                      {event.event_time && ` · ${event.event_time.slice(0, 5)}`}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="mt-3 text-sm text-[var(--muted)] line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Latest Updates */}
      <section className="border-t border-[var(--border)] bg-[var(--secondary)]/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Megaphone className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="text-2xl font-bold">Latest Updates</h2>
          </div>

          {updates.length === 0 ? (
            <p className="text-center text-[var(--muted)]">No updates at this time.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {updates.map((update: any) => (
                <article
                  key={update.id}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {update.photo_url ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={update.photo_url}
                        alt={update.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Megaphone className="h-12 w-12 text-white/50" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg group-hover:text-[var(--primary)] transition">
                        {update.title}
                      </h3>
                      <time className="text-xs text-[var(--muted)] whitespace-nowrap">
                        {formatDate(update.date_posted)}
                      </time>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3">
                      {update.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[var(--primary)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Join Our Fellowship</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Whether you are a new student or have been around for years, you are welcome.
            Come experience the love of Christ with us.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-50 transition"
          >
            Get in Touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}