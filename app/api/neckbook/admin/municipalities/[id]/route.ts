import { forwardToNeckbook } from "@/app/api/neckbook/admin/_lib/forward";

export interface MunicipalityRouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  req: Request,
  context: MunicipalityRouteContext,
): Promise<Response> {
  const { id } = await Promise.resolve(context.params);
  return forwardToNeckbook(
    req,
    `/v1/admin/municipalities/${encodeURIComponent(id)}`,
  );
}
