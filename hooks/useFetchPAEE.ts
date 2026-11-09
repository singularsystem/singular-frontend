"use client";
import { useAuth } from "@/contexts/auth-context";
import { Filters } from "@/types/filters";
import { PAEE } from "@/types/paee";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchPAEEs(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  filters: Filters,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [planos, setPlanos] = useState<PAEE[]>([]);
  const [total, setTotal] = useState(0);
  const [uniqueTotal, setUniqueTotal] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;

    if (filters.searchTerm && filters.searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          ...(filters.state ? { state: filters.state } : {}),
          ...(filters.city ? { city: filters.city } : {}),
          ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
          ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/paees?${params.toString()}`,
          {
            method: "GET",
            signal: signal,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (result.success) {
          setPlanos(result.data);
          setTotal(result.total ?? 0);
          setUniqueTotal(result.uniqueTotal ?? result.total ?? 0);
        } else {
          setPlanos([]);
          setTotal(0);
          setUniqueTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve plan data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching plan:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      controller.abort();
    };
  }, [
    apiUrl,
    authLoading,
    page,
    pageSize,
    refreshTrigger,
    filters,
    options?.enabled,
  ]);

  return { planos, total, uniqueTotal, error, loading };
}

export function useFetchPAEEByID(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [plano, setPlano] = useState<PAEE | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/paees/${id}`, {
          method: "GET",
          signal: signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (result.success) {
          setPlano(result.data);
        } else {
          setPlano(null);
          setError(
            new Error(result.message || "Failed to retrieve plan data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching plan:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, id, options?.enabled]);

  return { plano, error, loading };
}

export function useFetchPAEEByStudent(studentID: string | undefined) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [planos, setPlanos] = useState<PAEE[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || !studentID) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/paees/student/${studentID}`,
          {
            method: "GET",
            signal: signal,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (result.success) {
          setPlanos(result.data);
        } else {
          setPlanos([]);
          setError(
            new Error(result.message || "Failed to retrieve plan data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching plan:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, studentID]);

  return { planos, error, loading };
}

type FetchAllPAEEsResult<T> = {
  paees: T[];
  total: number;
};

export async function fetchAllPAEEs<TPAEE>({
  apiUrl,
  secureFetch,
  filters,
  signal,
}: {
  apiUrl: string;
  secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  filters: Filters;
  signal?: AbortSignal;
}): Promise<FetchAllPAEEsResult<TPAEE>> {
  const params = new URLSearchParams({
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
  });

  const response = await secureFetch(
    `${apiUrl}/api/v1/paees/all?${params.toString()}`,
    { method: "GET", signal },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `HTTP error! Status: ${response.status}`,
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to retrieve student data.");
  }

  return {
    paees: result.data ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}
