'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CONDITIONS, type Asset } from '@/types'
import { Plus, Search, Pencil, Trash2, X, Loader2, FileDown } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type FormState = {
  asset_name: string
  description: string
  quantity: number
  condition: string
  date_acquired: string
}

const emptyForm: FormState = {
  asset_name: '',
  description: '',
  quantity: 1,
  condition: 'Good',
  date_acquired: new Date().toISOString().split('T')[0],
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Asset | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('assets').select('*').order('asset_name')
    setAssets(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = assets.filter((a) => {
    const matchSearch = !search || a.asset_name.toLowerCase().includes(search.toLowerCase())
    const matchCond = !conditionFilter || a.condition === conditionFilter
    return matchSearch && matchCond
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
    doc.text('Assets Report', pageWidth / 2, 30, { align: 'center' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' })
    doc.text(`Total assets: ${filtered.length}`, pageWidth / 2, 41, { align: 'center' })

    autoTable(doc, {
      startY: 48,
      head: [['#', 'Asset Name', 'Description', 'Quantity', 'Condition', 'Date Acquired']],
      body: filtered.map((a, i) => [
        i + 1,
        a.asset_name,
        a.description,
        a.quantity,
        a.condition,
        a.date_acquired,
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    })

    doc.save(`BOL-Assets-Report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function openEdit(a: Asset) {
    setEditing(a)
    setForm({
      asset_name: a.asset_name,
      description: a.description,
      quantity: a.quantity,
      condition: a.condition,
      date_acquired: a.date_acquired,
    })
    setError('')
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (editing) {
      const { error } = await supabase.from('assets').update(form).eq('id', editing.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('assets').insert(form)
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
    if (!confirm('Delete this asset?')) return
    await supabase.from('assets').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assets</h1>
          <p className="text-sm text-[var(--muted)]">{assets.length} total assets</p>
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
            <Plus className="h-4 w-4" /> Add Asset
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by asset name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        >
          <option value="">All Conditions</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-white dark:bg-slate-900">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-[var(--muted)]">No assets found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">Asset Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Condition</th>
                <th className="px-4 py-3 font-medium">Date Acquired</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{a.asset_name}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{a.description}</td>
                  <td className="px-4 py-3">{a.quantity}</td>
                  <td className="px-4 py-3">{a.condition}</td>
                  <td className="px-4 py-3">{a.date_acquired}</td>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit Asset' : 'Add New Asset'}
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
                <label className="block text-sm font-medium mb-1">Asset Name *</label>
                <input
                  required
                  value={form.asset_name}
                  onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition *</label>
                  <select
                    required
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Acquired *</label>
                <input
                  type="date"
                  required
                  value={form.date_acquired}
                  onChange={(e) => setForm({ ...form, date_acquired: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
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