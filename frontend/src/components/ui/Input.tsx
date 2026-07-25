import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-control border border-black/10 bg-white px-3 text-sm tracking-tight outline-none shadow-inner transition-all focus:border-arc-blue focus:ring-1 focus:ring-arc-blue/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
