
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast({
        title: "Subscription confirmed!",
        description: `Thanks for signing up with ${email}! We'll be in touch soon.`,
        variant: "default",
      });
    }, 1000);
  };

  return (
    <section className="py-16 md:py-20 container-padding scroll-section bg-gradient-to-b from-background to-background/70">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-500">
          Stay Updated
        </h3>
        <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest updates and agricultural insights.
        </p>
        <form 
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-2xl border border-input shadow-sm bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            variant="gradient" 
            disabled={isSubmitting}
            className="shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
