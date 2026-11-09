import type {
  DraftResponse,
  DraftUpdatePayload,
  GenerateBookPayload,
  GenerateBookResult,
  JobStatusEntity,
} from "../../entities/neckbook/GeracaoLivroTypes";

export class NeckbookBooksError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, unknown> | Array<unknown>;

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: Record<string, unknown> | Array<unknown>,
  ) {
    super(message);
    this.name = "NeckbookBooksError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, NeckbookBooksError.prototype);
  }
}

export interface INeckbookBooksRepository {
  generate(
    payload: GenerateBookPayload,
    signal?: AbortSignal,
  ): Promise<GenerateBookResult>;

  getJobStatus(jobId: string, signal?: AbortSignal): Promise<JobStatusEntity>;

  getDraft(bookId: string, signal?: AbortSignal): Promise<DraftResponse>;

  saveDraft(
    bookId: string,
    draft: DraftUpdatePayload,
    signal?: AbortSignal,
  ): Promise<void>;

  approve(bookId: string, signal?: AbortSignal): Promise<void>;
}
