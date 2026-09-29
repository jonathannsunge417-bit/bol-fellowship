'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Slide = {
  id: string
  title?: string | null
  subtitle?: string | null
  image_url: string
  link_url?: string | null
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides || slides.length === 0) {
    return (
      <div className="relative h-72 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center">
        <p className="text-white/70 text-lg">No slides yet</p>
      </div>
    )
  }

  const slide = slides[current]

  return (
    <div className="relative h-72 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl">
      {/* Image */}
      <img
        src={slide.image_url}
        alt={slide.title || 'Slide'}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Text */}
      {(slide.title || slide.subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          {slide.title && (
            <h2 className="text-2xl sm:text-3xl font-bold">{slide.title}</h2>
          )}
          {slide.subtitle && (
            <p className="mt-2 text-sm sm:text-base text-white/90 max-w-xl">
              {slide.subtitle}
            </p>
          )}
          {slide.link_url && (
            <a
              href={slide.link_url}
              className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50 transition"
            >
              Learn More
            </a>
          )}
        </div>
      )}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}