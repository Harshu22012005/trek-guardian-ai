import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TREKS = [
  { name: "Kalsubai", altitude: 1646, difficulty: "Hard" },
  { name: "Rajmachi", altitude: 827, difficulty: "Easy" },
  { name: "Harischandragad", altitude: 1424, difficulty: "Medium" },
  { name: "Sinhagad", altitude: 1312, difficulty: "Easy" },
  { name: "Sandhan Valley", altitude: 1350, difficulty: "Medium" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trekName, altitude } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let trekInfo = "";
    let finalAltitude = altitude;

    if (trekName) {
      const trek = TREKS.find(
        (t) => t.name.toLowerCase() === trekName.toLowerCase()
      );
      if (trek) {
        finalAltitude = trek.altitude;
        trekInfo = `Trek: ${trek.name}, Altitude: ${trek.altitude}m, Difficulty: ${trek.difficulty}`;
      }
    }

    const prompt = `Analyze health risks for a trek at ${finalAltitude} meters altitude.
    ${trekInfo ? `Trek details: ${trekInfo}` : ""}
    
    Provide a comprehensive health risk assessment including:
    1. AMS (Acute Mountain Sickness) risk percentage
    2. Dehydration risk percentage
    3. Exhaustion risk percentage
    4. Weather-related health concerns
    5. Practical health recommendations

    Return your analysis as a JSON object with:
    {
      "healthScore": <number 0-100, higher is safer>,
      "risks": {
        "ams": <number 0-100>,
        "hydration": <number 0-100>,
        "exhaustion": <number 0-100>,
        "weather": "<weather conditions and health impact>"
      },
      "recommendations": [
        "<specific health recommendation>",
        ...
      ]
    }

    Base the health score on overall safety, with lower individual risk percentages contributing to a higher health score.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "user", content: prompt }
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
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
    console.error("Error in analyze-health:", error);
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
