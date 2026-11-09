"use client";
import { getSiglaEstadoPorNome } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

type City = {
  id: string;
  nome: string;
};

export function useFetchCitiesByUf(uf: string | null | undefined) {
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (!uf) {
      setCities([]);
      return;
    }

    uf = getSiglaEstadoPorNome(uf) || "";
    const uf_lower = uf.toLowerCase();
    const controller = new AbortController();

    const fetchCities = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await secureFetch(
          `${apiUrl}/api/v1/ibge/by-uf/${uf_lower}`,
          {
            auth: false,
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Failed to fetch cities");
        const data = await res.json();
        setCities(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err);
          setCities([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCities();

    return () => {
      controller.abort();
    };
  }, [uf]);

  return { cities, error, loading };
}
