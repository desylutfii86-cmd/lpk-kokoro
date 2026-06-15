// Edge function: translate Indonesian texts to Japanese using Lovable AI
// POST { texts: string[], target?: "jp" } -> { translations: string[] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, target = "jp" } = await req.json();
    if (!Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ translations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const targetLangName = target === "jp" ? "Japanese (日本語)" : "Indonesian";

    const systemPrompt = `You are a professional translator. Translate each given Indonesian text into ${targetLangName}.
Rules:
- Keep proper nouns/brand names like "LPK SO KOKORO BREBES", "JLPT", "Tokutei Ginou", "Ginou Jisshusei", "Brebes", "Jepang/Japan", "IM Japan" unchanged or use natural Japanese form when applicable.
- Keep the meaning natural and concise.
- Return EXACTLY the same number of translations, in the SAME order, via the tool call.
- Do not add explanations.`;

    const userPrompt = `Translate these ${texts.length} Indonesian texts to ${targetLangName}:\n\n${texts
      .map((t: string, i: number) => `${i + 1}. ${t}`)
      .join("\n")}`;

    const aiRes = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_translations",
                description: "Return translated texts in the same order.",
                parameters: {
                  type: "object",
                  properties: {
                    translations: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["translations"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "return_translations" },
          },
        }),
      },
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error", aiRes.status, errText);
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;
    let translations: string[] = [];
    try {
      const parsed = typeof args === "string" ? JSON.parse(args) : args;
      translations = Array.isArray(parsed?.translations)
        ? parsed.translations
        : [];
    } catch (e) {
      console.error("Failed to parse tool args", e);
    }

    // Pad/truncate to match input length
    if (translations.length !== texts.length) {
      const out: string[] = [];
      for (let i = 0; i < texts.length; i++) {
        out.push(translations[i] ?? texts[i]);
      }
      translations = out;
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
