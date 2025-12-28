import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // For admin routes, check isAdmin flag
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // For user routes, just check if authenticated (user object may still be loading from DB)
  if (requiredRole === 'user' && !isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
