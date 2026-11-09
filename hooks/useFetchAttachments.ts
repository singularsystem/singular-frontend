"use client";
import { useAuth } from "@/contexts/auth-context";
import { Attachment } from "@/types/anexo";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchAttachments(
  studentID: string | undefined,
  refreshTrigger: number
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || !studentID) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAttachments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/files/students/${studentID}`,
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
          setAttachments(result.data);
        } else {
          setAttachments([]);
          setError(
            new Error(result.message || "Failed to retrieve attachments data.")
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching attachments:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();

    return () => {
      controller.abort();
    };
  }, [apiUrl, studentID, authLoading, refreshTrigger]);

  return { attachments, error, loading };
}
