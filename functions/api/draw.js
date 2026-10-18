// Contact-first for now. Do not call the paid image provider.
export function onRequest() {
  return Response.json({ error: "Please email hello@heisenbag.com to describe your piece." }, { status: 410 });
}
