import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth()

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to home')
    return <Navigate to="/" replace />
  }

  // For admin routes, check isAdmin flag
  if (requiredRole === 'admin' && !isAdmin) {
    console.log('[ProtectedRoute] Not admin, redirecting to home')
    return <Navigate to="/" replace />
  }

  // For user routes, proceed even if user profile is still loading
  // The UserDashboard component will handle missing profile
  if (requiredRole === 'user' && !isAuthenticated) {
    console.log('[ProtectedRoute] User route but not authenticated')
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
