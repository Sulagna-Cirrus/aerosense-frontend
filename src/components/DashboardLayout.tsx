
import { Outlet } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 md:ml-64 pt-16 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
