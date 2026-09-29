import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Video, Calendar, User } from 'lucide-react'

export const revalidate = 60

function getYouTubeId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1)
    }
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

export default async function VideosPage() {
  const supabase = await createClient()
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('video_date', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[var(--primary)]/10 mb-4">
          <Video className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Videos</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Watch messages from Bread of Life Campus Fellowship
        </p>
      </div>

      {!videos || videos.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-16">
          No videos available yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const videoId = getYouTubeId(video.youtube_url)

            return (
              <article
                key={video.id}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm transition hover:shadow-lg hover:-translate-y-1"
              >
                {/* YouTube Thumbnail / Embed */}
                <div className="relative aspect-video bg-black">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/50">
                      <Video className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {video.video_date && (
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(video.video_date)}
                    </div>
                  )}

                  <h2 className="text-xl font-semibold group-hover:text-[var(--primary)] transition">
                    {video.title}
                  </h2>

                  {video.preacher && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                      <User className="h-4 w-4" />
                      {video.preacher}
                    </div>
                  )}

                  {video.description && (
                    <p className="mt-3 text-sm text-[var(--muted)] line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}