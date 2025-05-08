
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type MainNavProps = {
  onScrollToSection?: (id: string) => void;
};

export function MainNav({ onScrollToSection }: MainNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // Check if we're on the dashboard or other internal pages
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/plots') || 
                          location.pathname.includes('/crops') || 
                          location.pathname.includes('/alerts') || 
                          location.pathname.includes('/historical') || 
                          location.pathname.includes('/settings');
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleNavClick = (id: string) => {
    if (onScrollToSection) {
      onScrollToSection(id);
      setIsMobileMenuOpen(false);
    }
  };
  
  return (
    <header 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container-padding">
        <div className="flex items-center justify-between">
          {!isDashboardPage && (
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          )}
          
          {isDashboardPage && <div className="w-40"></div>}
          
          <nav className="hidden md:flex items-center space-x-6">
            {!isDashboardPage && !user && (
              <>
                <button 
                  onClick={() => handleNavClick("home")}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavClick("features")}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Features
                </button>
                <button 
                  onClick={() => handleNavClick("testimonials")}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => handleNavClick("contact")}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  Contact
                </button>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      {user.profile && user.profile.profileImage ? (
                        <AvatarImage 
                          src={`http://localhost:5000/uploads/profiles/${user.profile.profileImage}`} 
                          alt={user.fullName} 
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-white">
                        {user.fullName?.charAt(0) || <User size={16} />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="gradient">Sign Up</Button>
                </Link>
              </div>
            )}
            
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-5 bg-white dark:bg-slate-900 border-t">
          <div className="container-padding">
            <nav className="flex flex-col space-y-4">
              {!isDashboardPage && !user && (
                <>
                  <button 
                    onClick={() => handleNavClick("home")}
                    className="text-foreground/80 hover:text-primary transition-colors py-2"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => handleNavClick("features")}
                    className="text-foreground/80 hover:text-primary transition-colors py-2"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => handleNavClick("testimonials")}
                    className="text-foreground/80 hover:text-primary transition-colors py-2"
                  >
                    Testimonials
                  </button>
                  <button 
                    onClick={() => handleNavClick("contact")}
                    className="text-foreground/80 hover:text-primary transition-colors py-2"
                  >
                    Contact
                  </button>
                </>
              )}
              
              {user ? (
                <Button 
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => signOut()}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              ) : (
                <div className="flex space-x-3 pt-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button variant="gradient" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
