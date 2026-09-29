import { createClient } from '@/lib/supabase/server'
import { Image as ImageIcon } from 'lucide-react'
import GalleryLightbox from '@/components/GalleryLightbox'

export const revalidate = 60

export default async function GalleryPage() {
  let items: any[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('date_posted', { ascending: false })
    items = data || []
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[var(--primary)]/10 mb-4">
          <ImageIcon className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Gallery</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Moments from our fellowship life
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-[var(--muted)]">
          Gallery is empty. Check back soon.
        </p>
      ) : (
        <GalleryLightbox items={items} />
      )}
    </div>
  )
}