import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      viteCompression({
        algorithm: "gzip",
        ext: ".gz",
        deleteOriginFile: false,
        threshold: 1024,
      }),
      viteCompression({
        algorithm: "brotliCompress",
        ext: ".br",
        deleteOriginFile: false,
        threshold: 1024,
      }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["**/*"],
        manifest: {
          name: "XyloHost — Upload & Share Any File Instantly",
          short_name: "XyloHost",
          description: "Upload, share, and host any file type — images, videos, code, documents.",
          theme_color: "#000000",
          background_color: "#000000",
          display: "standalone",
          orientation: "any",
          start_url: "/",
          icons: [
            {
              src: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>",
              sizes: "192x192",
              type: "image/svg+xml",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "cdn-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
      {
        name: "api-handler",
        configureServer(server) {
          server.middlewares.use("/api", async (req, res, next) => {
            if (req.method !== "POST" || !req.url.startsWith("/files")) return next();

            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
              try {
                const { name, content } = JSON.parse(body);
                const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : "";
                const rand = Math.random().toString(36).slice(2, 12);
                const fname = rand + ext;

                const ghRes = await fetch(
                  "https://api.github.com/repos/palabotakpak/cdn/contents/" + fname,
                  {
                    method: "PUT",
                    headers: {
                      Authorization: "Bearer " + (env.VITE_GITHUB_TOKEN || ""),
                      "User-Agent": "XyloHost/2.0",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: "Upload: " + name,
                      content,
                      branch: "main",
                    }),
                  }
                );

                const ghData = await ghRes.json();
                if (!ghRes.ok) {
                  res.statusCode = ghRes.status;
                  res.setHeader("Content-Type", "application/json");
                  return res.end(JSON.stringify({ success: false, error: ghData.message || "Upload failed" }));
                }

                const s = ["B", "KB", "MB", "GB"];
                const i = Math.floor(Math.log(content.length * 0.75) / Math.log(1024));
                const size = (content.length * 0.75 / 1024 ** i).toFixed(i > 0 ? 1 : 0) + " " + s[i];

                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                  success: true,
                  data: {
                    id: fname,
                    name,
                    path: fname,
                    size,
                    type: "other",
                    ext: ext.replace(".", ""),
                    sha: ghData.content?.sha,
                  },
                }));
              } catch (e) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
            });
          });
        },
      },
    ],
    server: {
      proxy: {
        "/f": {
          target: "https://cdn.jsdelivr.net",
          changeOrigin: true,
          rewrite: (path) => {
            const p = path.replace("/f/", "");
            return "/gh/palabotakpak/cdn@main/" + p;
          },
        },
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
              return "vendor-react";
            }
            if (id.includes("node_modules/react-router") || id.includes("node_modules/@tanstack/react-query")) {
              return "vendor-libs";
            }
            if (id.includes("node_modules/motion") || id.includes("node_modules/framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("node_modules/@iconify") || id.includes("node_modules/sonner") || id.includes("node_modules/react-helmet-async")) {
              return "vendor-ui";
            }
          },
        },
      },
    },
  };
});

