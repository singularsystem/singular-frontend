import { forwardToNeckbook } from "@/app/api/neckbook/admin/_lib/forward";

export async function GET(req: Request): Promise<Response> {
  return forwardToNeckbook(req, "/v1/admin/municipalities");
}

export async function POST(req: Request): Promise<Response> {
  return forwardToNeckbook(req, "/v1/admin/municipalities");
}
