import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-blue-100/80",
        "bg-white/90 backdrop-blur-xl",
        "shadow-[0_12px_40px_rgba(59,130,246,.08)]",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_20px_55px_rgba(59,130,246,.14)]",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
