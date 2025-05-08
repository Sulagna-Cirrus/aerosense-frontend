
export function TestimonialsSection() {
  return (
    <section 
      id="testimonials" 
      className="py-20 container-padding scroll-section scroll-section-3"
    >
      <div className="text-center mb-16">
        <h2 className="text-gradient mb-4">What Our Users Say</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AeroSense is helping farmers, researchers, and students across the country.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            quote: "AeroSense has revolutionized how I teach agricultural technology. Students can now practice with simulated data before working with real sensors.",
            author: "Dr. Rajan Patel",
            role: "Professor, Agricultural Sciences"
          },
          {
            quote: "The simulation capabilities of AeroSense have helped me test different irrigation strategies without risking my actual crops. A game-changer for small farmers!",
            author: "Amita Sharma",
            role: "Small-scale Farmer"
          },
          {
            quote: "As a researcher, I use AeroSense to validate my hypotheses before expensive field trials. The historical data analysis is particularly valuable.",
            author: "Vikram Singh",
            role: "Agricultural Researcher"
          }
        ].map((testimonial, index) => (
          <div 
            key={index} 
            className="glass-effect p-6 rounded-2xl shadow-sm card-hover"
          >
            <div className="mb-4 text-4xl text-primary">"</div>
            <p className="text-muted-foreground mb-4">{testimonial.quote}</p>
            <div className="mt-auto">
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
