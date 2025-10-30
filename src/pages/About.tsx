import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              About
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About Stories by Foot
            </h1>
            <p className="text-lg text-muted-foreground">
              Founded in October 2020, Stories by Foot curates adventures for everyone—from budget explorers to luxury travelers, students, families, and corporate groups. Specializing in motorbike and 4x4 expeditions across Ladakh, Zanskar, Meghalaya, Tawang (Arunachal), Bhutan, and Nepal’s Upper Mustang, we combine thrill, culture, comfort, and style in every journey.
            </p>
            <p className="text-lg text-muted-foreground">
              With over 500 bike trips and more than 10,000 happy travelers across three nations, every adventure with us goes beyond travel—it becomes a story worth telling.
            </p>
            <p className="text-xl font-semibold">✨ Walk the Road. Live the Story.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 mt-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border border-border/60 bg-card/90 shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Bike trips completed</p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card/90 shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold">10,000+</p>
                <p className="text-sm text-muted-foreground">Happy travelers</p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card/90 shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold">3+</p>
                <p className="text-sm text-muted-foreground">Nations explored</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
