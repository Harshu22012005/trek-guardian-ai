import { Link } from "react-router-dom";
import { Shield, Heart, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeuCard } from "@/components/NeuCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/xplorevo-logo.jpg";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Truth Check",
      description: "AI-powered misinformation detection for trek images and content",
      color: "text-primary",
      link: "/truth-check",
    },
    {
      icon: Heart,
      title: "Health Predictor",
      description: "Assess altitude risks, AMS probability, and health safety",
      color: "text-primary",
      link: "/health-check",
    },
    {
      icon: AlertTriangle,
      title: "Fraud Detector",
      description: "Scan invoices, UPI IDs, and bookings for scams",
      color: "text-primary",
      link: "/fraud-check",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Xplorevo Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-xl font-bold text-primary">Xplorevo</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                AI-Powered Trek Safety
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              Adventure Guardian AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Verify trek information, assess health risks, and detect fraud before your adventure begins.
              Your AI companion for safe trekking.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <NeuCard hover glow className="h-full group">
                <div className="space-y-4">
                  <div className={`${feature.color} w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                    <span className="text-sm font-medium">Start Scan</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </NeuCard>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <NeuCard className="max-w-4xl mx-auto text-center bg-gradient-to-br from-card via-card to-primary/5">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Get Your Verified Trek Score
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete all three checks to receive a comprehensive safety assessment
              with actionable recommendations for your trek.
            </p>
            <Link to="/final-score">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-lg">
                View Final Score
              </Button>
            </Link>
          </div>
        </NeuCard>
      </section>
    </div>
  );
};

export default Index;
