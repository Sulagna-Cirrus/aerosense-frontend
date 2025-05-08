
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SensorChart } from "@/components/ui/sensor-chart";
import { Calendar as CalendarIcon, Download, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  generatePlots, 
  generateHistoricalData,
  type Plot,
  type SensorReading 
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function HistoricalPage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState<string>("");
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [filteredData, setFilteredData] = useState<SensorReading[]>([]);
  const { toast } = useToast();
  
  // Date range filter
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const plotsData = generatePlots(8);
        setPlots(plotsData);
        
        if (plotsData.length > 0) {
          setSelectedPlot(plotsData[0].id);
          // Generate 60 days of historical data for the first plot
          const data = generateHistoricalData(plotsData[0].id, 60);
          setHistoricalData(data);
          setFilteredData(data);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading historical data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load historical data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);
  
  // When selected plot changes, update historical data
  useEffect(() => {
    if (selectedPlot) {
      // Generate 60 days of historical data for the selected plot
      const data = generateHistoricalData(selectedPlot, 60);
      setHistoricalData(data);
      setFilteredData(data);
      
      // Reset date range
      setDateRange({ from: undefined, to: undefined });
    }
  }, [selectedPlot]);
  
  // Apply date range filter
  useEffect(() => {
    if (!dateRange.from && !dateRange.to) {
      setFilteredData(historicalData);
      return;
    }
    
    const filtered = historicalData.filter(reading => {
      const readingDate = new Date(reading.timestamp);
      
      if (dateRange.from && dateRange.to) {
        // Set time to end of day for the to date to include the full day
        const toDateWithTime = new Date(dateRange.to);
        toDateWithTime.setHours(23, 59, 59, 999);
        
        return readingDate >= dateRange.from && readingDate <= toDateWithTime;
      } else if (dateRange.from) {
        return readingDate >= dateRange.from;
      } else if (dateRange.to) {
        // Set time to end of day to include the full day
        const toDateWithTime = new Date(dateRange.to);
        toDateWithTime.setHours(23, 59, 59, 999);
        
        return readingDate <= toDateWithTime;
      }
      
      return true;
    });
    
    setFilteredData(filtered);
  }, [dateRange, historicalData]);
  
  const handleExportData = () => {
    // Create CSV content
    const csvHeader = 'Timestamp,Temperature,Humidity,Soil Moisture,Crop Health\n';
    const csvContent = filteredData.map(reading => 
      `${new Date(reading.timestamp).toLocaleString()},${reading.temperature.toFixed(1)},${reading.humidity.toFixed(1)},${reading.soilMoisture.toFixed(1)},${reading.cropHealth.toFixed(1)}`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `plot-data-${selectedPlot}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data exported",
      description: "Historical data has been exported as CSV file.",
    });
  };
  
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      const data = generateHistoricalData(selectedPlot, 60);
      setHistoricalData(data);
      setFilteredData(data);
      setDateRange({ from: undefined, to: undefined });
      setIsLoading(false);
      
      toast({
        title: "Data refreshed",
        description: "Historical data has been updated.",
      });
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading historical data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 pb-16 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historical Data</h1>
          <p className="text-muted-foreground">
            View and analyze historical sensor readings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleRefreshData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </Button>
          <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
          </CardTitle>
          <CardDescription>
            Filter historical data by plot and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64">
              <label className="text-sm font-medium mb-2 block">Select Plot</label>
              <Select
                value={selectedPlot}
                onValueChange={setSelectedPlot}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plot" />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.name} ({plot.cropType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[240px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        format(dateRange.from, "PPP")
                      ) : (
                        "Select start date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[240px] justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        format(dateRange.to, "PPP")
                      ) : (
                        "Select end date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      initialFocus
                      disabled={(date) =>
                        (dateRange.from ? date < dateRange.from : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="ghost"
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                  className="sm:self-start"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            Sensor Data Visualization
          </CardTitle>
          <CardDescription>
            {filteredData.length > 0 
              ? `Showing ${filteredData.length} data points`
              : "No data available for the selected filters"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <SensorChart 
              title=""
              data={filteredData} 
            />
          ) : (
            <div className="flex items-center justify-center p-12 bg-secondary/20 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">No Data Available</div>
                <p className="text-muted-foreground mb-4">
                  There is no data available for the selected date range. Please adjust your filters.
                </p>
                <Button onClick={() => setDateRange({ from: undefined, to: undefined })}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
          <CardDescription>
            Detailed sensor readings for the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Temperature (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Soil Moisture (%)</TableHead>
                    <TableHead>Crop Health Index</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Show only the first 100 entries to prevent performance issues */}
                  {filteredData.slice(0, 100).map((reading, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(reading.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{reading.temperature.toFixed(1)}</TableCell>
                      <TableCell>{reading.humidity.toFixed(1)}</TableCell>
                      <TableCell>{reading.soilMoisture.toFixed(1)}</TableCell>
                      <TableCell>{reading.cropHealth.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredData.length > 100 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Showing 100 of {filteredData.length} entries. Export to CSV to view all data.
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 bg-secondary/20 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">No Data Available</div>
                <p className="text-muted-foreground mb-4">
                  There is no data available for the selected date range. Please adjust your filters.
                </p>
                <Button onClick={() => setDateRange({ from: undefined, to: undefined })}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
