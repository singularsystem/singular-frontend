import { useAuth } from "@/contexts/auth-context";
import { Filters } from "@/types/filters";
import { EvaluationScreening } from "@/types/triagem";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchTeacherScreenings(
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
  const [screenings, setScreenings] = useState<EvaluationScreening[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (filters.searchTerm && filters.searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchScreenings = async () => {
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
          `${apiUrl}/api/v1/regular-teacher-screenings?${params.toString()}`,
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
          setScreenings(result.data);
          setTotal(result.total ?? 0);
          setUniqueTotal(result.uniqueTotal ?? result.total ?? 0);
        } else {
          setScreenings([]);
          setTotal(0);
          setUniqueTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve screening data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching screenings:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();

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

  return { screenings, total, uniqueTotal, error, loading };
}

export function useFetchTeacherScreeningById(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [screening, setScreening] = useState<EvaluationScreening | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchScreening = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/regular-teacher-screenings/${id}`,
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
          setScreening(result.data);
        } else {
          setScreening(null);
          setError(
            new Error(result.message || "Failed to retrieve screening data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching screening:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchScreening();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, id]);

  return { screening, error, loading };
}

export function useFetchTeacherScreeningByStudent(studentID: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [screenings, setScreenings] = useState<EvaluationScreening[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchScreenings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/regular-teacher-screenings/${studentID}`,
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
          setScreenings(result.data);
        } else {
          setScreenings([]);
          setError(
            new Error(result.message || "Failed to retrieve screening data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching screenings:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, studentID]);

  return { screenings, error, loading };
}
