import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function isUpcoming(date: string) {
  const eventDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate >= today
}
