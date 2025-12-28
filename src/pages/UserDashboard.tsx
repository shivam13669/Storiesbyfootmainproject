import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase, Testimonial } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

export default function UserDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    role: '',
    location: '',
    trip: '',
    quote: '',
    highlight: '',
    rating: 5,
  })

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (isAuthLoading) {
      return
    }

    if (!user) {
      window.location.href = '/'
      return
    }
    fetchTestimonials()
  }, [user, isAuthLoading])

  const fetchTestimonials = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })

      if (error) throw error
      setTestimonials(data as Testimonial[])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('You must be logged in to submit a testimonial')
      return
    }

    if (!user.canWriteTestimonial) {
      toast.error('Your account is not enabled to write testimonials yet. Please contact the admin.')
      return
    }

    if (!formData.quote || !formData.trip || !formData.role || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)

      const { error } = await supabase.from('testimonials').insert({
        userId: user.id,
        name: formData.name,
        role: formData.role,
        location: formData.location,
        trip: formData.trip,
        quote: formData.quote,
        highlight: formData.highlight,
        rating: formData.rating,
        isPublished: false,
      })

      if (error) throw error

      toast.success('Testimonial submitted! Admin will review and publish it soon.')
      setFormData({
        name: user.fullName,
        role: '',
        location: '',
        trip: '',
        quote: '',
        highlight: '',
        rating: 5,
      })
      await fetchTestimonials()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to submit testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteTestimonial = async () => {
    if (!deleteId) return

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', deleteId)

      if (error) throw error

      setTestimonials(testimonials.filter((t) => t.id !== deleteId))
      setDeleteId(null)
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

  const canWriteTestimonial = user?.canWriteTestimonial

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your testimonials</p>

          {!canWriteTestimonial && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                ⚠️ Your account hasn't been enabled to write testimonials yet. Please wait for admin approval.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="submit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="submit">Write Testimonial</TabsTrigger>
            <TabsTrigger value="my-testimonials">My Testimonials</TabsTrigger>
          </TabsList>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!canWriteTestimonial ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      You need to be enabled by the admin to write testimonials.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Role/Profession *
                        </label>
                        <Input
                          placeholder="e.g., Photographer"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location *
                        </label>
                        <Input
                          placeholder="e.g., New Delhi, India"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trip Name *
                        </label>
                        <Input
                          placeholder="e.g., Ladakh Himalayan Ride"
                          value={formData.trip}
                          onChange={(e) => setFormData({ ...formData, trip: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Testimonial *
                      </label>
                      <Textarea
                        placeholder="Share your experience..."
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        required
                        disabled={isSubmitting}
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Highlight
                        </label>
                        <Input
                          placeholder="e.g., Altitude 17,982 ft"
                          value={formData.highlight}
                          onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating (1-5) *
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              className={`text-3xl transition-transform hover:scale-110 ${
                                star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              disabled={isSubmitting}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Testimonials Tab */}
          <TabsContent value="my-testimonials">
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                          <Badge
                            variant={testimonial.isPublished ? 'default' : 'outline'}
                            className={
                              testimonial.isPublished ? 'bg-green-100 text-green-800' : ''
                            }
                          >
                            {testimonial.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{testimonial.role}</p>

                        <blockquote className="text-sm italic text-gray-700 border-l-4 border-orange-500 pl-4 my-3">
                          "{testimonial.quote}"
                        </blockquote>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>⭐ {testimonial.rating}/5</span>
                          <span>📍 {testimonial.location}</span>
                          <span>✈️ {testimonial.trip}</span>
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(testimonial.id)}
                        disabled={testimonial.isPublished}
                        title={
                          testimonial.isPublished
                            ? 'Cannot delete published testimonials'
                            : 'Delete testimonial'
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {testimonials.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    {canWriteTestimonial
                      ? 'You haven\'t submitted any testimonials yet.'
                      : 'Waiting for admin to enable testimonial writing...'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
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
