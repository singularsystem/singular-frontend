import { AlunoAttachment, AlunoDocument, AlunoEntity } from "../../model/entities/alunos/AlunoEntity";
import { IAlunoRepository } from "../../model/repositories/alunos/IAlunoRepository";

export interface AlunoDetailsState {
  aluno: AlunoEntity | null;
  documents: AlunoDocument[];
  attachments: AlunoAttachment[];
  isLoading: boolean;
  isDocumentsLoading: boolean;
  isAttachmentsLoading: boolean;
  error: string | null;
}

type Listener = (state: AlunoDetailsState) => void;

export class AlunoDetailsViewModel {
  private state: AlunoDetailsState = {
    aluno: null,
    documents: [],
    attachments: [],
    isLoading: false,
    isDocumentsLoading: false,
    isAttachmentsLoading: false,
    error: null,
  };

  private listeners: Listener[] = [];

  constructor(private repository: IAlunoRepository) {}

  getState(): AlunoDetailsState {
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

  private updateState(partialState: Partial<AlunoDetailsState>) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  async loadDetails(id: string) {
    this.updateState({ isLoading: true, error: null });
    try {
      const aluno = await this.repository.getAlunoById(id);
      this.updateState({ aluno, isLoading: false });
      
      // Carrega documentos e anexos em paralelo após ter o aluno
      this.loadDocuments(id);
      this.loadAttachments(id);
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao carregar detalhes do aluno",
      });
    }
  }

  async loadDocuments(id: string) {
    this.updateState({ isDocumentsLoading: true });
    try {
      const documents = await this.repository.getDocuments(id);
      this.updateState({ documents, isDocumentsLoading: false });
    } catch (error) {
      this.updateState({ isDocumentsLoading: false });
      // Erro de documentos não deve travar a tela toda
    }
  }

  async loadAttachments(id: string) {
    this.updateState({ isAttachmentsLoading: true });
    try {
      const attachments = await this.repository.getAttachments(id);
      this.updateState({ attachments, isAttachmentsLoading: false });
    } catch (error) {
      this.updateState({ isAttachmentsLoading: false });
    }
  }

  async uploadFiles(files: FileList) {
    if (!this.state.aluno) return;
    this.updateState({ isAttachmentsLoading: true });
    try {
      await this.repository.uploadAttachments(this.state.aluno.id, Array.from(files));
      await this.loadAttachments(this.state.aluno.id);
    } catch (error) {
      this.updateState({ isAttachmentsLoading: false });
      throw error;
    }
  }

  async deleteAttachment(attachmentId: string) {
    if (!this.state.aluno) return;
    this.updateState({ isAttachmentsLoading: true });
    try {
      await this.repository.deleteAttachment(attachmentId);
      await this.loadAttachments(this.state.aluno.id);
    } catch (error) {
      this.updateState({ isAttachmentsLoading: false });
      throw error;
    }
  }

  getDocumentUrl(docId: string, docType: string): string {
    const routeBuilder = documentRouteMap[docType];
    return routeBuilder ? routeBuilder(docId) : "";
  }
}

const documentRouteMap: Record<string, (id: string) => string> = {
  RegularTeacherEvaluationDocument: (id) => `/professor-avaliacao/${id}`,
  RegularTeacherQuestionnaire: (id) => `/professor-questionario/${id}`,
  RegularTeacherScreening: (id) => `/professor-triagem/${id}`,
  PEI: (id) => `/pei/${id}`,
  PAEE: (id) => `/paee/plano/${id}`,
  PortageGuide: (id) => `/paee/portage/${id}`,
  Report: (id) => `/relatorios/${id}`,
  SocialWorkerReport: (id) => `/relatorios/${id}/servico-social`,
  PsychologistReport: (id) => `/relatorios/${id}/psicologo`,
  PsychopedagogueReport: (id) => `/relatorios/${id}/psicopedagogo`,
  PsychologistQuestionnaire: (id) => `/questionarios/psicologo/${id}`,
  PsychopedagogueQuestionnaire: (id) => `/questionarios/psicopedagogo/${id}`,
  CARSQuestionnaire: (id) => `/questionarios/cars-childhood/${id}`,
  MCHATQuestionnaire: (id) => `/questionarios/mchat/${id}`,
  CognitiveAssessment: (id) => `/questionarios/avaliacao-cognitiva/${id}`,
  SnapIVQuestionnaire: (id) => `/questionarios/snapiv/${id}`,
  AdaptiveBehaviorScaleDI: (id) => `/questionarios/escala-adaptativa-di/${id}`,
};

