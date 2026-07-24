import { HTMLAttributes } from "react";
import clsx from "clsx";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
