
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCrops, type Crop } from "@/lib/mockData";
import { Search, Plus, Thermometer, Droplets, LineChart } from "lucide-react";

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // New crop form state
  const [newCrop, setNewCrop] = useState<Crop>({
    id: "",
    name: "",
    scientificName: "",
    growthDuration: 0,
    waterRequirement: "medium",
    optimalTemperature: { min: 15, max: 30 },
    optimalHumidity: { min: 40, max: 80 },
    optimalSoilMoisture: { min: 30, max: 70 },
    description: "",
  });
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const cropsData = generateCrops();
        setCrops(cropsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading crops data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load crops data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);
  
  // Filtered crops based on search query
  const filteredCrops = crops.filter(crop => 
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    crop.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateCrop = () => {
    // Validate form
    if (!newCrop.name || !newCrop.scientificName || !newCrop.description) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields to create a new crop profile.",
        variant: "destructive",
      });
      return;
    }
    
    // Create crop with a new ID
    const cropWithId = {
      ...newCrop,
      id: `crop-${Date.now()}`,
    };
    
    // Add to crops array
    setCrops([cropWithId, ...crops]);
    
    // Reset form and close dialog
    setNewCrop({
      id: "",
      name: "",
      scientificName: "",
      growthDuration: 0,
      waterRequirement: "medium",
      optimalTemperature: { min: 15, max: 30 },
      optimalHumidity: { min: 40, max: 80 },
      optimalSoilMoisture: { min: 30, max: 70 },
      description: "",
    });
    setDialogOpen(false);
    
    toast({
      title: "Crop profile created",
      description: `${newCrop.name} has been added to your crop profiles.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading crops data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 pb-16 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Profiles</h1>
          <p className="text-muted-foreground">
            Manage crop profiles and optimal growth parameters
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Crop</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Crop Profile</DialogTitle>
              <DialogDescription>
                Enter the details for the new crop profile including optimal growing conditions.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="conditions">Growing Conditions</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="col-span-1">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Wheat"
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scientificName" className="col-span-1">
                      Scientific Name
                    </Label>
                    <Input
                      id="scientificName"
                      placeholder="e.g., Triticum aestivum"
                      value={newCrop.scientificName}
                      onChange={(e) => setNewCrop({ ...newCrop, scientificName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="growthDuration" className="col-span-1">
                      Growth Duration (days)
                    </Label>
                    <Input
                      id="growthDuration"
                      type="number"
                      placeholder="e.g., 120"
                      value={newCrop.growthDuration || ""}
                      onChange={(e) => setNewCrop({ ...newCrop, growthDuration: parseInt(e.target.value) || 0 })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="waterRequirement" className="col-span-1">
                      Water Requirement
                    </Label>
                    <Select 
                      onValueChange={(value) => setNewCrop({ ...newCrop, waterRequirement: value as any })}
                      value={newCrop.waterRequirement}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select water requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="conditions" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="col-span-4">
                      Optimal Temperature (°C)
                    </Label>
                    <Label htmlFor="tempMin" className="col-span-1 text-sm text-muted-foreground">
                      Min
                    </Label>
                    <Input
                      id="tempMin"
                      type="number"
                      placeholder="Min temp"
                      value={newCrop.optimalTemperature.min}
                      onChange={(e) => setNewCrop({ 
                        ...newCrop, 
                        optimalTemperature: {
                          ...newCrop.optimalTemperature,
                          min: parseInt(e.target.value) || 0
                        } 
                      })}
                      className="col-span-1"
                    />
                    <Label htmlFor="tempMax" className="col-span-1 text-sm text-muted-foreground">
                      Max
                    </Label>
                    <Input
                      id="tempMax"
                      type="number"
                      placeholder="Max temp"
                      value={newCrop.optimalTemperature.max}
                      onChange={(e) => setNewCrop({ 
                        ...newCrop, 
                        optimalTemperature: {
                          ...newCrop.optimalTemperature,
                          max: parseInt(e.target.value) || 0
                        } 
                      })}
                      className="col-span-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="col-span-4">
                      Optimal Humidity (%)
                    </Label>
                    <Label htmlFor="humidityMin" className="col-span-1 text-sm text-muted-foreground">
                      Min
                    </Label>
                    <Input
                      id="humidityMin"
                      type="number"
                      placeholder="Min humidity"
                      value={newCrop.optimalHumidity.min}
                      onChange={(e) => setNewCrop({ 
                        ...newCrop, 
                        optimalHumidity: {
                          ...newCrop.optimalHumidity,
                          min: parseInt(e.target.value) || 0
                        } 
                      })}
                      className="col-span-1"
                    />
                    <Label htmlFor="humidityMax" className="col-span-1 text-sm text-muted-foreground">
                      Max
                    </Label>
                    <Input
                      id="humidityMax"
                      type="number"
                      placeholder="Max humidity"
                      value={newCrop.optimalHumidity.max}
                      onChange={(e) => setNewCrop({ 
                        ...newCrop, 
                        optimalHumidity: {
                          ...newCrop.optimalHumidity,
                          max: parseInt(e.target.value) || 0
                        } 
                      })}
                      className="col-span-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="col-span-4">
                      Optimal Soil Moisture (%)
                    </Label>
                    <Label htmlFor="soilMin" className="col-span-1 text-sm text-muted-foreground">
                      Min
                    </Label>
                    <Input
                      id="soilMin"
                      type="number"
                      placeholder="Min moisture"
                      value={newCrop.optimalSoilMoisture.min}
                      onChange={(e) => setNewCrop({ 
                        ...newCrop, 
                        optimalSoilMoisture: {
                          ...newCrop.optimalSoilMoisture,
                          min: parseInt(e.target.value) || 0
                        } 
                      })}
                      className="col-span-1"
                    />
                    <Label htmlFor="soilMax" className="col-span-1 text-sm text-muted-foreground">
                      Max
                    </Label>
                    <Input
                      id="soilMax"
                      type="number"
                      placeholder="Max moisture"
                      value={newCrop.optimalSoilMoisture.max}
                      onChange={(e) => setNewCrop({ 
                        ...newCrop, 
                        optimalSoilMoisture: {
                          ...newCrop.optimalSoilMoisture,
                          max: parseInt(e.target.value) || 0
                        } 
                      })}
                      className="col-span-1"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="description" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="col-span-4">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a detailed description of the crop, including growing tips, common issues, and harvesting information."
                      value={newCrop.description}
                      onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                      className="col-span-4"
                      rows={5}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCrop}>Create Crop Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search crops by name or scientific name..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.length === 0 ? (
          <div className="col-span-full flex items-center justify-center p-12 bg-secondary/40 rounded-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-full mb-4">
                <Seedling className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Crops Found</h3>
              <p className="text-muted-foreground mb-4">
                No crop profiles match your search criteria.
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          filteredCrops.map((crop) => (
            <Card key={crop.id} className="card-hover">
              <CardHeader>
                <CardTitle>{crop.name}</CardTitle>
                <CardDescription className="italic">{crop.scientificName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Growth Duration</span>
                    <span className="font-medium">{crop.growthDuration} days</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Water Requirement</span>
                    <span className="font-medium capitalize">{crop.waterRequirement}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 dark:bg-secondary/20 rounded-lg">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="text-sm font-medium">
                      {crop.optimalTemperature.min}°C - {crop.optimalTemperature.max}°C
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-secondary/50 dark:bg-secondary/20 rounded-lg">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">Humidity</span>
                    </div>
                    <span className="text-sm font-medium">
                      {crop.optimalHumidity.min}% - {crop.optimalHumidity.max}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-secondary/50 dark:bg-secondary/20 rounded-lg">
                    <div className="flex items-center">
                      <DropletIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">Soil Moisture</span>
                    </div>
                    <span className="text-sm font-medium">
                      {crop.optimalSoilMoisture.min}% - {crop.optimalSoilMoisture.max}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">{crop.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Full Details</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function DropletIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  )
}

function Seedling(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 22c1.25-1.25 2.5-2.5 3.5-4" />
      <path d="M14 22a20.81 20.81 0 0 0 3-3" />
      <path d="M10 22a9.26 9.26 0 0 0 2-2" />
      <path d="M13.75 17A9.63 9.63 0 0 0 16 12a7.89 7.89 0 0 0-6-8 7.89 7.89 0 0 0-8 6 9.63 9.63 0 0 0 5 8.25" />
      <path d="M10 7.9A5.11 5.11 0 0 0 9 11a5 5 0 0 0 9.5 2" />
    </svg>
  )
}
