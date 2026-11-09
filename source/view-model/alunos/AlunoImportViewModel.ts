import { ResultadoImportacaoAlunos } from "../../model/entities/alunos/AlunoEntity";
import { IFileRepository } from "../../model/repositories/alunos/IFileRepository";

export interface AlunoImportState {
  isLoading: boolean;
  error: string | null;
  result: ResultadoImportacaoAlunos | null;
  showResultModal: boolean;
}

type Listener = (state: AlunoImportState) => void;

export class AlunoImportViewModel {
  private state: AlunoImportState = {
    isLoading: false,
    error: null,
    result: null,
    showResultModal: false,
  };

  private listeners: Listener[] = [];

  constructor(private repository: IFileRepository) {}

  getState(): AlunoImportState {
    return { ...this.state };
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.getState()));
  }

  private updateState(partialState: Partial<AlunoImportState>) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  async importFile(file: File) {
    this.updateState({ isLoading: true, error: null, result: null, showResultModal: false });
    try {
      const response = await this.repository.importStudents(file);
      
      // Mapeia a resposta para garantir que os campos internos (data) sejam extraídos se necessário
      const apiResult = (response as any).data || response;

      const result: ResultadoImportacaoAlunos = {
        createdCount: apiResult.createdCount ?? 0,
        failedCount: apiResult.failedCount ?? 0,
        successfulStudents: Array.isArray(apiResult.successfulStudents) ? apiResult.successfulStudents : [],
        failedStudents: Array.isArray(apiResult.failedStudents) ? apiResult.failedStudents : [],
      };

      this.updateState({
        result,
        isLoading: false,
        showResultModal: true,
      });
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao importar arquivo",
      });
    }
  }

  closeModal() {
    this.updateState({ showResultModal: false });
  }

  downloadFailedRows() {
    if (!this.state.result || this.state.result.failedCount === 0) return;
    
    const headers = [
      "NomeCompleto", "Sexo", "DataNascimento", "Endereco", "Municipio", "Estado",
      "UnidadeEscolar", "MunicipioEscola", "EstadoEscola", "Serie", "NomeResponsavel",
      "EstadoCivilPais", "CorPele", "SUS", "RG", "CPF", "Erros"
    ];

    const csvRows = this.state.result.failedStudents.map(({ rowData, errors }) => {
      const values = [
        rowData.fullName, rowData.sex, rowData.dateOfBirth, rowData.address, rowData.city, rowData.state,
        rowData.schoolName, rowData.schoolCity, rowData.schoolState, rowData.serie, rowData.nameOfPersonResponsible,
        rowData.maritalStatusParents, rowData.skinColor, rowData.susCard ?? "", rowData.rg ?? "", rowData.cpf ?? "",
        errors.join(" | ")
      ];
      return values.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(";");
    });

    const csvContent = [headers.join(";"), ...csvRows].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alunos-com-falha-importacao.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
