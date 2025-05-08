
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section 
      id="contact" 
      className="py-20 container-padding scroll-section scroll-section-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-gradient font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions about AeroSense? We're here to help! Fill out the form and our team will get back to you shortly.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium">Email Us</div>
                <div className="text-muted-foreground">info@aerosense.io</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium">Call Us</div>
                <div className="text-muted-foreground">+91 9583495238</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium">Address</div>
                <div className="text-muted-foreground">Bhubaneshwar, India</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full px-3 py-2 border border-input rounded-xl bg-background shadow-sm"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-input rounded-xl bg-background shadow-sm"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <input
                id="subject"
                className="w-full px-3 py-2 border border-input rounded-xl bg-background shadow-sm"
                placeholder="Message subject"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-xl bg-background shadow-sm resize-none"
                placeholder="Your message"
              />
            </div>
            <Button variant="gradient" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

