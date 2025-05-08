
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { type Alert } from "@/lib/mockData";

interface ActiveAlertsCardProps {
  activeAlerts: Alert[];
}

export function ActiveAlertsCard({ activeAlerts }: ActiveAlertsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Active Alerts</CardTitle>
          <Link to="/alerts">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {activeAlerts.length > 0 ? (
          <div className="space-y-4">
            {activeAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 dark:bg-secondary/20">
                <div className={`mt-0.5 p-1.5 rounded-full ${
                  alert.severity === 'critical' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : alert.severity === 'warning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{alert.plotName}</div>
                    <StatusBadge status={alert.severity} text={alert.severity} className="text-[10px]" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
              <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-medium mb-1">No Active Alerts</h3>
            <p className="text-sm text-muted-foreground">
              All your plots are currently operating within normal parameters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// CheckIcon component
function CheckIcon(props: any) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
