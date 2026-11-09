"use client";
import { useAuth } from "@/contexts/auth-context";
import { DashBoardFilters, StatisticsFilters } from "@/lib/constants";
import { DashboardSummary, StatisticsSummary } from "@/types/estatisticas";
import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "./useSecureFetch";

export function useFetchDashboardStatistics(
  filters?: DashBoardFilters,
  refreshKey = 0
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [estatisticas, setEstatisticas] = useState<DashboardSummary | null>(
    null
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (filters?.sex) params.append("sex", filters.sex);
    if (filters?.state) params.append("state", filters.state);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.schoolID) params.append("schoolID", filters.schoolID);
    if (filters?.minimalAge) params.append("minimalAge", filters.minimalAge);
    if (filters?.maximumAge) params.append("maximumAge", filters.maximumAge);
    if (filters?.registrationType)
      params.append("registrationType", filters.registrationType);
    if (filters?.disability) params.append("disability", filters.disability);
    if (filters?.month) params.append("month", filters.month);
    if (filters?.year) params.append("year", filters.year);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/statistics?${queryString}`,
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
          setEstatisticas(result.data);
        } else {
          setEstatisticas(null);
          setError(
            new Error(result.message || "Failed to retrieve statistic data.")
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching statistics:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, queryString, refreshKey]);

  return { estatisticas, error, loading };
}

type MunicipalityStudentTargetPayload = {
  state: string;
  city: string;
  totalStudents: number;
};

export function useUpsertMunicipalityStudentTarget() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  const upsertMunicipalityStudentTarget = async (
    payload: MunicipalityStudentTargetPayload
  ) => {
    const response = await secureFetch(
      `${apiUrl}/api/v1/statistics/municipality-total`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || `HTTP error! Status: ${response.status}`
      );
    }

    return result;
  };

  return { upsertMunicipalityStudentTarget };
}

export function useFetchStatistics(filters?: StatisticsFilters) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading: authLoading } = useAuth();
  const [estatisticas, setEstatisticas] = useState<StatisticsSummary | null>(
    null
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { secureFetch } = useSecureFetch();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (filters?.sex) params.append("sex", filters.sex);
    if (filters?.state) params.append("state", filters.state);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.schoolID) params.append("schoolID", filters.schoolID);
    if (filters?.ageGroup) params.append("ageGroup", filters.ageGroup);
    if (filters?.year) params.append("year", filters.year);
    if (filters?.registrationType)
      params.append("registrationType", filters.registrationType);
    if (filters?.disability) params.append("disability", filters.disability);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await secureFetch(
          `${apiUrl}/api/v1/statistics/statistics?${queryString}`,
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
          setEstatisticas(result.data);
        } else {
          setEstatisticas(null);
          setError(
            new Error(result.message || "Failed to retrieve statistic data.")
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted (component unmounted or token changed)");
          return;
        }
        console.error("Error fetching statistics:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();

    return () => {
      controller.abort();
    };
  }, [apiUrl, authLoading, queryString]);

  return { estatisticas, error, loading };
}
