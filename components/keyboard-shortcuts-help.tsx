"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Detectar se o usuário está usando teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardUser(true);
        // Mostrar o diálogo de ajuda automaticamente na primeira vez
        const hasSeenHelp = localStorage.getItem("keyboard-help-seen");
        if (!hasSeenHelp) {
          setOpen(true);
          localStorage.setItem("keyboard-help-seen", "true");
        }
      }

      // Mostrar atalhos com Alt+K
      if (e.altKey && e.key === "k") {
        setOpen(true);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isKeyboardUser) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full h-12 w-12 shadow-lg"
          aria-label="Atalhos de teclado"
        >
          <Keyboard className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atalhos de Teclado</DialogTitle>
          <DialogDescription>
            Use estes atalhos para navegar mais rapidamente pelo sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Navegação Geral</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Navegar entre elementos</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
              </div>
              <div className="flex justify-between">
                <span>Ativar botão/link</span>
                <div>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Enter
                  </kbd>{" "}
                  ou{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Espaço
                  </kbd>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Mostrar este menu de ajuda</span>
                <div>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt</kbd>{" "}
                  + <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Escala Portage</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Navegar entre áreas</span>
                <div>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt</kbd>{" "}
                  + <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>{" "}
                  / <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Salvar avaliação</span>
                <div>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt</kbd>{" "}
                  + <kbd className="px-2 py-1 bg-muted rounded text-xs">S</kbd>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Fechar diálogo</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Texto para Fala</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ler texto selecionado</span>
                <div>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt</kbd>{" "}
                  + <kbd className="px-2 py-1 bg-muted rounded text-xs">T</kbd>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Parar leitura</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
