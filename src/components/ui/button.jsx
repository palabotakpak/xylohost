import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-xs font-mono font-bold tracking-[0.05em] uppercase transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        variant === "default" && "bg-white text-black hover:bg-[#eaeaea] active:bg-[#d8d8d8]",
        variant === "gold" && "bg-gold text-black hover:bg-[#f6cd4b] active:bg-[#cc9f1c] shadow-[0_0_12px_rgba(212,175,55,0.2)] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)]",
        variant === "outline" && "border border-border-color bg-transparent text-white hover:bg-ghost-hover-bg hover:border-white/50 active:bg-white/10",
        variant === "secondary" && "bg-charcoal text-white hover:bg-charcoal/85 border border-border-color",
        variant === "ghost" && "text-white/80 hover:text-white hover:bg-ghost-hover-bg",
        variant === "link" && "text-gold underline-offset-4 hover:underline",
        size === "default" && "h-[42px] px-5 py-2",
        size === "sm" && "h-8 px-3 text-[10px]",
        size === "lg" && "h-[48px] px-8 py-3 text-sm",
        size === "icon" && "h-10 w-10",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
