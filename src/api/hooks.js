import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFiles, getFile, uploadFile as uploadApi } from "./github";

export const FILES_KEY = ["xylohost", "files"];

/* ─── List all files ──────────────────────────────── */

export function useFiles() {
  return useQuery({
    queryKey: FILES_KEY,
    queryFn: listFiles,
  });
}

/* ─── Get single file ─────────────────────────────── */

export function useFile(path) {
  return useQuery({
    queryKey: [...FILES_KEY, path],
    queryFn: () => getFile(path),
    enabled: !!path,
  });
}

/* ─── Upload file ──────────────────────────────────── */

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }) => uploadApi(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FILES_KEY });
    },
  });
}
