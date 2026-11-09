import { ResultadoImportacaoAlunos } from "../../entities/alunos/AlunoEntity";

export interface IFileRepository {
  downloadTemplate(): Promise<Blob>;
  importStudents(file: File): Promise<ResultadoImportacaoAlunos>;
}
