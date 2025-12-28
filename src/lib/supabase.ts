import { createClient } from '@supabase/supabase-js'

// Load credentials from environment variables (never hardcode!)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log environment variable status for debugging
console.log('[Supabase] Environment variables check:')
console.log('[Supabase] VITE_SUPABASE_URL:', SUPABASE_URL)
console.log('[Supabase] VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '***SET***' : '***NOT SET***')

// Validate that environment variables are set
if (!SUPABASE_URL) {
  console.error('[Supabase] Missing VITE_SUPABASE_URL - this will cause all Supabase operations to fail')
  throw new Error('Missing VITE_SUPABASE_URL in environment variables')
}
if (!SUPABASE_ANON_KEY) {
  console.error('[Supabase] Missing VITE_SUPABASE_ANON_KEY - this will cause all Supabase operations to fail')
  throw new Error('Missing VITE_SUPABASE_ANON_KEY in environment variables')
}

console.log('[Supabase] Creating Supabase client with URL:', SUPABASE_URL)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
console.log('[Supabase] Client created successfully')

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
