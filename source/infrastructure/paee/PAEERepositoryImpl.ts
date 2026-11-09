import { PAEEEntity, PAEEFilters, PaginatedResult, CreatePAEEEntity, UpdatePAEEEntity } from "../../model/entities/paee/PAEEEntity";
import { IPAEERepository } from "../../model/repositories/paee/IPAEERepository";
import { env } from "../common/config/env";

export class PAEERepositoryImpl implements IPAEERepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async getPAEEs(page: number, pageSize: number, filters: PAEEFilters, signal?: AbortSignal): Promise<PaginatedResult<PAEEEntity>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
      ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
      ...(filters.onlyMyDocs !== undefined ? { onlyMyDocs: String(filters.onlyMyDocs) } : {}),
      ...(filters.onlyMyReports !== undefined ? { onlyMyReports: String(filters.onlyMyReports) } : {}),
      ...(filters.myStatus ? { myStatus: filters.myStatus } : {}),
    });

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/paees?${params.toString()}`, { signal });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao buscar PAEEs");
    }

    const result = await response.json();

    if (result.success === false) {
      throw new Error(result.message || "Falha ao buscar PAEEs");
    }
    
    return {
      data: result.data || [],
      total: result.total || 0,
      uniqueTotal: result.uniqueTotal || result.total || 0,
    }; 
  }

  async getPAEEById(id: string, signal?: AbortSignal): Promise<PAEEEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/paees/${id}`, { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao buscar PAEE");
    }

    const result = await response.json();
    if (result.success === false) {
      throw new Error(result.message || "Falha ao buscar PAEE");
    }

    return result.data as PAEEEntity;
  }

  async createPAEE(data: CreatePAEEEntity): Promise<void> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/paees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar PAEE");
    }

    const result = await response.json().catch(() => ({}));
    if (result.success === false) {
      throw new Error(result.message || "Erro ao criar PAEE");
    }
  }

  async updatePAEE(data: UpdatePAEEEntity): Promise<void> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/paees`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao atualizar PAEE");
    }

    const result = await response.json().catch(() => ({}));
    if (result.success === false) {
      throw new Error(result.message || "Erro ao atualizar PAEE");
    }
  }

  async deletePAEE(id: string): Promise<void> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/paees/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        confirmDeletion: true,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao deletar PAEE");
    }

    const result = await response.json().catch(() => ({}));
    if (result.success === false) {
      throw new Error(result.message || "Erro ao deletar PAEE");
    }
  }
}
