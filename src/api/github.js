import CONFIG from "../config";
import { validateFile } from "../lib/validation";
import { nanoid } from "nanoid";
import pRetry, { AbortError } from "p-retry";

const { owner, repo, branch, token } = CONFIG.github;
const { uploadsPath, maxFileSize } = CONFIG.site;
const { method, baseUrl } = CONFIG.proxy;

/* ─── CDN: generate raw URL ────────────────────────── */

function rawUrl(path) {
  if (method === "cloudflare" || method === "php" || method === "vercel" || method === "netlify") {
    return `${baseUrl.replace(/\/+$/, "")}/${path}`;
  }
  if (CONFIG.cdn === "jsdelivr") {
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
  }
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/* ─── helpers ─────────────────────────────────────── */

function getExt(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  const s = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / 1024 ** i).toFixed(i > 0 ? 1 : 0) + " " + s[i];
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function isRetriable(err) {
  if (err instanceof TypeError) return true;
  if (err.status === 429 || (err.status >= 500 && err.status < 600)) return true;
  return false;
}

/* ─── format detection ─────────────────────────────── */

function getFileType(name) {
  const ext = getExt(name).replace(".", "").toLowerCase();
  const images = /^(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif|heic|tiff?)$/;
  const videos = /^(mp4|webm|avi|mov|mkv|m4v|wmv|flv|3gp|ogv|mpe?g)$/;
  const audios = /^(mp3|wav|ogg|flac|m4a|aac|wma|opus)$/;
  const docs   = /^(pdf|docx?|xlsx?|pptx?|odt|ods|odp|rtf|epub|mobi)$/;
  const codes  = /^(js|ts|jsx|tsx|html?|css|py|java|cpp?|h|go|rs|rb|php|swift|kt|dart|lua|sql|sh|bash)$/;
  if (images.test(ext)) return "image";
  if (videos.test(ext)) return "video";
  if (audios.test(ext)) return "audio";
  if (docs.test(ext))   return "document";
  if (codes.test(ext))  return "code";
  return "other";
}

/* ─── public API ──────────────────────────────────── */

export async function uploadFile(file, onProgress) {
  validateFile(file);

  const b64 = await toBase64(file);
  onProgress?.(30);

  const result = await pRetry(async () => {
    const res = await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        content: b64,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      const error = new Error(data.error || "Upload failed");
      error.status = res.status;
      if (!isRetriable(error)) throw new AbortError(error.message);
      throw error;
    }

    return data.data;
  }, {
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 5000,
  });

  onProgress?.(90);
  onProgress?.(100);

  return {
    id: result.id,
    name: result.name,
    size: result.size,
    type: result.type,
    ext: result.ext,
    url: rawUrl(result.path),
    sha: result.sha,
  };
}

export async function listFiles() {
  const res = await fetch("/api/files");
  const data = await res.json();
  if (!data.success) return [];
  return data.data;
}

export async function getFile(path) {
  const res = await fetch(`/api/files/${path}`);
  const data = await res.json();
  if (!data.success) throw new Error("File not found");
  return data.data;
}

export function getFileIcon(type) {
  const icons = {
    image: "tabler:photo", video: "tabler:video", audio: "tabler:music",
    document: "tabler:file", text: "tabler:file-text", archive: "tabler:archive",
    code: "tabler:code", font: "tabler:typography", data: "tabler:database", other: "tabler:file-unknown",
  };
  return icons[type] || "tabler:file-unknown";
}

const PREVIEWABLE_EXTS = new Set([
  "jpg","jpeg","png","gif","webp","svg","bmp","ico","avif","apng","tiff","tif",
  "mp4","webm","mov","avi","mkv","m4v","wmv","flv","3gp","ogv","mpeg","mpg",
  "mp3","wav","ogg","flac","m4a","aac","wma","opus","weba",
  "txt","csv","md","markdown","html","htm","css","js","jsx","ts","tsx",
  "json","xml","yaml","yml","toml","ini","cfg","conf","env","properties",
  "sh","bash","zsh","py","rb","php","java","cpp","c","h","go","rs","sql",
  "swift","kt","dart","lua","pl","r","vue","svelte","astro","pdf",
]);

export function canPreview(ext) {
  return PREVIEWABLE_EXTS.has(ext.toLowerCase());
}

