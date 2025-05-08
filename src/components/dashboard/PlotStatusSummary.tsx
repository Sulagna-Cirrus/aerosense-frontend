
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { type Plot } from "@/lib/mockData";

interface PlotStatusSummaryProps {
  plots: Plot[];
  summary: {
    healthyPlots: number;
    warningPlots: number;
    criticalPlots: number;
  };
}

export function PlotStatusSummary({ plots, summary }: PlotStatusSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plot Status Summary</CardTitle>
        <CardDescription>
          Current status of all monitored plots
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.healthyPlots}
              </div>
              <div className="text-sm font-medium text-green-800 dark:text-green-300">Healthy</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {summary.warningPlots}
              </div>
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Warning</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {summary.criticalPlots}
              </div>
              <div className="text-sm font-medium text-red-800 dark:text-red-300">Critical</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Recent Plot Updates</h4>
            <div className="space-y-2">
              {plots.slice(0, 5).map((plot) => (
                <div key={plot.id} className="flex items-center justify-between p-3 bg-secondary/50 dark:bg-secondary/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={plot.status} />
                    <div>
                      <div className="font-medium">{plot.name}</div>
                      <div className="text-sm text-muted-foreground">{plot.cropType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {plot.lastReading ? `${plot.lastReading.temperature.toFixed(1)}°C` : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plot.lastReading ? `${plot.lastReading.soilMoisture.toFixed(1)}% soil` : "No data"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/plots">
                <Button variant="outline" size="sm">View All Plots</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
