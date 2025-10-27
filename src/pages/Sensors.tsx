import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Activity, Clock, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Sensors.css"; // 🌊 for marker animations

// ✅ Fix Leaflet default icons for React/Vite builds
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Parameters {
  temperature: number;
  pH: number;
  turbidity: number;
  dissolvedOxygen: number;
  nitrate: number;
  phosphate: number;
}

interface SensorReading {
  _id: string;
  deviceId: string;
  location: { lat: number; lng: number };
  parameters: Parameters;
  bloomRisk: string;
  analysis: string;
  timestamp: string;
}

interface SensorDisplay {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  lat: number;
  lng: number;
  status: "active" | "warning" | "offline";
  lastReading: string;
  parameters: number;
}

export default function Sensors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sensorList, setSensorList] = useState<SensorDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🗺️ Water body names
  const waterBodyMap: Record<string, string> = {
    "sensor-01": "Nairobi River - Upstream",
    "sensor-02": "Nairobi River - Midstream",
    "sensor-03": "Nairobi River - Downstream",
    "sensor-04": "Lake Victoria - North Shore",
    "sensor-05": "Tana River",
  };

  // 🔁 Fetch from `/api/sensor-data/latest` every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchSensors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sensor-data/latest");
        const data = await res.json();

        // Normalize shape: may be an object or array
        let readings: SensorReading[] = [];

        if (Array.isArray(data)) {
          readings = data;
        } else if (data.success && Array.isArray(data.data)) {
          readings = data.data;
        } else if (data.deviceId) {
          readings = [data];
        }

        if (isMounted && readings.length > 0) {
          const processed = processSensors(readings);
          setSensorList(processed);
        }
      } catch (err) {
        console.error("❌ Error fetching sensor data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSensors();
    const interval = setInterval(fetchSensors, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 🧮 Determine sensor statuses
  const processSensors = (readings: SensorReading[]): SensorDisplay[] => {
    return readings.map((r) => {
      const { temperature, pH, turbidity, dissolvedOxygen, nitrate, phosphate } = r.parameters;

      const allZero =
        temperature === 0 &&
        pH === 0 &&
        turbidity === 0 &&
        dissolvedOxygen === 0 &&
        nitrate === 0 &&
        phosphate === 0;

      const abnormal =
        temperature > 30 || nitrate > 10 || pH < 6.5 || pH > 8.5 || dissolvedOxygen < 3;

      const status = allZero ? "offline" : abnormal ? "warning" : "active";
      const lastReading = new Date(r.timestamp).toLocaleTimeString();

      return {
        id: r.deviceId,
        name: waterBodyMap[r.deviceId] || `Water Body ${r.deviceId}`,
        location: `${r.location.lat.toFixed(3)}, ${r.location.lng.toFixed(3)}`,
        coordinates: `${r.location.lat.toFixed(3)}, ${r.location.lng.toFixed(3)}`,
        lat: r.location.lat,
        lng: r.location.lng,
        status,
        lastReading,
        parameters: 6,
      };
    });
  };

  // 🎨 Helpers
  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      offline: "bg-muted text-muted-foreground border-border",
    };
    return colors[status as keyof typeof colors];
  };

  const filteredSensors = sensorList.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Activity className="h-8 w-8 mb-2 animate-spin" />
        <p>Loading sensors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sensors</h1>
          <p className="text-muted-foreground">Live water quality data and sensor health</p>
        </div>

        {/* Search */}
        <div className="mb-6 animate-slide-up">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
              <div>
                <div className="text-2xl font-bold text-success">
                  {sensorList.filter((s) => s.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active Sensors</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-warning animate-blink" />
              <div>
                <div className="text-2xl font-bold text-warning">
                  {sensorList.filter((s) => s.status === "warning").length}
                </div>
                <div className="text-sm text-muted-foreground">Warning State</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-muted-foreground" />
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {sensorList.filter((s) => s.status === "offline").length}
                </div>
                <div className="text-sm text-muted-foreground">Offline</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="mb-8 animate-slide-up">
          <CardContent className="p-0">
            <MapContainer
              center={[-1.286, 36.817]}
              zoom={6}
              scrollWheelZoom={false}
              style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
              {sensorList.map((sensor) => (
                <Marker
                  key={sensor.id}
                  position={[sensor.lat, sensor.lng]}
                  icon={L.divIcon({
                    className: `marker-${sensor.status}`,
                    html: `<div class="pulse-marker ${sensor.status}"></div>`,
                  })}
                >
                  <Popup>
                    <strong>{sensor.name}</strong>
                    <br />
                    {sensor.coordinates}
                    <br />
                    Status:{" "}
                    <span
                      style={{
                        color:
                          sensor.status === "active"
                            ? "green"
                            : sensor.status === "warning"
                            ? "orange"
                            : "gray",
                      }}
                    >
                      {sensor.status.toUpperCase()}
                    </span>
                    <br />
                    Last Reading: {sensor.lastReading}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        {/* Sensor Cards */}
        <div className="space-y-4">
          {filteredSensors.map((sensor, index) => (
            <Card
              key={sensor.id}
              className="hover:shadow-lg transition-all hover:border-primary/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{sensor.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {sensor.coordinates}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {sensor.lastReading}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{sensor.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(sensor.status)}>
                      {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/sensor/${sensor.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Monitoring {sensor.parameters} parameters: Temperature, pH, Turbidity, DO,
                    Nitrate, Phosphate
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
