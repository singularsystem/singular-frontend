import { GeracaoLivroViewModel } from "@/source/view-model/neckbook/GeracaoLivroViewModel";
import type { INeckbookBooksRepository } from "@/source/model/repositories/neckbook/INeckbookBooksRepository";
import { NeckbookBooksError } from "@/source/model/repositories/neckbook/INeckbookBooksRepository";

describe("GeracaoLivroViewModel Polling e Fluxo de Rascunho (Task 9.5)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("polling sequencial consulta a cada 3s e encerra em COMPLETED", async () => {
    let callCount = 0;
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(async () => {
        callCount++;
        if (callCount === 1) {
          return { status: "PROCESSING" as const, progress: 20, current_step: "Texto" };
        }
        return {
          status: "COMPLETED",
          progress: 100,
          current_step: "Concluído",
          pdf_url: "https://neckbook.com/livro.pdf",
        };
      }),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.startPolling("job-1");

    // Primeira consulta
    await Promise.resolve();
    expect(callCount).toBe(1);
    expect(vm.getState().isPolling).toBe(true);

    // Avança 3s -> segunda consulta
    jest.advanceTimersByTime(3000);
    await Promise.resolve();
    expect(callCount).toBe(2);
    expect(vm.getState().isPolling).toBe(false);
    expect(vm.getState().jobStatus?.status).toBe("COMPLETED");
    expect(vm.getState().jobStatus?.pdf_url).toBe("https://neckbook.com/livro.pdf");
  });

  it("polling encerra em FAILED e exibe mensagem de erro", async () => {
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(async () => ({
        status: "FAILED",
        progress: 50,
        current_step: "Erro",
        error_message: "Falha na renderização do PDF",
      })),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.startPolling("job-2");
    await Promise.resolve();

    expect(vm.getState().isPolling).toBe(false);
    expect(vm.getState().errorView?.message).toBe("Falha na renderização do PDF");
  });

  it("em AWAITING_TEACHER_REVIEW com draft_first, pausa polling e marca isDraftReady: true", async () => {
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(async () => ({
        status: "AWAITING_TEACHER_REVIEW",
        progress: 50,
        current_step: "Aguardando revisão",
      })),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.setMode("draft_first");
    vm.startPolling("job-draft-1");
    await Promise.resolve();

    expect(vm.getState().isPolling).toBe(false);
    expect(vm.getState().isDraftReady).toBe(true);
  });

  it("falha isolada de getJobStatus nao encerra o polling e reagenda para 3s depois", async () => {
    let callCount = 0;
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error("Conexão instável momentânea");
        }
        return {
          status: "COMPLETED",
          progress: 100,
          current_step: "Pronto",
        };
      }),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.startPolling("job-retry-1");

    await Promise.resolve();
    expect(callCount).toBe(1);
    expect(vm.getState().isPolling).toBe(true);

    // Próximo intervalo de 3s
    jest.advanceTimersByTime(3000);
    await Promise.resolve();
    expect(callCount).toBe(2);
    expect(vm.getState().isPolling).toBe(false);
    expect(vm.getState().jobStatus?.status).toBe("COMPLETED");
  });

  it("timeout total de 10 min encerra polling e exibe mensagem de expiracao", async () => {
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(async () => ({
        status: "PROCESSING" as const,
        progress: 80,
        current_step: "Gerando imagens",
      })),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.startPolling("job-timeout-1");
    await Promise.resolve();

    // Avança 10 minutos (600_000 ms)
    jest.setSystemTime(Date.now() + 600_000);
    jest.advanceTimersByTime(3000);
    await Promise.resolve();

    expect(vm.getState().isPolling).toBe(false);
    expect(vm.getState().timeoutExpired).toBe(true);
    expect(vm.getState().errorView?.message).toBe(
      "O tempo de geração expirou. Tente novamente mais tarde",
    );
  });

  it("approveDraft retoma o polling do Job em sucesso", async () => {
    let getStatusCalls = 0;
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(async () => {
        getStatusCalls++;
        return { status: "COMPLETED", progress: 100, current_step: "Final" };
      }),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(async () => {}),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.updateState({ jobId: "job-approved-1", bookId: "book-1", isDraftReady: true });

    const ok = await vm.approveDraft("book-1");
    expect(ok).toBe(true);
    expect(mockRepo.approve).toHaveBeenCalledWith("book-1");
    expect(vm.getState().isDraftReady).toBe(false);

    await Promise.resolve();
    expect(getStatusCalls).toBe(1);
  });

  it("em erro de requisicao, preserva o formulario", async () => {
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(async () => {
        throw new NeckbookBooksError(503, "Indisponível");
      }),
      getJobStatus: jest.fn(),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);
    vm.setStudentId("student-preservar-1");
    vm.setDisciplina("História");
    vm.setMode("full_auto");
    vm.addInteresseItem("Castelos");

    await vm.gerar();

    const state = vm.getState();
    expect(state.errorView?.category).toBe("SERVICE_UNAVAILABLE");
    expect(state.form.studentId).toBe("student-preservar-1");
    expect(state.form.disciplina).toBe("História");
    expect(state.form.mode).toBe("full_auto");
    expect(state.form.interesses).toEqual(["Castelos"]);
  });
});
