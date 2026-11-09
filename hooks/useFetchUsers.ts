"use client";
import { useAuth } from "@/contexts/auth-context";
import { Usuario } from "@/types/usuario";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchUsers(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  searchTerm: string,
  searchRole?: string,
  searchState?: string,
  searchCity?: string
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (authLoading) return;

    if (searchTerm != "" && searchTerm.length < 3) return;

    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          searchTerm: searchTerm,
        });

        if (searchRole && searchRole !== "todos") params.append("role", searchRole);
        if (searchState && searchState !== "todos") params.append("state", searchState);
        if (searchCity && searchCity !== "todos") params.append("city", searchCity);

        const response = await secureFetch(
          `${apiUrl}/api/v1/users?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const result = await response.json();
        console.log;

        if (result.success) {
          setUsuarios(result.data);
          setTotal(result.total);
        } else {
          setUsuarios([]);
          setError(
            new Error(result.message || "Failed to retrieve user data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, page, pageSize, refreshTrigger, searchTerm, searchRole, searchState, searchCity]);

  return { usuarios, total, error, loading };
}

export function useFetchPrincipalsByCity(city: string | null | undefined) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [principals, setPrincipals] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (authLoading) return;

    if (!city) {
      setPrincipals([]);
      return;
    }

    const controller = new AbortController();

    const fetchPrincipals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/users/principals/${city}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (result.success) {
          setPrincipals(result.data);
          setTotal(result.total);
        } else {
          setPrincipals([]);
          setError(
            new Error(result.message || "Failed to retrieve user data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPrincipals();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, city]);

  return { principals, total, error, loading };
}
