import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Factory,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  Activity,
  Image as ImageIcon,
} from "lucide-react";

interface Report {
  _id: string;
  location: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Industrial() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 🔁 Fetch reports from backend every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports");
        const json = await res.json();
        if (isMounted) {
          if (json.success) {
            setReports(json.reports);
            setError(null);
          } else {
            setError("Failed to fetch reports");
          }
        }
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
        if (isMounted) setError("Network error while fetching reports");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 3000); // refresh every 3 sec

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 🟢 Helpers
  const getSeverityColor = (severity: string) => {
    const colors = {
      Low: "bg-success/10 text-success border-success/20",
      Medium: "bg-warning/10 text-warning border-warning/20",
      High: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return colors[severity as keyof typeof colors];
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  // 🧮 Filtered data
  const filteredReports = reports.filter((r) => {
    const matchesSeverity =
      selectedSeverity === "All" || r.severity === selectedSeverity;
    const matchesDate =
      !selectedDate ||
      new Date(r.createdAt).toDateString() ===
        new Date(selectedDate).toDateString();
    return matchesSeverity && matchesDate;
  });

  // 🧾 Export CSV
  const exportToCSV = () => {
    const headers = ["Location", "Description", "Severity", "Date", "Time"];
    const rows = filteredReports.map((r) => {
      const { date, time } = formatDate(r.createdAt);
      return [r.location, r.description, r.severity, date, time];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `reports_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🧠 Loading and Error States
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Activity className="h-8 w-8 mb-2 animate-spin" />
        <p>Loading industrial reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  // 🧩 Page Layout
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Environmental Reports</h1>
          <p className="text-muted-foreground">
            Field-reported pollution and discharge incidents from the monitoring network
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 stagger-children">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold numeric text-destructive">
                {reports.filter((r) => r.severity === "High").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">High Severity</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold numeric text-warning">
                {reports.filter((r) => r.severity === "Medium").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Medium Severity</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold numeric text-success">
                {reports.filter((r) => r.severity === "Low").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Low Severity</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold numeric text-primary">
                {reports.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Reports</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6 animate-slide-up">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <label htmlFor="date-filter" className="cursor-pointer">
                <Calendar className="h-4 w-4 mr-2 inline-block" />
                Filter by Date
              </label>
            </Button>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm text-muted-foreground"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-muted-foreground"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Export Button */}
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No matching reports found.
            </p>
          ) : (
            filteredReports.map((report, index) => {
              const { date, time } = formatDate(report.createdAt);
              return (
                <Card
                  key={report._id}
                  className="hover:shadow-lg transition-all hover:border-primary/50 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      {report.imageUrl ? (
                        <div className="w-full md:w-1/3">
                          <img
                            src={report.imageUrl}
                            alt={report.location}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      ) : (
                        <div className="w-full md:w-1/3 flex items-center justify-center bg-muted rounded-lg h-48">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Factory className="h-5 w-5 text-primary" />
                              {report.location}
                            </h3>
                            <Badge className={getSeverityColor(report.severity)}>
                              {report.severity}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {report.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                          <span>{date}</span>
                          <span>•</span>
                          <span>{time}</span>
                          <span>•</span>
                          <FileText className="h-4 w-4" />
                          <span>Report ID: {report._id}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
