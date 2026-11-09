"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, token, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!token || isLoading) return;

    const customFetch = async (
      ...args: Parameters<typeof fetch>
    ): Promise<Response> => {
      const response = await fetch(...args);
      if (response.status === 401) {
        await logout();
        router.push("/login");
        throw new Error("Unauthorized");
      }
      return response;
    };

    (window as any).secureFetch = customFetch;

    return () => {
      delete (window as any).secureFetch;
    };
  }, [token, logout, router, isLoading]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
