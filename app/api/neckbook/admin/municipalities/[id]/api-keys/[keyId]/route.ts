import { forwardToNeckbook } from "@/app/api/neckbook/admin/_lib/forward";

export interface MunicipalityApiKeyItemRouteContext {
  params: Promise<{ id: string; keyId: string }>;
}

export async function PATCH(
  req: Request,
  context: MunicipalityApiKeyItemRouteContext,
): Promise<Response> {
  const { id, keyId } = await Promise.resolve(context.params);
  return forwardToNeckbook(
    req,
    `/v1/admin/municipalities/${encodeURIComponent(id)}/api-keys/${encodeURIComponent(keyId)}`,
  );
}

export async function DELETE(
  req: Request,
  context: MunicipalityApiKeyItemRouteContext,
): Promise<Response> {
  const { id, keyId } = await Promise.resolve(context.params);
  return forwardToNeckbook(
    req,
    `/v1/admin/municipalities/${encodeURIComponent(id)}/api-keys/${encodeURIComponent(keyId)}`,
  );
}
