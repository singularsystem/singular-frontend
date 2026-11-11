import { IssuerProfile, UpdateIssuerProfileDto } from "../entities/issuer-profile";

export class IssuerProfileRepository {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || "";
  }

  async getProfile(token: string): Promise<IssuerProfile> {
    const res = await fetch(`${this.apiUrl}/api/v1/issuer-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Erro ao obter perfil do emissor (${res.status})`);
    }

    return await res.json();
  }

  async updateProfile(dto: UpdateIssuerProfileDto, token: string): Promise<IssuerProfile> {
    const res = await fetch(`${this.apiUrl}/api/v1/issuer-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erro ao salvar perfil" }));
      throw new Error(err.message || `Erro ao salvar perfil (${res.status})`);
    }

    return await res.json();
  }

  async uploadLogo(file: File, token: string): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${this.apiUrl}/api/v1/issuer-profile/logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erro no envio do logotipo" }));
      throw new Error(err.message || `Erro ao enviar logotipo (${res.status})`);
    }

    return await res.json();
  }
}
