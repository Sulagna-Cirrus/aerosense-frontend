
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export function WeatherForecastCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
        <CardDescription>Next 5 days forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <div className="font-medium">Today</div>
              <div className="text-sm text-muted-foreground">Mostly Sunny</div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-yellow-500" />
              <div className="text-lg font-bold">28°C</div>
            </div>
          </div>
          
          {/* Next Days */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { day: "Tomorrow", weather: "Partly Cloudy", temp: "26°C", icon: <CloudSun className="h-5 w-5 text-blue-500" /> },
              { day: "Wednesday", weather: "Scattered Showers", temp: "24°C", icon: <CloudRain className="h-5 w-5 text-blue-500" /> },
              { day: "Thursday", weather: "Sunny", temp: "29°C", icon: <Sun className="h-5 w-5 text-yellow-500" /> },
              { day: "Friday", weather: "Overcast", temp: "25°C", icon: <Cloud className="h-5 w-5 text-gray-500" /> }
            ].map((day, i) => (
              <div key={i} className="p-3 bg-secondary/50 dark:bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{day.day}</div>
                  {day.icon}
                </div>
                <div className="text-sm text-muted-foreground">{day.weather}</div>
                <div className="text-lg font-bold mt-1">{day.temp}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Weather icon components
function Cloud(props: any) {
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}

function CloudRain(props: any) {
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
      <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  )
}

function CloudSun(props: any) {
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
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </svg>
  )
}

function Sun(props: any) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}
