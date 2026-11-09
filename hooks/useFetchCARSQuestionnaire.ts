"use client";
import { useAuth } from "@/contexts/auth-context";
import { CARSQuestionnaire } from "@/types/cars";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchQuestionnairesCARSChildhood(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  searchTerm: string
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [total, setTotal] = useState(0);
  const [questionarios, setQuestionarios] = useState<CARSQuestionnaire[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (searchTerm != "" && searchTerm.length < 3) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchQuestionnaires = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          searchTerm: searchTerm,
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/cars-questionnaires?${params.toString()}`,
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
          setQuestionarios(result.data);
          setTotal(result.total);
        } else {
          setQuestionarios([]);
          setTotal(0);
          setError(
            new Error(
              result.message || "Failed to retrieve questionnaire data."
            )
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching questionnaires:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, page, pageSize, refreshTrigger, searchTerm]);

  return { questionarios, total, error, loading };
}

export function useFetchQuestionnaireCARSChildhood(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [questionario, setQuestionario] = useState<CARSQuestionnaire | null>(
    null
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchQuestionnaire = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/cars-questionnaires/${id}`,
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
          setQuestionario(result.data);
        } else {
          setQuestionario(null);
          setError(
            new Error(
              result.message || "Failed to retrieve questionnaire data."
            )
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching questionnaire:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, id]);

  return { questionario, error, loading };
}

export function useFetchQuestionnairesCARSChildhoodByStudent(
  studentID: string
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [questionarios, setQuestionarios] = useState<CARSQuestionnaire[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchQuestionnaires = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/cars-questionnaires/${studentID}`,
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
          setQuestionarios(result.data);
        } else {
          setQuestionarios([]);
          setError(
            new Error(
              result.message || "Failed to retrieve questionnaire data."
            )
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching questionnaires:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();

    return () => {
      controller.abort();
    };
  }, [authLoading, apiUrl, studentID]);

  return { questionarios, error, loading };
}
