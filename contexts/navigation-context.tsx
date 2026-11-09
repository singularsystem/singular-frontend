"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type NavContextValue = {
  lastRoute: string | null;
};

const NavContext = createContext<NavContextValue>({ lastRoute: null });

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // guarda o "current" (pathname + querystring) sem usar useSearchParams
  const [current, setCurrent] = useState<string>(pathname);

  useEffect(() => {
    // só existe no client
    const qs = window.location.search; // inclui o "?" quando existe
    setCurrent(qs ? `${pathname}${qs}` : pathname);
  }, [pathname]);

  const prevRouteRef = useRef<string | null>(null);
  const [lastRoute, setLastRoute] = useState<string | null>(null);

  useEffect(() => {
    const prev = prevRouteRef.current;

    if (prev && prev !== current) {
      setLastRoute(prev);
    }

    prevRouteRef.current = current;
  }, [current]);

  return (
    <NavContext.Provider value={{ lastRoute }}>{children}</NavContext.Provider>
  );
}

export function useLastRoute() {
  return useContext(NavContext).lastRoute;
}
