'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { POSITIONS, type Alumni } from '@/types'
import { Plus, Search, Pencil, Trash2, X, Loader2, FileDown } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const emptyForm = {
  full_name: '',
  graduation_year: new Date().getFullYear(),
  position_held: 'Members',
  contact: '',
  email: '',
  current_location: '',
  photo_url: '',
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')
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
      .from('alumni')
      .select('*')
      .order('graduation_year', { ascending: false })
    setAlumni(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = alumni.filter((a) => {
    const matchSearch =
      !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    const matchYear = !yearFilter || a.graduation_year.toString() === yearFilter
    return matchSearch && matchYear
  })

  async function downloadPDF() {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    async function loadImage(src: string): Promise<string | null> {
      try {
        return await new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Canvas not supported'))
              return
            }
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          }
          img.onerror = () => reject(new Error(`Failed to load ${src}`))
          img.src = src
        })
      } catch (err) {
        console.log(err)
        return null
      }
    }

    const churchLogo = await loadImage('/logo.png')
    const kmuLogo = await loadImage('/kmu-logo.png')

    if (churchLogo) {
      doc.addImage(churchLogo, 'PNG', 14, 8, 18, 18)
    }
    if (kmuLogo) {
      doc.addImage(kmuLogo, 'PNG', pageWidth - 32, 8, 18, 18)
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text('Bread of Life Campus Fellowship', pageWidth / 2, 15, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Kapasa Makasa University', pageWidth / 2, 22, { align: 'center' })

    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Alumni Report', pageWidth / 2, 30, { align: 'center' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' })
    doc.text(`Total alumni: ${filtered.length}`, pageWidth / 2, 41, { align: 'center' })

    autoTable(doc, {
      startY: 48,
      head: [['#', 'Full Name', 'Graduation Year', 'Position Held', 'Contact', 'Email', 'Location']],
      body: filtered.map((a, i) => [
        i + 1,
        a.full_name,
        a.graduation_year,
        a.position_held,
        a.contact,
        a.email,
        a.current_location || '—',
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    })

    doc.save(`BOL-Alumni-Report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setPhotoFile(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(a: any) {
    setEditing(a)
    setForm({
      full_name: a.full_name,
      graduation_year: a.graduation_year,
      position_held: a.position_held,
      contact: a.contact,
      email: a.email,
      current_location: a.current_location || '',
      photo_url: a.photo_url || '',
    })
    setPhotoFile(null)
    setError('')
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    let photo_url = form.photo_url

    if (photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('alumni-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        setError('Photo upload failed: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('alumni-photos')
        .getPublicUrl(fileName)
      photo_url = urlData.publicUrl
    }

    const payload = { ...form, photo_url }

    if (editing) {
      const { error } = await supabase
        .from('alumni')
        .update(payload)
        .eq('id', editing.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('alumni').insert(payload)
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
    if (!confirm('Delete this alumni record?')) return
    await supabase.from('alumni').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alumni</h1>
          <p className="text-sm text-[var(--muted)]">{alumni.length} total alumni</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--secondary)]"
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Alumni
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <input
          type="number"
          placeholder="Filter by year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-white dark:bg-slate-900 px-3 py-2 text-sm w-36"
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-white dark:bg-slate-900">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-[var(--muted)]">No alumni found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Full Name</th>
                <th className="px-4 py-3 font-medium">Graduation Year</th>
                <th className="px-4 py-3 font-medium">Position Held</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    {a.photo_url ? (
                      <img
                        src={a.photo_url}
                        alt={a.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500">
                        No photo
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{a.full_name}</td>
                  <td className="px-4 py-3">{a.graduation_year}</td>
                  <td className="px-4 py-3">{a.position_held}</td>
                  <td className="px-4 py-3">{a.contact}</td>
                  <td className="px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="rounded p-1.5 text-[var(--muted)] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit Alumni' : 'Add New Alumni'}
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
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Graduation Year *</label>
                <input
                  type="number"
                  required
                  value={form.graduation_year}
                  onChange={(e) =>
                    setForm({ ...form, graduation_year: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position Held *</label>
                <select
                  required
                  value={form.position_held}
                  onChange={(e) => setForm({ ...form, position_held: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact *</label>
                <input
                  required
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Location</label>
                <input
                  value={form.current_location}
                  onChange={(e) => setForm({ ...form, current_location: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
                {form.photo_url && !photoFile && (
                  <img
                    src={form.photo_url}
                    alt="Current"
                    className="mt-2 h-20 w-20 rounded-full object-cover"
                  />
                )}
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