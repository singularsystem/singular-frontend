export type Background = "navy" | "orange" | "light" | "dark";

export type LogoVariant =
  | "logomarca-branca"
  | "logomarca-laranja"
  | "icone-branco-sobre-azul"
  | "icone-azul-mono"
  | "icone"
  | "symbol-orange"
  | "horizontal-white";

/**
 * Seleciona a variante correta do logotipo baseando-se na largura disponível e na cor de fundo.
 * Se largura < 140 px: devolve o ícone apropriado.
 * Se largura >= 140 px: devolve a logomarca de maior contraste (ou ícone azul mono sobre laranja).
 */
export function selectLogoVariant(width: number, bg: Background): LogoVariant {
  if (width < 140) {
    if (bg === "navy" || bg === "dark") {
      return "icone-branco-sobre-azul";
    }
    if (bg === "orange") {
      return "icone-azul-mono";
    }
    return "icone";
  }

  if (bg === "navy" || bg === "dark") {
    return "logomarca-branca";
  }
  if (bg === "orange") {
    return "icone-azul-mono";
  }
  return "logomarca-laranja";
}

export const LOGO_ASSETS: Record<
  LogoVariant,
  { src: string; alt: string; aspectWidth: number; aspectHeight: number }
> = {
  "logomarca-branca": {
    src: "/brand/logo-white.png",
    alt: "Singular System",
    aspectWidth: 200,
    aspectHeight: 48,
  },
  "horizontal-white": {
    src: "/brand/logo-white.png",
    alt: "Singular System",
    aspectWidth: 200,
    aspectHeight: 48,
  },
  "logomarca-laranja": {
    src: "/brand/logo-orange.png",
    alt: "Singular System",
    aspectWidth: 200,
    aspectHeight: 48,
  },
  "icone-branco-sobre-azul": {
    src: "/brand/icon-white-on-navy.png",
    alt: "Singular System",
    aspectWidth: 48,
    aspectHeight: 48,
  },
  "icone-azul-mono": {
    src: "/brand/icon-navy-mono.png",
    alt: "Singular System",
    aspectWidth: 48,
    aspectHeight: 48,
  },
  "symbol-orange": {
    src: "/brand/icon.png",
    alt: "Singular System",
    aspectWidth: 48,
    aspectHeight: 48,
  },
  icone: {
    src: "/brand/icon.png",
    alt: "Singular System",
    aspectWidth: 48,
    aspectHeight: 48,
  },
};
