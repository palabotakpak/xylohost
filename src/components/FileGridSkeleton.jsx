import { motion } from "motion/react";

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse bg-iron opacity-40 ${className || ""}`}
    />
  );
}

export default function FileGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          className="flex items-center gap-3.5 p-4 border border-border-color bg-dark-iron"
        >
          <Skeleton className="w-11 h-11 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
