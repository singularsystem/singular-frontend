import { IEscolaRepository } from "../../model/repositories/escolas/IEscolaRepository";
import { EscolaEntity, CreateEscolaDTO, UpdateEscolaDTO } from "../../model/entities/escolas/EscolaEntity";
import { PaginatedResult } from "../../model/entities/alunos/AlunoEntity";
import { EscolaAdapter } from "./EscolaAdapter";
import { env } from "../common/config/env";

export class EscolaRepositoryImpl implements IEscolaRepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async getEscolas(
    page: number,
    pageSize: number,
    searchTerm: string,
    state?: string,
    city?: string,
    signal?: AbortSignal
  ): Promise<PaginatedResult<EscolaEntity>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(searchTerm ? { searchTerm } : {}),
      ...(state ? { state } : {}),
      ...(city ? { city } : {})
    });

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/schools?${params.toString()}`, { signal });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao carregar lista de escolas");
    }

    const result = await response.json();
    return {
      data: (result.data || []).map(EscolaAdapter.toEntity),
      total: result.total || 0
    };
  }

  async getEscolaById(id: string, signal?: AbortSignal): Promise<EscolaEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/schools/${id}`, { signal });
    
    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes da escola");
    }

    const result = await response.json();
    return EscolaAdapter.toEntity(result.data);
  }

  async createEscola(escola: CreateEscolaDTO): Promise<EscolaEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/schools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(escola),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao cadastrar escola");
    }

    const result = await response.json();
    return EscolaAdapter.toEntity(result.data);
  }

  async updateEscola(escola: UpdateEscolaDTO): Promise<EscolaEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/schools`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(escola),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao atualizar escola");
    }

    const result = await response.json();
    return EscolaAdapter.toEntity(result.data);
  }

  async deleteEscola(id: string): Promise<void> {
    const params = new URLSearchParams({
      confirmDeletion: "true"
    });

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/schools/${id}?${params.toString()}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao excluir escola");
    }
  }
}
