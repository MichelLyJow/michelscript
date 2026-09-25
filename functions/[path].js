// functions/[path].js
export async function onRequestGet(context) {
  const { request, env } = context;

  const dest = request.headers.get("sec-fetch-dest");
  const accept = request.headers.get("accept") || "";
  const isBrowser = dest === "document" || accept.includes("text/html");

  if (isBrowser) {
    return env.ASSETS.fetch(request);
  }

  const luauCode = `print("Hello from Michel Script")`;

  return new Response(luauCode, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
