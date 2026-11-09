"use client";

import { useAuth } from "@/contexts/auth-context";
import { fetchActiveTermStatus } from "@/hooks/term";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TERM_KEY = "AEE_TERMO_RESPONSABILIDADE";
const ALLOW_ROUTES_PREFIX = ["/login", "/termo", "/primeiro-acesso", "/public"];

export function TermsGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isLoading: authLoading } = useAuth();

  // Só bloqueia quando você tem certeza que NÃO aceitou
  const [blocked, setBlocked] = useState(false);

  const lastCheckKey = useRef<string>("");
  const acceptedCache = useRef<boolean | null>(null); // cache em memória

  useEffect(() => {
    if (authLoading) return;

    // rotas liberadas
    if (ALLOW_ROUTES_PREFIX.some((p) => pathname?.startsWith(p))) {
      setBlocked(false);
      lastCheckKey.current = "";
      return;
    }

    // sem token -> login
    if (!token) {
      router.replace("/login");
      return;
    }

    // se já sabemos que aceitou nessa sessão, NÃO bloqueia nem mostra nada
    if (acceptedCache.current === true) {
      setBlocked(false);
      return;
    }

    const key = `${pathname}|${token}`;
    if (lastCheckKey.current === key) return;
    lastCheckKey.current = key;

    let cancelled = false;

    (async () => {
      try {
        const status = await fetchActiveTermStatus(token, TERM_KEY);
        if (cancelled) return;

        if (!status.hasAccepted) {
          acceptedCache.current = false;
          setBlocked(true); // aqui sim bloqueia (opcional)
          router.replace("/termo");
        } else {
          acceptedCache.current = true;
          setBlocked(false);
        }
      } catch {
        if (!cancelled) {
          // em erro, você pode decidir mandar pro termo
          router.replace("/termo");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, token, pathname, router]);

  // Só mostra algo se estiver efetivamente bloqueando
  if (blocked) return <div className="p-6">Redirecionando...</div>;

  // ✅ nunca mais aparece "Verificando termo..." depois de aceito
  return <>{children}</>;
}
