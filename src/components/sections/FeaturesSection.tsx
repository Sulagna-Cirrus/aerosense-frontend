
import { 
  Thermometer, 
  Bell, 
  Globe, 
  Zap
} from "lucide-react";
import { WaterDropIcon } from "@/components/icons/WaterDropIcon";
import { LeafIcon } from "@/components/icons/LeafIcon";

export function FeaturesSection() {
  return (
    <section 
      id="features" 
      className="py-20 container-padding scroll-section scroll-section-2"
    >
      <div className="text-center mb-16">
        <h2 className="text-gradient mb-4">Key Features</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AeroSense provides a comprehensive suite of tools to monitor and analyze crop conditions without physical sensors.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <Thermometer className="h-8 w-8 text-red-500" />,
            title: "Environmental Monitoring",
            description: "Track temperature, humidity, and other environmental factors affecting crop growth."
          },
          {
            icon: <WaterDropIcon className="h-8 w-8 text-blue-500" />,
            title: "Soil Analysis",
            description: "Monitor soil moisture levels and nutrient content to optimize irrigation schedules."
          },
          {
            icon: <LeafIcon className="h-8 w-8 text-green-500" />,
            title: "Crop Health Tracking",
            description: "Track crop health indices to identify and address issues before they escalate."
          },
          {
            icon: <Bell className="h-8 w-8 text-yellow-500" />,
            title: "Real-time Alerts",
            description: "Receive notifications for critical conditions requiring immediate attention."
          },
          {
            icon: <Globe className="h-8 w-8 text-purple-500" />,
            title: "Plot Management",
            description: "Organize and manage multiple plots with different crops and growth stages."
          },
          {
            icon: <Zap className="h-8 w-8 text-orange-500" />,
            title: "Data Analysis",
            description: "Analyze historical data to identify trends and optimize farming practices."
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="glass-effect p-6 rounded-2xl feature-card-hover"
          >
            <div className="p-3 bg-white dark:bg-slate-700 rounded-xl inline-block mb-4 shadow-sm">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
