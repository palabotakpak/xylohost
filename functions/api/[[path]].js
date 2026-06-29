/**
 * XyloHost — REST API
 * =====================
 * API untuk upload, list, info, dan delete file.
 * Bisa diakses dari mana aja via HTTP request.
 *
 * Base URL: https://xylohost.com/api
 *
 * Endpoints:
 *   GET    /api/files             → List semua file
 *   POST   /api/files             → Upload file (JSON { name, content: base64 })
 *   GET    /api/files/{path}      → Info file
 *   DELETE /api/files/{path}      → Hapus file
 *
 * Semua response JSON:
 *   { success: true,  data: ... }
 *   { success: false, error: "..." }
 */

const FALLBACK = {
    owner:  "palabotakpak",
    repo:   "cdn",
    branch: "main",
    token:  "",
};

const GITHUB_API = "https://api.github.com";

/* ─── helpers ──────────────────────────────────────── */

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        },
    });
}

function getConfig(env) {
    return {
        owner:  env.GITHUB_OWNER  || FALLBACK.owner,
        repo:   env.GITHUB_REPO   || FALLBACK.repo,
        branch: env.GITHUB_BRANCH || FALLBACK.branch,
        token:  env.GITHUB_TOKEN || env.VITE_GITHUB_TOKEN || FALLBACK.token,
    };
}

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

/* ─── GitHub API helpers ───────────────────────────── */

function ghHeaders(token) {
    const h = {
        Accept: "application/vnd.github.v3+json",
    };
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
}

async function listGitHubFiles(cfg) {
    const url = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/uploads?ref=${cfg.branch}`;
    const res = await fetch(url, { headers: ghHeaders(cfg.token) });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.filter((f) => f.type === "file").map((f) => ({
        id: f.name,
        name: f.name,
        path: f.path,
        size: formatSize(f.size),
        type: getFileType(f.name),
        ext: getExt(f.name).replace(".", ""),
        sha: f.sha,
        download_url: f.download_url,
    }));
}

async function getGitHubFile(cfg, path) {
    const url = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`;
    const res = await fetch(url, { headers: ghHeaders(cfg.token) });
    if (!res.ok) return null;
    const f = await res.json();
    return {
        id: f.name,
        name: f.name,
        path: f.path,
        size: formatSize(f.size),
        type: getFileType(f.name),
        ext: getExt(f.name).replace(".", ""),
        sha: f.sha,
        download_url: f.download_url,
    };
}

async function deleteGitHubFile(cfg, path, sha) {
    const url = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { ...ghHeaders(cfg.token), "Content-Type": "application/json" },
        body: JSON.stringify({
            message: `Delete: ${path}`,
            branch: cfg.branch,
            sha: sha,
        }),
    });
    return res.ok;
}

/* ─── router ───────────────────────────────────────── */

export async function onRequest(context) {
    const { request, env } = context;
    const cfg = getConfig(env);

    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    let path = url.pathname.replace(/^\/api\//, "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");

    // Handle CORS preflight
    if (method === "OPTIONS") {
        return json({ success: true }, 200);
    }

    // ── GET /api/files ── List semua file ────────────
    if (method === "GET" && (path === "files" || path === "")) {
        try {
            const files = await listGitHubFiles(cfg);
            return json({ success: true, data: files });
        } catch (e) {
            return json({ success: false, error: e.message }, 500);
        }
    }


    // ── PUT /api/upload/{path} ── Upload via proxy ─────
    if (method === "PUT" && path.startsWith("upload/")) {
        try {
            const filePath = path.slice("upload/".length);
            const body = await request.json();
            const ghRes = await fetch(
                `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}`,
                {
                    method: "PUT",
                    headers: {
                        ...ghHeaders(cfg.token),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );
            if (!ghRes.ok) {
                const err = await ghRes.json().catch(() => ({}));
                return json({ success: false, error: err.message || "Upload failed" }, ghRes.status);
            }
            const result = await ghRes.json();
            return json({ success: true, data: result.content }, 201);
        } catch (e) {
            return json({ success: false, error: e.message }, 500);
        }
    }
    // ── POST /api/files ── Upload file ──────────────
    if (method === "POST" && (path === "files" || path === "")) {
        try {
            const body = await request.json();
            const name = body.name;
            const content = body.content; // base64
            const filePath = body.path || "uploads";

            if (!name || !content) {
                return json({ success: false, error: "name and content (base64) are required" }, 400);
            }

            const ts = Date.now();
            const rand = Math.random().toString(36).slice(2, 8);
            const ext = getExt(name);
            const fname = `${ts}-${rand}${ext}`;
            const fullPath = filePath ? `${filePath}/${fname}` : fname;

            const ghRes = await fetch(
                `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${fullPath}`,
                {
                    method: "PUT",
                    headers: {
                        ...ghHeaders(cfg.token),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: `Upload: ${name}`,
                        content: content,
                        branch: cfg.branch,
                    }),
                }
            );

            if (!ghRes.ok) {
                const err = await ghRes.json().catch(() => ({}));
                return json({ success: false, error: err.message || "Upload failed" }, ghRes.status);
            }

            const result = await ghRes.json();
            return json({
                success: true,
                data: {
                    id: fname,
                    name: name,
                    path: fullPath,
                    size: formatSize(content.length * 0.75), // estimate from base64
                    type: getFileType(name),
                    ext: ext.replace(".", ""),
                    sha: result.content?.sha,
                    url: result.content?.download_url,
                },
            }, 201);

        } catch (e) {
            return json({ success: false, error: e.message }, 500);
        }
    }

    // ── GET /api/files/{path} ── Info file ──────────
    if (method === "GET" && path.startsWith("files/")) {
        try {
            const filePath = path.slice("files/".length);
            const file = await getGitHubFile(cfg, filePath);
            if (!file) {
                return json({ success: false, error: "File not found" }, 404);
            }
            return json({ success: true, data: file });
        } catch (e) {
            return json({ success: false, error: e.message }, 500);
        }
    }

    // ── DELETE /api/files/{path} ── Hapus file ─────
    if (method === "DELETE" && path.startsWith("files/")) {
        try {
            const filePath = path.slice("files/".length);
            const file = await getGitHubFile(cfg, filePath);
            if (!file) {
                return json({ success: false, error: "File not found" }, 404);
            }
            const ok = await deleteGitHubFile(cfg, filePath, file.sha);
            if (!ok) {
                return json({ success: false, error: "Failed to delete" }, 500);
            }
            return json({ success: true, data: { deleted: filePath } });
        } catch (e) {
            return json({ success: false, error: e.message }, 500);
        }
    }


    // ── GET /api/ping ── Diagnostic ─────────────────
    if (method === "GET" && path === "ping") {
        return json({
            success: true,
            data: {
                ok: true,
                hasToken: !!cfg.token,
                owner: cfg.owner,
                repo: cfg.repo,
            },
        });
    }
    // ── 404 ─────────────────────────────────────────
    return json({ success: false, error: "Endpoint not found" }, 404);
}







