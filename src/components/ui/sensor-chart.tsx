
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SensorReading } from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface SensorChartProps {
  title: string;
  data: SensorReading[];
  className?: string;
}

export function SensorChart({ title, data, className }: SensorChartProps) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Process data based on selected period
    const now = new Date();
    let filteredData: SensorReading[] = [];

    switch (period) {
      case "day":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        filteredData = data.filter(
          (reading) => new Date(reading.timestamp) >= yesterday
        );
        break;
      case "week":
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filteredData = data.filter(
          (reading) => new Date(reading.timestamp) >= lastWeek
        );
        break;
      case "month":
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filteredData = data.filter(
          (reading) => new Date(reading.timestamp) >= lastMonth
        );
        break;
    }

    // Format data for Recharts
    const formattedData = filteredData.map((reading) => {
      const date = new Date(reading.timestamp);
      return {
        timestamp: date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          day: period !== 'day' ? '2-digit' : undefined,
          month: period !== 'day' ? '2-digit' : undefined,
        }),
        temperature: parseFloat(reading.temperature.toFixed(1)),
        humidity: parseFloat(reading.humidity.toFixed(1)),
        soilMoisture: parseFloat(reading.soilMoisture.toFixed(1)),
        cropHealth: parseFloat(reading.cropHealth.toFixed(1)),
      };
    });

    setChartData(formattedData);
  }, [data, period]);

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Tabs
            defaultValue="day"
            value={period}
            onValueChange={(value) => setPeriod(value as any)}
            className="w-fit"
          >
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="day" className="text-xs px-2">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-2">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
                }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                iconSize={8} 
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                name="Soil Moisture (%)"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="cropHealth"
                name="Crop Health Index"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
