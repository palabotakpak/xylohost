import { z } from "zod";

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXTS = [
  "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif", "heic", "tiff", "tif",
  "mp4", "webm", "avi", "mov", "mkv", "m4v", "wmv", "flv", "3gp", "ogv", "mpeg", "mpg",
  "mp3", "wav", "ogg", "flac", "m4a", "aac", "wma", "opus", "weba",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "rtf", "epub", "mobi",
  "txt", "csv", "md", "markdown", "html", "htm", "css", "js", "mjs", "ts", "jsx", "tsx",
  "json", "xml", "yaml", "yml", "toml", "ini", "cfg", "conf", "env",
  "sh", "bash", "zsh", "ps1", "bat", "py", "rb", "php", "java", "cpp", "c", "h", "go", "rs",
  "sql", "swift", "kt", "dart", "lua", "pl", "r", "vue", "svelte", "astro",
  "zip", "tar", "gz", "bz2", "7z", "rar",
  "woff", "woff2", "ttf", "otf", "eot",
];

const extSchema = z.string().min(1).max(20).refine(
  (ext) => ALLOWED_EXTS.includes(ext.toLowerCase()),
  { message: "File type is not supported" }
);

export const fileUploadSchema = z.object({
  name: z.string()
    .min(1, "File name is required")
    .max(255, "File name is too long")
    .refine((name) => !/[<>:"/\\|?*]/.test(name), {
      message: "File name contains invalid characters",
    }),
  size: z.number()
    .positive("File is empty")
    .max(MAX_SIZE, "File exceeds 20 MB limit"),
  type: z.string().optional(),
}).refine(
  (data) => {
    const ext = data.name.split(".").pop() || "";
    return extSchema.safeParse(ext).success;
  },
  { message: "File type is not supported" }
);

export function validateFile(file) {
  const result = fileUploadSchema.safeParse({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    throw new Error(errors[0]);
  }

  return result.data;
}
