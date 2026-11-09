import { ActiveTermStatusResponse, TermResponse } from "@/types/term";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchActiveTerm(
  token: string,
  key = "AEE_TERMO_RESPONSABILIDADE",
) {
  const res = await fetch(
    `${apiUrl}/api/v1/terms/active?key=${encodeURIComponent(key)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Falha ao buscar termo ativo");
  return (await res.json()) as TermResponse;
}

export async function fetchActiveTermStatus(
  token: string,
  key = "AEE_TERMO_RESPONSABILIDADE",
) {
  const res = await fetch(
    `${apiUrl}/api/v1/terms/active/status?key=${encodeURIComponent(key)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Falha ao buscar status do termo");
  return (await res.json()) as ActiveTermStatusResponse;
}

export async function acceptActiveTerm(
  token: string,
  key = "AEE_TERMO_RESPONSABILIDADE",
) {
  const res = await fetch(
    `${apiUrl}/api/v1/terms/active/accept?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accepted: true }),
    },
  );

  if (!res.ok && res.status !== 204)
    throw new Error("Falha ao registrar aceite do termo");
}
