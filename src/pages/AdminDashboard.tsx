import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase, User, Testimonial } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2, CheckCircle, XCircle, Users, FileText, Plus, Edit2, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [deleteTestimonialId, setDeleteTestimonialId] = useState<string | null>(null)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading before checking role
    if (isAuthLoading) {
      return
    }

    if (!isAdmin) {
      window.location.href = '/'
      return
    }
    fetchData()
  }, [isAdmin, isAuthLoading])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false })

      if (usersError) throw usersError
      setUsers(usersData as User[])

      // Fetch all testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('createdAt', { ascending: false })

      if (testimonialsError) throw testimonialsError
      setTestimonials(testimonialsData as Testimonial[])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail || !newUserName || !newUserPassword) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsCreatingUser(true)

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (!authData.user) {
        toast.error('Failed to create user')
        return
      }

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: newUserEmail,
        fullName: newUserName,
        role: 'user',
        isActive: true,
        canWriteTestimonial: false,
      })

      if (profileError) {
        toast.error(profileError.message)
        return
      }

      toast.success('User created successfully!')
      setNewUserEmail('')
      setNewUserName('')
      setNewUserPassword('')
      await fetchData()
    } catch (error) {
      toast.error('An error occurred while creating the user')
    } finally {
      setIsCreatingUser(false)
    }
  }

  const toggleTestimonialPermission = async (userId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ canWriteTestimonial: !currentState })
        .eq('id', userId)

      if (error) throw error

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, canWriteTestimonial: !currentState } : u
        )
      )

      toast.success(
        !currentState
          ? 'User can now write testimonials'
          : 'User testimonial permission revoked'
      )
    } catch (error) {
      toast.error('Failed to update user permission')
    }
  }

  const suspendUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ isActive: false })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: false } : u)))
      toast.success('User suspended')
    } catch (error) {
      toast.error('Failed to suspend user')
    }
  }

  const deleteUser = async () => {
    if (!deleteUserId) return

    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', deleteUserId)

      if (profileError) throw profileError

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(deleteUserId)

      if (authError && !authError.message.includes('not found')) {
        throw authError
      }

      setUsers(users.filter((u) => u.id !== deleteUserId))
      setDeleteUserId(null)
      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete user')
    }
  }

  const publishTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ isPublished: true })
        .eq('id', testimonialId)

      if (error) throw error

      setTestimonials(
        testimonials.map((t) =>
          t.id === testimonialId ? { ...t, isPublished: true } : t
        )
      )
      toast.success('Testimonial published!')
    } catch (error) {
      toast.error('Failed to publish testimonial')
    }
  }

  const unpublishTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ isPublished: false })
        .eq('id', testimonialId)

      if (error) throw error

      setTestimonials(
        testimonials.map((t) =>
          t.id === testimonialId ? { ...t, isPublished: false } : t
        )
      )
      toast.success('Testimonial unpublished')
    } catch (error) {
      toast.error('Failed to unpublish testimonial')
    }
  }

  const deleteTestimonial = async () => {
    if (!deleteTestimonialId) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', deleteTestimonialId)

      if (error) throw error

      setTestimonials(testimonials.filter((t) => t.id !== deleteTestimonialId))
      setDeleteTestimonialId(null)
      toast.success('Testimonial deleted')
    } catch (error) {
      toast.error('Failed to delete testimonial')
    }
  }

  // Show loading state while authenticating or fetching data
  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{isAuthLoading ? 'Loading authentication...' : 'Loading dashboard...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and testimonials</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Total Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {testimonials.length} ({testimonials.filter((t) => t.isPublished).length} published)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* Create User Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      disabled={isCreatingUser}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      disabled={isCreatingUser}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      disabled={isCreatingUser}
                    />
                  </div>
                  <Button type="submit" disabled={isCreatingUser}>
                    {isCreatingUser ? 'Creating...' : 'Create User'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
              {users.map((u) => (
                <Card key={u.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{u.fullName}</p>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                            {u.role}
                          </Badge>
                          <Badge variant={u.isActive ? 'default' : 'destructive'}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </Badge>
                          <Badge
                            variant={u.canWriteTestimonial ? 'default' : 'outline'}
                            className={u.canWriteTestimonial ? 'bg-green-100 text-green-800' : ''}
                          >
                            {u.canWriteTestimonial ? '✓ Can Write' : 'Cannot Write'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={u.canWriteTestimonial ? 'default' : 'outline'}
                          size="sm"
                          onClick={() =>
                            toggleTestimonialPermission(u.id, u.canWriteTestimonial)
                          }
                        >
                          {u.canWriteTestimonial ? '✓ Enabled' : 'Enable Writing'}
                        </Button>

                        {u.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => suspendUser(u.id)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            Suspend
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteUserId(u.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="space-y-4">
              {testimonials.map((testimonial) => {
                const author = users.find((u) => u.id === testimonial.userId)
                return (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-lg">{testimonial.name}</p>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                              <p className="text-xs text-gray-500">
                                By: {author?.fullName || 'Unknown'}
                              </p>
                            </div>
                            <Badge
                              variant={testimonial.isPublished ? 'default' : 'outline'}
                              className={
                                testimonial.isPublished ? 'bg-green-100 text-green-800' : ''
                              }
                            >
                              {testimonial.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <blockquote className="text-sm italic text-gray-700 border-l-4 border-orange-500 pl-4 my-3">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>⭐ {testimonial.rating}/5</span>
                            <span>•</span>
                            <span>{testimonial.trip}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {testimonial.isPublished ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => unpublishTestimonial(testimonial.id)}
                              className="text-orange-600"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Unpublish
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => publishTestimonial(testimonial.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Publish
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteTestimonialId(testimonial.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {testimonials.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No testimonials found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete User Alert */}
      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Testimonial Alert */}
      <AlertDialog open={!!deleteTestimonialId} onOpenChange={(open) => !open && setDeleteTestimonialId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this testimonial? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTestimonial} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
