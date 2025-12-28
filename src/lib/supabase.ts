import { createClient } from '@supabase/supabase-js'

// Load credentials from environment variables (never hardcode!)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL in environment variables')
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY in environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type User = {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'user'
  isActive: boolean
  canWriteTestimonial: boolean
  createdAt: string
  updatedAt: string
}

export type Testimonial = {
  id: string
  userId: string
  name: string
  role: string
  location: string
  trip: string
  quote: string
  highlight: string
  rating: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type Session = {
  user: {
    id: string
    email: string
  }
  access_token: string
  refresh_token: string
}
