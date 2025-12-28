import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Copy, CheckCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSetup() {
  const { user, session, isAuthenticated, refreshUser, isLoading: isAuthLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [attemptedSetup, setAttemptedSetup] = useState(false)

  // If user is already admin, redirect
  useEffect(() => {
    if (!isAuthLoading && user?.role === 'admin') {
      window.location.href = '/admin-dashboard'
    }
  }, [user, isAuthLoading])

  const handleCopySQL = () => {
    if (!session?.user?.id) return

    const sql = `UPDATE public.users SET role = 'admin', canWriteTestimonial = true WHERE id = '${session.user.id}';`
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('SQL copied to clipboard!')
  }

  const handleCreateProfileManually = async () => {
    if (!session?.user?.id || !session?.user?.email) return

    setIsLoading(true)
    try {
      // Try to create the user profile in the users table
      const { error } = await supabase.from('users').insert({
        id: session.user.id,
        email: session.user.email,
        fullName: fullName || 'Admin User',
        role: 'admin',
        isActive: true,
        canWriteTestimonial: true,
      })

      if (error) {
        if (error.code === '23505') {
          // User already exists, just update it
          const { error: updateError } = await supabase
            .from('users')
            .update({
              role: 'admin',
              canWriteTestimonial: true,
              fullName: fullName || 'Admin User',
            })
            .eq('id', session.user.id)

          if (updateError) throw updateError
          toast.success('Admin profile updated!')
        } else {
          throw error
        }
      } else {
        toast.success('Admin profile created!')
      }

      // Refresh user data
      await refreshUser()
      setAttemptedSetup(true)
    } catch (error) {
      console.error('Error creating admin profile:', error)
      toast.error('Failed to create admin profile. See Supabase guide below.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Not Logged In</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p>Please log in first to set up your admin account.</p>
            <Button
              onClick={() => (window.location.href = '/')}
              className="mt-4"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Admin Profile Not Found</h3>
                <p className="text-sm text-orange-800">
                  You're logged in as <strong>{session.user.email}</strong>, but your admin profile hasn't been set up yet. 
                  Let's fix that!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option 1: Auto Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Option 1: Auto Setup (Easiest)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              I can try to automatically create your admin profile. This works if your Supabase RLS policies allow it.
            </p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Full Name (Optional)
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., John Doe"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleCreateProfileManually}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating Admin Profile...
                </>
              ) : (
                'Create Admin Profile'
              )}
            </Button>

            {attemptedSetup && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                ✓ Admin profile created! Please wait a moment, then we'll redirect you to the dashboard...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Option 2: Manual Setup via Supabase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">2️⃣</span>
              Option 2: Manual Setup (If Option 1 Fails)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Follow these steps if the auto setup doesn't work:
            </p>

            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">1.</span>
                <span>
                  Go to your <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">2.</span>
                <span>Click <strong>New Query</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">3.</span>
                <span>Copy the SQL query below and paste it</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-600 flex-shrink-0">4.</span>
                <span>Click <strong>Run</strong> button</span>
              </li>
            </ol>

            <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
              <div className="flex items-start justify-between gap-3 mb-2">
                <code className="text-xs text-gray-800 break-all">
                  UPDATE public.users SET role = 'admin', canWriteTestimonial = true WHERE id = '{session.user.id}';
                </code>
                <button
                  onClick={handleCopySQL}
                  className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy SQL"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-600">
                {copied ? '✓ Copied!' : 'Click to copy this SQL query'}
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <strong>ℹ️ Note:</strong> After running the SQL query in Supabase, refresh this page. You should be automatically redirected to your admin dashboard.
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded font-mono">
            <p><strong>Logged In:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
            <p><strong>User ID:</strong> {session?.user?.id}</p>
            <p><strong>Role:</strong> {user?.role || 'Not found in database'}</p>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => (window.location.href = '/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}
