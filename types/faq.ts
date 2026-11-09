export interface FaqGuiaRapidoItem {
  passo: string;
  detalhe: string;
}

export interface FaqCategoria {
  id: string;
  titulo: string;
}

export interface FaqPergunta {
  id: string;
  categoria: string;
  pergunta: string;
  introducao?: string;
  passos?: string[];
  bom_saber?: string;
  se_nao_resolver?: string;
  palavras_chave: string;
  confirmar_antes_de_publicar?: boolean;
}

export interface FaqData {
  titulo: string;
  versao: string;
  atualizado_em: string;
  guia_rapido: FaqGuiaRapidoItem[];
  modelo_de_chamado: string;
  categorias: FaqCategoria[];
  perguntas: FaqPergunta[];
}
