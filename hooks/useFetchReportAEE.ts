"use client";
import { useAuth } from "@/contexts/auth-context";
import { Filters } from "@/types/filters";
import { ReportAEE } from "@/types/relatorio-aee";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchReportAEE(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  filters: Filters,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [total, setTotal] = useState(0);
  const [uniqueTotal, setUniqueTotal] = useState(0);
  const [relatorios, setRelatorios] = useState<ReportAEE[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (filters.searchTerm && filters.searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));

        if (filters.state) params.set("state", filters.state);
        if (filters.city) params.set("city", filters.city);
        if (filters.schoolID) params.set("schoolID", filters.schoolID);
        if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);

        if (filters.disability && filters.disability.length > 0) {
          params.set("disability", filters.disability.join(","));
        }
        if (filters.disorder && filters.disorder.length > 0) {
          params.set("disorder", filters.disorder.join(","));
        }
        if (filters.year) params.set("year", filters.year);
        if (filters.month) params.set("month", filters.month);

        console.log(params);

        const response = await secureFetch(
          `${apiUrl}/api/v1/report-aee?${params.toString()}`,
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
          setRelatorios(result.data);
          setTotal(result.total ?? 0);
          setUniqueTotal(result.uniqueTotal ?? result.total ?? 0);
        } else {
          setRelatorios([]);
          setTotal(0);
          setUniqueTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve report AEE data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching report AEE:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    return () => {
      controller.abort();
    };
  }, [
    authLoading,
    apiUrl,
    page,
    pageSize,
    refreshTrigger,
    filters,
    options?.enabled,
  ]);

  return { relatorios, total, uniqueTotal, error, loading };
}

type FetchAllReportResult<T> = {
  reports: T[];
  total: number;
};

export async function fetchAllReports<TReport>({
  apiUrl,
  secureFetch,
  filters,
  signal,
}: {
  apiUrl: string;
  secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  filters: Filters;
  signal?: AbortSignal;
}): Promise<FetchAllReportResult<TReport>> {
  const params = new URLSearchParams({
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.year ? { year: filters.year } : {}),
    ...(filters.month ? { month: filters.month } : {}),
  });

  const response = await secureFetch(
    `${apiUrl}/api/v1/report-aee/all?${params.toString()}`,
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
    throw new Error(result.message || "Failed to retrieve data.");
  }

  return {
    reports: result.data ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}
