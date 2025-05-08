
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { SensorChart } from "@/components/ui/sensor-chart";
import { generateHistoricalData, type Plot, type SensorReading } from "@/lib/mockData";

interface PlotPerformanceCardProps {
  plots: Plot[];
  selectedPlot: string;
  onPlotChange: (plotId: string) => void;
}

export function PlotPerformanceCard({ plots, selectedPlot, onPlotChange }: PlotPerformanceCardProps) {
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  
  // When selected plot changes, update historical data
  useEffect(() => {
    if (selectedPlot) {
      // Pass the selectedPlot ID to the generateHistoricalData function
      setHistoricalData(generateHistoricalData(selectedPlot, 24));
    }
  }, [selectedPlot]);
  
  // Find the currently selected plot
  const currentPlot = plots.find(plot => plot.id === selectedPlot);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Plot Performance</CardTitle>
          <div className="flex items-center space-x-2">
            <select 
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={selectedPlot}
              onChange={(e) => onPlotChange(e.target.value)}
            >
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name} ({plot.cropType})
                </option>
              ))}
            </select>
          </div>
        </div>
        <CardDescription>
          {currentPlot && `${currentPlot.location} | ${currentPlot.size} acres | Planted: ${new Date(currentPlot.plantDate).toLocaleDateString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SensorChart 
          title=""
          data={historicalData} 
        />
      </CardContent>
    </Card>
  );
}
