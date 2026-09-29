'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    weekly_fellowship: '',
    prayer_meetings: '',
    location: '',
    our_story: '',
    our_vision: '',
    our_mission: '',
    our_values: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*')
      if (data) {
        const map: any = {}
        data.forEach((row) => {
          map[row.key] = row.value
        })
        setSettings({
          weekly_fellowship: map.weekly_fellowship || '',
          prayer_meetings: map.prayer_meetings || '',
          location: map.location || '',
          our_story: map.our_story || '',
          our_vision: map.our_vision || '',
          our_mission: map.our_mission || '',
          our_values: map.our_values || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const updates = [
      { key: 'weekly_fellowship', value: settings.weekly_fellowship },
      { key: 'prayer_meetings', value: settings.prayer_meetings },
      { key: 'location', value: settings.location },
      { key: 'our_story', value: settings.our_story },
      { key: 'our_vision', value: settings.our_vision },
      { key: 'our_mission', value: settings.our_mission },
      { key: 'our_values', value: settings.our_values },
    ]

    for (const item of updates) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: item.key, value: item.value }, { onConflict: 'key' })

      if (error) {
        setMessage('Error: ' + error.message)
        setSaving(false)
        return
      }
    }

    setMessage('Settings saved successfully!')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Control the content shown on the public website
      </p>

      <form onSubmit={handleSave} className="mt-8 max-w-2xl space-y-8">
        {/* Meeting Times */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-[var(--border)] pb-2">
            Meeting Times & Location
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">Weekly Fellowship</label>
            <input
              type="text"
              value={settings.weekly_fellowship}
              onChange={(e) => setSettings({ ...settings, weekly_fellowship: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prayer Meetings</label>
            <input
              type="text"
              value={settings.prayer_meetings}
              onChange={(e) => setSettings({ ...settings, prayer_meetings: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* About Content */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-[var(--border)] pb-2">
            About Content
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">Our Story</label>
            <textarea
              rows={5}
              value={settings.our_story}
              onChange={(e) => setSettings({ ...settings, our_story: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Our Vision</label>
            <textarea
              rows={3}
              value={settings.our_vision}
              onChange={(e) => setSettings({ ...settings, our_vision: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Our Mission</label>
            <textarea
              rows={3}
              value={settings.our_mission}
              onChange={(e) => setSettings({ ...settings, our_mission: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Our Values</label>
            <textarea
              rows={2}
              value={settings.our_values}
              onChange={(e) => setSettings({ ...settings, our_values: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </form>
    </div>
  )
}