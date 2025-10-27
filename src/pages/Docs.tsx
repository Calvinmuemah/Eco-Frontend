import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Code, BookOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CodeBlock = ({ code, language = "bash" }: { code: string; language?: string }) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="relative group">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Docs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground">
            RESTful API and WebSocket endpoints for water quality data
          </p>
        </div>

        <div className="max-w-4xl space-y-8">
          {/* Getting Started */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Eco Watch API provides access to real-time water quality data, sensor information, 
                AI analysis, and discharge event tracking. All endpoints return JSON responses.
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">Base URL</h4>
                <CodeBlock code="https://api.ecowatch.example.com" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Authentication (coming soon)</h4>
                <p className="text-sm text-muted-foreground">
                  API key authentication will be required. Include your API key in the Authorization header:
                </p>
                <CodeBlock code='Authorization: Bearer YOUR_API_KEY' />
              </div>
            </CardContent>
          </Card>

          {/* Sensor Endpoints */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <CardTitle>Sensor Data Endpoints</CardTitle>
                </div>
                <Badge variant="outline">REST</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Get Realtime Metrics */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-success/10 text-success border-success/20">GET</Badge>
                  <code className="text-sm">/api/sensor-data/realtime-metrics</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get all current sensor readings with AI summary
                </p>
                
                <div>
                  <div className="text-sm font-semibold mb-2">Response Example</div>
                  <CodeBlock 
                    language="json"
                    code={`{
  "success": true,
  "count": 1,
  "data": [{
    "deviceId": "sensor-01",
    "location": { "lat": -1.286, "lng": 36.817 },
    "parameters": {
      "temperature": 28,
      "pH": 8.4,
      "turbidity": 65,
      "dissolvedOxygen": 3.5,
      "nitrate": 12,
      "phosphate": 0.15
    },
    "bloomRisk": "High",
    "timestamp": "2025-10-11T21:06:30.575Z"
  }],
  "ai_analysis": "Elevated nutrient levels detected..."
}`}
                  />
                </div>
              </div>

              {/* Get Sensor by ID */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Badge className="bg-success/10 text-success border-success/20">GET</Badge>
                  <code className="text-sm">/api/sensor-data/:deviceId</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get latest data for a specific sensor
                </p>
                
                <div>
                  <div className="text-sm font-semibold mb-2">Example Request</div>
                  <CodeBlock 
                    code="curl https://api.ecowatch.example.com/api/sensor-data/sensor-01"
                  />
                </div>
              </div>

              {/* Get History */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Badge className="bg-success/10 text-success border-success/20">GET</Badge>
                  <code className="text-sm">/api/sensor-data/:deviceId/history</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get historical timeseries data for charts
                </p>
                
                <div>
                  <div className="text-sm font-semibold mb-2">Query Parameters</div>
                  <div className="text-sm space-y-1">
                    <div className="flex gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded">hours</code>
                      <span className="text-muted-foreground">Number of hours (default: 24)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Endpoints */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-secondary" />
                <CardTitle>AI Analysis Endpoints</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20">POST</Badge>
                  <code className="text-sm">/api/analysis/summary</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered quality assessment and recommendations
                </p>
                
                <div>
                  <div className="text-sm font-semibold mb-2">Request Body</div>
                  <CodeBlock 
                    language="json"
                    code={`{
  "parameters": {
    "temperature": 28,
    "pH": 8.4,
    "turbidity": 65,
    "dissolvedOxygen": 3.5,
    "nitrate": 12,
    "phosphate": 0.15
  }
}`}
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2">Response</div>
                  <CodeBlock 
                    language="json"
                    code={`{
  "quality": "Poor",
  "bloomRisk": "High",
  "recommendations": [
    "Increase monitoring frequency",
    "Implement nutrient reduction"
  ],
  "monitorNext": ["Dissolved Oxygen", "Temperature"]
}`}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20">POST</Badge>
                  <code className="text-sm">/api/predictions/bloom</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Predict algae bloom probability
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Discharge Endpoints */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Discharge Monitoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-success/10 text-success border-success/20">GET</Badge>
                  <code className="text-sm">/api/discharge/events</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get industrial discharge events
                </p>
                
                <div>
                  <div className="text-sm font-semibold mb-2">Query Parameters</div>
                  <div className="text-sm space-y-1">
                    <div className="flex gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded">from</code>
                      <span className="text-muted-foreground">ISO date (optional)</span>
                    </div>
                    <div className="flex gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded">to</code>
                      <span className="text-muted-foreground">ISO date (optional)</span>
                    </div>
                    <div className="flex gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded">severity</code>
                      <span className="text-muted-foreground">low | medium | high | all</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WebSocket */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-secondary" />
                  <CardTitle>WebSocket Real-time Updates</CardTitle>
                </div>
                <Badge variant="outline">WS</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect to receive real-time sensor updates and alerts
              </p>
              
              <div>
                <div className="text-sm font-semibold mb-2">Connection</div>
                <CodeBlock code="wss://api.ecowatch.example.com/ws/sensors" />
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Message Types</div>
                <CodeBlock 
                  language="json"
                  code={`// Sensor reading
{
  "type": "reading",
  "deviceId": "sensor-01",
  "parameters": { ... },
  "timestamp": "2025-10-11T..."
}

// Alert
{
  "type": "alert",
  "message": "High turbidity detected",
  "deviceId": "sensor-01"
}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chatbot */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Chatbot Endpoints</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20">POST</Badge>
                  <code className="text-sm">/api/chatbot/chat</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send a message to EcoBot and receive a response
                </p>
                
                <div>
                  <div className="text-sm font-semibold mb-2">Request Body</div>
                  <CodeBlock 
                    language="json"
                    code={`{
  "sessionId": "user123",
  "message": "What's the current water quality?"
}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
