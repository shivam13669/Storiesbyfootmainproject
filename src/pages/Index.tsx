import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Footer from "@/components/Footer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Index = () => {
  // Automatically redirect authenticated users to their dashboard
  useAuthRedirect();

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Destinations />
      <TestimonialsCarousel />
      <Footer />
    </div>
  );
};

export default Index;
