import { Mail, Phone } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message sent",
        description: `${name ? name + ", " : ""}we'll get back to you shortly.`,
      });
      form.reset();
    }, 800);
  };

  return (
    <section id="contact" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to plan your next adventure? Send us a message and we’ll reach out.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+91XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Tell us about your plans…" className="min-h-32" required />
                </div>
                <Button type="submit" variant="adventure" className="w-full" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-2xl p-8 bg-gradient-to-br from-primary/10 via-adventure-forest/10 to-transparent border border-border">
            <h3 className="text-2xl font-semibold mb-4">Reach us directly</h3>
            <p className="text-muted-foreground mb-8">
              Prefer WhatsApp, call, or email? Get in touch using the details below.
            </p>
            <div className="text-foreground space-y-3">
              <span className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <a href="tel:+916205129118" className="hover:underline">+916205129118</a>
              </span>

              <span className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <a href="tel:+916283620764" className="hover:underline">+916283620764</a>
              </span>

              <span className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:contact@storiesbyfoot.com" className="hover:underline">contact@storiesbyfoot.com</a>
              </span>

              <span className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:storiesbyfoot@gmail.com" className="hover:underline">storiesbyfoot@gmail.com</a>
              </span>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              Our team typically replies within a few hours.
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <span className="flex items-center">
                <WhatsAppIcon className="h-5 w-5 text-primary mr-2" />
                <a href="https://wa.me/916205129118" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">WhatsApp Support</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
