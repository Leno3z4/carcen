import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={refref}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-tight transition-all rounded-control disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]",
          variant === "primary" && "bg-arc-blue text-white hover:bg-arc-blue-hover shadow-sm",
          variant === "secondary" && "bg-black/5 text-text-primary hover:bg-black/10 border border-transparent",
          variant === "ghost" && "hover:bg-black/5 text-text-primary",
          size === "sm" && "h-8 px-3 text-xs",
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
