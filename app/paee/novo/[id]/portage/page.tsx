"use client";
export const dynamic = "force-dynamic";

import { use } from "react";
import { PortageCreateScreen } from "../../../../../source/view/screens/paee/PortageCreateScreen";

export default function NovoPortage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <PortageCreateScreen id={unwrappedParams.id} />;
}
