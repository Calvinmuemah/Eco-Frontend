import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, Users, Droplets, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import sarahJohnson from "@/assets/team-sarah-johnson.jpg";
import davidKimani from "@/assets/team-david-kimani.jpg";
import mariaRodriguez from "@/assets/team-maria-rodriguez.jpg";
import jamesOmondi from "@/assets/team-james-omondi.jpg";
import member1 from "@/assets/member1.jpg";
import member4 from "@/assets/member2.jpg";
import member3 from "@/assets/member3.jpg";
import member2 from "@/assets/member4.jpg";

export default function About() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Eco Watch
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                We're on a mission to protect water resources through real-time monitoring, 
                AI-powered predictions, and actionable insights for communities worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full gradient-water flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide accessible, accurate water quality monitoring that empowers 
                  communities to protect their most vital resource.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Our Technology</h3>
                <p className="text-muted-foreground">
                  Advanced IoT sensors combined with machine learning deliver real-time 
                  insights and predictive analytics for water safety.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full gradient-water flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Our Impact</h3>
                <p className="text-muted-foreground">
                  Serving communities across multiple countries with 50+ active sensors 
                  and 10,000+ daily water quality measurements.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center animate-slide-up">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 animate-slide-up">
                <p>
                  Eco Watch was founded in 2023 by a team of environmental scientists, 
                  engineers, and data scientists who recognized the critical need for 
                  accessible water quality monitoring in developing regions.
                </p>
                <p>
                  What started as a research project at a university has grown into a 
                  comprehensive platform serving communities, governments, and environmental 
                  organizations. Our technology combines affordable IoT sensors with 
                  sophisticated AI analysis to detect pollution, predict algae blooms, 
                  and track industrial discharge.
                </p>
                <p>
                  Today, Eco Watch monitors water quality across rivers, lakes, and coastal 
                  areas, providing early warning systems that help protect public health and 
                  preserve aquatic ecosystems. We believe that access to clean water is a 
                  fundamental human right, and our technology helps make that right a reality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center animate-slide-up">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto stagger-children">
            {[
              { name: "Policap Adongo", role: "CEO & Co-Founder", image: sarahJohnson },
              { name: "Calvin Muemah", role: "CTO & Co-Founder", image: davidKimani },
              { name: "John Kithinji", role: "Lead Data Scientist", image: mariaRodriguez },
              { name: "Mercy Kipkoril", role: "Field Operations Manager", image: jamesOmondi },
              { name: "Mercy Kipkoril", role: "Field Operations Manager", image: member4 },
              { name: "Mercy Kipkoril", role: "Field Operations Manager", image: member3 },
              { name: "Mercy Kipkoril", role: "Field Operations Manager", image: member2 },
              { name: "Mercy Kipkoril", role: "Field Operations Manager", image: member1 },
            ].map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`}
                    className="h-20 w-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8 animate-slide-up">
                <div className="h-16 w-16 rounded-full gradient-water flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Have questions? We'd love to hear from you.
                </p>
              </div>

              <Card className="animate-slide-up">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gradient-water border-0">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
