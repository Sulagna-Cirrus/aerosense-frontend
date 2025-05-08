
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <>
      <div className="section-divider"></div>
      
      <section className="py-20 container-padding bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold mb-6 text-white">Ready to Transform Your Farming Approach?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of users who are already benefiting from AeroSense's powerful simulation and monitoring capabilities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
                Get Started for Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
