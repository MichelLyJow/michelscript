export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const param = url.searchParams.get("p");

  const dest = request.headers.get("sec-fetch-dest");
  const accept = request.headers.get("accept");
  const isBrowser = dest === "document" || accept?.includes("text/html");

  if (isBrowser && !param) {
    return env.ASSETS.fetch(request);
  }

  if (!param) {
    return new Response("-- Error: Parameter tidak ada!", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  // Otomatis ngambil file mentah dari GitHub lu berdasarkan nilai ?p=
  const rawUrl = `https://raw.githubusercontent.com/MichelLyJow/michelscript/main/scripts/${param}.lua`;
  
  try {
    const res = await fetch(rawUrl);
    if (!res.ok) {
      return new Response("-- Error: Script tidak ditemukan di GitHub!", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }
    const scriptCode = await res.text();
    return new Response(scriptCode, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    return new Response("-- Error: Gagal mengambil script!", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
}
