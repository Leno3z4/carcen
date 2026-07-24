import { SelectHTMLAttributes } from "react";
import clsx from "clsx";

type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function FilterSelect({
  className,
  children,
  ...props
}: FilterSelectProps) {
  return (
    <select
      className={clsx(
        "h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-blue-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
