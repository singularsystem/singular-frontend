import { AlunoAttachment, AlunoDocument, AlunoEntity, AlunoFilters, CreateAlunoDTO, PaginatedResult, ResultadoImportacaoAlunos, UpdateAlunoDTO } from "../../model/entities/alunos/AlunoEntity";
import { IAlunoRepository } from "../../model/repositories/alunos/IAlunoRepository";
import { env } from "../common/config/env";
import { AlunoAdapter } from "./AlunoAdapter";

export class AlunoRepositoryImpl implements IAlunoRepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async getAlunos(page: number, pageSize: number, filters: AlunoFilters, signal?: AbortSignal): Promise<PaginatedResult<AlunoEntity>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
      ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
      ...(filters.serie ? { serie: filters.serie } : {}),
    });

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students?${params.toString()}`, { signal });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Falha ao buscar alunos");
    }

    const result = await response.json();
    
    return {
      data: (result.data || []).map(AlunoAdapter.toEntity),
      total: result.total || 0
    }; 
    
  }

  async getAlunoById(id: string, signal?: AbortSignal): Promise<AlunoEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students/${id}`, { signal });
    
    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes do aluno");
    }

    const result = await response.json();
    return AlunoAdapter.toEntity(result.data);
  }

  async getDocuments(alunoId: string, signal?: AbortSignal): Promise<AlunoDocument[]> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students/${alunoId}/documents`, { signal });
    if (!response.ok) throw new Error("Erro ao buscar documentos");
    const result = await response.json();
    return (result.data || []).map(AlunoAdapter.toDocument);
  }

  async getAttachments(alunoId: string, signal?: AbortSignal): Promise<AlunoAttachment[]> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/files/students/${alunoId}`, { signal });
    if (!response.ok) throw new Error("Erro ao buscar anexos");
    const result = await response.json();
    return (result.data || []).map(AlunoAdapter.toAttachment);
  }

  async uploadAttachments(alunoId: string, files: File[]): Promise<void> {
    const formData = new FormData();
    formData.append("studentID", alunoId);
    files.forEach(file => formData.append("Files", file));

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/files/students`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Erro ao fazer upload");
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/files/${attachmentId}?confirmDeletion=true`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Erro ao deletar anexo");
  }

  async deleteAluno(id: string): Promise<void> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao deletar aluno");
    }
  }

  async createAluno(aluno: CreateAlunoDTO): Promise<AlunoEntity> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aluno),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao cadastrar aluno");
    }

    const result = await response.json();
    return AlunoAdapter.toEntity(result.data);
  }

  async updateAluno(aluno: UpdateAlunoDTO): Promise<AlunoEntity> {
    // Para garantir compatibilidade total de maiúsculas/minúsculas no backend C# (System.Text.Json)
    const payload = {
      ...aluno,
      id: aluno.id,
      ID: aluno.id,
      Id: aluno.id,
      susCard: aluno.susCard,
      SUSCard: aluno.susCard,
      rg: aluno.rg,
      RG: aluno.rg,
      cpf: aluno.cpf,
      CPF: aluno.cpf,
    };

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[AlunoRepositoryImpl] PUT /api/v1/students error:", errorData);
      
      let errorMsg = errorData.message || "Erro ao atualizar aluno";
      if (errorData.data && Array.isArray(errorData.data)) {
        const detail = errorData.data
          .map((err: any) => `${err.field}: ${err.errors.join(", ")}`)
          .join(" | ");
        if (detail) {
          errorMsg = `Dados inválidos: ${detail}`;
        }
      }
      throw new Error(errorMsg);
    }

    const result = await response.json();
    return AlunoAdapter.toEntity(result.data);
  }

  async fetchAllStudents(filters: AlunoFilters, signal?: AbortSignal): Promise<AlunoEntity[]> {
    const params = new URLSearchParams({
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
      ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
      ...(filters.serie ? { serie: filters.serie } : {}),
    });

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students/all?${params.toString()}`, { signal });
    if (!response.ok) throw new Error("Erro ao buscar todos os alunos");
    const result = await response.json();
    return (result.data || []).map(AlunoAdapter.toEntity);
  }
}

