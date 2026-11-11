"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ResetarSenhaFormDataType } from "@/types/usuario";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ResetarSenhaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (results: any) => void;
  formData: ResetarSenhaFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<ResetarSenhaFormDataType>>;
}

export function ResetarSenhaModal({
  open,
  onOpenChange,
  onSave,
  formData,
  setFormData,
}: ResetarSenhaModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [scrollIndicator, setScrollIndicator] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setScrollIndicator(scrollHeight > clientHeight);
    }
  }, [open]);

  const requirements = useMemo(() => {
    const pwd = formData.newPassword || "";
    return {
      minLength: pwd.length >= 6,
      hasLowercase: /[a-z]/.test(pwd),
      hasUppercase: /[A-Z]/.test(pwd),
      hasDigit: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
      match:
        pwd.length > 0 &&
        formData.confirmNewPassword?.length > 0 &&
        pwd === formData.confirmNewPassword,
    };
  }, [formData.newPassword, formData.confirmNewPassword]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (requirements.minLength) score += 20;
    if (requirements.hasLowercase) score += 20;
    if (requirements.hasUppercase) score += 20;
    if (requirements.hasDigit) score += 20;
    if (requirements.hasSpecial) score += 20;
    return score;
  }, [requirements]);

  const getStrengthText = () => {
    if (passwordStrength <= 20) return "Muito fraca";
    if (passwordStrength <= 40) return "Fraca";
    if (passwordStrength <= 60) return "Média";
    if (passwordStrength <= 80) return "Boa";
    return "Forte";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const isFormValid = useMemo(() => {
    return (
      requirements.minLength &&
      requirements.hasLowercase &&
      requirements.hasDigit &&
      requirements.hasSpecial &&
      requirements.match
    );
  }, [requirements]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-auto flex flex-col p-0 gap-0">
        <div className="px-6 pt-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-brand-navy">
              Redefinir senha
            </DialogTitle>
          </div>
          <DialogDescription>
            Redefinir a senha de um usuário existente
          </DialogDescription>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mt-2 mb-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Digite a nova senha"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirme a nova senha"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Painel de Validação e Critérios da Senha */}
            {formData.newPassword && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>Força da senha: <strong>{getStrengthText()}</strong></span>
                  <span
                    className={
                      passwordStrength >= 80
                        ? "text-green-600 font-bold"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength}%
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`h-1.5 ${getStrengthColor()}`}
                />

                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Requisitos de segurança da senha:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <li
                      className={`flex items-center gap-1.5 ${
                        requirements.minLength
                          ? "text-green-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {requirements.minLength ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      )}
                      Mínimo de 6 caracteres
                    </li>

                    <li
                      className={`flex items-center gap-1.5 ${
                        requirements.hasLowercase
                          ? "text-green-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {requirements.hasLowercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      )}
                      Pelo menos uma letra minúscula (a-z)
                    </li>

                    <li
                      className={`flex items-center gap-1.5 ${
                        requirements.hasUppercase
                          ? "text-green-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {requirements.hasUppercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      )}
                      Pelo menos uma letra maiúscula (A-Z)
                    </li>

                    <li
                      className={`flex items-center gap-1.5 ${
                        requirements.hasDigit
                          ? "text-green-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {requirements.hasDigit ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      )}
                      Pelo menos um número (0-9)
                    </li>

                    <li
                      className={`flex items-center gap-1.5 ${
                        requirements.hasSpecial
                          ? "text-green-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {requirements.hasSpecial ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      )}
                      Pelo menos um caractere especial (!@#$...)
                    </li>

                    <li
                      className={`flex items-center gap-1.5 ${
                        requirements.match
                          ? "text-green-700 font-medium"
                          : formData.confirmNewPassword
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {requirements.match ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      )}
                      Senhas coincidem
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center gap-2 p-3 border-t bg-background">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="bg-brand-navy hover:bg-blue-800 disabled:opacity-50"
            >
              Redefinir Senha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
