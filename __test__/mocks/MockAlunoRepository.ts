import { AlunoEntity, AlunoFilters, CreateAlunoDTO, PaginatedResult, UpdateAlunoDTO, AlunoDocument, AlunoAttachment } from "../../source/model/entities/alunos/AlunoEntity";
import { IAlunoRepository } from "../../source/model/repositories/alunos/IAlunoRepository";

export class MockAlunoRepository implements IAlunoRepository {
  alunos: AlunoEntity[] = [];

  async getAlunos(page: number, pageSize: number, filters: AlunoFilters): Promise<PaginatedResult<AlunoEntity>> {
    return {
      data: this.alunos.slice((page - 1) * pageSize, page * pageSize),
      total: this.alunos.length
    };
  }

  async getAlunoById(id: string): Promise<AlunoEntity> {
    const aluno = this.alunos.find(a => a.id === id);
    if (!aluno) throw new Error("Aluno não encontrado");
    return aluno;
  }

  async deleteAluno(id: string): Promise<void> {
    this.alunos = this.alunos.filter(a => a.id !== id);
  }

  async createAluno(aluno: CreateAlunoDTO): Promise<AlunoEntity> {
    const newAluno: AlunoEntity = {
      id: Math.random().toString(),
      nome: aluno.fullName,
      fullName: aluno.fullName,
      cpf: aluno.cpf || "",
      rg: aluno.rg || "",
      susCard: aluno.susCard || "",
      dataNascimento: aluno.dateOfBirth,
      sexo: aluno.sex,
      sex: aluno.sex,
      email: "",
      telefone: "",
      status: true,
      escolaId: aluno.schoolID,
      schoolID: aluno.schoolID,
      cidade: aluno.city,
      city: aluno.city,
      uf: aluno.state,
      state: aluno.state,
      address: aluno.address,
      serie: aluno.serie,
      nameOfPersonResponsible: aluno.nameOfPersonResponsible,
      maritalStatusParents: aluno.maritalStatusParents,
      skinColor: aluno.skinColor
    };
    this.alunos.push(newAluno);
    return newAluno;
  }

  async updateAluno(aluno: UpdateAlunoDTO): Promise<AlunoEntity> {
    const index = this.alunos.findIndex(a => a.id === aluno.id);
    if (index === -1) throw new Error("Aluno não encontrado");
    
    const updatedAluno: AlunoEntity = {
      ...this.alunos[index],
      nome: aluno.fullName,
      fullName: aluno.fullName,
      cpf: aluno.cpf || "",
      rg: aluno.rg || "",
      susCard: aluno.susCard || "",
      dataNascimento: aluno.dateOfBirth,
      sexo: aluno.sex,
      sex: aluno.sex,
      escolaId: aluno.schoolID,
      schoolID: aluno.schoolID,
      cidade: aluno.city,
      city: aluno.city,
      uf: aluno.state,
      state: aluno.state,
      address: aluno.address,
      serie: aluno.serie,
      nameOfPersonResponsible: aluno.nameOfPersonResponsible,
      maritalStatusParents: aluno.maritalStatusParents,
      skinColor: aluno.skinColor
    };
    
    this.alunos[index] = updatedAluno;
    return updatedAluno;
  }

  async getDocuments(alunoId: string): Promise<AlunoDocument[]> {
    return [];
  }

  async getAttachments(alunoId: string): Promise<AlunoAttachment[]> {
    return [];
  }

  async uploadAttachments(alunoId: string, files: File[]): Promise<void> {
    return;
  }

  async fetchAllStudents(filters: AlunoFilters): Promise<AlunoEntity[]> { return this.alunos; }
  async deleteAttachment(attachmentId: string): Promise<void> {
    return;
  }
}
