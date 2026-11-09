import { NeckbookBooksRepositoryImpl } from "@/source/infrastructure/neckbook/NeckbookBooksRepositoryImpl";
import { NeckbookBooksError } from "@/source/model/repositories/neckbook/INeckbookBooksRepository";
import type { GenerateBookPayload } from "@/source/model/entities/neckbook/GeracaoLivroTypes";

function createMockResponse(status: number, data?: unknown, ok = status >= 200 && status < 300) {
  return {
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

describe("NeckbookBooksRepositoryImpl", () => {
  const fakeApiUrl = "http://test-api.local";

  const samplePayload: GenerateBookPayload = {
    studentId: "student-123",
    disciplina: "Matemática",
    mode: "full_auto",
    num_capitulos: 4,
    exercicios_por_capitulo: 1,
    suporte_caa: false,
    estilo_visual: "aquarela_infantil",
    interesses: ["robôs"],
  };

  it("generate chama POST /api/v1/neckbook/books/generate com headers e body corretos", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;

    const mockFetch = jest.fn(async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedInit = init;
      return createMockResponse(202, { jobId: "job-1", bookId: "book-1" }, true);
    });

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);
    const result = await repo.generate(samplePayload);

    expect(capturedUrl).toBe(`${fakeApiUrl}/api/v1/neckbook/books/generate`);
    expect(capturedInit?.method).toBe("POST");
    expect((capturedInit?.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    expect(JSON.parse(capturedInit?.body as string)).toEqual(samplePayload);
    expect(result).toEqual({ jobId: "job-1", bookId: "book-1" });
  });

  it("getJobStatus chama GET /api/v1/neckbook/books/jobs/{jobId}", async () => {
    let capturedUrl = "";
    const mockFetch = jest.fn(async (url: string) => {
      capturedUrl = url;
      return createMockResponse(
        200,
        {
          status: "GENERATING_TEXT",
          progress: 35,
          current_step: "Gerando capítulo 2",
        },
        true,
      );
    });

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);
    const result = await repo.getJobStatus("job-999");

    expect(capturedUrl).toBe(`${fakeApiUrl}/api/v1/neckbook/books/jobs/job-999`);
    expect(result.status).toBe("GENERATING_TEXT");
    expect(result.progress).toBe(35);
    expect(result.current_step).toBe("Gerando capítulo 2");
  });

  it("getDraft chama GET /api/v1/neckbook/books/{bookId}/draft", async () => {
    let capturedUrl = "";
    const mockFetch = jest.fn(async (url: string) => {
      capturedUrl = url;
      return createMockResponse(
        200,
        {
          title: "Meu Livro",
          chapters: [
            {
              id: "ch-1",
              order: 1,
              title: "Capítulo 1",
              content: "Texto",
              exercises: ["Ex 1"],
              image_prompt: "Ilustração",
            },
          ],
        },
        true,
      );
    });

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);
    const result = await repo.getDraft("book-123");

    expect(capturedUrl).toBe(`${fakeApiUrl}/api/v1/neckbook/books/book-123/draft`);
    expect(result.title).toBe("Meu Livro");
    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].id).toBe("ch-1");
  });

  it("saveDraft chama PUT /api/v1/neckbook/books/{bookId}/draft com payload", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;
    const mockFetch = jest.fn(async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedInit = init;
      return createMockResponse(204, null, true);
    });

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);
    await repo.saveDraft("book-123", {
      title: "Título Editado",
      chapters: [],
    });

    expect(capturedUrl).toBe(`${fakeApiUrl}/api/v1/neckbook/books/book-123/draft`);
    expect(capturedInit?.method).toBe("PUT");
  });

  it("approve chama POST /api/v1/neckbook/books/{bookId}/approve", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;
    const mockFetch = jest.fn(async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedInit = init;
      return createMockResponse(200, null, true);
    });

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);
    await repo.approve("book-123");

    expect(capturedUrl).toBe(`${fakeApiUrl}/api/v1/neckbook/books/book-123/approve`);
    expect(capturedInit?.method).toBe("POST");
  });

  it("normaliza erro HTTP 403 com RFC-7807 para NeckbookBooksError", async () => {
    const mockFetch = jest.fn(async () => {
      return createMockResponse(
        403,
        {
          code: "MUNICIPALITY_NOT_ENABLED",
          message: "Seu município não está habilitado para geração de livros",
        },
        false,
      );
    });

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);

    await expect(repo.generate(samplePayload)).rejects.toThrow(NeckbookBooksError);
    await expect(repo.generate(samplePayload)).rejects.toMatchObject({
      status: 403,
      code: "MUNICIPALITY_NOT_ENABLED",
    });
  });

  it("aplica timeout de 30s abortando a requisicao e normalizando para status: 0 e NETWORK", async () => {
    jest.useFakeTimers();

    const mockFetch = jest.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new Error("The operation was aborted"));
          });
        }),
    );

    const repo = new NeckbookBooksRepositoryImpl(mockFetch, 30000, fakeApiUrl);

    const promise = repo.generate(samplePayload);
    jest.advanceTimersByTime(30000);

    await expect(promise).rejects.toMatchObject({
      status: 0,
      code: "NETWORK",
    });

    jest.useRealTimers();
  });
});
