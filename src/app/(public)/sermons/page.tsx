import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Music, Calendar, User } from 'lucide-react'

export const revalidate = 60

export default async function SermonsPage() {
  const supabase = await createClient()
  const { data: sermons } = await supabase
    .from('sermons')
    .select('*')
    .order('sermon_date', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[var(--primary)]/10 mb-4">
          <Music className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Sermons</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Listen to messages from Bread of Life Campus Fellowship
        </p>
      </div>

      {!sermons || sermons.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-16">
          No sermons available yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <article
              key={sermon.id}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm transition hover:shadow-lg hover:-translate-y-1"
            >
              {/* Preacher Photo */}
              <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700">
                {sermon.photo_url ? (
                  <img
                    src={sermon.photo_url}
                    alt={sermon.preacher || sermon.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music className="h-16 w-16 text-white/40" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(sermon.sermon_date)}
                </div>

                <h2 className="text-xl font-semibold group-hover:text-[var(--primary)] transition">
                  {sermon.title}
                </h2>

                {sermon.preacher && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <User className="h-4 w-4" />
                    {sermon.preacher}
                  </div>
                )}

                {sermon.description && (
                  <p className="mt-3 text-sm text-[var(--muted)] line-clamp-2">
                    {sermon.description}
                  </p>
                )}

                <div className="mt-5">
                  <audio controls className="w-full">
                    <source src={sermon.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}