const PREFIX = "Editorial illustration in mixed technique: expressive black charcoal drawing combined with selective oil painting color elements. Background is plain warm cream paper, exact color #FDF6E3, no texture gradient, flat even background. Loose visible charcoal strokes, smudged shading, sketchy construction lines. Everything stays monochrome charcoal on the cream paper except two or three thick oil paint color accents. Editorial magazine style, clean composition, subject centered, lots of empty cream space around the subject, no text, no letters, no words, no numbers, no signature, no logo marks. Subject: ";

const OK_ORIGINS = ["https://heisenbag.com", "https://www.heisenbag.com", "https://heisenbag.pages.dev"];

export async function onRequestPost(ctx) {
  const origin = ctx.request.headers.get("Origin") || "";
  const cors = OK_ORIGINS.includes(origin) ? origin : OK_ORIGINS[0];
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": cors };
  try {
    const body = await ctx.request.json();
    let prompt = String(body.prompt || "").slice(0, 400).trim();
    if (prompt.length < 3) return new Response(JSON.stringify({ error: "prompt too short" }), { status: 400, headers });
    const r = await fetch("https://fal.run/fal-ai/flux-2-klein/4b", {
      method: "POST",
      headers: { "Authorization": "Key " + ctx.env.FAL_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: PREFIX + prompt, image_size: "square", num_images: 1 })
    });
    const d = await r.json();
    const url = d.images && d.images[0] && d.images[0].url;
    if (!url) return new Response(JSON.stringify({ error: "no image" }), { status: 502, headers });
    return new Response(JSON.stringify({ url }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad request" }), { status: 400, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": OK_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
