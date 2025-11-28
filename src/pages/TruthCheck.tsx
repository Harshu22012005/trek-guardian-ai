import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeuCard } from "@/components/NeuCard";
import { FileUpload } from "@/components/FileUpload";
import { ScoreCircle } from "@/components/ScoreCircle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TruthResult {
  truthScore: number;
  findings: Array<{
    category: string;
    status: "pass" | "warning" | "fail";
    message: string;
  }>;
  explanation: string;
}

const TruthCheck = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TruthResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;

        const { data, error } = await supabase.functions.invoke("analyze-truth", {
          body: { image: base64 },
        });

        if (error) throw error;

        setResult(data);
        
        // Store result in localStorage for final score
        localStorage.setItem("truthScore", data.truthScore.toString());
        
        toast({
          title: "Analysis Complete",
          description: "Truth check results are ready",
        });
      };
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      let errorMessage = "Failed to analyze the image. Please try again.";
      
      if (error?.message?.includes("402")) {
        errorMessage = "Insufficient API credits. Please add credits to your OpenRouter account at https://openrouter.ai/settings/credits";
      } else if (error?.message?.includes("429")) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error?.message?.includes("401")) {
        errorMessage = "Invalid API key. Please check your OpenRouter API key.";
      }
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text text-transparent">
              Truth Check Scanner
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload trek images to detect misinformation, edited content, and verify authenticity
            </p>
          </div>

          <NeuCard>
            <div className="space-y-6">
              <FileUpload
                onFileSelect={setFile}
                accept="image/*"
                maxSize={10}
              />

              <Button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-cyber-blue to-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </div>
          </NeuCard>

          {result && (
            <NeuCard glow>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <ScoreCircle score={result.truthScore} size="lg" label="Truth Score" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Findings</h3>
                  {result.findings.map((finding, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      {finding.status === "pass" ? (
                        <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{finding.category}</p>
                        <p className="text-sm text-muted-foreground">{finding.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Explanation</h4>
                  <p className="text-muted-foreground">{result.explanation}</p>
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

export default TruthCheck;
