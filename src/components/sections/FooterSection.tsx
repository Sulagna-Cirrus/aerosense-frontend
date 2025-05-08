import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/Logo";

interface FooterLinkProps {
  href?: string;
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function FooterLink({ href, to, onClick, children }: FooterLinkProps) {
  if (href) {
    return (
      <a href={href} className="text-muted-foreground hover:text-primary transition-colors">
        {children}
      </a>
    );
  } else if (to) {
    return (
      <Link to={to} className="text-muted-foreground hover:text-primary transition-colors">
        {children}
      </Link>
    );
  } else if (onClick) {
    return (
      <button onClick={onClick} className="text-muted-foreground hover:text-primary transition-colors">
        {children}
      </button>
    );
  }
  return <span>{children}</span>;
}

export function FooterSection({ onScrollToSection }: { onScrollToSection: (id: string) => void }) {
  return (
    <footer className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-t">
      <div className="container-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-4">
              Modern agriculture monitoring for everyone, no expensive hardware required.
            </p>
            <div className="flex space-x-4">
              <FooterLink href="#">
                <Twitter className="h-5 w-5" />
              </FooterLink>
              <FooterLink href="#">
                <Linkedin className="h-5 w-5" />
              </FooterLink>
              <FooterLink href="#">
                <Github className="h-5 w-5" />
              </FooterLink>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <FooterLink onClick={() => onScrollToSection('features')}>Features</FooterLink>
              </li>
              <li><FooterLink href="#">Pricing</FooterLink></li>
              <li><FooterLink to="/dashboard">Demo</FooterLink></li>
              <li><FooterLink href="#">API</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><FooterLink href="#">Documentation</FooterLink></li>
              <li><FooterLink href="#">Blog</FooterLink></li>
              <li><FooterLink href="#">Community</FooterLink></li>
              <li><FooterLink href="#">Support</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><FooterLink href="#">About</FooterLink></li>
              <li><FooterLink href="#">Careers</FooterLink></li>
              <li><FooterLink onClick={() => onScrollToSection('contact')}>Contact</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
            </ul>
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

        <div className="pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} AeroSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
