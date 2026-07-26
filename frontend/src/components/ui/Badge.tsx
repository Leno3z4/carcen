import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "live" | "success" | "warning" | "danger";
}

const variants = {
  default:
    "bg-card border border-border text-text-secondary",

  live:
    "bg-green-500/10 border border-green-500/20 text-green-600",

  success:
    "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600",

  warning:
    "bg-yellow-500/10 border border-yellow-500/20 text-yellow-600",

  danger:
    "bg-red-500/10 border border-red-500/20 text-red-600",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}