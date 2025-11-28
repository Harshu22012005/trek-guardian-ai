import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertTriangle, Heart, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeuCard } from "@/components/NeuCard";
import { ScoreCircle } from "@/components/ScoreCircle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HealthResult {
  healthScore: number;
  risks: {
    ams: number;
    hydration: number;
    exhaustion: number;
    weather: string;
  };
  recommendations: string[];
}

const HealthCheck = () => {
  const [trekName, setTrekName] = useState("");
  const [altitude, setAltitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResult | null>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!trekName && !altitude) {
      toast({
        title: "Missing Information",
        description: "Please enter trek name or altitude",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-health", {
        body: {
          trekName: trekName || undefined,
          altitude: altitude ? parseInt(altitude) : undefined,
        },
      });

      if (error) throw error;

      setResult(data);
      
      // Store result in localStorage for final score
      localStorage.setItem("healthScore", data.healthScore.toString());
      
      toast({
        title: "Health Check Complete",
        description: "Your health risk assessment is ready",
      });
    } catch (error) {
      console.error("Error checking health:", error);
      toast({
        title: "Check Failed",
        description: "Failed to analyze health risks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-green to-primary bg-clip-text text-transparent">
              Health Risk Predictor
            </h1>
            <p className="text-lg text-muted-foreground">
              Assess altitude sickness risk, hydration needs, and physical demands
            </p>
          </div>

          <NeuCard>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="trekName">Trek Name</Label>
                <Input
                  id="trekName"
                  placeholder="e.g., Kalsubai, Rajmachi"
                  value={trekName}
                  onChange={(e) => setTrekName(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altitude">Altitude (meters)</Label>
                <Input
                  id="altitude"
                  type="number"
                  placeholder="e.g., 1646"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                />
              </div>

              <Button
                onClick={handleCheck}
                disabled={loading || (!trekName && !altitude)}
                className="w-full bg-gradient-to-r from-neon-green to-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Check Health Risks"
                )}
              </Button>
            </div>
          </NeuCard>

          {result && (
            <NeuCard glow>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <ScoreCircle score={result.healthScore} size="lg" label="Health Safety Score" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <p className="text-sm text-muted-foreground mb-1">AMS Risk</p>
                    <p className="text-2xl font-bold text-foreground">{result.risks.ams}%</p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
                    <Droplets className="w-8 h-8 mx-auto mb-2 text-cyber-blue" />
                    <p className="text-sm text-muted-foreground mb-1">Dehydration Risk</p>
                    <p className="text-2xl font-bold text-foreground">{result.risks.hydration}%</p>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-destructive" />
                    <p className="text-sm text-muted-foreground mb-1">Exhaustion Risk</p>
                    <p className="text-2xl font-bold text-foreground">{result.risks.exhaustion}%</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Weather Conditions</h4>
                  <p className="text-muted-foreground">{result.risks.weather}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">Recommendations</h3>
                  {result.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                    >
                      <span className="text-primary font-bold">{index + 1}.</span>
                      <p className="text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>

                <Link to="/final-score">
                  <Button className="w-full" variant="outline">
                    View Final Score
                  </Button>
                </Link>
              </div>
            </NeuCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
