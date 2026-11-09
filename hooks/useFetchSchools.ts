"use client";
export const dynamic = "force-dynamic";
import { useAuth } from "@/contexts/auth-context";
import { Escola, School } from "@/types/escola";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchSchools(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  searchTerm: string,
  options?: { enabled?: boolean }
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [total, setTotal] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;

    if (searchTerm != "" && searchTerm.length < 3) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSchools = async () => {
      setLoading(true);
      setError(null);
      let url;

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          searchTerm: searchTerm,
        });
        url = `${apiUrl}/api/v1/schools?${params.toString()}`;

        const response = await secureFetch(url, {
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
          setEscolas(result.data);
          setTotal(result.total);
        } else {
          setEscolas([]);
          setTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve school data.")
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching schools:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, page, pageSize, refreshTrigger, searchTerm, options?.enabled]);

  return { escolas, total, error, loading };
}

export function useFetchSchoolsByCity(city: string | null | undefined, state?: string | null | undefined) {
  const [schools, setSchools] = useState<School[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (!city) {
      setSchools([]);
      return;
    }

    const controller = new AbortController();

    const fetchSchools = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${apiUrl}/api/v1/schools/city/${encodeURIComponent(city)}`;
        if (state) {
          url += `?state=${encodeURIComponent(state)}`;
        }

        const res = await secureFetch(url, {
          method: "GET",
          auth: false,
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch schools");
        const data = await res.json();
        setSchools(data["data"]);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err);
          setSchools([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();

    return () => {
      controller.abort();
    };
  }, [city, state]);

  return { schools, error, loading };
}

export function useFetchSchool(id: string | null | undefined) {
  const [school, setSchool] = useState<Escola | null>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();
  const { isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!id) {
      setSchool(null);
      return;
    }

    const controller = new AbortController();

    const fetchSchool = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await secureFetch(`${apiUrl}/api/v1/schools/${id}`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch schools");
        const data = await res.json();
        setSchool(data["data"]);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err);
          setSchool(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();

    return () => {
      controller.abort();
    };
  }, [id, authLoading]);

  return { school, error, loading };
}
