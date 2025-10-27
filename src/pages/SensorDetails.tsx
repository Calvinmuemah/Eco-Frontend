import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Activity } from "lucide-react";

export default function SensorDetails() {
  const { id } = useParams();
  const [sensor, setSensor] = useState<any>(null);

  useEffect(() => {
    const fetchSensor = async () => {
      const res = await fetch(`https://eco-watch-d05f.onrender.com/api/sensor-data/latest`);
      const data = await res.json();
      const readings = Array.isArray(data) ? data : data.data ? data.data : [data];
      const found = readings.find((r: any) => r.deviceId === id);
      setSensor(found);
    };
    fetchSensor();
  }, [id]);

  if (!sensor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Activity className="h-8 w-8 mb-2 animate-spin" />
        <p>Loading sensor details...</p>
      </div>
    );
  }

  const { parameters, bloomRisk, analysis, timestamp } = sensor;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold mb-4">{sensor.deviceId}</h1>
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-lg">Live Parameters</h2>
            {Object.entries(parameters).map(([key, val]) => (
              <p key={key}>
                <strong>{key.toUpperCase()}:</strong> {val}
              </p>
            ))}
            <p><strong>Bloom Risk:</strong> {bloomRisk}</p>
            <p><strong>Last Updated:</strong> {new Date(timestamp).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-2">AI Analysis</h2>
            <p className="whitespace-pre-line text-muted-foreground">{analysis}</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
