import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

// Minimal hand-written primitive standing in for shadcn/ui's Button — same
// visual intent (variants, sizes) without needing the shadcn CLI to
// generate it, since this project can't reach npm registry to run that here.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors rounded-control disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "bg-arc-blue text-white hover:bg-arc-blue/90",
          variant === "secondary" && "bg-black/5 text-text-primary hover:bg-black/10",
          variant === "ghost" && "hover:bg-black/5 text-text-primary",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
