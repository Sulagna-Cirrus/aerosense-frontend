
import { useState, useRef, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { ContactSection } from "@/components/sections/ContactSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { startSimulation, stopSimulation } from "@/lib/mockData";

export default function HomePage() {
  const [scrollSection, setScrollSection] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  // Start simulation when the component mounts
  useEffect(() => {
    startSimulation();
    
    // Cleanup: stop simulation when component unmounts
    return () => {
      stopSimulation();
    };
  }, []);
  
  // Handle scroll events to change background
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      
      // Calculate which section we're in based on scroll position
      const sectionCount = 4; // Total number of color transition sections
      const sectionHeight = fullHeight / sectionCount;
      const currentSection = Math.min(
        sectionCount,
        Math.max(1, Math.ceil(scrollPosition / sectionHeight))
      );
      
      setScrollSection(currentSection);
      
      // Add classes to sections based on visibility
      const sections = document.querySelectorAll('.scroll-section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.75 && rect.bottom > 0;
        
        if (isVisible) {
          section.classList.add('animate-fade-in');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Get background class based on scroll position
  const getBackgroundClass = () => {
    switch (scrollSection) {
      case 1:
        return "bg-gradient-to-b from-background to-background/90";
      case 2:
        return "bg-gradient-to-b from-background/90 to-background/80";
      case 3:
        return "bg-gradient-to-b from-background/80 to-background/90";
      case 4:
        return "bg-gradient-to-b from-background/90 to-background";
      default:
        return "bg-background";
    }
  };
  
  return (
    <div 
      ref={mainRef} 
      className={`min-h-screen flex flex-col transition-colors duration-1000 ${getBackgroundClass()}`}
    >
      <MainNav onScrollToSection={scrollToSection} />
      
      <main className="flex-1">
        <div ref={heroRef}>
          <HeroSection />
        </div>
        
        <div ref={featuresRef} id="features">
          <FeaturesSection />
        </div>
        
        <div ref={testimonialsRef} id="testimonials">
          <TestimonialsSection />
        </div>
        
        <CTASection />
        
        <div ref={contactRef} id="contact">
          <ContactSection />
        </div>
        
        <NewsletterSection />
      </main>
      
      <FooterSection onScrollToSection={scrollToSection} />
    </div>
  );
}
