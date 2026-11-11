export interface ContrastPair {
  name: string;
  textColor: string;
  bgColor: string;
  minRatio: number;
  expectedPass: boolean;
  isLargeText?: boolean;
}

export const OFFICIAL_CONTRAST_PAIRS: ContrastPair[] = [
  {
    name: "Branco sobre Navy",
    textColor: "#FFFFFF",
    bgColor: "#111E42",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Navy sobre Branco",
    textColor: "#111E42",
    bgColor: "#FFFFFF",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Navy sobre Gelo",
    textColor: "#111E42",
    bgColor: "#F5F7FB",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Navy sobre Laranja #FF7623",
    textColor: "#111E42",
    bgColor: "#FF7623",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Navy sobre Laranja Escuro #E5651A",
    textColor: "#111E42",
    bgColor: "#E5651A",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Link #C2410C sobre Branco",
    textColor: "#C2410C",
    bgColor: "#FFFFFF",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Link #C2410C sobre Gelo",
    textColor: "#C2410C",
    bgColor: "#F5F7FB",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Laranja sobre Navy (Modo Escuro)",
    textColor: "#FF7623",
    bgColor: "#111E42",
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "Branco sobre Laranja #FF7623 (Exemplo negativo proibido)",
    textColor: "#FFFFFF",
    bgColor: "#FF7623",
    minRatio: 4.5,
    expectedPass: false,
  },
];
