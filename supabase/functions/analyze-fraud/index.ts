import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FRAUD_PATTERNS = {
  keywords: ["refund", "agent fee", "urgent payment", "processing fee", "last minute deal"],
  upiPatterns: ["@axl", "@ibl", "@okaxis"],
  invoiceRedFlags: ["missing gst", "blurry logo", "incorrect date", "suspicious pricing"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoice, upiId, phoneNumber } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    let prompt = `Analyze the following for potential fraud or scam indicators in the context of trek bookings:

    Known fraud patterns to check:
    - Suspicious keywords: ${FRAUD_PATTERNS.keywords.join(", ")}
    - Suspicious UPI patterns: ${FRAUD_PATTERNS.upiPatterns.join(", ")}
    - Invoice red flags: ${FRAUD_PATTERNS.invoiceRedFlags.join(", ")}
    
    `;

    if (upiId) {
      prompt += `\nUPI ID: ${upiId}`;
    }
    if (phoneNumber) {
      prompt += `\nPhone Number: ${phoneNumber}`;
    }

    prompt += `

    Analyze for fraud indicators and return a JSON object with:
    {
      "fraudScore": <number 0-100, higher means safer>,
      "redFlags": ["<specific red flag found>", ...],
      "isSafe": <boolean>,
      "analysis": "<detailed explanation of findings>"
    }

    Be thorough and look for common scam patterns in trek/travel bookings.`;

    const requestBody: any = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // Add image if invoice is provided
    if (invoice) {
      const base64Data = invoice.split(",")[1];
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data,
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-fraud:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
