
import { Thermometer, Droplets, LineChart, Sprout } from "lucide-react";
import { MetricsCard } from "@/components/ui/metrics-card";

interface SummaryProps {
  summary: {
    avgTemperature: number;
    avgHumidity: number;
    avgSoilMoisture: number;
    avgCropHealth: number;
    healthyPlots: number;
    warningPlots: number;
    criticalPlots: number;
  };
}

export function SummaryMetrics({ summary }: SummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Average Temperature"
        value={`${summary.avgTemperature.toFixed(1)}°C`}
        icon={<Thermometer className="h-4 w-4" />}
        description="Last 24 hours"
        trend={{ value: 2.5, isPositive: true }}
      />
      <MetricsCard
        title="Average Humidity"
        value={`${summary.avgHumidity.toFixed(1)}%`}
        icon={<Droplets className="h-4 w-4" />}
        description="Last 24 hours"
        trend={{ value: 1.2, isPositive: false }}
      />
      <MetricsCard
        title="Average Soil Moisture"
        value={`${summary.avgSoilMoisture.toFixed(1)}%`}
        icon={<Sprout className="h-4 w-4" />}
        description="Last 24 hours"
        trend={{ value: 3.7, isPositive: false }}
      />
      <MetricsCard
        title="Average Crop Health"
        value={`${summary.avgCropHealth.toFixed(1)}`}
        icon={<LineChart className="h-4 w-4" />}
        description="Last 24 hours"
        trend={{ value: 0.8, isPositive: true }}
      />
    </div>
  );
}
