import { PortageEntity, CreatePortageEntity } from "../../model/entities/paee/PortageEntity";
import { IPortageRepository } from "../../model/repositories/paee/IPortageRepository";
import { env } from "../common/config/env";

export class PortageRepositoryImpl implements IPortageRepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async getPortageById(id: string, signal?: AbortSignal): Promise<PortageEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/portage/${id}`, { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao buscar Portage");
    }

    const result = await response.json();
    if (result.success === false) {
      throw new Error(result.message || "Falha ao buscar Portage");
    }

    return result.data as PortageEntity;
  }

  async getPortagesByStudent(studentId: string, signal?: AbortSignal): Promise<PortageEntity[]> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/portage/student/${studentId}`, { signal });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao buscar Portages do aluno");
    }

    const result = await response.json();
    if (result.success === false) {
      throw new Error(result.message || "Falha ao buscar Portages do aluno");
    }

    return result.data as PortageEntity[];
  }

  async createPortage(data: CreatePortageEntity): Promise<{ id: string }> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/portage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar Portage");
    }

    const result = await response.json().catch(() => ({}));
    if (result.success === false) {
      throw new Error(result.message || "Erro ao criar Portage");
    }

    return { id: result.data?.id || result.id };
  }
}
