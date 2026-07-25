import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "live" | "yes" | "no";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-black/5 text-text-secondary",
        variant === "live" && "bg-emerald-50 text-emerald-600",
        variant === "yes" && "bg-emerald-50 text-emerald-600",
        variant === "no" && "bg-red-50 text-red-600",
        className
      )}
      {...props}
    />
  );
}
