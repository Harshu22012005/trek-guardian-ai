import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Heart, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeuCard } from "@/components/NeuCard";
import { ScoreCircle } from "@/components/ScoreCircle";

const FinalScore = () => {
  const [scores, setScores] = useState({
    truth: 0,
    health: 0,
    fraud: 0,
    final: 0,
  });

  useEffect(() => {
    const truthScore = parseInt(localStorage.getItem("truthScore") || "0");
    const healthScore = parseInt(localStorage.getItem("healthScore") || "0");
    const fraudScore = parseInt(localStorage.getItem("fraudScore") || "0");

    // Calculate weighted final score
    const finalScore = Math.round(
      truthScore * 0.4 + healthScore * 0.3 + fraudScore * 0.3
    );

    setScores({
      truth: truthScore,
      health: healthScore,
      fraud: fraudScore,
      final: finalScore,
    });
  }, []);

  const getStatusColor = (score: number) => {
    if (score >= 75) return "text-neon-green";
    if (score >= 50) return "text-yellow-400";
    return "text-destructive";
  };

  const getStatusText = (score: number) => {
    if (score >= 75) return "Safe to Proceed";
    if (score >= 50) return "Proceed with Caution";
    return "High Risk - Not Recommended";
  };

  const handleReset = () => {
    localStorage.removeItem("truthScore");
    localStorage.removeItem("healthScore");
    localStorage.removeItem("fraudScore");
    setScores({ truth: 0, health: 0, fraud: 0, final: 0 });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyber-blue via-neon-green to-primary bg-clip-text text-transparent">
              Verified Trek Score
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive safety assessment based on all checks
            </p>
          </div>

          <NeuCard glow className="bg-gradient-to-br from-card via-card to-primary/10">
            <div className="text-center space-y-6">
              <ScoreCircle score={scores.final} size="lg" label="Overall Score" />
              
              <div className={`text-3xl font-bold ${getStatusColor(scores.final)}`}>
                {getStatusText(scores.final)}
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-cyber-blue/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <ScoreCircle score={scores.truth} size="sm" label="Truth Score" />
                  <Link to="/truth-check">
                    <Button variant="outline" className="w-full" size="sm">
                      {scores.truth === 0 ? "Start Check" : "Re-check"}
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-neon-green/10 flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6 text-neon-green" />
                  </div>
                  <ScoreCircle score={scores.health} size="sm" label="Health Score" />
                  <Link to="/health-check">
                    <Button variant="outline" className="w-full" size="sm">
                      {scores.health === 0 ? "Start Check" : "Re-check"}
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-400/10 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <ScoreCircle score={scores.fraud} size="sm" label="Fraud Score" />
                  <Link to="/fraud-check">
                    <Button variant="outline" className="w-full" size="sm">
                      {scores.fraud === 0 ? "Start Check" : "Re-check"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </NeuCard>

          <NeuCard>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Recommendations</h3>
              {scores.final >= 75 && (
                <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/30">
                  <p className="text-muted-foreground">
                    ✓ All safety checks passed. You're ready for your trek! Make sure to
                    carry essential supplies and inform someone about your plans.
                  </p>
                </div>
              )}
              {scores.final >= 50 && scores.final < 75 && (
                <div className="p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
                  <p className="text-muted-foreground">
                    ⚠ Some concerns detected. Review the individual check results and take
                    necessary precautions before proceeding with your trek.
                  </p>
                </div>
              )}
              {scores.final < 50 && scores.final > 0 && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-muted-foreground">
                    ⛔ Multiple safety concerns identified. We strongly recommend
                    reconsidering this trek or addressing the flagged issues first.
                  </p>
                </div>
              )}
              {scores.final === 0 && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-muted-foreground">
                    Complete all three safety checks to receive your comprehensive trek
                    verification score and recommendations.
                  </p>
                </div>
              )}
            </div>
          </NeuCard>

          <div className="flex gap-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All Scores
            </Button>
            <Link to="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-cyber-blue to-neon-green">
                New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;
