import { Search } from "lucide-react";

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export default function SearchBar({
  value = "",
  placeholder = "Search creators...",
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-12 w-full rounded-2xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-blue-500"
      />
    </div>
  );
}
