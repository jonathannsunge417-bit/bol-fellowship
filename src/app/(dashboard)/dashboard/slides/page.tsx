'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react'

const emptyForm = {
  title: '',
  subtitle: '',
  image_url: '',
  link_url: '',
  sort_order: 0,
  is_active: true,
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
    setSlides(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setPhotoFile(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(slide: any) {
    setEditing(slide)
    setForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '',
      link_url: slide.link_url || '',
      sort_order: slide.sort_order || 0,
      is_active: slide.is_active ?? true,
    })
    setPhotoFile(null)
    setError('')
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    let image_url = form.image_url

    if (photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('hero-slides')
        .upload(fileName, photoFile)

      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('hero-slides')
        .getPublicUrl(fileName)
      image_url = urlData.publicUrl
    }

    if (!image_url) {
      setError('Please upload an image')
      setSaving(false)
      return
    }

    const payload = { ...form, image_url }

    if (editing) {
      const { error } = await supabase
        .from('hero_slides')
        .update(payload)
        .eq('id', editing.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('hero_slides').insert(payload)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setShowForm(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this slide?')) return
    await supabase.from('hero_slides').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Home Slider</h1>
          <p className="text-sm text-[var(--muted)]">{slides.length} slides</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Slide
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : slides.length === 0 ? (
          <p className="py-12 text-center text-[var(--muted)]">No slides yet. Add your first slide.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              >
                <div className="relative h-40 bg-slate-200 dark:bg-slate-700">
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title || 'Slide'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-slate-400" />
                    </div>
                  )}
                  {!slide.is_active && (
                    <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-0.5 text-xs text-white">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium truncate">{slide.title || 'No title'}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Order: {slide.sort_order}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => openEdit(slide)}
                      className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="rounded p-1.5 text-[var(--muted)] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded p-1 hover:bg-[var(--secondary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Optional title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Optional short text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Image {editing ? '(leave empty to keep current)' : '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
                {form.image_url && !photoFile && (
                  <img
                    src={form.image_url}
                    alt="Current"
                    className="mt-2 h-32 w-full rounded object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
                <input
                  type="url"
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                      className="rounded"
                    />
                    Active (show on website)
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}