'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, MapPin, Send, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      // 1. Save to Supabase
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({ name, email, message })

      if (dbError) throw new Error(dbError.message)

      // 2. Send email via Web3Forms
      const formData = new FormData()
      formData.append('access_key', 'b798027a-385f-4335-b5f6-f4d43ddf5e38')
      formData.append('name', name)
      formData.append('email', email)
      formData.append('message', message)
      formData.append('subject', `New message from BOL CF website - ${name}`)
      formData.append('from_name', 'Bread of Life Campus Fellowship')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Email failed to send')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center">Contact Us</h1>
      <p className="mt-2 text-center text-[var(--muted)]">We would love to hear from you.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-[var(--primary)]" />
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-[var(--muted)]">Kapasa Makasa University, Zambia</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-[var(--primary)]" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-[var(--muted)]">breadoflifecampusfellowship@gmail.com</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-green-600">
              Message sent successfully! We will get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}