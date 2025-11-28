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
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
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

    const messages: any[] = [
      { role: "user", content: prompt }
    ];

    // Add image if invoice is provided
    if (invoice) {
      const base64Data = invoice.split(",")[1];
      messages[0].content = [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: invoice
          }
        }
      ];
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://xplorevo.com",
          "X-Title": "Xplorevo Adventure Guardian"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: messages,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    
    // Try to extract from markdown code blocks first
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    } else {
      // Fall back to finding JSON object
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
    }

    const result = JSON.parse(jsonText);

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
