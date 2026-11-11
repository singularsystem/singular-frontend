import React from "react";
import Image from "next/image";
import {
  Background,
  LogoVariant,
  LOGO_ASSETS,
  selectLogoVariant,
} from "@/lib/brand/logo-variant";

export interface BrandLogoProps {
  width?: number;
  height?: number;
  bg?: Background;
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  width = 160,
  height,
  bg = "light",
  variant,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const selectedVariant = variant || selectLogoVariant(width, bg);
  const asset = LOGO_ASSETS[selectedVariant] || LOGO_ASSETS["logomarca-laranja"];

  // Calcular altura proporcional se não informada explicitamente
  const finalHeight =
    height ?? Math.round((width / (asset?.aspectWidth || 200)) * (asset?.aspectHeight || 48));

  return (
    <div
      className={`inline-flex items-center justify-center p-1 ${className}`}
      style={{
        boxShadow: "none",
        filter: "none",
        background: "transparent",
      }}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={width}
        height={finalHeight}
        priority={priority}
        className="object-contain h-auto"
        style={{
          boxShadow: "none",
          filter: "none",
        }}
      />
    </div>
  );
}

export default BrandLogo;
