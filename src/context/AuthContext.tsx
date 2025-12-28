import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { Session as SupabaseSession } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: SupabaseSession | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  signup: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  verifyOTP: (email: string, token: string, newPassword: string) => Promise<{ error: string | null }>
  sendOTP: (email: string) => Promise<{ error: string | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)

        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes (e.g., on login, logout, refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Auth state changed:', event, session?.user?.id)

      try {
        setSession(session)

        if (session?.user) {
          // For subsequent logins, we need to manage loading state
          setIsLoading(true)
          console.log('[Auth] Session exists, fetching profile for user:', session.user.id)
          await fetchUserProfile(session.user.id)
        } else {
          // User logged out
          console.log('[Auth] No session, clearing user')
          setUser(null)
        }
      } catch (error) {
        // Log detailed error info instead of [object Object]
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorName = error instanceof Error ? error.name : 'Unknown'

        console.error('[Auth] Error in onAuthStateChange handler:', {
          errorName,
          message: errorMessage,
          type: typeof error,
        })

        if (error instanceof Error) {
          console.error('[Auth] Stack trace:', error.stack)
        }

        setUser(null)
      } finally {
        // ALWAYS exit loading state - this prevents infinite "Logging in..." loop
        console.log('[Auth] Setting isLoading to false')
        setIsLoading(false)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('[Auth] Fetching profile for user:', userId)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      // Handle RLS or permission errors explicitly
      if (error) {
        const errorCode = error?.code || 'UNKNOWN'
        const errorMessage = error?.message || 'Unknown error'
        const errorStatus = error?.status || 'UNKNOWN'

        console.warn('[Auth] Error fetching user profile:', {
          code: errorCode,
          message: errorMessage,
          status: errorStatus,
          details: error?.details,
          hint: error?.hint,
        })

        if (errorCode === 'PGRST116') {
          // No row found - user exists in auth but not in users table
          // This can happen if profile creation during signup failed
          console.warn('[Auth] User profile not found in database (PGRST116). User may not have completed setup.')
          setUser(null)
          return
        }
        if (errorCode === '42501') {
          // RLS policy denial
          console.error('[Auth] RLS Policy Denied (42501): Cannot fetch user profile. Check RLS policies on users table.')
          setUser(null)
          return
        }
        // Any other error - log and don't crash
        console.error('[Auth] Unexpected error fetching profile. Code:', errorCode, 'Message:', errorMessage)
        setUser(null)
        return
      }

      if (!data) {
        console.warn('[Auth] Profile fetch returned null data', { userId })
        setUser(null)
        return
      }

      console.log('[Auth] Profile fetched successfully:', { userId, role: data.role })
      setUser(data as User)
    } catch (error) {
      // Better error logging
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorName = error instanceof Error ? error.name : 'Unknown'

      console.error('[Auth] Exception while fetching user profile:', {
        errorName,
        message: errorMessage,
        type: typeof error,
      })

      if (error instanceof Error) {
        console.error('[Auth] Error stack:', error.stack)
      }

      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('[Auth] Login attempt for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        const errorMessage = error?.message || 'Unknown error'
        console.error('[Auth] Login failed:', {
          message: errorMessage,
          code: (error as any)?.code,
          status: (error as any)?.status,
        })
        return { error: errorMessage }
      }

      if (!data.session?.user) {
        console.error('[Auth] Login succeeded but no session/user returned')
        return { error: 'Login succeeded but session was not created' }
      }

      console.log('[Auth] Login successful, session created:', data.session.user.id)

      // The onAuthStateChange listener will handle fetching the user profile
      // This ensures the user data is populated after successful login
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('[Auth] Unexpected error during login:', {
        message: errorMessage,
        fullError: error,
      })
      return { error: 'An unexpected error occurred' }
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) return { error: authError.message }

      if (!authData.user) return { error: 'Failed to create user' }

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        fullName,
        role: 'user',
        isActive: true,
        canWriteTestimonial: false, // Admin must enable
      })

      if (profileError) return { error: profileError.message }

      return { error: null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      console.log('[Auth] Logging out')

      await supabase.auth.signOut()

      // Clear auth state explicitly
      setUser(null)
      setSession(null)
      setIsLoading(false)

      console.log('[Auth] Logout successful')
    } catch (error) {
      console.error('[Auth] Error logging out:', error)
      // Even if logout fails, clear the state
      setUser(null)
      setSession(null)
      setIsLoading(false)
    }
  }

  const sendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) return { error: error.message }
      return { error: null }
    } catch (error) {
      return { error: 'Failed to send OTP' }
    }
  }

  const verifyOTP = async (email: string, token: string, newPassword: string) => {
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      })

      if (verifyError) return { error: verifyError.message }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) return { error: updateError.message }

      return { error: null }
    } catch (error) {
      return { error: 'Failed to verify OTP' }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) return { error: error.message }
      return { error: null }
    } catch (error) {
      return { error: 'Failed to reset password' }
    }
  }

  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user.id)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    resetPassword,
    verifyOTP,
    sendOTP,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * Get session user data - useful for cases where profile is still loading
 */
export function getSessionUser(session: SupabaseSession | null) {
  if (!session?.user?.email) return null

  // Extract name from email or use email as fallback
  const emailParts = session.user.email.split('@')[0].split('.')
  const firstName = emailParts[0]?.charAt(0).toUpperCase() + emailParts[0]?.slice(1) || ''
  const lastName = emailParts[1]?.charAt(0).toUpperCase() + emailParts[1]?.slice(1) || ''
  const fullName = (firstName + ' ' + lastName).trim() || session.user.email

  return {
    id: session.user.id,
    email: session.user.email,
    fullName: fullName,
  }
}
