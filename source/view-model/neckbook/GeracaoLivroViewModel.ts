import {
  ESTILO_VISUAL_PADRAO,
  EXERCICIOS_POR_CAPITULO_PADRAO,
  NUM_CAPITULOS_PADRAO,
  POLLING_INTERVAL_MS,
  POLLING_TOTAL_TIMEOUT_MS,
  type CampoFormulario,
  type Disciplina,
  type DraftResponse,
  type DraftUpdatePayload,
  type ErrorView,
  type FormularioGeracao,
  type JobStatusEntity,
  type ModoGeracao,
} from "../../model/entities/neckbook/GeracaoLivroTypes";
import {
  addInteresse,
  montarPayload,
  validarFormulario,
} from "../../model/entities/neckbook/FormValidator";
import { classificarErro } from "../../model/entities/neckbook/ErrorClassifier";
import {
  NeckbookBooksError,
  type INeckbookBooksRepository,
} from "../../model/repositories/neckbook/INeckbookBooksRepository";

export interface GeracaoLivroState {
  form: FormularioGeracao;
  fieldErrors: Partial<Record<CampoFormulario, string>>;
  isGenerating: boolean;
  jobId: string | null;
  bookId: string | null;
  jobStatus: JobStatusEntity | null;
  errorView: ErrorView | null;
  isPolling: boolean;
  isDraftReady: boolean;
  timeoutExpired: boolean;
  draft: DraftResponse | null;
  isSavingDraft: boolean;
  isApprovingDraft: boolean;
}

type Listener = (state: GeracaoLivroState) => void;

export class GeracaoLivroViewModel {
  private state: GeracaoLivroState = {
    form: {
      studentId: null,
      disciplina: null,
      interesses: [],
      numCapitulos: NUM_CAPITULOS_PADRAO,
      exerciciosPorCapitulo: EXERCICIOS_POR_CAPITULO_PADRAO,
      estiloVisual: ESTILO_VISUAL_PADRAO,
      suporteCaa: false,
      mode: null,
    },
    fieldErrors: {},
    isGenerating: false,
    jobId: null,
    bookId: null,
    jobStatus: null,
    errorView: null,
    isPolling: false,
    isDraftReady: false,
    timeoutExpired: false,
    draft: null,
    isSavingDraft: false,
    isApprovingDraft: false,
  };

  private listeners: Listener[] = [];
  private pollingTimer: ReturnType<typeof setTimeout> | null = null;
  private pollingStartedAt: number | null = null;

  constructor(private readonly repository: INeckbookBooksRepository) {}

  getState(): GeracaoLivroState {
    return {
      ...this.state,
      form: {
        ...this.state.form,
        interesses: [...this.state.form.interesses],
      },
      fieldErrors: { ...this.state.fieldErrors },
    };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(): void {
    const currentState = this.getState();
    this.listeners.forEach((l) => l(currentState));
  }

  updateState(partial: Partial<GeracaoLivroState>): void {
    this.state = {
      ...this.state,
      ...partial,
      form: partial.form
        ? {
            ...this.state.form,
            ...partial.form,
            interesses: partial.form.interesses
              ? [...partial.form.interesses]
              : [...this.state.form.interesses],
          }
        : this.state.form,
      fieldErrors: partial.fieldErrors !== undefined
        ? { ...partial.fieldErrors }
        : this.state.fieldErrors,
    };
    this.notify();
  }

  // --- Mutators do formulário ---

  setStudentId(studentId: string | null): void {
    this.updateState({
      form: { ...this.state.form, studentId },
      fieldErrors: { ...this.state.fieldErrors, studentId: undefined },
    });
  }

  setDisciplina(disciplina: Disciplina | "" | null): void {
    this.updateState({
      form: { ...this.state.form, disciplina },
      fieldErrors: { ...this.state.fieldErrors, disciplina: undefined },
    });
  }

  addInteresseItem(candidato: string): void {
    const novaLista = addInteresse(this.state.form.interesses, candidato);
    this.updateState({
      form: { ...this.state.form, interesses: novaLista },
    });
  }

  removeInteresseItem(index: number): void {
    const novaLista = this.state.form.interesses.filter((_, i) => i !== index);
    this.updateState({
      form: { ...this.state.form, interesses: novaLista },
    });
  }

  setNumCapitulos(numCapitulos: number | string): void {
    this.updateState({
      form: { ...this.state.form, numCapitulos },
      fieldErrors: { ...this.state.fieldErrors, numCapitulos: undefined },
    });
  }

  setExerciciosPorCapitulo(exerciciosPorCapitulo: number | string): void {
    this.updateState({
      form: { ...this.state.form, exerciciosPorCapitulo },
      fieldErrors: {
        ...this.state.fieldErrors,
        exerciciosPorCapitulo: undefined,
      },
    });
  }

  setEstiloVisual(estiloVisual: string): void {
    this.updateState({
      form: { ...this.state.form, estiloVisual },
    });
  }

  setSuporteCaa(suporteCaa: boolean): void {
    this.updateState({
      form: { ...this.state.form, suporteCaa },
    });
  }

  setMode(mode: ModoGeracao | null): void {
    this.updateState({
      form: { ...this.state.form, mode },
      fieldErrors: { ...this.state.fieldErrors, mode: undefined },
    });
  }

  clearError(): void {
    this.updateState({ errorView: null });
  }

  // --- Disparo de geração ---

  async gerar(): Promise<void> {
    this.updateState({ errorView: null, fieldErrors: {} });

    const validacao = validarFormulario(this.state.form);
    if (!validacao.valid) {
      this.updateState({
        fieldErrors: validacao.fieldErrors,
        isGenerating: false,
      });
      return;
    }

    this.updateState({ isGenerating: true, errorView: null });

    try {
      const payload = montarPayload(this.state.form);
      const res = await this.repository.generate(payload);
      this.updateState({
        jobId: res.jobId,
        bookId: res.bookId,
        isGenerating: false,
      });
      this.startPolling(res.jobId);
    } catch (err: unknown) {
      const backendErr =
        err instanceof NeckbookBooksError
          ? {
              status: err.status,
              code: err.code,
              message: err.message,
              details: err.details,
            }
          : {
              status: 0,
              code: "NETWORK",
              message: err instanceof Error ? err.message : String(err),
            };

      const errorView = classificarErro(backendErr);
      this.updateState({
        errorView,
        isGenerating: false,
      });
    }
  }

  // --- Polling sequencial ---

  startPolling(jobId: string): void {
    this.stopPolling();
    this.pollingStartedAt = Date.now();
    this.updateState({ isPolling: true, timeoutExpired: false });
    this.pollJob(jobId);
  }

  stopPolling(): void {
    if (this.pollingTimer !== null) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = null;
    }
    this.updateState({ isPolling: false });
  }

