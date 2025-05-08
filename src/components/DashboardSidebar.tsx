
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Bell, 
  ChartLine, 
  Settings,
  Menu,
  X
} from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export function DashboardSidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/plots",
      label: "Plots",
      icon: Map,
    },
    {
      href: "/crops",
      label: "Crop Profiles",
      icon: FileText,
    },
    {
      href: "/alerts",
      label: "Alerts",
      icon: Bell,
    },
    {
      href: "/historical",
      label: "Historical Data",
      icon: ChartLine,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  if (!mounted) return null;

  return (
    <>
      <div className="fixed top-0 left-0 z-40 w-full md:hidden flex items-center justify-between p-4 bg-sidebar dark:bg-sidebar border-b">
        <Logo className="text-white" />
        <Button 
          variant="ghost" 
          className="text-white" 
          size="icon" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:pt-0 pt-16 flex flex-col`}
      >
        <div className="p-6 hidden md:block">
          <Logo className="text-white" />
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "bg-sidebar-accent text-white"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-white"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6">
          <div className="rounded-lg bg-sidebar-accent p-4">
            <h5 className="font-medium text-sm text-white">Need Help?</h5>
            <p className="mt-1 text-xs text-sidebar-foreground/80">
              Contact our support team for any assistance.
            </p>
            <Button 
              className="mt-3 w-full text-xs" 
              variant="outline"
              onClick={() => setIsMobileOpen(false)}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
