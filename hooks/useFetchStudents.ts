"use client";
export const dynamic = "force-dynamic";
import { useAuth } from "@/contexts/auth-context";
import {
  CreateStudentDTO,
  Student,
  StudentDocument,
  UpdateStudentDTO,
} from "@/types/aluno";
import { Filters } from "@/types/filters";
import { useCallback, useEffect, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useCreateStudent() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [created, setCreated] = useState<Student | null>(null);

  const createStudent = useCallback(
    async (payload: CreateStudentDTO) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/students`, {
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
          throw new Error(result.message || "Failed to create student.");
        }

        setCreated(result.data);
        return result.data as Student;
      } catch (err) {
        console.error("Error creating student:", err);
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
    createStudent,
    created,
    loading,
    error,
  };
}

export function useUpdateStudent() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<Student | null>(null);

  const updateStudent = useCallback(
    async (payload: UpdateStudentDTO) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/students`, {
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
          throw new Error(result.message || "Failed to update student.");
        }

        setUpdated(result.data);
        return result.data as Student;
      } catch (err) {
        console.error("Error updating student:", err);
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
    updateStudent,
    updated,
    loading,
    error,
  };
}

export function useDeleteStudent() {
  const { isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleted, setDeleted] = useState<Student | null>(null);

  const deleteStudent = useCallback(
    async (id: string) => {
      if (authLoading) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/students/${id}`, {
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
          throw new Error(result.message || "Failed to delete student.");
        }

        setDeleted(result.data);
        return result.data as Student;
      } catch (err) {
        console.error("Error deleting student:", err);
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
    deleteStudent,
    deleted,
    loading,
    error,
  };
}

export function useFetchStudents(
  page: number,
  pageSize: number,
  refreshTrigger: number,
  filters: Filters,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [alunos, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;

    const state = filters.state ?? "";
    const city = filters.city ?? "";
    const schoolID = filters.schoolID ?? "";
    const searchTerm = filters.searchTerm ?? "";

    if (searchTerm && searchTerm.length < 3) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          ...(state ? { state } : {}),
          ...(city ? { city } : {}),
          ...(schoolID ? { schoolID } : {}),
          ...(searchTerm ? { searchTerm } : {}),
        });

        const response = await secureFetch(
          `${apiUrl}/api/v1/students?${params.toString()}`,
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
          setStudents(result.data);
          setTotal(result.total);
        } else {
          setStudents([]);
          setTotal(0);
          setError(
            new Error(result.message || "Failed to retrieve student data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();

    return () => {
      controller.abort();
    };
  }, [
    apiUrl,
    authLoading,
    page,
    pageSize,
    refreshTrigger,
    filters.state,
    filters.city,
    filters.schoolID,
    filters.searchTerm,
    options?.enabled,
  ]);

  return { alunos, total, error, loading };
}

export function useFetchStudent(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [aluno, setStudent] = useState<Student | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStudent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(`${apiUrl}/api/v1/students/${id}`, {
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
            throw new Error("Sem permissão para acessar este aluno.");
          }

          const errorData = (body ?? {}) as { message?: string };
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`,
          );
        }

        if (!body) {
          throw new Error("Resposta vazia do servidor ao buscar aluno.");
        }

        if ((body as { success?: boolean }).success) {
          setStudent((body as { data: Student }).data);
        } else {
          setStudent(null);
          setError(
            new Error(
              (body as { message?: string } | null)?.message ||
                "Failed to retrieve student data.",
            ),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();

    return () => {
      controller.abort();
    };
  }, [apiUrl, id, authLoading, options?.enabled]);

  return { aluno, error, loading };
}

export function useFetchStudentDocuments(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  useEffect(() => {
    if (authLoading || options?.enabled === false) return;
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/students/${id}/documents`,
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
          setDocuments(result.data);
        } else {
          setDocuments([]);
          setError(
            new Error(result.message || "Failed to retrieve student data."),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();

    return () => {
      controller.abort();
    };
  }, [apiUrl, id, authLoading, options?.enabled]);

  return { documents, error, loading };
}

type FetchAllStudentsResult<T> = {
  alunos: T[];
  total: number;
};

export async function fetchAllStudents<TStudent>({
  apiUrl,
  secureFetch,
  filters,
  signal,
}: {
  apiUrl: string;
  secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  filters: Filters;
  signal?: AbortSignal;
}): Promise<FetchAllStudentsResult<TStudent>> {
  const params = new URLSearchParams({
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
  });

  const response = await secureFetch(
    `${apiUrl}/api/v1/students/all?${params.toString()}`,
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
    throw new Error(result.message || "Failed to retrieve student data.");
  }

  return {
    alunos: result.data ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}
