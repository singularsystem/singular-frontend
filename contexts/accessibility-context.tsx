"use client";
export const dynamic = "force-dynamic";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type React from "react";
import { createContext, useContext, useEffect } from "react";

type FontSize = "normal" | "large" | "x-large";
type ColorScheme = "default" | "high-contrast" | "dark-high-contrast";
type AnimationPreference = "reduced" | "normal";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  animations: AnimationPreference;
  setAnimations: (pref: AnimationPreference) => void;
  screenReaderMode: boolean;
  setScreenReaderMode: (enabled: boolean) => void;
  keyboardMode: boolean;
  setKeyboardMode: (enabled: boolean) => void;
  textToSpeechEnabled: boolean;
  setTextToSpeechEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSize, setFontSize] = useLocalStorage<FontSize>(
    "accessibility-font-size",
    "normal"
  );
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    "accessibility-color-scheme",
    "default"
  );
  const [animations, setAnimations] = useLocalStorage<AnimationPreference>(
    "accessibility-animations",
    "normal"
  );
  const [screenReaderMode, setScreenReaderMode] = useLocalStorage<boolean>(
    "accessibility-screen-reader",
    false
  );
  const [keyboardMode, setKeyboardMode] = useLocalStorage<boolean>(
    "accessibility-keyboard-mode",
    false
  );
  const [textToSpeechEnabled, setTextToSpeechEnabled] =
    useLocalStorage<boolean>("accessibility-tts", false);

  // Detectar se o usuário está usando apenas o teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setKeyboardMode(true);
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    const handleMouseDown = () => {
      setKeyboardMode(false);
      window.addEventListener("keydown", handleKeyDown);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [setKeyboardMode]);

  // Aplicar classes CSS com base nas configurações
  useEffect(() => {
    const root = document.documentElement;

    // Aplicar tamanho da fonte
    root.classList.remove(
      "font-size-normal",
      "font-size-large",
      "font-size-x-large"
    );
    root.classList.add(`font-size-${fontSize}`);

    // Aplicar esquema de cores
    root.classList.remove(
      "color-scheme-default",
      "color-scheme-high-contrast",
      "color-scheme-dark-high-contrast"
    );
    root.classList.add(`color-scheme-${colorScheme}`);

    // Aplicar preferência de animação
    root.classList.remove("animations-normal", "animations-reduced");
    root.classList.add(`animations-${animations}`);

    // Aplicar modo de leitor de tela
    if (screenReaderMode) {
      root.classList.add("screen-reader-mode");
    } else {
      root.classList.remove("screen-reader-mode");
    }

    // Aplicar modo de teclado
    if (keyboardMode) {
      root.classList.add("keyboard-mode");
    } else {
      root.classList.remove("keyboard-mode");
    }
  }, [fontSize, colorScheme, animations, screenReaderMode, keyboardMode]);

  // Função para texto para fala
  const speak = (text: string) => {
    if (!textToSpeechEnabled) return;

    if ("speechSynthesis" in window) {
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        colorScheme,
        setColorScheme,
        animations,
        setAnimations,
        screenReaderMode,
        setScreenReaderMode,
        keyboardMode,
        setKeyboardMode,
        textToSpeechEnabled,
        setTextToSpeechEnabled,
        speak,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}
