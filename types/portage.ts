import { AREA_MAP } from "@/lib/constants";
import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export type EscalaPortage = {
  [area: string]: {
    [ageGroup: string]: {
      [id: string]: string;
    };
  };
};

const ORDEM_FAIXAS_ETARIAS = [
  "0 a 1 ano",
  "1 a 2 anos",
  "2 a 3 anos",
  "3 a 4 anos",
  "4 a 5 anos",
  "5 a 6 anos",
  "7 anos ou mais",
];

export function ordenarFaixasEtarias(data: EscalaPortage): EscalaPortage {
  const resultadoOrdenado: EscalaPortage = {};

  for (const area of Object.keys(data)) {
    const faixaEtariaOriginal = data[area];

    const faixaEtariaOrdenada: EscalaPortage[string] = {};

    ORDEM_FAIXAS_ETARIAS.forEach((faixa) => {
      if (faixaEtariaOriginal[faixa]) {
        faixaEtariaOrdenada[faixa] = faixaEtariaOriginal[faixa];
      }
    });

    resultadoOrdenado[area] = faixaEtariaOrdenada;
  }

  return resultadoOrdenado;
}

export function organizarHabilidadesPorAreaEIdade(data: any[]): EscalaPortage {
  const result: EscalaPortage = {};

  for (const item of data) {
    let { area, ageGroup, description, id } = item;

    area = AREA_MAP[area.toLowerCase()] ?? area.toLowerCase();

    if (!result[area]) {
      result[area] = {};
    }

    if (!result[area][ageGroup]) {
      result[area][ageGroup] = {};
    }

    result[area][ageGroup][id] = description;
  }

  return result;
}

export interface Portage {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  ageRange: string;
  responses: Record<number, PortageResponse>;
  createdAt: string;
  localCreatedAt: string;
}

export interface PortageResponse {
  response: string;
  category: string;
}

export const areaMapping: { [key: string]: string } = {
  "desenvolvimento-global": "Desenvolvimento Global",
  socializacao: "Socialização",
  linguagem: "Linguagem",
  cognição: "Cognição",
  "auto-cuidados": "Autocuidado",
  "desenvolvimento-motor": "Desenvolvimento Motor",
};
