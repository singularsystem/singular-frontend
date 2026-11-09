import { EscolaEntity, CreateEscolaDTO, UpdateEscolaDTO } from "../../entities/escolas/EscolaEntity";
import { PaginatedResult } from "../../entities/alunos/AlunoEntity";

export interface IEscolaRepository {
  getEscolas(
    page: number,
    pageSize: number,
    searchTerm: string,
    state?: string,
    city?: string,
    signal?: AbortSignal
  ): Promise<PaginatedResult<EscolaEntity>>;
  
  getEscolaById(id: string, signal?: AbortSignal): Promise<EscolaEntity>;
  
  createEscola(escola: CreateEscolaDTO): Promise<EscolaEntity>;
  
  updateEscola(escola: UpdateEscolaDTO): Promise<EscolaEntity>;
  
  deleteEscola(id: string): Promise<void>;
}
