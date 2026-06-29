import * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-gold/10 text-gold border border-gold/20",
  outline: "border border-border-color text-ash",
  secondary: "bg-charcoal text-ash border border-border-color",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-0.5",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
