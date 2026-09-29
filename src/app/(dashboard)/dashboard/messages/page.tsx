'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Trash2, CheckCircle, Circle, Copy, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function markAsRead(id: string) {
    await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    setSelected(null)
    load()
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-[var(--muted)]">
            {messages.length} total messages
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : messages.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">No messages yet.</p>
          ) : (
            <div className="divide-y divide-[var(--border)] max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelected(msg)
                    if (!msg.is_read) markAsRead(msg.id)
                  }}
                  className={`w-full text-left px-4 py-4 hover:bg-[var(--secondary)] transition ${
                    selected?.id === msg.id ? 'bg-[var(--secondary)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {msg.is_read ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--primary)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${!msg.is_read ? 'font-semibold' : ''}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-[var(--muted)] truncate">{msg.email}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 min-h-[400px]">
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selected.name}</h2>
                  <p className="text-sm text-[var(--muted)]">{selected.email}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {formatDate(selected.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="rounded p-2 text-[var(--muted)] hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-[var(--foreground)]">
                  {selected.message}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => copyEmail(selected.email)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--secondary)]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Email
                    </>
                  )}
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selected.email}&su=Re: Your message to Bread of Life Campus Fellowship`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  <Mail className="h-4 w-4" />
                  Reply in Gmail
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--muted)]">
              <Mail className="h-12 w-12 mb-4 opacity-40" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}