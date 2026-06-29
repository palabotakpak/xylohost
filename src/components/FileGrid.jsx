import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import FileGridSkeleton from "./FileGridSkeleton";
import { Badge } from "./ui/badge";
import { getFileIcon } from "../api/github";

export default function FileGrid({ files }) {
  if (files == null) {
    return <FileGridSkeleton count={6} />;
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-20 text-ash">
        <Icon icon="tabler:inbox-off" width="48" height="48" className="mx-auto mb-4 opacity-30" />
        <h3 className="font-display text-base font-semibold text-white mb-1">No files yet</h3>
        <p className="font-display text-sm">Upload your first file to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {files.map((f, i) => (
        <motion.a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noopener"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          className="no-underline text-inherit cursor-pointer group"
        >
          <Card className="p-4 flex items-center gap-3.5 hover:border-gold/50 transition-all duration-200 group-hover:border-gold/50">
            <span className="w-11 h-11 flex items-center justify-center bg-black border border-border-color shrink-0 group-hover:border-gold/30 transition-colors">
              <Icon icon={getFileIcon(f.type)} width="22" height="22" className="text-ash group-hover:text-gold transition-colors" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-sm truncate group-hover:text-gold transition-colors">{f.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-ash">{f.size}</span>
                <Badge variant="default">{f.type}</Badge>
              </div>
            </div>
          </Card>
        </motion.a>
      ))}
    </div>
  );
}
