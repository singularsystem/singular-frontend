import type {
  BackendErrorResponse,
  ErrorCategory,
  ErrorView,
} from "./GeracaoLivroTypes";

export function formatarDataRenovacao(renewalDate?: string | null): string {
  if (
    !renewalDate ||
    typeof renewalDate !== "string" ||
    renewalDate.trim() === ""
  ) {
    return "";
  }
  const trimmed = renewalDate.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, ano, mes, dia] = isoMatch;
    return `${dia}/${mes}/${ano}`;
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const dia = String(date.getUTCDate()).padStart(2, "0");
  const mes = String(date.getUTCMonth() + 1).padStart(2, "0");
  const ano = date.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}

function extractFieldErrors(
  details?: Record<string, unknown> | Array<unknown>,
): Record<string, string> | undefined {
  if (!details) {
    return undefined;
  }
  if (Array.isArray(details)) {
    if (details.length === 0) {
      return undefined;
    }
    const errors: Record<string, string> = {};
    for (const item of details) {
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const field = String(obj.field || obj.name || obj.property || "");
        const message = String(obj.message || obj.error || "");
        if (field && message) {
          errors[field] = message;
        }
      }
    }
    return Object.keys(errors).length > 0 ? errors : undefined;
  }
  if (typeof details === "object") {
    const errors: Record<string, string> = {};
    for (const [key, val] of Object.entries(details)) {
      if (typeof val === "string" && val.trim() !== "") {
        errors[key] = val;
      } else if (Array.isArray(val) && val.length > 0) {
        errors[key] = val.map(String).join(", ");
      }
    }
    return Object.keys(errors).length > 0 ? errors : undefined;
  }
  return undefined;
}

export function classificarErro(resp: BackendErrorResponse): ErrorView {
  const status = resp?.status;
  const code = typeof resp?.code === "string" ? resp.code.trim() : "";

  if (status === 0 || status === undefined || status === null) {
    return {
      category: "NETWORK",
      message:
        "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente",
    };
  }

  if (status === 403) {
    if (code === "MUNICIPALITY_NOT_ENABLED") {
      return {
        category: "MUNICIPALITY_NOT_ENABLED",
        message: "Seu município não está habilitado para geração de livros",
      };
    }
    if (code === "MODULE_NOT_ACTIVE") {
      return {
        category: "MODULE_NOT_ACTIVE",
        message:
          "O módulo de geração de livros não está contratado para o seu município",
      };
    }
    return {
      category: "UNEXPECTED",
      message: "Ocorreu um erro inesperado ao gerar o livro",
    };
  }

  if (status === 429) {
    if (code === "EXCESS_MUNICIPAL_QUOTA") {
      let rawDate: string | null = null;
      if (resp.details && typeof resp.details === "object" && !Array.isArray(resp.details)) {
        const rec = resp.details as Record<string, unknown>;
        if (typeof rec.renewal_date === "string") {
          rawDate = rec.renewal_date;
        } else if (typeof rec.renewalDate === "string") {
          rawDate = rec.renewalDate;
        }
      }
      const formattedDate = formatarDataRenovacao(rawDate);
      if (formattedDate !== "") {
        return {
          category: "EXCESS_MUNICIPAL_QUOTA",
          message: `A cota mensal de geração de livros do seu município foi atingida. A cota será renovada em ${formattedDate}`,
        };
      }
      return {
        category: "EXCESS_MUNICIPAL_QUOTA",
        message: "A cota mensal de geração de livros do seu município foi atingida",
      };
    }
    return {
      category: "UNEXPECTED",
      message: "Ocorreu um erro inesperado ao gerar o livro",
    };
  }

  if (status === 422) {
    const fieldErrors = extractFieldErrors(resp.details);
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      const fieldMessages = Object.values(fieldErrors).join(". ");
      return {
        category: "VALIDATION",
        message: fieldMessages,
        fieldErrors,
      };
    }
    return {
      category: "VALIDATION",
      message:
        "Os dados enviados são inválidos. Verifique o formulário e tente novamente",
    };
  }

  if (status === 503) {
    return {
      category: "SERVICE_UNAVAILABLE",
      message:
        "O serviço de geração está temporariamente indisponível. Tente novamente mais tarde",
    };
  }

  if (status === 500) {
    return {
      category: "UNEXPECTED",
      message: "Ocorreu um erro inesperado ao gerar o livro",
    };
  }

  return {
    category: "UNEXPECTED",
    message: "Ocorreu um erro inesperado ao gerar o livro",
  };
}
