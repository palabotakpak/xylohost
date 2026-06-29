import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[42px] w-full border border-border-color bg-black px-3 py-2.5 font-mono text-xs text-white outline-none transition-colors placeholder:text-ash/50 focus:border-gold disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
