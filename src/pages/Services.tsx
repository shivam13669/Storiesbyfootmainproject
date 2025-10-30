import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Bike, Truck, Plane, Home, FileText, Users, Landmark, Shield } from "lucide-react";

const services = [
  {
    icon: Bike,
    title: "Motorbike Expeditions",
    description:
      "Guided motorcycle adventures across rugged terrains with experienced crew, support vehicles, and safety protocols.",
    points: [
      "Premium bikes on request or bring your own",
      "Experienced road captains and sweep riders",
      "Backup vehicle with spares and tools",
      "Daily briefings and route planning",
    ],
  },
  {
    icon: Truck,
    title: "4x4 Adventure Tours",
    description:
      "Off-road expeditions in capable 4x4 vehicles through mountain passes, river crossings, and desert tracks.",
    points: [
      "Expert off-road marshals",
      "Well-researched routes and recovery plans",
      "Mechanical and logistic support",
      "Small groups for safety and comfort",
    ],
  },
  {
    icon: Plane,
    title: "Airport Pickups & Drops",
    description:
      "Timely airport transfers in comfortable vehicles so your trip starts and ends hassle‑free.",
    points: [
      "On-time pickups and drops",
      "Multiple vehicle options",
      "24/7 coordination",
      "Coverage for major airports",
    ],
  },
  {
    icon: Home,
    title: "Stay & Accommodation",
    description:
      "Handpicked stays ranging from boutique hotels to cozy homestays that match the route and vibe of your trip.",
    points: [
      "Verified properties and hosts",
      "Breakfast included on most routes",
      "Comfort + hygiene prioritized",
      "Scenic, convenient locations",
    ],
  },
  {
    icon: FileText,
    title: "Permits & Travel Documentation",
    description:
      "Complete assistance with regional permits and documentation required for restricted or high-altitude regions.",
    points: [
      "Inner line/forest permits",
      "Visa and entry guidance (where applicable)",
      "Route advisories and check-post updates",
      "On-trip compliance support",
    ],
  },
  {
    icon: Users,
    title: "Group Departures & Custom Itineraries",
    description:
      "Fixed departures you can join, or fully custom private trips tailored to your dates, pace, and interests.",
    points: [
      "Shared-group departures",
      "Private and corporate trips",
      "Flexible dates and pacing",
      "Theme-based itineraries",
    ],
  },
  {
    icon: Landmark,
    title: "Local Culture & Experiences",
    description:
      "Immersive local interactions—monasteries, artisan visits, food trails, and community-led experiences.",
    points: [
      "Authentic cultural sessions",
      "Local cuisine and homestays",
      "Guided heritage walks",
      "Responsible tourism practices",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Backup Support",
    description:
      "End-to-end safety with trained staff, first-aid kits, emergency protocols, and 24/7 helpline.",
    points: [
      "Medical kit and oxygen (region dependent)",
      "Emergency evacuation assistance",
      "Real-time weather and route monitoring",
      "Dedicated support team",
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
