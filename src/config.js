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
    baseUrl: "https://cdn.xyloapi.qzz.io/f",
  },
  site: {
    name: "XyloHost",
    domain: typeof window !== "undefined" ? window.location.origin : "",
    maxFileSize: 20 * 1024 * 1024,
    uploadsPath: "",
  },
};

export default CONFIG;
