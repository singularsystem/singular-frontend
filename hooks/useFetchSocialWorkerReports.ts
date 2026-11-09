"use client";
import { useAuth } from "@/contexts/auth-context";
import {
  CreateSocialWorkerReportApiPayload,
  SocialWorkerReport,
  UpdateSocialWorkerReportApiPayload,
} from "@/types/relatorio-assistente-social";
import { useCallback, useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useCreateSocialWorkerReport() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [created, setCreated] = useState<SocialWorkerReport | null>(null);

  const createSocialWorkerReport = useCallback(
    async (payload: CreateSocialWorkerReportApiPayload) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/social-worker-reports`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

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
        return result.data as SocialWorkerReport;
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
    createSocialWorkerReport,
    created,
    loading,
    error,
  };
}

export function useUpdateSocialWorkerReport() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<SocialWorkerReport | null>(null);

  const updateSocialWorkerReport = useCallback(
    async (payload: UpdateSocialWorkerReportApiPayload) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/social-worker-reports`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

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
        return result.data as SocialWorkerReport;
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
    updateSocialWorkerReport,
    updated,
    loading,
    error,
  };
}

export function useDeleteSocialWorkerReport() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleted, setDeleted] = useState<SocialWorkerReport | null>(null);

  const deleteSocialWorkerReport = useCallback(
    async (id: string) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/social-worker-reports/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

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
        return result.data as SocialWorkerReport;
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
    deleteSocialWorkerReport,
    deleted,
    loading,
    error,
  };
}

export function useFetchSocialWorkerReport(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorio, setRelatorio] = useState<SocialWorkerReport | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/social-worker-reports/${id}`,
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
          setRelatorio(result.data);
        } else {
          setRelatorio(null);
          setError(
            new Error(result.message || "Failed to retrieve report data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching report:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, id]);

  return { relatorio, error, loading };
}
