
import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="container-padding max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">Our Story</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            AeroSense was born from a vision to revolutionize agricultural monitoring through accessible technology.
          </p>
        </div>

        {/* Story Section */}
        <div className="prose dark:prose-invert max-w-4xl mx-auto space-y-6">
          <p>
            In early 2024, three passionate technologists came together with a shared vision: to make advanced agricultural monitoring accessible to everyone. They identified a crucial pain point in the agriculture sector - the high cost and complexity of existing monitoring solutions that left many farmers unable to leverage modern technology.
          </p>
          
          <p>
            The journey began when Swatik Baral, our frontend architect, noticed how local farmers struggled with expensive hardware-based monitoring systems. He envisioned a more accessible solution that could work with minimal equipment. Connecting with Sulagna, who brought extensive backend development expertise, and Priyanshu, a database management specialist, the team was formed with complementary skills and a shared mission.
          </p>

          <p>
            Each team member brought their unique expertise to the table:
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <LayoutGrid className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Swatik Baral</h3>
                <p className="text-muted-foreground">Frontend Development</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Led the frontend development, creating an intuitive and responsive interface that makes complex data easily accessible to users.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <LayoutGrid className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Sulagna</h3>
                <p className="text-muted-foreground">Backend Development</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Architected the robust backend infrastructure, ensuring seamless data processing and real-time monitoring capabilities.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <LayoutGrid className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Priyanshu</h3>
                <p className="text-muted-foreground">Database Management</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Designed and optimized the database architecture, ensuring efficient data storage and retrieval for scalable operations.
            </p>
          </Card>
        </div>

        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gradient">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            Today, AeroSense stands as a testament to our commitment to democratizing agricultural technology. We continue to innovate and expand our platform, making advanced monitoring tools accessible to farmers worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
