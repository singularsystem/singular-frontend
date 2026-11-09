import { ResultadoImportacaoAlunos } from "../../model/entities/alunos/AlunoEntity";
import { IFileRepository } from "../../model/repositories/alunos/IFileRepository";
import { env } from "../common/config/env";

export class FileRepositoryImpl implements IFileRepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async downloadTemplate(): Promise<Blob> {
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students/template/xls`);
    if (!response.ok) throw new Error("Erro ao baixar template");
    return await response.blob();
  }

  async importStudents(file: File): Promise<ResultadoImportacaoAlunos> {
    const formData = new FormData();
    formData.append("File", file);

    const response = await this.secureFetch(`${this.apiUrl}/api/v1/students/import/xls`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao importar alunos");
    }

    return await response.json();
  }
}
