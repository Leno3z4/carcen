import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search creators..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
