import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplet,
  Thermometer,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { useEffect, useState } from "react";

// ✅ Define TypeScript types for data structure
interface SensorParameters {
  temperature: number;
  pH: number;
  turbidity: number;
  dissolvedOxygen: number;
  nitrate: number;
  phosphate: number;
}

interface Location {
  lat: number;
  lng: number;
}

interface SensorData {
  _id: string;
  deviceId: string;
  location: Location;
  parameters: SensorParameters;
  bloomRisk: string;
  analysis: string;
  timestamp: string;
}

// ✅ Metric card component
const MetricCard = ({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  status
}: {
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
  status: "good" | "warning" | "danger";
}) => {
  const statusColors = {
    good: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  };

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className="hover:shadow-lg transition-shadow animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${statusColors[status]}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={`text-2xl font-bold numeric ${statusColors[status]}`}>
            {value}
          </div>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <TrendIcon className={`h-3 w-3 ${statusColors[status]}`} />
          <span className={`text-xs ${statusColors[status]}`}>
            {trend === "stable"
              ? "Stable"
              : `${trend === "up" ? "Rising" : "Falling"}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// ✅ Main dashboard component
export default function Dashboard() {
  const [data, setData] = useState<SensorData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch backend data every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("https://eco-watch-d05f.onrender.com/api/sensor-data/latest");
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Fetch immediately and every 3 seconds
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getRiskBadge = (risk: string) => {
    const colors = {
      Low: "bg-success/10 text-success border-success/20",
      Medium: "bg-warning/10 text-warning border-warning/20",
      High: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
      <Badge className={colors[risk as keyof typeof colors]}>
        {risk} Risk
      </Badge>
    );
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Activity className="h-10 w-10 mb-2 animate-spin" />
        <p>Loading live sensor data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">Live Dashboard</h1>
            {getRiskBadge(data.bloomRisk)}
          </div>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate?.toLocaleTimeString()}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 stagger-children">
          <MetricCard
            title="Temperature"
            value={data.parameters.temperature}
            unit="°C"
            trend="up"
            icon={Thermometer}
            status={data.parameters.temperature > 30 ? "warning" : "good"}
          />
          <MetricCard
            title="pH Level"
            value={data.parameters.pH}
            unit="pH"
            trend="stable"
            icon={Activity}
            status={
              data.parameters.pH > 9 || data.parameters.pH < 6
                ? "danger"
                : "good"
            }
          />
          <MetricCard
            title="Turbidity"
            value={data.parameters.turbidity}
            unit="NTU"
            trend="down"
            icon={Droplet}
            status={data.parameters.turbidity > 50 ? "warning" : "good"}
          />
          <MetricCard
            title="Dissolved O₂"
            value={data.parameters.dissolvedOxygen}
            unit="mg/L"
            trend="down"
            icon={Activity}
            status={data.parameters.dissolvedOxygen < 5 ? "warning" : "good"}
          />
          <MetricCard
            title="Nitrate"
            value={data.parameters.nitrate}
            unit="mg/L"
            trend="up"
            icon={AlertTriangle}
            status={data.parameters.nitrate > 10 ? "danger" : "good"}
          />
          <MetricCard
            title="Phosphate"
            value={data.parameters.phosphate}
            unit="mg/L"
            trend="stable"
            icon={AlertTriangle}
            status={data.parameters.phosphate > 0.1 ? "warning" : "good"}
          />
        </div>

        {/* AI Analysis */}
        <Card className="animate-slide-up glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-water flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <CardTitle>AI Analysis Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {data.analysis}
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
