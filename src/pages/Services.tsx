import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Bike, Truck, Plane, Home, FileText, Users, Landmark, Shield } from "lucide-react";

const services = [
  {
    icon: Bike,
    title: "Motorbike Expeditions",
    description:
      "Curated motorcycle journeys across remote passes and scenic backroads, supported by experienced crew and logistics.",
    points: [
      "Maintained bikes and on-route spares",
      "Local road captains and sweep riders",
      "Support vehicle with tools and spare parts",
      "Daily briefings with flexible rest stops",
    ],
  },
  {
    icon: Truck,
    title: "4x4 Adventure Tours",
    description:
      "Overland tours in well-equipped 4x4s, designed for challenging terrain and immersive outdoor routes.",
    points: [
      "Skilled off-road marshals",
      "Recovery and contingency plans",
      "Mechanical support on the trail",
      "Smaller groups for comfort and safety",
    ],
  },
  {
    icon: Plane,
    title: "Airport Pickups & Drops",
    description:
      "Seamless meet-and-greet transfers with flight tracking and luggage assistance so your trip begins and ends smoothly.",
    points: [
      "Flight-aware pickup coordination",
      "Private and shared transfer options",
      "Luggage handling and door-to-door service",
      "24/7 coordination for arrivals and departures",
    ],
  },
  {
    icon: Home,
    title: "Stay & Accommodation",
    description:
      "Comfortable, vetted stays selected to match each route—boutique hotels, mountain lodges, and homestays with local flavour.",
    points: [
      "Pre-vetted properties for comfort and hygiene",
      "Options from cozy homestays to boutique hotels",
      "Meals and breakfast choices where applicable",
      "Convenient locations matched to the itinerary",
    ],
  },
  {
    icon: FileText,
    title: "Permits & Travel Documentation",
    description:
      "End-to-end handling of regional permits, entry paperwork and on-trip compliance for restricted or high-altitude areas.",
    points: [
      "Inner-line, forest and special access permits",
      "Guidance on visas and entry requirements",
      "Pre-trip checks and route advisories",
      "On-trip permit coordination and support",
    ],
  },
  {
    icon: Users,
    title: "Group Departures & Custom Itineraries",
    description:
      "Join scheduled departures or create a private, tailor-made route crafted to your dates, pace and interests.",
    points: [
      "Fixed departures to join",
      "Fully custom private and corporate itineraries",
      "Flexible dates and group sizing",
      "Theme-based and purpose-led journeys",
    ],
  },
  {
    icon: Landmark,
    title: "Local Culture & Experiences",
    description:
      "Meaningful local interactions—from village visits and artisan workshops to community-led experiences and culinary trails.",
    points: [
      "Authentic cultural exchanges",
      "Local food trails and markets",
      "Guided visits to heritage and artisan centres",
      "Community-led experiences promoting responsible tourism",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Backup Support",
    description:
      "A safety-first approach with trained staff, medical kits, emergency protocols and a dedicated support line for every trip.",
    points: [
      "Regional medical kit and oxygen where needed",
      "Emergency evacuation and contingency support",
      "Real-time weather and route monitoring",
      "Dedicated operations and support team",
    ],
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Our Services
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need for unforgettable adventures
            </h1>
            <p className="text-lg text-muted-foreground">
              From permits and planning to on-ground safety and support—we handle the details so you can focus on the journey.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.title}
                  className="group h-full border border-border/60 bg-card/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/60"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
