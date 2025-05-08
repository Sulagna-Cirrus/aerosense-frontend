import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  generatePlots, 
  generateAlerts, 
  getSummaryData,
  type Plot,
  type Alert,
} from "@/lib/mockData";

// Import our new components
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { PlotPerformanceCard } from "@/components/dashboard/PlotPerformanceCard";
import { PlotStatusSummary } from "@/components/dashboard/PlotStatusSummary";
import { ActiveAlertsCard } from "@/components/dashboard/ActiveAlertsCard";
import { WeatherForecastCard } from "@/components/dashboard/WeatherForecastCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<string>("");
  const { toast } = useToast();
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data - Fix: Remove the argument from generateAlerts()
        const plotsData = generatePlots();
        const alertsData = generateAlerts(); // Fixed: removed argument
        
        setPlots(plotsData);
        setAlerts(alertsData);
        setSelectedPlot(plotsData[0].id);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);
  
  const handlePlotChange = (plotId: string) => {
    setSelectedPlot(plotId);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  // Get summary data for the dashboard
  const summary = getSummaryData(plots);
  
  // Get active alerts only
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  
  return (
    <div className="p-6 pb-16 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor your crops and agricultural data in real-time
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>
            <Link to="/plots" className="flex items-center gap-2">
              View All Plots
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Summary Metrics */}
      <SummaryMetrics summary={summary} />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plot Selection and Chart */}
          <PlotPerformanceCard 
            plots={plots} 
            selectedPlot={selectedPlot} 
            onPlotChange={handlePlotChange} 
          />
          
          {/* Plot Status Summary */}
          <PlotStatusSummary plots={plots} summary={summary} />
        </div>
        
        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <ActiveAlertsCard activeAlerts={activeAlerts} />
          
          {/* Weather Forecast */}
          <WeatherForecastCard />
          
          {/* Quick Actions */}
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
