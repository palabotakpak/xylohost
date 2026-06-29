import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { getFileIcon } from "../api/github";
import { useUploadFile } from "../api/hooks";
import ProgressBar from "./ProgressBar";

export default function UploadZone() {
  const [progress, setProgress] = useState(null);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const uploadMutation = useUploadFile();

  const handleFiles = useCallback(async (files) => {
    setResult(null);
    for (const file of files) {
      try {
        setProgressLabel(`Uploading ${file.name}...`);
        const res = await uploadMutation.mutateAsync({
          file,
          onProgress: (p) => setProgress(p),
        });
        setResult(res);
        toast("Upload successful!", {
          description: `${file.name} (${res.size})`,
        });
      } catch (err) {
        toast.error(err.message || "Upload failed", {
          description: file.name,
        });
      } finally {
        setProgress(null);
      }
    }
  }, [uploadMutation]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) handleFiles(acceptedFiles);
  }, [handleFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !!result,
  });

  const reset = () => { setResult(null); setCopied(false); };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      toast("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div>
      {/* Drop zone */}
      <motion.div
        {...getRootProps()}
        animate={isDragActive ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`
          cursor-pointer border-2 border-dashed p-12 sm:p-16 text-center
          transition-colors duration-200 outline-none
          ${isDragActive
            ? "border-gold bg-gold/5 shadow-[0_0_60px_rgba(255,192,0,0.1)]"
            : "border-border-color hover:border-gold/50 bg-dark-iron"}
          ${result ? "hidden" : "block"}
        `}
      >
        <input {...getInputProps()} />
        <Icon icon="tabler:cloud-upload" width="48" height="48" className="mx-auto mb-4 opacity-60 text-ash" />
        <h2 className="font-display text-xl font-semibold mb-1" style={{ color: "var(--dropzone-heading)" }}>
          {isDragActive ? "Letakan file di sini..." : "Seret dan lepaskan file"}
        </h2>
        <p className="font-display text-sm text-ash mb-4">atau klik untuk menelusuri hingga 20 MB</p>
      </motion.div>

      <AnimatePresence>
        {progress != null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressBar percent={progress} label={progressLabel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Card className="p-5 mt-6">
              <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border-color">
                <span className="w-11 h-11 flex items-center justify-center bg-black border border-border-color">
                  <Icon icon={getFileIcon(result.type)} width="22" height="22" className="text-gold" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-sm truncate">{result.name}</p>
                  <p className="font-mono text-xs text-ash">{result.size} &middot; {result.type} &middot; <span className="text-gold uppercase">{result.ext}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black border border-border-color p-1">
                <Input className="border-0 bg-transparent text-xs" value={result.url} readOnly onClick={(e) => e.target.select()} />
                <Button
                  variant={copied ? "secondary" : "gold"}
                  size="sm"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              <div className="flex gap-2 mt-3">
                <a href={result.url} target="_blank" rel="noopener" className="flex-1">
                  <Button variant="gold" size="default" className="w-full">Buka File</Button>
                </a>
                <Button variant="outline" size="default" onClick={reset} className="flex-1">
                  <Icon icon="tabler:refresh" className="inline-block align-middle mr-1.5" width="14" height="14" />
                  Upload Lain
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

