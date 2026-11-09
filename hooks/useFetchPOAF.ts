"use client";
import { useAuth } from "@/contexts/auth-context";
import { POAF } from "@/types/poaf";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchPOAFs(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  searchTerm: string
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [poafs, setPoafs] = useState<POAF[]>([]);
  const [total, setTotal] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (searchTerm != "" && searchTerm.length < 3) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPOAFs = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          searchTerm: searchTerm,
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/poaf?${params.toString()}`,
          {
            method: "GET",
            signal: signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const result = await response.json();

        if (result.success) {
          setPoafs(result.data);
          setTotal(result.total);
        } else {
          setPoafs([]);
          setTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve poaf data.")
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching poafs:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPOAFs();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, page, pageSize, refreshTrigger, searchTerm]);

  return { poafs, total, error, loading };
}

export function useFetchPOAF(id: string | undefined) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [poaf, setPoaf] = useState<POAF | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || !id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPOAF = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/poaf/${id}`, {
          method: "GET",
          signal: signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const result = await response.json();

        if (result.success) {
          setPoaf(result.data);
        } else {
          setPoaf(null);
          setError(
            new Error(result.message || "Failed to retrieve poaf data.")
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching poaf:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPOAF();

    return () => {
      controller.abort();
    };
  }, [apiUrl, id, authLoading]);

  return { poaf, error, loading };
}
