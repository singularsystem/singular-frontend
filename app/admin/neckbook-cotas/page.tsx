"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAdmin } from "@/source/infrastructure/common/config/roles";
import { Skeleton } from "@/components/ui/skeleton";
import { MunicipiosCotasScreen } from "@/source/view/screens/neckbook/MunicipiosCotasScreen";

const AUTHENTICATED_HOME_ROUTE = "/dashboard";

export default function NeckbookCotasAdminPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const rolesIndeterminate =
    isLoading || (isAuthenticated && (!user || !Array.isArray(user.roles)));
  const userIsAdmin =
    !rolesIndeterminate && isAuthenticated && Boolean(user && isAdmin(user.roles));

  useEffect(() => {
    if (!rolesIndeterminate && !userIsAdmin) {
      router.replace(AUTHENTICATED_HOME_ROUTE);
    }
  }, [rolesIndeterminate, userIsAdmin, router]);

  if (rolesIndeterminate) {
    return (
      <div
        data-testid="admin-gate-loading"
        className="mx-auto max-w-7xl space-y-4 p-6"
      >
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!userIsAdmin) {
    return null;
  }

  return <MunicipiosCotasScreen />;
}
