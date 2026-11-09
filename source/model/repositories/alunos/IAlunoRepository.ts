import { AlunoAttachment, AlunoDocument, AlunoEntity, AlunoFilters, CreateAlunoDTO, PaginatedResult, ResultadoImportacaoAlunos, UpdateAlunoDTO } from "../../entities/alunos/AlunoEntity";

export interface IAlunoRepository {
  getAlunos(
    page: number,
    pageSize: number,
    filters: AlunoFilters,
    signal?: AbortSignal
  ): Promise<PaginatedResult<AlunoEntity>>;
  
  getAlunoById(id: string, signal?: AbortSignal): Promise<AlunoEntity>;
  
  deleteAluno(id: string): Promise<void>;
  
  createAluno(aluno: CreateAlunoDTO): Promise<AlunoEntity>;

  updateAluno(aluno: UpdateAlunoDTO): Promise<AlunoEntity>;

  getDocuments(alunoId: string, signal?: AbortSignal): Promise<AlunoDocument[]>;

  getAttachments(alunoId: string, signal?: AbortSignal): Promise<AlunoAttachment[]>;

  uploadAttachments(alunoId: string, files: File[]): Promise<void>;

  deleteAttachment(attachmentId: string): Promise<void>;

  fetchAllStudents(filters: AlunoFilters, signal?: AbortSignal): Promise<AlunoEntity[]>;
}

