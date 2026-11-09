"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ALLOWED_ROUTES_PREFIX = ["/login", "/primeiro-acesso", "/public"];

export function PasswordChangeGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, isLoading } = useAuth();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isAllowedRoute = ALLOWED_ROUTES_PREFIX.some((route) =>
      pathname.startsWith(route),
    );

    if (!token || !user) {
      setBlocked(false);
      return;
    }

    if (user.mustChangePassword && !isAllowedRoute) {
      setBlocked(true);
      router.replace("/primeiro-acesso");
      return;
    }

    if (!user.mustChangePassword && pathname.startsWith("/primeiro-acesso")) {
      setBlocked(true);
      router.replace("/dashboard");
      return;
    }

    setBlocked(false);
  }, [isLoading, pathname, router, token, user]);

  if (blocked) {
    return <div className="p-6">Redirecionando...</div>;
  }

  return <>{children}</>;
}
