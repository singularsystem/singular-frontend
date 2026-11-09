"use client";
export const dynamic = "force-dynamic";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

type SecureFetchOptions = RequestInit & {
  auth?: boolean;
};

export function useSecureFetch() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const hasLoggedOutRef = useRef(false);

  const secureFetch = useCallback(
    async (input: RequestInfo | URL, options: SecureFetchOptions = {}) => {
      const controller = new AbortController();
      const signal = options.signal ?? controller.signal;

      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
      };

      if (options.auth !== false && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(input, {
          ...options,
          headers,
          signal,
        });

        if (response.status === 401 && !hasLoggedOutRef.current) {
          hasLoggedOutRef.current = true;
          await logout();

          if (window.location.pathname !== "/login") {
            router.push("/login");
          }

          throw new Error("Sessão expirada. Faça login novamente.");
        }

        return response;
      } catch (err) {
        if (err instanceof TypeError) {
          throw new Error("Erro de conexão com o servidor. Verifique sua internet e tente novamente.");
        }
        throw err;
      }
    },
    [token, logout, router]
  );

  return { secureFetch };
}
