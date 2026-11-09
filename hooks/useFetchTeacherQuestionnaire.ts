import { useAuth } from "@/contexts/auth-context";
import { Filters } from "@/types/filters";
import { NeuropsychopedagogicalQuestionnaire } from "@/types/questionario-professor";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchQuestionnairesNeuropsychopedagogical(
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
  const [questionarios, setQuestionarios] = useState<
    NeuropsychopedagogicalQuestionnaire[]
  >([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (filters.searchTerm && filters.searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchQuestionnaires = async () => {
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
          `${apiUrl}/api/v1/regular-teacher-questionnaires?${params.toString()}`,
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
          setQuestionarios(result.data);
          setTotal(result.total ?? 0);
          setUniqueTotal(result.uniqueTotal ?? result.total ?? 0);
        } else {
          setQuestionarios([]);
          setTotal(0);
          setUniqueTotal(0);
          setError(
            new Error(
              result.message || "Failed to retrieve questionnaire data.",
            ),
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
  }, [
    authLoading,
    apiUrl,
    page,
    pageSize,
    refreshTrigger,
    filters,
    options?.enabled,
  ]);

  return { questionarios, total, uniqueTotal, error, loading };
}

export function useFetchQuestionnaireNeuropsychopedagogical(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [questionario, setQuestionario] =
    useState<NeuropsychopedagogicalQuestionnaire | null>(null);
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
          `${apiUrl}/api/v1/regular-teacher-questionnaires/${id}`,
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
          setQuestionario(result.data);
        } else {
          setQuestionario(null);
          setError(
            new Error(
              result.message || "Failed to retrieve questionnaire data.",
            ),
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
