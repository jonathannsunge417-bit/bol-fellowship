import { createClient } from '@/lib/supabase/server'
import { formatDate, isUpcoming } from '@/lib/utils'
import { Calendar, MapPin, Clock } from 'lucide-react'

export const revalidate = 60

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  const upcoming = events?.filter((e) => isUpcoming(e.event_date)) || []
  const past = events?.filter((e) => !isUpcoming(e.event_date)) || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Events</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Stay updated with our fellowship activities
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-[var(--primary)]" />
          Upcoming
        </h2>

        {upcoming.length === 0 ? (
          <p className="text-[var(--muted)]">No upcoming events at the moment.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:shadow-xl hover:-translate-y-1"
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
                    <Calendar className="h-12 w-12 text-white/60" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-lg font-semibold group-hover:text-[var(--primary)] transition">
                    {event.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.event_date)}
                    </div>
                    {event.event_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {event.event_time.slice(0, 5)}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="mt-3 text-sm text-[var(--muted)] line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-[var(--muted)]">Past Events</h2>

        {past.length === 0 ? (
          <p className="text-[var(--muted)]">No past events yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] opacity-90 transition hover:opacity-100 hover:shadow-lg"
              >
                {event.photo_url ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={event.photo_url}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-slate-700 flex items-center justify-center">
                    <Calendar className="h-10 w-10 text-white/40" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatDate(event.event_date)}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}