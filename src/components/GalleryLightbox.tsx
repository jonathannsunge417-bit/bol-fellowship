'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type GalleryItem = {
  id: string
  photo_url: string
  title?: string
  date_posted?: string
}

export default function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--secondary)] text-left"
          >
            <img
              src={item.photo_url}
              alt={item.title || 'Gallery photo'}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition group-hover:translate-y-0">
              <p className="text-sm font-medium text-white line-clamp-1">
                {item.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.photo_url}
              alt={selected.title || 'Gallery photo'}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            {selected.title && (
              <p className="mt-3 text-center text-white text-lg">
                {selected.title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}