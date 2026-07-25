import { useMemo, useState } from "react";

type Creator = {
  name: string;
};

export default function useCreatorSearch(
  creators: Creator[]
) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) {
      return creators;
    }

    return creators.filter((creator) =>
      creator.name
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [creators, query]);

  return {
    query,
    setQuery,
    results,
  };
}
