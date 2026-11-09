"use client";
import { useAuth } from "@/contexts/auth-context";
import {
  CognitiveAssessment,
  CreateCognitiveAssessmentDTO,
  UpdateCognitiveAssessmentDTO,
} from "@/types/cognitive-assessment";
import { useCallback, useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useCreateCognitiveAssessment() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [created, setCreated] = useState<CognitiveAssessment | null>(null);

  const createQuestionnaire = useCallback(
    async (payload: CreateCognitiveAssessmentDTO) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/cognitive-assessments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to create Cognitive Assessment."
          );
        }

        setCreated(result.data);
        return result.data as CognitiveAssessment;
      } catch (err) {
        console.error("Error creating Cognitive Assessment:", err);
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch]
  );

  return {
    createQuestionnaire,
    created,
    loading,
    error,
  };
}

export function useUpdateCognitiveAssessment() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<CognitiveAssessment | null>(null);

  const updateQuestionnaire = useCallback(
    async (payload: UpdateCognitiveAssessmentDTO) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/cognitive-assessments`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to update Cognitive Assessment."
          );
        }

        setUpdated(result.data);
        return result.data as CognitiveAssessment;
      } catch (err) {
        console.error("Error updating Cognitive Assessment:", err);
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch]
  );

  return {
    updateQuestionnaire,
    updated,
    loading,
    error,
  };
}

export function useDeleteCognitiveAssessment() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleted, setDeleted] = useState<CognitiveAssessment | null>(null);

  const deleteQuestionnaire = useCallback(
    async (id: string) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/cognitive-assessments/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to delete Cognitive Assessment."
          );
        }

        setDeleted(result.data);
        return result.data as CognitiveAssessment;
      } catch (err) {
        console.error("Error deleting Cognitive Assessment:", err);
        const finalError = err instanceof Error ? err : new Error(String(err));
        setError(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [authLoading, apiUrl, secureFetch]
  );

  return {
    deleteQuestionnaire,
    deleted,
    loading,
    error,
  };
}

export function useFetchCognitiveAssessments(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  searchTerm: string
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [total, setTotal] = useState(0);
  const [questionarios, setQuestionarios] = useState<CognitiveAssessment[]>([]);
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
          `${apiUrl}/api/v1/cognitive-assessments?${params.toString()}`,
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

export function useFetchCognitiveAssessment(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [questionario, setQuestionario] = useState<CognitiveAssessment | null>(
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
          `${apiUrl}/api/v1/cognitive-assessments/${id}`,
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

export function useFetchCognitiveAssessmentsByStudent(studentID: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [questionarios, setQuestionarios] = useState<CognitiveAssessment[]>([]);
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
          `${apiUrl}/api/v1/cognitive-assessments/student/${studentID}`,
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
