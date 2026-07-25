import { useEffect, useState } from "react";

import { getMarkets } from "../services/markets";

export default function useMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarkets() {
      try {
        const data = await getMarkets();
        setMarkets(data);
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, []);

  return {
    markets,
    loading,
  };
}
