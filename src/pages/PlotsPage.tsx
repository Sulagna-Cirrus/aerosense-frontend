import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generatePlots, type Plot } from "@/lib/mockData";
import { Search, Plus, MapPin, Thermometer, Droplets } from "lucide-react";
import { LeafIcon } from "@/components/icons/LeafIcon";
import { Link } from "react-router-dom";

export default function PlotsPage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "warning" | "critical">("all");
  
  const [newPlot, setNewPlot] = useState({
    name: "",
    location: "",
    size: "",
    cropType: "",
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const plotsData = generatePlots(12);
        setPlots(plotsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading plots data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load plots data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);
  
  const filteredPlots = plots.filter(plot => {
    const matchesSearch = 
      plot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.cropType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || plot.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleCreatePlot = () => {
    if (!newPlot.name || !newPlot.location || !newPlot.size || !newPlot.cropType) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to create a new plot.",
        variant: "destructive",
      });
      return;
    }
    
    const plotId = `plot-${Date.now()}`;
    const newPlotData: Plot = {
      id: plotId,
      name: newPlot.name,
      location: newPlot.location,
      size: parseFloat(newPlot.size),
      cropType: newPlot.cropType,
      plantDate: new Date().toISOString(),
      status: 'healthy',
    };
    
    setPlots([newPlotData, ...plots]);
    
    setNewPlot({
      name: "",
      location: "",
      size: "",
      cropType: "",
    });
    setDialogOpen(false);
    
    toast({
      title: "Plot created",
      description: `${newPlot.name} has been created successfully.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading plots data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 pb-16 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plots</h1>
          <p className="text-muted-foreground">
            Manage and monitor your agricultural plots
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Plot</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Plot</DialogTitle>
              <DialogDescription>
                Enter the details for your new monitoring plot.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="col-span-1">
                  Plot Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., North Field B12"
                  value={newPlot.name}
                  onChange={(e) => setNewPlot({ ...newPlot, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="col-span-1">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., North Field"
                  value={newPlot.location}
                  onChange={(e) => setNewPlot({ ...newPlot, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="size" className="col-span-1">
                  Size (acres)
                </Label>
                <Input
                  id="size"
                  type="number"
                  placeholder="e.g., 5.2"
                  value={newPlot.size}
                  onChange={(e) => setNewPlot({ ...newPlot, size: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cropType" className="col-span-1">
                  Crop Type
                </Label>
                <Select 
                  onValueChange={(value) => setNewPlot({ ...newPlot, cropType: value })}
                  value={newPlot.cropType}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Corn">Corn</SelectItem>
                    <SelectItem value="Soybeans">Soybeans</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlot}>Create Plot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search plots by name, location, or crop type..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as any)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlots.length === 0 ? (
          <div className="col-span-full flex items-center justify-center p-12 bg-secondary/40 rounded-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-full mb-4">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Plots Found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter !== "all"
                  ? `No plots with ${statusFilter} status match your search criteria.`
                  : "No plots match your search criteria."}
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          filteredPlots.map((plot) => (
            <Card key={plot.id} className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{plot.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {plot.location}
                    </CardDescription>
                  </div>
                  <StatusBadge status={plot.status} />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 dark:bg-secondary/20 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground flex items-center mb-1">
                      <LeafIcon className="h-3.5 w-3.5 mr-1" />
                      Crop Type
                    </div>
                    <div className="font-medium">{plot.cropType}</div>
                  </div>
                  <div className="bg-secondary/50 dark:bg-secondary/20 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground flex items-center mb-1">
                      <div className="h-3.5 w-3.5 mr-1 flex items-center justify-center">
                        <span className="text-xs">🌱</span>
                      </div>
                      Planted
                    </div>
                    <div className="font-medium">{new Date(plot.plantDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                {plot.lastReading && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-secondary/30 dark:bg-secondary/10 rounded">
                      <div className="text-xs text-muted-foreground flex items-center justify-center mb-1">
                        <Thermometer className="h-3 w-3 mr-1" />
                        Temp
                      </div>
                      <div className="font-medium text-sm">
                        {plot.lastReading.temperature.toFixed(1)}°C
                      </div>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 dark:bg-secondary/10 rounded">
                      <div className="text-xs text-muted-foreground flex items-center justify-center mb-1">
                        <Droplets className="h-3 w-3 mr-1" />
                        Humidity
                      </div>
                      <div className="font-medium text-sm">
                        {plot.lastReading.humidity.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 dark:bg-secondary/10 rounded">
                      <div className="text-xs text-muted-foreground flex items-center justify-center mb-1">
                        <div className="h-3 w-3 mr-1 flex items-center justify-center">
                          <span className="text-xs">💧</span>
                        </div>
                        Soil
                      </div>
                      <div className="font-medium text-sm">
                        {plot.lastReading.soilMoisture.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <Link to={`/plot/${plot.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
