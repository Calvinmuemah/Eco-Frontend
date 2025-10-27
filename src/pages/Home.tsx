import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { 
  Droplets, 
  Brain, 
  Factory, 
  Radio,
  TrendingUp,
  Shield,
  ArrowRight,
  Waves,
  Activity,
  Bell
} from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className="numeric">{count}</span>;
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-water-radial"></div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Water monitoring" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Monitor Water Quality.{" "}
              <span className="bg-gradient-water bg-clip-text text-transparent">
                Predict Algae Blooms.
              </span>{" "}
              Track Discharge.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Real-time sensors + AI analysis for safer water. Protect your community with 
              data-driven environmental monitoring.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gradient-water border-0 text-lg">
                  Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {/* <Link to="/docs">
                <Button size="lg" variant="outline" className="text-lg">
                  View API Docs
                </Button>
              </Link> */}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 stagger-children">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter end={50} />+
                </div>
                <div className="text-sm text-muted-foreground mt-1">Active Sensors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary">
                  <AnimatedCounter end={10000} />+
                </div>
                <div className="text-sm text-muted-foreground mt-1">Daily Readings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter end={99} />%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Water Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced IoT sensors combined with AI-powered analytics to keep water safe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Radio className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Real-time IoT</h3>
                <p className="text-sm text-muted-foreground">
                  Live data from 50+ sensors monitoring temperature, pH, turbidity, and more
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Bloom Prediction</h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning models predict algae blooms 24-48 hours in advance
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-destructive transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <Factory className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Discharge Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Track and monitor industrial discharge events with instant notifications
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Open API</h3>
                <p className="text-sm text-muted-foreground">
                  RESTful API and WebSocket support for seamless integration
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to better water quality monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-children">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full gradient-water flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent mb-4"></div>
              <h3 className="font-semibold text-xl mb-2">1. Sense</h3>
              <p className="text-muted-foreground">
                IoT sensors continuously monitor water parameters across multiple locations
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full gradient-water flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent mb-4"></div>
              <h3 className="font-semibold text-xl mb-2">2. Analyze</h3>
              <p className="text-muted-foreground">
                AI models process data in real-time to detect anomalies and predict risks
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full gradient-water flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent mb-4"></div>
              <h3 className="font-semibold text-xl mb-2">3. Alert</h3>
              <p className="text-muted-foreground">
                Instant notifications via email, SMS, or web when thresholds are exceeded
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8 md:p-12 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Monitor Your Water?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join organizations worldwide using Eco Watch to protect their water resources
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-water border-0">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
