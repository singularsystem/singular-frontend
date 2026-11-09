import {
  REQUEST_TIMEOUT_MS,
  type DraftResponse,
  type DraftUpdatePayload,
  type GenerateBookPayload,
  type GenerateBookResult,
  type JobStatusEntity,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import {
  NeckbookBooksError,
  type INeckbookBooksRepository,
} from "@/source/model/repositories/neckbook/INeckbookBooksRepository";
import { env } from "../common/config/env";

export type SecureFetchFn = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export class NeckbookBooksRepositoryImpl implements INeckbookBooksRepository {
  private readonly apiUrl: string;
  private readonly secureFetch: SecureFetchFn;
  private readonly timeoutMs: number;

  constructor(
    secureFetch: SecureFetchFn,
    timeoutMs: number = REQUEST_TIMEOUT_MS,
    apiUrl: string = env.apiUrl,
  ) {
    this.secureFetch = secureFetch;
    this.timeoutMs = timeoutMs;
    this.apiUrl = apiUrl.replace(/\/+$/, "");
  }

  private createTimeoutSignal(externalSignal?: AbortSignal): {
    signal: AbortSignal;
    cleanup: () => void;
  } {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    const onExternalAbort = () => {
      controller.abort();
    };

    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
      } else {
        externalSignal.addEventListener("abort", onExternalAbort);
      }
    }

    return {
      signal: controller.signal,
      cleanup: () => {
        clearTimeout(timer);
        if (externalSignal) {
          externalSignal.removeEventListener("abort", onExternalAbort);
        }
      },
    };
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    const message =
      (body && (body.message || body.title || body.error)) ||
      "Ocorreu um erro ao comunicar com o servidor";
    const code = body && typeof body.code === "string" ? body.code : undefined;
    const details = body && body.details ? body.details : undefined;

    throw new NeckbookBooksError(response.status, message, code, details);
  }

  async generate(
    payload: GenerateBookPayload,
    signal?: AbortSignal,
  ): Promise<GenerateBookResult> {
    const { signal: timeoutSignal, cleanup } = this.createTimeoutSignal(signal);
    try {
      const response = await this.secureFetch(
        `${this.apiUrl}/api/v1/neckbook/books/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: timeoutSignal,
        },
      );

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return {
        jobId: String(data.jobId || data.job_id || ""),
        bookId: String(data.bookId || data.book_id || ""),
      };
    } catch (err: unknown) {
      if (err instanceof NeckbookBooksError) {
        throw err;
      }
      throw new NeckbookBooksError(
        0,
        "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente",
        "NETWORK",
      );
    } finally {
      cleanup();
    }
  }

  async getJobStatus(
    jobId: string,
    signal?: AbortSignal,
  ): Promise<JobStatusEntity> {
    const { signal: timeoutSignal, cleanup } = this.createTimeoutSignal(signal);
    try {
      const response = await this.secureFetch(
        `${this.apiUrl}/api/v1/neckbook/books/jobs/${encodeURIComponent(jobId)}`,
        {
          method: "GET",
          signal: timeoutSignal,
        },
      );

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return {
        status: data.status,
        progress: typeof data.progress === "number" ? data.progress : 0,
        current_step: data.current_step || data.currentStep || "",
        pdf_url: data.pdf_url || data.pdfUrl || null,
        error_message: data.error_message || data.errorMessage || null,
      };
    } catch (err: unknown) {
      if (err instanceof NeckbookBooksError) {
        throw err;
      }
      throw new NeckbookBooksError(
        0,
        "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente",
        "NETWORK",
      );
    } finally {
      cleanup();
    }
  }

  async getDraft(
    bookId: string,
    signal?: AbortSignal,
  ): Promise<DraftResponse> {
    const { signal: timeoutSignal, cleanup } = this.createTimeoutSignal(signal);
    try {
      const response = await this.secureFetch(
        `${this.apiUrl}/api/v1/neckbook/books/${encodeURIComponent(bookId)}/draft`,
        {
          method: "GET",
          signal: timeoutSignal,
        },
      );

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return {
        title: data.title || "",
        chapters: (data.chapters || []).map((ch: any) => ({
          id: String(ch.id || ""),
          order: typeof ch.order === "number" ? ch.order : 0,
          title: String(ch.title || ""),
          content: String(ch.content || ""),
          exercises: Array.isArray(ch.exercises) ? ch.exercises.map(String) : [],
          image_prompt: String(ch.image_prompt || ch.imagePrompt || ""),
          caa_symbols: Array.isArray(ch.caa_symbols || ch.caaSymbols)
            ? (ch.caa_symbols || ch.caaSymbols).map(String)
            : undefined,
        })),
      };
    } catch (err: unknown) {
      if (err instanceof NeckbookBooksError) {
        throw err;
      }
      throw new NeckbookBooksError(
        0,
        "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente",
        "NETWORK",
      );
    } finally {
      cleanup();
    }
  }

  async saveDraft(
    bookId: string,
    draft: DraftUpdatePayload,
    signal?: AbortSignal,
  ): Promise<void> {
    const { signal: timeoutSignal, cleanup } = this.createTimeoutSignal(signal);
    try {
      const response = await this.secureFetch(
        `${this.apiUrl}/api/v1/neckbook/books/${encodeURIComponent(bookId)}/draft`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
          signal: timeoutSignal,
        },
      );

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }
    } catch (err: unknown) {
      if (err instanceof NeckbookBooksError) {
        throw err;
      }
      throw new NeckbookBooksError(
        0,
        "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente",
        "NETWORK",
      );
    } finally {
      cleanup();
    }
  }

  async approve(bookId: string, signal?: AbortSignal): Promise<void> {
    const { signal: timeoutSignal, cleanup } = this.createTimeoutSignal(signal);
    try {
      const response = await this.secureFetch(
        `${this.apiUrl}/api/v1/neckbook/books/${encodeURIComponent(bookId)}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          signal: timeoutSignal,
        },
      );

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }
    } catch (err: unknown) {
      if (err instanceof NeckbookBooksError) {
        throw err;
      }
      throw new NeckbookBooksError(
        0,
        "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente",
        "NETWORK",
      );
    } finally {
      cleanup();
    }
  }
}
