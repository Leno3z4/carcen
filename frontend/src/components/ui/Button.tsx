import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-[1px] active:translate-y-0",

  secondary:
    "border border-blue-100 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50",

  ghost:
    "bg-transparent text-slate-600 hover:bg-blue-50 hover:text-blue-700",

  danger:
    "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "h-10 px-4 rounded-xl text-sm",
  md: "h-11 px-5 rounded-2xl text-sm",
  lg: "h-12 px-7 rounded-2xl text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-blue-300",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button };
