export type Member = {
  id: string
  full_name: string
  position: string
  hostel_name: string
  room_number: string
  year_of_study: string
  contact: string
  home_address: string
  email: string
  created_at?: string
  updated_at?: string
}

export type Alumni = {
  id: string
  full_name: string
  graduation_year: number
  position_held: string
  contact: string
  email: string
  current_location?: string | null
  created_at?: string
  updated_at?: string
}

export type Asset = {
  id: string
  asset_name: string
  description: string
  quantity: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  date_acquired: string
  created_at?: string
  updated_at?: string
}

export type Event = {
  id: string
  title: string
  event_date: string
  event_time: string
  location: string
  description: string
  photo_url?: string | null
  created_at?: string
  updated_at?: string
}

export type GalleryItem = {
  id: string
  title: string
  photo_url: string
  date_posted: string
  created_at?: string
  updated_at?: string
}

export type Update = {
  id: string
  title: string
  content: string
  date_posted: string
  created_at?: string
  updated_at?: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  created_at?: string
  is_read?: boolean
}

export const POSITIONS = [
  'Chairperson',
  'Vice Chairperson',
  'Prayer Secretary',
  'Vice Prayer Secretary',
  'Secretary General',
  'Vice Secretary General',
  'Treasurer', 
  'Vice Treasurer',
  'Evangelism Secretary and Mission Director',
  'Vice Evangelism Secretary and Mission Director',
  'Media Director',
  'Vice Media Director',
  'Music Director',
  'Vice Music Director',
  'Hospitality Director',
  'Vice Hospitality Director',
  'Disciplinary Director',
  'Vice Disciplinary Director',
  'Discipleship Director',
  'Vice Discipleship Director',
  'Organising Director',
  'Vice Organising Director',
  'Usher Director',
  'Vice Usher Director',
  'Praise Member',
  'Member',
] as const

export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'] as const

export const YEARS_OF_STUDY = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  'Postgraduate',
  'Non-Student',
] as const
