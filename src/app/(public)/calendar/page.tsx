import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { CalendarDays, ArrowRight } from 'lucide-react'

export const revalidate = 60

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .order('event_date', { ascending: true })

  const today = new Date().toISOString().split('T')[0]

  // Find the next upcoming event
  const upcoming = events?.find((e) => e.event_date >= today) || null

  // Group by Term
  const terms = ['Term 1', 'Term 2', 'Term 3']
  const grouped: Record<string, any[]> = {
    'Term 1': [],
    'Term 2': [],
    'Term 3': [],
  }

  events?.forEach((event) => {
    const term = event.term || 'Term 1'
    if (grouped[term]) {
      grouped[term].push(event)
    } else {
      grouped['Term 1'].push(event)
    }
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[var(--primary)]/10 mb-4">
          <CalendarDays className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Church Calendar</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Planned activities for the academic year
        </p>
      </div>

      {/* Next Upcoming Event */}
      {upcoming && (
        <div className="mb-14 rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-6">
          <p className="text-sm font-medium text-[var(--primary)] mb-2 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Next Upcoming Event
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            {upcoming.photo_url && (
              <img
                src={upcoming.photo_url}
                alt={upcoming.title}
                className="h-32 w-full sm:w-48 rounded-xl object-cover"
              />
            )}
            <div>
              <p className="text-sm text-[var(--muted)]">{formatDate(upcoming.event_date)}</p>
              <h2 className="text-2xl font-bold mt-1">{upcoming.title}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  {upcoming.term || 'Term 1'}
                </span>
                <span className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {upcoming.event_type}
                </span>
              </div>
              {upcoming.description && (
                <p className="mt-3 text-sm text-[var(--muted)]">{upcoming.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events by Term */}
      {!events || events.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-16">
          No activities planned yet. Check back soon.
        </p>
      ) : (
        <div className="space-y-14">
          {terms.map((term) => {
            const termEvents = grouped[term]
            if (termEvents.length === 0) return null

            return (
              <section key={term}>
                <h2 className="text-xl font-semibold text-[var(--primary)] mb-6 border-b border-[var(--border)] pb-2">
                  {term}
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  {termEvents.map((event) => {
                    const isPast = event.event_date < today
                    return (
                      <div
                        key={event.id}
                        className={`group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition hover:shadow-lg hover:-translate-y-1 ${
                          isPast ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="relative h-44 bg-gradient-to-br from-blue-600 to-indigo-700">
                          {event.photo_url ? (
                            <img
                              src={event.photo_url}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <CalendarDays className="h-14 w-14 text-white/40" />
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)] mb-2">
                            <span>{formatDate(event.event_date)}</span>
                            <span className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                              {event.event_type}
                            </span>
                            {isPast && (
                              <span className="text-xs text-red-500">Past</span>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold group-hover:text-[var(--primary)] transition">
                            {event.title}
                          </h3>

                          {event.description && (
                            <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}