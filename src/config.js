const CONFIG = {
  github: {
    owner: "palabotakpak",
    repo: "cdn",
    branch: "main",
    token: import.meta.env.VITE_GITHUB_TOKEN || "",
  },
  cdn: "jsdelivr",
  proxy: {
    method: "cloudflare",
    baseUrl: typeof window !== "undefined"
      ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? window.location.origin + "/f"
        : window.location.origin
      : "",
  },
  site: {
    name: "XyloHost",
    domain: typeof window !== "undefined" ? window.location.origin : "",
    maxFileSize: 20 * 1024 * 1024,
    uploadsPath: "",
  },
};

export default CONFIG;

