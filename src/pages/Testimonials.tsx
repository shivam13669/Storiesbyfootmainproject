import { FormEvent, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Quote } from "lucide-react";

const getInitials = (fullName: string) => {
  const [first, last] = fullName.split(" ");
  return `${first?.[0]}${last?.[0]}`.toUpperCase();
};

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Photographer",
    location: "New Delhi, India",
    trip: "Ladakh Himalayan Ride",
    quote:
      "StoriesByFoot turned the intimidating Himalayas into a dream ride. Every halt had hot chai, every route had a backup plan, and they never stopped surprising us with hidden gems.",
    image:
      "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&w=400&q=80",
    highlight: "Altitude 17,982 ft",
    rating: 5,
  },
  {
    name: "Neha Kapoor",
    role: "Product Manager",
    location: "Bengaluru, India",
    trip: "Arunachal Riverine Expedition",
    quote:
      "From bamboo homestays to private rafting sessions, the itinerary was a perfect blend of thrill and serenity. Their crew felt like family by the end of the trip.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    highlight: "8-day guided trail",
    rating: 5,
  },
  {
    name: "Kabir Singh",
    role: "Entrepreneur",
    location: "Mumbai, India",
    trip: "Spiti Valley Convoy",
    quote:
      "I have done a dozen driving expeditions, but none matched the precision of StoriesByFoot. The lead marshals navigated blizzards like pros and kept morale sky high.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    highlight: "12 vehicles in convoy",
    rating: 4,
  },
  {
    name: "Lara Dsouza",
    role: "Yoga Instructor",
    location: "Goa, India",
    trip: "Sikkim Wellness Retreat",
    quote:
      "Sunrise meditations, organic breakfasts, and mindful hikes. They curated every little detail so I could focus on teaching and soaking in the mountains.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    highlight: "Daily guided rituals",
    rating: 5,
  },
  {
    name: "Vikram Reddy",
    role: "Software Engineer",
    location: "Hyderabad, India",
    trip: "Rajasthan Desert Safari",
    quote:
      "Disconnecting from code and connecting with nature was exactly what I needed. The camel rides under starlit skies, bonfire stories, and the expertise of local guides made this journey truly magical.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    highlight: "5-night desert camp",
    rating: 5,
  },
  {
    name: "Priya Malhotra",
    role: "Journalist",
    location: "Delhi, India",
    trip: "Northeast Stories Trail",
    quote:
      "As a travel writer, I've explored many regions, but the storytelling approach of StoriesByFoot was exceptional. They don't just guide you through destinations, they unveil the soul of each place through authentic local connections.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    highlight: "Culture-immersive journey",
    rating: 5,
  },
];

const journeyOptions = [
  "Ladakh Himalayan Ride",
  "Spiti Valley Convoy",
  "Sikkim Wellness Retreat",
  "Arunachal Riverine Expedition",
  "Sahara Desert Drive",
  "Meghalaya Caving Quest",
];

const TestimonialsPage = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("name") || "").trim();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Story received",
        description: `${fullName ? fullName + ", " : ""}thank you for trusting us with your journey.`,
      });
      form.reset();
      setRating(5);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-adventure-sky/20 via-primary/10 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  Traveler testimonials
                </span>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Real voices from trails, passes, and river bends
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Hear from the explorers who trusted StoriesByFoot to plan their next adventure. Every itinerary is handcrafted, every safety net is tested, and every memory is unforgettable.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-4xl font-semibold text-primary">4.9/5</p>
                    <p className="text-sm text-muted-foreground">Average traveler rating across 120+ journeys</p>
                  </div>
                  <div className="flex -space-x-3">
                    {testimonials.slice(0, 3).map((person) => (
                      <Avatar key={person.name} className="border-2 border-background">
                        <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-primary/60 bg-primary/5 text-xs font-semibold text-primary">
                      120+
                    </div>
                  </div>
                </div>
              </div>
              <Card className="border-0 bg-card/80 shadow-xl shadow-primary/10 backdrop-blur">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-semibold">Featured Story</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    “We were constantly chasing horizons, but StoriesByFoot always stayed one curve ahead with support and warmth.”
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{getInitials("Aarohi Bhandari")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Aarohi Bhandari</p>
                      <p className="text-sm text-muted-foreground">Wildlife Filmmaker · Kaziranga Expedition</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Badge variant="secondary">Full support crew</Badge>
                    <Badge variant="secondary">Night jungle drive</Badge>
                    <Badge variant="secondary">Offbeat homestays</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    “My crew captured rhinos at dawn while the StoriesByFoot team handled logistics, permits, and local storytellers. I never imagined adventure travel could feel this effortless.”
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mt-16">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold sm:text-4xl">Shared memories that stay</h2>
              <p className="text-muted-foreground">
                Each review captures the thrill, warmth, and courage of journeys crafted with care.
              </p>
            </div>
            <Badge className="bg-primary/15 text-primary border border-primary/20 px-4 py-2 text-sm">
              98% would recommend StoriesByFoot
            </Badge>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((story) => (
              <Card
                key={story.name}
                className="group h-full border border-border/60 bg-card/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/60"
              >
                <CardHeader className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(story.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold leading-tight">{story.name}</p>
                      <p className="text-xs text-muted-foreground">{story.role}</p>
                      <p className="mt-0.5 text-xs text-primary/80">{story.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary/90">
                    <Quote className="h-4 w-4" />
                    <span>{story.trip}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{story.quote}</p>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-2xl text-yellow-400">{"★".repeat(story.rating)}{"☆".repeat(5 - story.rating)}</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary/80">
                      {story.highlight}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="add-testimonial-form" className="mt-20 bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
              <div className="space-y-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Share your experience</span>
                <h2 className="text-3xl font-semibold sm:text-4xl">Add your testimonial</h2>
                <p className="text-muted-foreground max-w-2xl">
                  We love hearing about the serendipitous sunsets, friendships forged, and challenges conquered. Submit your story and inspire the next traveler.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border border-primary/30 bg-primary/5">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-primary">72 hour response</p>
                      <p className="mt-1 text-xs text-primary/70">Our team curates stories and publishes the best ones every week.</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-secondary/30 bg-secondary/5">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-secondary">Feature spotlight</p>
                      <p className="mt-1 text-xs text-secondary/70">Top stories land on our homepage and Instagram community.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="border border-border/60 bg-card/90 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Tell us about your journey</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add highlights, shout-outs, and favourite moments. We read every submission.
                  </p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="journey">Adventure taken</Label>
                      <Input
                        list="journey-options"
                        id="journey"
                        name="journey"
                        placeholder="Select or type the itinerary"
                        required
                      />
                      <datalist id="journey-options">
                        {journeyOptions.map((journey) => (
                          <option key={journey} value={journey} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moments">Favourite moments</Label>
                      <Textarea
                        id="moments"
                        name="moments"
                        placeholder="Share how the trip made you feel, any standout crew members, and highlights."
                        className="min-h-32"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="block">Rating</Label>
                      <div className="flex items-center gap-1 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <span
                            key={value}
                            className="text-3xl text-yellow-400 cursor-pointer transition-transform hover:scale-110"
                            onClick={() => setRating(value)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setRating(value);
                              }
                            }}
                          >
                            {value <= rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <input type="hidden" name="rating" value={rating} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sharing…" : "Submit testimonial"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
