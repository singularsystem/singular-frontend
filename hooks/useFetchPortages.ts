"use client";
import { useAuth } from "@/contexts/auth-context";
import { Portage } from "@/types/portage";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchPortages(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  searchTerm: string,
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [portages, setPortages] = useState<Portage[]>([]);
  const [total, setTotal] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (searchTerm != "" && searchTerm.length < 3) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPortages = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          searchTerm: searchTerm,
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/portage?${params.toString()}`,
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
          setPortages(result.data);
          setTotal(result.total);
        } else {
          setPortages([]);
          setTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve portage data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching portages:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPortages();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, page, pageSize, refreshTrigger, searchTerm]);

  return { portages, total, error, loading };
}

export function useFetchPortage(id: string | undefined) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [portage, setPortage] = useState<Portage | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || !id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPortage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/portage/${id}`, {
          method: "GET",
          signal: signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (result.success) {
          setPortage(result.data);
        } else {
          setPortage(null);
          setError(
            new Error(result.message || "Failed to retrieve portage data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching portage:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPortage();

    return () => {
      controller.abort();
    };
  }, [apiUrl, id, authLoading]);

  return { portage, error, loading };
}

export function useFetchPortageByStudent(
  studentID: string | undefined,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [portages, setPortages] = useState<Portage[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || !studentID || options?.enabled === false) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/portage/student/${studentID}`,
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
          setPortages(result.data);
        } else {
          setPortages([]);
          setError(
            new Error(result.message || "Failed to retrieve Portage data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching Portage:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, studentID, options?.enabled]);

  return { portages, error, loading };
}
