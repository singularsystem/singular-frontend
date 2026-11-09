import { forwardToNeckbook } from "@/app/api/neckbook/admin/_lib/forward";

export interface MunicipalityApiKeysRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: Request,
  context: MunicipalityApiKeysRouteContext,
): Promise<Response> {
  const { id } = await Promise.resolve(context.params);
  return forwardToNeckbook(
    req,
    `/v1/admin/municipalities/${encodeURIComponent(id)}/api-keys`,
  );
}

export async function POST(
  req: Request,
  context: MunicipalityApiKeysRouteContext,
): Promise<Response> {
  const { id } = await Promise.resolve(context.params);
  return forwardToNeckbook(
    req,
    `/v1/admin/municipalities/${encodeURIComponent(id)}/api-keys`,
  );
}
