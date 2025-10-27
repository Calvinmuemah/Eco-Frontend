import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Droplet,
  Factory,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

// ✅ Define types for data consistency
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

export default function Analysis() {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // 🔁 Fetch backend data every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sensor-data/latest");
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error("❌ Failed to fetch analysis data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 🟢 Dynamic bloom risk badge
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
        <p>Loading AI analysis...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Analysis</h1>
          <p className="text-muted-foreground">
            Real-time machine learning insights for water quality
          </p>
        </div>

        {/* AI Summary Card */}
        <Card className="mb-8 glass border-2 border-primary/20 animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-water flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>AI Summary</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {lastUpdate?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {getRiskBadge(data.bloomRisk)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
              <p>{data.analysis}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Recommended Actions
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Increase monitoring frequency at high-risk sites.</li>
                  <li>Inspect sensors showing unusual readings (e.g., pH = 0).</li>
                  <li>Coordinate with nearby treatment facilities.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Parameters Monitored
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Temp: {data.parameters.temperature}°C</Badge>
                  <Badge variant="outline">pH: {data.parameters.pH}</Badge>
                  <Badge variant="outline">Turbidity: {data.parameters.turbidity}</Badge>
                  <Badge variant="outline">DO: {data.parameters.dissolvedOxygen}</Badge>
                  <Badge variant="outline">NO₃: {data.parameters.nitrate} mg/L</Badge>
                  <Badge variant="outline">PO₄: {data.parameters.phosphate} mg/L</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="quality" className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quality">Water Quality</TabsTrigger>
            <TabsTrigger value="bloom">Bloom Risk</TabsTrigger>
            <TabsTrigger value="discharge">Industrial Discharge</TabsTrigger>
          </TabsList>

          {/* Water Quality Tab */}
          <TabsContent value="quality" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-primary" />
                  Current Water Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The latest readings from <strong>{data.deviceId}</strong> show
                  temperature at <strong>{data.parameters.temperature}°C</strong>, pH{" "}
                  <strong>{data.parameters.pH}</strong>, and turbidity{" "}
                  <strong>{data.parameters.turbidity} NTU</strong>. Dissolved oxygen
                  stands at <strong>{data.parameters.dissolvedOxygen} mg/L</strong>.
                </p>
                <p>
                  Bloom risk is currently categorized as{" "}
                  <strong className="text-destructive">{data.bloomRisk}</strong>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bloom Risk Tab */}
          <TabsContent value="bloom" className="space-y-6 mt-6">
            <Card className="border-2 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Algae Bloom Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>
                  According to AI models, the bloom risk is currently classified as{" "}
                  <strong className="text-destructive">{data.bloomRisk}</strong>.
                </p>
                <p>
                  The water temperature of <strong>{data.parameters.temperature}°C</strong>{" "}
                  and nutrient levels (nitrate:{" "}
                  <strong>{data.parameters.nitrate} mg/L</strong>, phosphate:{" "}
                  <strong>{data.parameters.phosphate} mg/L</strong>) are contributing
                  factors.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industrial Discharge Tab */}
          <TabsContent value="discharge" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-primary" />
                  Industrial Impact Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>
                  No recent abnormal discharge detected in the monitored area.
                  Water quality parameters remain within expected thresholds.
                </p>
                <p>
                  Continue monitoring for spikes in pH or turbidity which may
                  indicate upstream industrial influence.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
