"use client";
import { useAuth } from "@/contexts/auth-context";
import { Filters } from "@/types/filters";
import {
  CreatePEIApiPayload,
  PEI,
  PEISubjectPayload,
  UpdatePEIDTO,
} from "@/types/pei";
import { useCallback, useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useCreatePEI() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [created, setCreated] = useState<PEI | null>(null);

  const createPEI = useCallback(
    async (payload: CreatePEIApiPayload) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/peis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to create report.");
        }

        setCreated(result.data);
        return result.data as PEI;
      } catch (err) {
        console.error("Error creating report:", err);
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch],
  );

  return {
    createPEI,
    created,
    loading,
    error,
  };
}

export function useAddSubjectToPEI(options?: { enabled?: boolean }) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updated, setUpdated] = useState<PEI | null>(null);

  const { isLoading: authLoading } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  const addSubjectToPEI = useCallback(
    async (peiId: string, subjectPayload: PEISubjectPayload) => {
      if (authLoading || options?.enabled === false) return;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/peis/${peiId}/subjects`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subjectPayload),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update PEI.");
        }

        setUpdated(result.data);
        return result.data as PEI;
      } catch (err) {
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch, options?.enabled],
  );

  return { addSubjectToPEI, updated, loading, error };
}

export function useUpdatePEI() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<PEI | null>(null);

  const updatePEI = useCallback(
    async (payload: UpdatePEIDTO) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/peis`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update report.");
        }

        setUpdated(result.data);
        return result.data as PEI;
      } catch (err) {
        console.error("Error updating report:", err);
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch],
  );

  return {
    updatePEI,
    updated,
    loading,
    error,
  };
}

export function useDeletePEI() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleted, setDeleted] = useState<PEI | null>(null);

  const deletePEI = useCallback(
    async (id: string) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/peis/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to delete report.");
        }

        setDeleted(result.data);
        return result.data as PEI;
      } catch (err) {
        console.error("Error deleting report:", err);
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch],
  );

  return {
    deletePEI,
    deleted,
    loading,
    error,
  };
}

export function useFetchPEIs(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  filters: Filters,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [planos, setPlanos] = useState<PEI[]>([]);
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
          ...(filters.onlyMyDocs !== undefined ? { onlyMyDocs: String(filters.onlyMyDocs) } : {}),
          ...(filters.onlyMyReports !== undefined ? { onlyMyReports: String(filters.onlyMyReports) } : {}),
          ...(filters.myStatus ? { myStatus: filters.myStatus } : {}),
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/peis?${params.toString()}`,
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
          setError(new Error(result.message || "Failed to retrieve PEI data."));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching PEI:", err);
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

export function useFetchPEIByID(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [plano, setPlano] = useState<PEI | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/peis/${id}`, {
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
          setError(new Error(result.message || "Failed to retrieve PEI data."));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching PEI:", err);
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

export function useFetchPEIByStudent(
  studentID: string | undefined,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [planos, setPlanos] = useState<PEI[]>([]);
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
          `${apiUrl}/api/v1/peis/student/${studentID}`,
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
          setError(new Error(result.message || "Failed to retrieve PEI data."));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching PEI:", err);
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

  return { planos, error, loading };
}

type FetchAllPEIResult<T> = {
  peis: T[];
  total: number;
};

export async function fetchAllPEI<TPEI>({
  apiUrl,
  secureFetch,
  filters,
  signal,
}: {
  apiUrl: string;
  secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  filters: Filters;
  signal?: AbortSignal;
}): Promise<FetchAllPEIResult<TPEI>> {
  const params = new URLSearchParams({
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
  });

  const response = await secureFetch(
    `${apiUrl}/api/v1/peis/all?${params.toString()}`,
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
    peis: result.data ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}
