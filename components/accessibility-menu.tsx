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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccessibility } from "@/contexts/accessibility-context";
import { Accessibility, Eye, Keyboard, Volume2, Zap } from "lucide-react";
import { useState } from "react";

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const {
    fontSize,
    setFontSize,
    colorScheme,
    setColorScheme,
    animations,
    setAnimations,
    screenReaderMode,
    setScreenReaderMode,
    textToSpeechEnabled,
    setTextToSpeechEnabled,
  } = useAccessibility();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
          aria-label="Opções de acessibilidade"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Opções de Acessibilidade</DialogTitle>
          <DialogDescription>
            Personalize a interface para atender às suas necessidades de
            acessibilidade.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="visual">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="visual">
              <Eye className="h-4 w-4 mr-2" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="motion">
              <Zap className="h-4 w-4 mr-2" />
              Movimento
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Volume2 className="h-4 w-4 mr-2" />
              Áudio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-size">Tamanho da Fonte</Label>
              <RadioGroup
                id="font-size"
                value={fontSize}
                onValueChange={(value) => setFontSize(value as any)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="font-normal" />
                  <Label htmlFor="font-normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="font-large" />
                  <Label htmlFor="font-large" className="text-lg">
                    Grande
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="x-large" id="font-x-large" />
                  <Label htmlFor="font-x-large" className="text-xl">
                    Extra Grande
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-scheme">Esquema de Cores</Label>
              <RadioGroup
                id="color-scheme"
                value={colorScheme}
                onValueChange={(value) => setColorScheme(value as any)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="color-default" />
                  <Label htmlFor="color-default">Padrão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="high-contrast"
                    id="color-high-contrast"
                  />
                  <Label htmlFor="color-high-contrast">Alto Contraste</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="dark-high-contrast"
                    id="color-dark-high-contrast"
                  />
                  <Label htmlFor="color-dark-high-contrast">
                    Alto Contraste Escuro
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="screen-reader">Modo Leitor de Tela</Label>
                <p className="text-sm text-muted-foreground">
                  Otimiza a interface para leitores de tela
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={screenReaderMode}
                onCheckedChange={setScreenReaderMode}
              />
            </div>
          </TabsContent>

          <TabsContent value="motion" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="animations">Animações</Label>
              <RadioGroup
                id="animations"
                value={animations}
                onValueChange={(value) => setAnimations(value as any)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="animations-normal" />
                  <Label htmlFor="animations-normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reduced" id="animations-reduced" />
                  <Label htmlFor="animations-reduced">Reduzidas</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Dicas para navegação por teclado:
              </p>
              <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  <span>Use Tab para navegar entre elementos</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-background rounded text-xs">
                    Enter
                  </kbd>{" "}
                  ou{" "}
                  <kbd className="px-2 py-1 bg-background rounded text-xs">
                    Espaço
                  </kbd>{" "}
                  para ativar botões
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-background rounded text-xs">
                    Esc
                  </kbd>{" "}
                  para fechar diálogos
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="text-to-speech">Texto para Fala</Label>
                <p className="text-sm text-muted-foreground">
                  Lê o conteúdo selecionado em voz alta
                </p>
              </div>
              <Switch
                id="text-to-speech"
                checked={textToSpeechEnabled}
                onCheckedChange={setTextToSpeechEnabled}
              />
            </div>

            {textToSpeechEnabled && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Como usar o texto para fala:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                  <div>1. Selecione qualquer texto na página</div>
                  <div>
                    2. Pressione{" "}
                    <kbd className="px-2 py-1 bg-background rounded text-xs">
                      Alt
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-1 bg-background rounded text-xs">
                      T
                    </kbd>{" "}
                    para ouvir o texto selecionado
                  </div>
                  <div>
                    3. Pressione{" "}
                    <kbd className="px-2 py-1 bg-background rounded text-xs">
                      Esc
                    </kbd>{" "}
                    para parar a leitura
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
