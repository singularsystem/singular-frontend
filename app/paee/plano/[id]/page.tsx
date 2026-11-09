"use client";
export const dynamic = "force-dynamic";

import { use } from "react";
import { PaeeDetailsScreen } from "../../../../source/view/screens/paee/PaeeDetailsScreen";

export default function PlanoPAEE({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <PaeeDetailsScreen id={unwrappedParams.id} />;
}