  private async pollJob(jobId: string): Promise<void> {
    const elapsed = Date.now() - (this.pollingStartedAt || Date.now());
    if (elapsed >= POLLING_TOTAL_TIMEOUT_MS) {
      this.stopPolling();
      this.updateState({
        isPolling: false,
        timeoutExpired: true,
        errorView: {
          category: "UNEXPECTED",
          message: "O tempo de geração expirou. Tente novamente mais tarde",
        },
      });
      return;
    }

    try {
      const jobStatus = await this.repository.getJobStatus(jobId);
      this.updateState({ jobStatus });

      if (jobStatus.status === "COMPLETED") {
        this.stopPolling();
        return;
      }

      if (jobStatus.status === "FAILED") {
        this.stopPolling();
        this.updateState({
          errorView: {
            category: "UNEXPECTED",
            message:
              jobStatus.error_message ||
              "Ocorreu um erro inesperado ao gerar o livro",
          },
        });
        return;
      }

      if (
        jobStatus.status === "AWAITING_TEACHER_REVIEW" &&
        this.state.form.mode === "draft_first"
      ) {
        this.stopPolling();
        this.updateState({ isDraftReady: true });
        return;
      }
    } catch {
      // Falha isolada de consulta não encerra o acompanhamento (Req 11.9)
    }

    this.pollingTimer = setTimeout(() => {
      this.pollJob(jobId);
    }, POLLING_INTERVAL_MS);
  }

  // --- Fluxo de rascunho ---

  async loadDraft(bookId: string): Promise<DraftResponse | null> {
    this.updateState({ errorView: null });
    try {
      const draft = await this.repository.getDraft(bookId);
      this.updateState({ draft });
      return draft;
    } catch (err: unknown) {
      const backendErr =
        err instanceof NeckbookBooksError
          ? {
              status: err.status,
              code: err.code,
              message: err.message,
              details: err.details,
            }
          : { status: 0, code: "NETWORK" };
      this.updateState({
        errorView: {
          category: "UNEXPECTED",
          message: "Não foi possível carregar o rascunho. Tente novamente",
        },
      });
      return null;
    }
  }

  async saveDraft(
    bookId: string,
    draftData: DraftUpdatePayload,
  ): Promise<boolean> {
    this.updateState({ isSavingDraft: true, errorView: null });
    try {
      await this.repository.saveDraft(bookId, draftData);
      this.updateState({
        isSavingDraft: false,
        draft: { ...draftData },
      });
      return true;
    } catch (err: unknown) {
      this.updateState({
        isSavingDraft: false,
        errorView: {
          category: "UNEXPECTED",
          message: "Não foi possível salvar as alterações. Tente novamente",
        },
      });
      return false;
    }
  }

  async approveDraft(bookId: string): Promise<boolean> {
    this.updateState({ isApprovingDraft: true, errorView: null });
    try {
      await this.repository.approve(bookId);
      this.updateState({
        isApprovingDraft: false,
        isDraftReady: false,
      });
      if (this.state.jobId) {
        this.startPolling(this.state.jobId);
      }
      return true;
    } catch (err: unknown) {
      this.updateState({
        isApprovingDraft: false,
        errorView: {
          category: "UNEXPECTED",
          message: "Não foi possível aprovar o rascunho. Tente novamente",
        },
      });
      return false;
    }
  }
}
