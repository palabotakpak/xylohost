const OWNER = "palabotakpak";
const REPO = "cdn";
const BRANCH = "main";

const PREVIEWABLE = new Set([
  "jpg","jpeg","png","gif","webp","svg","bmp","ico","avif",
  "mp4","webm","mov","avi","mkv","m4v","ogv","3gp",
  "mp3","wav","ogg","flac","m4a","aac","wma","opus","weba",
  "txt","csv","md","html","htm","css","js","mjs","ts","jsx","tsx",
  "json","xml","yaml","yml","toml","ini","cfg","conf","env",
  "sh","bash","zsh","ps1","bat","py","rb","php",
  "java","cpp","c","h","go","rs","sql","swift","kt","dart","lua","pl",
  "pdf","woff","woff2","ttf","otf","eot",
]);

const MIME_TYPES = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
  mp4: "video/mp4", webm: "video/webm", mp3: "audio/mpeg",
  wav: "audio/wav", pdf: "application/pdf",
  txt: "text/plain", html: "text/html", css: "text/css",
  js: "text/javascript", json: "application/json",
  zip: "application/zip",
};

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  let path = url.pathname.replace(/^\//, "");

  // Handle /f/ prefix (local dev) dan root (production)
  if (path.startsWith("f/")) path = path.slice(2);

  // Abaikan path internal
  if (!path || path.startsWith("assets/") || path.startsWith("@") ||
      path === "favicon.svg" || path === "robots.txt" || path === "sitemap.xml" ||
      path === "icons.svg" || path === "sw.js" || path === "registerSW.js" || path === "manifest.webmanifest" || path.startsWith("workbox-")) {
    return next();
  }

  const ext = path.split(".").pop().toLowerCase();
  if (!/^[a-z0-9]{2,5}$/.test(ext)) return next();

  const cdnUrl = "https://cdn.jsdelivr.net/gh/" + OWNER + "/" + REPO + "@" + BRANCH + "/" + path;

  try {
    const response = await fetch(cdnUrl);
    if (!response.ok) return next();

    const data = await response.arrayBuffer();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const inline = PREVIEWABLE.has(ext);
    const disposition = inline ? "inline" : "attachment; filename=\"" + path.split("/").pop() + "\"";

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": data.byteLength.toString(),
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return next();
  }
}

