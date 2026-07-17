import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are an expert HTML+CSS developer. Given a screenshot of a design, output the HTML+CSS code that reproduces it as closely as possible.

Rules:
- Use a single HTML file with inline <style> tags.
- Use modern CSS (flexbox, grid, custom properties).
- Use system fonts unless the design clearly uses a specific font.
- Output clean, responsive code. Assume 1080x1080 viewport.
- Use placeholder images (via picsum.photos or gradient backgrounds) where the screenshot has images.
- Do NOT wrap the output in markdown code fences. Output pure HTML only.
- Prioritize visual accuracy over pixel perfection.`;

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { image } = await request.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://github.com/nschramm12/content-pipeline",
          "X-Title": "Content Pipeline",
        },
        body: JSON.stringify({
          model: "qwen/qwen3.5-flash-02-23",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Reproduce this design as clean HTML+CSS:",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            },
          ],
          max_tokens: 4096,
          temperature: 0.1,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenRouter error:", res.status, err);
      return NextResponse.json(
        { error: `Model returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const code = data.choices?.[0]?.message?.content;

    if (!code) {
      return NextResponse.json(
        { error: "Model returned empty response" },
        { status: 502 }
      );
    }

    // Strip markdown code fences if the model wrapped them
    const cleaned = code
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return NextResponse.json({ code: cleaned });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}