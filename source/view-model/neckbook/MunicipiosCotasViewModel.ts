import {
  NeckbookAdminError,
  type AdminErrorView,
  type ApiKeyEntity,
  type CreateMunicipioDTO,
  type MunicipioCotaEntity,
  type UpdateMunicipioDTO,
} from "@/source/model/entities/neckbook/NeckbookEntity";
import type { INeckbookAdminRepository } from "@/source/model/repositories/neckbook/INeckbookAdminRepository";
import { computeRemaining } from "@/source/infrastructure/neckbook/NeckbookAdminAdapter";
import {
  deriveErrorDisplayMessage,
  extractFieldErrorsFromDetails,
} from "@/source/infrastructure/neckbook/NeckbookAdminErrorParser";

export const SESSION_STORAGE_KEY = "singular_neckbook_cotas_state";
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 15;
export const DEFAULT_SEARCH_TERM = "";
export const ALLOWED_PAGE_SIZES = [10, 15, 30, 50] as const;
export const MAX_MUNICIPIO_NAME_LENGTH = 120;
export const MAX_MONTHLY_QUOTA = 999_999_999;

export interface PersistedSessionState {
  currentPage: number;
  pageSize: number;
  searchTerm: string;
}

export interface MunicipiosCotasState {
  municipios: MunicipioCotaEntity[];
  total: number;
  currentPage: number;
  pageSize: number; // 10 | 15 | 30 | 50, default 15
  searchTerm: string;
  isLoading: boolean;
  error: AdminErrorView | null;

  // API keys (município aberto)
  activeMunicipioId: string | null;
  apiKeys: ApiKeyEntity[];
  isLoadingKeys: boolean;
  keysError: AdminErrorView | null;

  // Token efêmero (apenas em memória, durante o modal)
  generatedToken: string | null;
  isGeneratingKey: boolean;

  // Formulários
  isSubmitting: boolean;
  formFieldErrors: Record<string, string> | null;
}

export interface ValidationResult {
  valid: boolean;
  fieldErrors: Record<string, string>;
}

export function persistSessionState(
  state: PersistedSessionState,
  storage?: Storage | null,
): void {
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== "undefined" && window.sessionStorage
        ? window.sessionStorage
        : null;
  if (!targetStorage) {
    return;
  }
  try {
    const payload: PersistedSessionState = {
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
    };
    targetStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage quota/security errors
  }
}

export function restoreSessionState(
  storage?: Storage | null,
): PersistedSessionState {
  const defaults: PersistedSessionState = {
    currentPage: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    searchTerm: DEFAULT_SEARCH_TERM,
  };

  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== "undefined" && window.sessionStorage
        ? window.sessionStorage
        : null;
  if (!targetStorage) {
    return defaults;
  }

  try {
    const raw = targetStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return defaults;
    }
    const { currentPage, pageSize, searchTerm } = parsed;
    const isValidPage =
      typeof currentPage === "number" &&
      Number.isInteger(currentPage) &&
      currentPage >= 1;
    const isValidPageSize =
      typeof pageSize === "number" &&
      Number.isInteger(pageSize) &&
      pageSize >= 1;
    const isValidSearchTerm = typeof searchTerm === "string";

    if (!isValidPage || !isValidPageSize || !isValidSearchTerm) {
      return defaults;
    }

    return {
      currentPage,
      pageSize,
      searchTerm,
    };
  } catch {
    return defaults;
  }
}

