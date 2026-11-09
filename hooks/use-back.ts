"use client";

import { useLastRoute } from "@/contexts/navigation-context";
import { useRouter } from "next/navigation";

export function useBack(fallback = "/") {
  const router = useRouter();
  const lastRoute = useLastRoute();

  return () => {
    const sp = new URLSearchParams(window.location.search);
    const returnTo = sp.get("returnTo");

    if (returnTo) return router.push(returnTo);
    if (lastRoute) return router.push(lastRoute);
    return router.push(fallback);
  };
}
