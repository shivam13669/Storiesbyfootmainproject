import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Hook that automatically redirects users to their dashboard after login
 * Should be used on pages where unauthenticated users land (like home page)
 */
export function useAuthRedirect() {
  const navigate = useNavigate()
  const { user, isAdmin, isLoading } = useAuth()

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (isLoading) return

    // If user is authenticated and profile is loaded, redirect to dashboard
    if (user) {
      if (isAdmin) {
        console.log('[useAuthRedirect] Redirecting admin to admin dashboard')
        navigate('/admin-dashboard', { replace: true })
      } else {
        console.log('[useAuthRedirect] Redirecting user to user dashboard')
        navigate('/user-dashboard', { replace: true })
      }
    }
  }, [user, isAdmin, isLoading, navigate])
}