export function validateCreateMunicipio(dto: {
  name: string;
  monthlyQuota: number;
}): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (
    typeof dto.name !== "string" ||
    dto.name.length < 1 ||
    dto.name.length > MAX_MUNICIPIO_NAME_LENGTH
  ) {
    fieldErrors.name = `O nome deve ter entre 1 e ${MAX_MUNICIPIO_NAME_LENGTH} caracteres.`;
  }

  if (
    typeof dto.monthlyQuota !== "number" ||
    !Number.isInteger(dto.monthlyQuota) ||
    dto.monthlyQuota < 0 ||
    dto.monthlyQuota > MAX_MONTHLY_QUOTA
  ) {
    fieldErrors.monthlyQuota = `A cota mensal deve ser um número inteiro entre 0 e ${MAX_MONTHLY_QUOTA}.`;
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function validateMonthlyQuota(monthlyQuota: number): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  if (
    typeof monthlyQuota !== "number" ||
    !Number.isInteger(monthlyQuota) ||
    monthlyQuota < 0 ||
    monthlyQuota > MAX_MONTHLY_QUOTA
  ) {
    fieldErrors.monthlyQuota = `A cota mensal deve ser um número inteiro entre 0 e ${MAX_MONTHLY_QUOTA}.`;
  }
  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function buildUpdateMunicipioPatch(
  original: { monthlyQuota: number; moduleActive: boolean },
  updated: { monthlyQuota: number; moduleActive: boolean },
): UpdateMunicipioDTO {
  const patch: UpdateMunicipioDTO = {};
  if (updated.monthlyQuota !== original.monthlyQuota) {
    patch.monthlyQuota = updated.monthlyQuota;
  }
  if (updated.moduleActive !== original.moduleActive) {
    patch.moduleActive = updated.moduleActive;
  }
  return patch;
}

export function classifyError(error: unknown): AdminErrorView {
  if (error instanceof NeckbookAdminError) {
    const { status, code, message, details } = error;

    if (code === "SERVER_ADMIN_KEY_MISSING") {
      return {
        kind: "server_config",
        message:
          message ||
          "Servidor não configurado (Admin_Key ausente). Contate o suporte.",
      };
    }

    if (status === 401 || status === 403) {
      return {
        kind: "auth",
        message:
          deriveErrorDisplayMessage({ code, message }) ||
          "Credencial administrativa inválida ou sem permissão.",
      };
    }

    if (status === 404) {
      return {
        kind: "not_found",
        message:
          deriveErrorDisplayMessage({ code, message }) ||
          "Município ou chave não encontrado.",
      };
    }

    if (status === 422) {
      const rawFields = extractFieldErrorsFromDetails(details);
      const normalizedFields: Record<string, string> = { ...rawFields };
      if (rawFields.monthly_quota && !normalizedFields.monthlyQuota) {
        normalizedFields.monthlyQuota = rawFields.monthly_quota;
      }
      if (rawFields.module_active && !normalizedFields.moduleActive) {
        normalizedFields.moduleActive = rawFields.module_active;
      }
      return {
        kind: "validation",
        message:
          deriveErrorDisplayMessage({ code, message }) ||
          "Verifique os campos inválidos.",
        fieldErrors: normalizedFields,
      };
    }

    if (
      status === 0 ||
      status === 502 ||
      status === 504 ||
      code === "NETWORK_ERROR" ||
      code === "REQUEST_TIMEOUT" ||
      code === "NECKBOOK_UNAVAILABLE"
    ) {
      return {
        kind: "network",
        message: message || "Falha de comunicação com o servidor.",
      };
    }

    return {
      kind: "generic",
      message:
        deriveErrorDisplayMessage({ code, message }) ||
        "Falha ao processar a solicitação.",
    };
  }

  if (error instanceof Error) {
    const isAbortOrNetwork =
      error.name === "AbortError" ||
      error.name === "TypeError" ||
      error.message.toLowerCase().includes("network") ||
      error.message.toLowerCase().includes("fetch") ||
      error.message.toLowerCase().includes("abort") ||
      error.message.toLowerCase().includes("timeout");

    if (isAbortOrNetwork) {
      return {
        kind: "network",
        message: "Falha de comunicação com o servidor.",
      };
    }

    return {
      kind: "generic",
      message: error.message || "Falha ao carregar a listagem.",
    };
  }

  return {
    kind: "generic",
    message: "Falha ao carregar a listagem.",
  };
}

export class MunicipiosCotasViewModel {
  private state: MunicipiosCotasState;
  private listeners: Set<(s: MunicipiosCotasState) => void> = new Set();
  private listAbortController: AbortController | null = null;
  private readonly storage?: Storage | null;

  constructor(
    private readonly repository: INeckbookAdminRepository,
    storage?: Storage | null,
  ) {
    this.storage = storage;
    this.state = {
      municipios: [],
      total: 0,
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      searchTerm: DEFAULT_SEARCH_TERM,
      isLoading: false,
      error: null,
      activeMunicipioId: null,
      apiKeys: [],
      isLoadingKeys: false,
      keysError: null,
      generatedToken: null,
      isGeneratingKey: false,
      isSubmitting: false,
      formFieldErrors: null,
    };
  }

  getState(): MunicipiosCotasState {
    return this.state;
  }

  subscribe(listener: (s: MunicipiosCotasState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.state;
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private updateState(partial: Partial<MunicipiosCotasState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private saveSession(): void {
    persistSessionState(
      {
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        searchTerm: this.state.searchTerm,
      },
      this.storage,
    );
  }

  restoreStateFromSession(): void {
    const restored = restoreSessionState(this.storage);
    this.updateState({
      currentPage: restored.currentPage,
      pageSize: restored.pageSize,
      searchTerm: restored.searchTerm,
    });
  }

  setPage(page: number): void {
    this.updateState({ currentPage: page });
    this.saveSession();
  }

  setPageSize(size: number): void {
    this.updateState({
      pageSize: size,
      currentPage: 1,
    });
    this.saveSession();
  }

  setSearchTerm(term: string): void {
    if (term === this.state.searchTerm) {
      return;
    }
    this.updateState({
      searchTerm: term,
      currentPage: 1,
    });
    this.saveSession();
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  clearFormErrors(): void {
    this.updateState({ formFieldErrors: null, error: null });
  }

  async loadMunicipios(): Promise<void> {
    if (this.listAbortController) {
      this.listAbortController.abort();
    }
    const controller = new AbortController();
    this.listAbortController = controller;

    this.updateState({ isLoading: true, error: null });

    try {
      const { currentPage, pageSize, searchTerm } = this.state;
      const result = await this.repository.listMunicipios(
        currentPage,
        pageSize,
        searchTerm,
        controller.signal,
      );

      const normalized = result.data.map((m) => ({
        ...m,
        remaining:
          typeof m.remaining === "number" && m.remaining >= 0
            ? m.remaining
            : computeRemaining(m.monthlyQuota, m.currentUsage),
      }));

      this.updateState({
        municipios: normalized,
        total: result.total,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      // Preserva municipios, currentPage, pageSize e searchTerm em falha (Req 1.6)
      this.updateState({
        isLoading: false,
        error: classifyError(error),
      });
    }
  }

  async createMunicipio(dto: CreateMunicipioDTO): Promise<boolean> {
    const validation = validateCreateMunicipio(dto);
    if (!validation.valid) {
      this.updateState({
        formFieldErrors: validation.fieldErrors,
      });
      return false;
    }

    this.updateState({
      isSubmitting: true,
      formFieldErrors: null,
      error: null,
    });

    try {
      await this.repository.createMunicipio(dto);
      this.updateState({
        isSubmitting: false,
        formFieldErrors: null,
      });
      await this.loadMunicipios();
      return true;
    } catch (error: unknown) {
      const classified = classifyError(error);
      this.updateState({
        isSubmitting: false,
        formFieldErrors: classified.fieldErrors ?? null,
        error: classified.kind === "validation" ? null : classified,
      });
      return false;
    }
  }

  async updateMunicipio(
    id: string,
    patch: UpdateMunicipioDTO,
  ): Promise<boolean> {
    if (
      patch.monthlyQuota === undefined &&
      patch.moduleActive === undefined
    ) {
      this.updateState({
        formFieldErrors: {
          _form: "Nenhuma alteração foi realizada.",
        },
      });
      return false;
    }

    if (patch.monthlyQuota !== undefined) {
      const quotaValidation = validateMonthlyQuota(patch.monthlyQuota);
      if (!quotaValidation.valid) {
        this.updateState({
          formFieldErrors: quotaValidation.fieldErrors,
        });
        return false;
      }
    }

    this.updateState({
      isSubmitting: true,
      formFieldErrors: null,
      error: null,
    });

    try {
      await this.repository.updateMunicipio(id, patch);
      this.updateState({
        isSubmitting: false,
        formFieldErrors: null,
      });
      await this.loadMunicipios();
      return true;
    } catch (error: unknown) {
      const classified = classifyError(error);
      this.updateState({
        isSubmitting: false,
        formFieldErrors: classified.fieldErrors ?? null,
        error: classified.kind === "validation" ? null : classified,
      });
      return false;
    }
  }

  async generateApiKey(municipioId: string): Promise<void> {
    this.updateState({
      isGeneratingKey: true,
      generatedToken: null,
      error: null,
    });

    try {
      const result = await this.repository.generateApiKey(municipioId);
      // Mantém o token APENAS em memória no estado efêmero; nunca salva em storage
      this.updateState({
        isGeneratingKey: false,
        generatedToken: result.token,
      });
    } catch (error: unknown) {
      this.updateState({
        isGeneratingKey: false,
        generatedToken: null,
        error: classifyError(error),
      });
    }
  }

  clearGeneratedToken(): void {
    this.updateState({
      generatedToken: null,
    });
  }

  async loadApiKeys(municipioId: string): Promise<void> {
    this.updateState({
      activeMunicipioId: municipioId,
      isLoadingKeys: true,
      keysError: null,
    });

    try {
      const keys = await this.repository.listApiKeys(municipioId);
      this.updateState({
        apiKeys: keys,
        isLoadingKeys: false,
        keysError: null,
      });
    } catch (error: unknown) {
      this.updateState({
        isLoadingKeys: false,
        keysError: classifyError(error),
      });
    }
  }

  async toggleApiKey(
    municipioId: string,
    keyId: string,
    active: boolean,
  ): Promise<void> {
    this.updateState({ keysError: null });
    try {
      await this.repository.toggleApiKey(municipioId, keyId, active);
      await this.loadApiKeys(municipioId);
    } catch (error: unknown) {
      // Preserva isActive original das chaves e registra keysError (Req 5.7)
      this.updateState({
        keysError: classifyError(error),
      });
    }
  }

  async revokeApiKey(municipioId: string, keyId: string): Promise<void> {
    this.updateState({ keysError: null });
    try {
      await this.repository.revokeApiKey(municipioId, keyId);
      await this.loadApiKeys(municipioId);
    } catch (error: unknown) {
      this.updateState({
        keysError: classifyError(error),
      });
    }
  }
}
