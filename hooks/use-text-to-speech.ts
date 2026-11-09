"use client";

import { useAccessibility } from "@/contexts/accessibility-context";
import { useEffect } from "react";

export function useTextToSpeech() {
  const { speak, stopSpeaking, textToSpeechEnabled } = useAccessibility();

  useEffect(() => {
    if (!textToSpeechEnabled) return;

    // Função para ler o texto selecionado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "t") {
        const selection = window.getSelection();
        const selectedText = selection?.toString();

        if (selectedText) {
          speak(selectedText);
          e.preventDefault();
        }
      }

      if (e.key === "Escape") {
        stopSpeaking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [textToSpeechEnabled, speak, stopSpeaking]);

  return { speak, stopSpeaking };
}
