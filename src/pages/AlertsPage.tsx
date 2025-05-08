
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generatePlots, generateAlerts, type Alert } from "@/lib/mockData";
import { Search, AlertTriangle, Bell, Filter, Check, X } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Filters
  const [severityFilter, setSeverityFilter] = useState<"all" | "info" | "warning" | "critical">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "acknowledged" | "resolved">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "temperature" | "humidity" | "soilMoisture" | "cropHealth">("all");
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const plotsData = generatePlots();
        const alertsData = generateAlerts(); // Fixed: removed argument
        
        setAlerts(alertsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading alerts data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load alerts data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);
  
  // Filtered alerts based on search query and filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.plotName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });
  
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
      )
    );
    
    toast({
      title: "Alert acknowledged",
      description: "You've acknowledged this alert. Take action as needed.",
    });
  };
  
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    );
    
    toast({
      title: "Alert resolved",
      description: "This alert has been marked as resolved.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading alerts data...</p>
        </div>
      </div>
    );
  }
  
  const alertCounts = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
  };
  
  return (
    <div className="p-6 pb-16 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage system alerts and notifications
          </p>
        </div>
      </div>
      
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent className="text-red-600 dark:text-red-400">
            <div className="text-2xl font-bold">{alertCounts.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-600 dark:text-yellow-400">
            <div className="text-2xl font-bold">{alertCounts.acknowledged}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600 dark:text-green-400">
            <div className="text-2xl font-bold">{alertCounts.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent className="text-red-600 dark:text-red-400">
            <div className="text-2xl font-bold">{alertCounts.critical}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Alerts
          </CardTitle>
          <CardDescription>
            Narrow down alerts based on specific criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by plot name or message..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={severityFilter}
                onValueChange={(value) => setSeverityFilter(value as any)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as any)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="soilMoisture">Soil Moisture</SelectItem>
                  <SelectItem value="cropHealth">Crop Health</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setSeverityFilter("all");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Alerts Table */}
      <Card>
        <CardContent className="p-0">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-secondary/50 dark:bg-secondary/20 p-4 rounded-full mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground max-w-md text-center mb-4">
                No alerts match your current filter criteria. Try adjusting your filters or check back later.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSeverityFilter("all");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Severity</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead className="w-[120px]">Plot</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="w-[150px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`p-1 rounded-full mr-2 ${
                            alert.severity === 'critical' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                              : alert.severity === 'warning'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <StatusBadge status={alert.severity} text={alert.severity} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={alert.status} />
                      </TableCell>
                      <TableCell className="capitalize">
                        {alert.type === 'soilMoisture' ? 'Soil Moisture' : alert.type}
                      </TableCell>
                      <TableCell>{alert.plotName}</TableCell>
                      <TableCell className="max-w-xs truncate">{alert.message}</TableCell>
                      <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {alert.status === 'active' && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Acknowledge
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button 
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                        {alert.status === 'resolved' && (
                          <span className="text-sm text-muted-foreground">No actions</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
