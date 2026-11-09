import { useAuth } from "@/contexts/auth-context";
import { StudentEvaluation } from "@/types/avaliacao";
import { Filters } from "@/types/filters";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchTeacherEvaluations(
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
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (filters.searchTerm && filters.searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchEvaluations = async () => {
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
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.year ? { year: filters.year } : {}),
          ...(filters.month ? { month: filters.month } : {}),
          ...(filters.onlyMyDocs !== undefined ? { onlyMyDocs: String(filters.onlyMyDocs) } : {}),
          ...(filters.onlyMyReports !== undefined ? { onlyMyReports: String(filters.onlyMyReports) } : {}),
          ...(filters.myStatus ? { myStatus: filters.myStatus } : {}),
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/regular-teacher-evaluations?${params.toString()}`,
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
          setEvaluations(result.data);
          setTotal(result.total ?? 0);
          setUniqueTotal(result.uniqueTotal ?? result.total ?? 0);
        } else {
          setEvaluations([]);
          setTotal(0);
          setUniqueTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve evaluation data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching evaluations:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();

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

  return { evaluations, total, uniqueTotal, error, loading };
}

export function useFetchTeacherEvaluationById(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [evaluation, setEvaluation] = useState<StudentEvaluation | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchEvaluation = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/regular-teacher-evaluations/${id}`,
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
          setEvaluation(result.data);
        } else {
          setEvaluation(null);
          setError(
            new Error(result.message || "Failed to retrieve evaluation data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching evaluation:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, id]);

  return { evaluation, error, loading };
}

type FetchAllEvaluationResult<T> = {
  evaluations: T[];
  total: number;
};

export async function fetchAllTeacherEvaluations<TEvaluation>({
  apiUrl,
  secureFetch,
  filters,
  signal,
}: {
  apiUrl: string;
  secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  filters: Filters;
  signal?: AbortSignal;
}): Promise<FetchAllEvaluationResult<TEvaluation>> {
  const params = new URLSearchParams({
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.year ? { year: filters.year } : {}),
    ...(filters.month ? { month: filters.month } : {}),
  });

  const response = await secureFetch(
    `${apiUrl}/api/v1/regular-teacher-evaluations/all?${params.toString()}`,
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
    evaluations: result.data ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}
