import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  initialValue?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="relative">
      <Search
        className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="
          h-14
          w-full
          rounded-2xl
          border
          border-blue-100
          bg-gradient-to-b
          from-white
          to-blue-50/60
          pl-14
          pr-5
          text-[15px]
          text-slate-800
          outline-none
          transition-all
          duration-200
          placeholder:text-slate-400
          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-200/40
        "
      />
    </div>
  );
}
