"use client";
export const dynamic = "force-dynamic";

import { use } from "react";
import { PortageDetailsScreen } from "../../../../source/view/screens/paee/PortageDetailsScreen";

export default function Portage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <PortageDetailsScreen id={unwrappedParams.id} />;
}

