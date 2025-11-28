import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NeuCard } from "@/components/NeuCard";
import { FileUpload } from "@/components/FileUpload";
import { ScoreCircle } from "@/components/ScoreCircle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FraudResult {
  fraudScore: number;
  redFlags: string[];
  isSafe: boolean;
  analysis: string;
}

const FraudCheck = () => {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [upiId, setUpiId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudResult | null>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!invoiceFile && !upiId && !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please provide at least one detail to check",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let invoiceBase64 = null;
      if (invoiceFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(invoiceFile);
        });
        invoiceBase64 = await base64Promise;
      }

      const { data, error } = await supabase.functions.invoke("analyze-fraud", {
        body: {
          invoice: invoiceBase64,
          upiId: upiId || undefined,
          phoneNumber: phoneNumber || undefined,
        },
      });

      if (error) throw error;

      setResult(data);
      
      // Store result in localStorage for final score
      localStorage.setItem("fraudScore", data.fraudScore.toString());
      
      toast({
        title: "Fraud Check Complete",
        description: "Your fraud assessment is ready",
      });
    } catch (error) {
      console.error("Error checking fraud:", error);
      toast({
        title: "Check Failed",
        description: "Failed to analyze fraud risk. Please try again.",
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-destructive bg-clip-text text-transparent">
              Fraud & Scam Detector
            </h1>
            <p className="text-lg text-muted-foreground">
              Verify invoices, UPI IDs, and contact details for potential scams
            </p>
          </div>

          <NeuCard>
            <Tabs defaultValue="invoice" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
                <TabsTrigger value="upi">UPI ID</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="invoice" className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Invoice/Receipt</Label>
                  <FileUpload
                    onFileSelect={setInvoiceFile}
                    accept="image/*,.pdf"
                    maxSize={10}
                  />
                </div>
              </TabsContent>

              <TabsContent value="upi" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="e.g., merchant@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., +91 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </TabsContent>

              <Button
                onClick={handleCheck}
                disabled={loading || (!invoiceFile && !upiId && !phoneNumber)}
                className="w-full bg-gradient-to-r from-yellow-400 to-destructive hover:opacity-90 transition-opacity"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Check for Fraud"
                )}
              </Button>
            </Tabs>
          </NeuCard>

          {result && (
            <NeuCard glow>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <ScoreCircle score={result.fraudScore} size="lg" label="Fraud Safety Score" />
                </div>

                <div className={`p-6 rounded-xl text-center ${
                  result.isSafe
                    ? "bg-neon-green/10 border-2 border-neon-green"
                    : "bg-destructive/10 border-2 border-destructive"
                }`}>
                  {result.isSafe ? (
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-neon-green" />
                  ) : (
                    <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-destructive" />
                  )}
                  <h3 className={`text-2xl font-bold ${
                    result.isSafe ? "text-neon-green" : "text-destructive"
                  }`}>
                    {result.isSafe ? "Appears Safe" : "Warning: Potential Fraud"}
                  </h3>
                </div>

                {result.redFlags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">Red Flags Detected</h3>
                    {result.redFlags.map((flag, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30"
                      >
                        <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{flag}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Analysis</h4>
                  <p className="text-muted-foreground">{result.analysis}</p>
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

export default FraudCheck;
