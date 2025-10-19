import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white placeholder:text-slate-400 shadow-inner shadow-black/40 transition focus-visible:border-[var(--accent-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]/60",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
