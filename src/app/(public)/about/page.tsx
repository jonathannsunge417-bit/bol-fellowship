import { createClient } from '@/lib/supabase/server'
import { Church, Users, Clock, MapPin } from 'lucide-react'

export const revalidate = 30

const LEADERSHIP_POSITIONS = [
  'Chairperson',
  'Vice Chairperson',
  'Secretary General',
  'Vice Secretary General',
  'Prayer Secretary',
  'Vice Prayer Secretary',
  'Evangelism Secretary and Mission Director',
  'Vice Evangelism Secretary and Mission Director',
  'Media Director',
  'Vice Media Director',
  'Music Director',
  'Vice Music Director',
  'Hospitality Director',
  'Vice Hospitality Director',
  'Disciplinary Director',
  'Vice Disciplinary Director',
  'Discipleship Director',
  'Vice Discipleship Director',
  'Organising Director',
  'Vice Organising Director',
  'Usher Director',
  'Vice Usher Director',
]

export default async function AboutPage() {
  const supabase = await createClient()

  // Leadership
  const { data: leaders } = await supabase
    .from('public_leadership')
    .select('full_name, position, photo_url')

  const leadershipMap: Record<string, { name: string; photo?: string | null }> = {}
  leaders?.forEach((leader) => {
    leadershipMap[leader.position] = {
      name: leader.full_name,
      photo: leader.photo_url,
    }
  })

  // Meeting Times & Location from settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  settingsData?.forEach((row) => {
    settings[row.key] = row.value
  })

  const weeklyFellowship = settings.weekly_fellowship || 'Sundays · Time to be confirmed'
  const prayerMeetings = settings.prayer_meetings || 'Details announced regularly'
  const location = settings.location || 'Kapasa Makasa University Campus, Zambia'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About Us</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Bread of Life Campus Fellowship at Kapasa Makasa University
        </p>
      </div>

      {/* Our Story */}
      <section className="mt-16">
        <div className="flex items-center gap-2 mb-4">
          <Church className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="text-2xl font-semibold">Our Story</h2>
        </div>
        <div className="prose max-w-none text-[var(--muted)] space-y-4">
          <p>
            Bread of Life Campus Fellowship was established to provide a spiritual home for students
            at Kapasa Makasa University. We exist to help students grow in their relationship with
            Jesus Christ, build lasting friendships, and equip them for a lifetime of faith and service.
          </p>
          <p>
            Through weekly fellowships, prayer meetings, evangelism, discipleship, and community service,
            we seek to be the hands and feet of Jesus on campus.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:shadow-md">
          <h3 className="text-xl font-semibold text-[var(--primary)]">Our Vision</h3>
          <p className="mt-3 text-[var(--muted)]">
            A vibrant campus community transformed by the Gospel and impacting the nation for Christ.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:shadow-md">
          <h3 className="text-xl font-semibold text-[var(--primary)]">Our Mission</h3>
          <p className="mt-3 text-[var(--muted)]">
            To make disciples of Jesus Christ among university students through fellowship,
            biblical teaching, prayer, evangelism, and service.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="mt-16">
        <div className="flex items-center gap-2 mb-8">
          <Users className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="text-2xl font-semibold">Leadership</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LEADERSHIP_POSITIONS.map((position) => {
            const leader = leadershipMap[position]

            return (
              <div
                key={position}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[var(--primary)]/40"
              >
                <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--border)] transition-all duration-300 group-hover:border-[var(--primary)] group-hover:scale-105">
                  {leader?.photo ? (
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm">
                      No Photo
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium text-[var(--primary)]">{position}</p>
                <p className="mt-1 text-lg font-semibold">
                  {leader?.name || 'To be updated'}
                </p>
              </div>
            )
          })}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Leadership details are automatically updated from the Members section of the dashboard.
        </p>
      </section>

      {/* Meeting Times & Location - Now Dynamic */}
      <section className="mt-16 rounded-xl border border-[var(--border)] bg-[var(--secondary)]/40 p-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="text-2xl font-semibold">Meeting Times & Location</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Weekly Fellowship</h3>
            <p className="mt-1 text-[var(--muted)]">{weeklyFellowship}</p>
          </div>
          <div>
            <h3 className="font-medium">Prayer Meetings</h3>
            <p className="mt-1 text-[var(--muted)]">{prayerMeetings}</p>
          </div>
          <div className="flex items-start gap-2 md:col-span-2">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-[var(--primary)]" />
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="mt-1 text-[var(--muted)]">{location}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}