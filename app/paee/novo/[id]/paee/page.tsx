"use client";
export const dynamic = "force-dynamic";

import { use } from "react";
import { PaeeFormScreen } from "../../../../../source/view/screens/paee/PaeeFormScreen";

export default function NovoPAEE({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <PaeeFormScreen id={unwrappedParams.id} isEdit={false} />;
}
