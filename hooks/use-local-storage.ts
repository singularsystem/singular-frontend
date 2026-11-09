"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializar o estado com o valor do localStorage
  useEffect(() => {
    try {
      // Verificar se estamos no navegador
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        // Analisar o item armazenado ou retornar o valor inicial
        setStoredValue(item ? JSON.parse(item) : initialValue);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Função para atualizar o valor no localStorage
  const setValue = (value: T) => {
    try {
      // Permitir que o valor seja uma função
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Salvar o estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
