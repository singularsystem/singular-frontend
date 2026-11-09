"use client";
import { useAuth } from "@/contexts/auth-context";
import { Filters } from "@/types/filters";
import {
  Relatorio,
  RelatorioAssistenteSocial,
  RelatorioPsicologico,
  RelatorioPsicopedagogico,
} from "@/types/relatorio";
import { useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchReports(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  filters: Filters,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [total, setTotal] = useState(0);
  const [uniqueTotal, setUniqueTotal] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading) return;

    if (filters.searchTerm && filters.searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchReports = async () => {
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
          ...(filters.pendingProfessional ? { pendingProfessional: filters.pendingProfessional } : {}),
          ...(filters.year ? { year: filters.year } : {}),
          ...(filters.month ? { month: filters.month } : {}),
          ...(filters.onlyMyReports ? { onlyMyReports: String(filters.onlyMyReports) } : {}),
          ...(filters.myStatus ? { myStatus: filters.myStatus } : {}),
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/reports?${params.toString()}`,
          {
            method: "GET",
            signal: signal,
          },
        );

        if (!response.ok) {
          const fallbackMessage = `HTTP error! Status: ${response.status}`;
          const contentType = response.headers.get("content-type") || "";
          const raw = await response.text();

          if (!raw) {
            throw new Error(fallbackMessage);
          }

          if (contentType.includes("application/json")) {
            try {
              const errorData = JSON.parse(raw);
              throw new Error(errorData?.message || fallbackMessage);
            } catch {
              throw new Error(raw || fallbackMessage);
            }
          }

          try {
            const errorData = JSON.parse(raw);
            throw new Error(errorData?.message || fallbackMessage);
          } catch {
            throw new Error(raw || fallbackMessage);
          }
        }

        const result = await response.json();

        if (result.success) {
          setRelatorios(result.data);
          setTotal(result.total ?? 0);
          setUniqueTotal(result.uniqueTotal ?? result.total ?? 0);
        } else {
          setRelatorios([]);
          setTotal(0);
          setUniqueTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve reports data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching reports:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

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

  return { relatorios, total, uniqueTotal, error, loading };
}

export function useFetchReport(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
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
        const response = await secureFetch(`${apiUrl}/api/v1/reports/${id}`, {
          method: "GET",
          signal: signal,
        });

        const bodyText = await response.text().catch(() => "");
        const body =
          bodyText.length > 0
            ? (() => {
                try {
                  return JSON.parse(bodyText);
                } catch {
                  return null;
                }
              })()
            : null;

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Não autorizado. Faça login novamente.");
          }
          if (response.status === 403) {
            throw new Error("Sem permissão para acessar este relatório.");
          }

          throw new Error(
            (body as { message?: string } | null)?.message ||
              `HTTP error! Status: ${response.status}`,
          );
        }

        if (!body) {
          throw new Error("Resposta vazia do servidor ao buscar relatório.");
        }

        if ((body as { success?: boolean }).success) {
          setRelatorio((body as { data: Relatorio }).data);
        } else {
          setRelatorio(null);
          setError(
            new Error(
              (body as { message?: string } | null)?.message ||
                "Failed to retrieve report data.",
            ),
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
  }, [apiUrl, id, authLoading]);

  return { relatorio, error, loading };
}

export function useFetchReportByStudent(studentID: string | undefined | null) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || !studentID) return;

    if (studentID == undefined && studentID == null) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/reports/${studentID}`,
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
          setRelatorios(result.data);
        } else {
          setRelatorios([]);
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
  }, [apiUrl, studentID, authLoading]);

  return { relatorios, error, loading };
}

export function useFetchPsychologistReport(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorio, setRelatorio] = useState<RelatorioPsicologico | null>(null);
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
          `${apiUrl}/api/v1/psychologist-reports/${id}`,
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

export function useFetchPsychopedagogueReport(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorio, setRelatorio] = useState<RelatorioPsicopedagogico | null>(
    null,
  );
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
          `${apiUrl}/api/v1/psychopedagogue-reports/${id}`,
          {
            method: "GET",
            signal: signal,
          },
        );

        if (!response.ok) {
          const fallbackMessage = `HTTP error! Status: ${response.status}`;
          const contentType = response.headers.get("content-type") || "";
          const raw = await response.text();

          if (!raw) {
            throw new Error(fallbackMessage);
          }

          if (contentType.includes("application/json")) {
            try {
              const errorData = JSON.parse(raw);
              throw new Error(errorData?.message || fallbackMessage);
            } catch {
              throw new Error(raw || fallbackMessage);
            }
          }

          try {
            const errorData = JSON.parse(raw);
            throw new Error(errorData?.message || fallbackMessage);
          } catch {
            throw new Error(raw || fallbackMessage);
          }
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

export function useFetchSocialWorkerReport(id: string) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [relatorio, setRelatorio] = useState<RelatorioAssistenteSocial | null>(
    null,
  );
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
          `${apiUrl}/api/v1/reports/socialworker/${id}`,
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

export function useFetchRelatorioByRole(id: string, role: string | undefined) {
  if (!role) {
    return {
      relatorio: null,
      loading: false,
      error: new Error("Tipo de usuário não definido."),
    };
  }

  const normalizedRole = role?.toLowerCase();

  switch (normalizedRole) {
    case "socialwork":
      return useFetchSocialWorkerReport(id);
    case "psychologist":
      return useFetchPsychologistReport(id);
    case "psychopedagogue":
      return useFetchPsychopedagogueReport(id);
    default:
      return {
        relatorio: null,
        loading: false,
        error: new Error("Função não implementada para esse tipo de usuário."),
      };
  }
}

type FetchAllReportResult<T> = {
  reports: T[];
  total: number;
};

export async function fetchAllReports<TReport>({
  apiUrl,
  secureFetch,
  filters,
  signal,
}: {
  apiUrl: string;
  secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  filters: Filters;
  signal?: AbortSignal;
}): Promise<FetchAllReportResult<TReport>> {
  const params = new URLSearchParams({
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.pendingProfessional ? { pendingProfessional: filters.pendingProfessional } : {}),
    ...(filters.year ? { year: filters.year } : {}),
    ...(filters.month ? { month: filters.month } : {}),
          ...(filters.onlyMyReports ? { onlyMyReports: String(filters.onlyMyReports) } : {}),
          ...(filters.myStatus ? { myStatus: filters.myStatus } : {}),
  });

  const response = await secureFetch(
    `${apiUrl}/api/v1/reports/all?${params.toString()}`,
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
    reports: result.data ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}
