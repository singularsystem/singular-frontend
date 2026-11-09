"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionDescription: string;
  actionName: string;
  route: string | (() => void);
}

export function ConfirmDialog({
  open,
  onOpenChange,
  actionDescription,
  actionName,
  route,
}: DialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar {actionDescription}</DialogTitle>
          <p>Tem certeza que deseja cancelar {actionName}?</p>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {typeof route === "string" ? (
            <Button variant="success" onClick={() => router.push(route)}>
              Confirmar
            </Button>
          ) : (
            <Button variant="success" onClick={route}>
              Confirmar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
