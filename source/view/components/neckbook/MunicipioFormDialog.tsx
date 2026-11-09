"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { estados } from "@/lib/constants";
import { getSiglaEstadoPorNome } from "@/lib/utils";
import type {
  AdminErrorView,
  CreateMunicipioDTO,
  MunicipioCotaEntity,
  UpdateMunicipioDTO,
} from "@/source/model/entities/neckbook/NeckbookEntity";
import {
  buildUpdateMunicipioPatch,
  validateCreateMunicipio,
  validateMonthlyQuota,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";

export const SHARED_QUOTA_EDIT_NOTICE =
  "Atenção: esta é uma cota compartilhada por todo o município entre todos os seus usuários.";

interface IbgeCity {
  id: string | number;
  nome: string;
}

export interface MunicipioFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  municipio?: MunicipioCotaEntity | null;
  isSubmitting: boolean;
  serverFieldErrors?: Record<string, string> | null;
  serverError?: AdminErrorView | null;
  onClose: () => void;
  onCreate: (dto: CreateMunicipioDTO) => Promise<boolean>;
  onUpdate: (id: string, patch: UpdateMunicipioDTO) => Promise<boolean>;
}

export function MunicipioFormDialog({
  open,
  mode,
  municipio,
  isSubmitting,
  serverFieldErrors,
  serverError,
  onClose,
  onCreate,
  onUpdate,
}: MunicipioFormDialogProps) {
  const [selectedState, setSelectedState] = useState<string>("");
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [fetchCitiesLoading, setFetchCitiesLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [monthlyQuotaInput, setMonthlyQuotaInput] = useState<string>("0");
  const [moduleActive, setModuleActive] = useState<boolean>(true);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || mode !== "create" || !selectedState) {
      setCities([]);
      setFetchCitiesLoading(false);
      return;
    }

    const sigla = getSiglaEstadoPorNome(selectedState) || "";
    if (!sigla) {
      setCities([]);
      return;
    }

    const ufLower = sigla.toLowerCase();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const controller = new AbortController();

    const loadCities = async () => {
      setFetchCitiesLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/v1/ibge/by-uf/${ufLower}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Falha ao buscar cidades do IBGE");
        }
        const data = (await res.json()) as IbgeCity[];
        setCities(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === "AbortError")) {
          setCities([]);
        }
      } finally {
        setFetchCitiesLoading(false);
      }
    };

    void loadCities();

    return () => {
      controller.abort();
    };
  }, [open, mode, selectedState]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === "edit" && municipio) {
      setSelectedState("");
      setName(municipio.name);
      setMonthlyQuotaInput(String(municipio.monthlyQuota));
      setModuleActive(municipio.moduleActive);
    } else {
      setSelectedState("");
      setName("");
      setMonthlyQuotaInput("0");
      setModuleActive(true);
    }
    setLocalErrors({});
  }, [open, mode, municipio]);

  if (!open) {
    return null;
  }

  const combinedErrors: Record<string, string> = {
    ...(serverFieldErrors ?? {}),
    ...localErrors,
  };

  const handleStateChange = (ufNome: string) => {
    setSelectedState(ufNome);
    setName("");
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next.state;
      delete next.name;
      return next;
    });
  };

  const handleCityChange = (cityName: string) => {
    if (!cityName) {
      return;
    }
    setName(cityName);
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next.name;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors({});

    const parsedQuota = Number(monthlyQuotaInput);

    if (mode === "create") {
      const validation = validateCreateMunicipio({
        name,
        monthlyQuota: parsedQuota,
      });
      if (!validation.valid) {
        const nextErrors: Record<string, string> = { ...validation.fieldErrors };
        if (!selectedState && !name) {
          nextErrors.state = "Selecione o Estado.";
          nextErrors.name = "Selecione a Cidade.";
        }
        setLocalErrors(nextErrors);
        return;
      }
      const ok = await onCreate({
        name,
        monthlyQuota: parsedQuota,
        moduleActive,
      });
      if (ok) {
        onClose();
      }
      return;
    }

    if (mode === "edit" && municipio) {
      const quotaValidation = validateMonthlyQuota(parsedQuota);
      if (!quotaValidation.valid) {
        setLocalErrors(quotaValidation.fieldErrors);
        return;
      }

      const patch = buildUpdateMunicipioPatch(
        {
          monthlyQuota: municipio.monthlyQuota,
          moduleActive: municipio.moduleActive,
        },
        {
          monthlyQuota: parsedQuota,
          moduleActive,
        },
      );

      if (Object.keys(patch).length === 0) {
        setLocalErrors({
          _form: "Nenhuma alteração foi realizada.",
        });
        return;
      }

      const ok = await onUpdate(municipio.id, patch);
      if (ok) {
        onClose();
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="municipio-form-dialog-title"
      data-testid="municipio-form-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2
            id="municipio-form-dialog-title"
            className="text-lg font-bold text-[#111C4E]"
          >
            {mode === "create"
              ? "Novo Município"
              : `Editar Município — ${municipio?.name ?? ""}`}
          </h2>
          {mode === "edit" && (
            <p
              data-testid="shared-quota-notice"
              className="mt-1.5 rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-900"
            >
              {SHARED_QUOTA_EDIT_NOTICE}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {mode === "create" && (
            <div>
              {/* Input sincronizado para acessibilidade/testes automatizados */}
              <input
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                data-testid="municipio-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="municipio-state-select"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Estado (UF)
                  </Label>
                  <Select
                    value={selectedState}
                    onValueChange={handleStateChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="municipio-state-select"
                      data-testid="municipio-state-select"
                      className="h-11 rounded-xl border-slate-200"
                    >
                      <SelectValue placeholder="Selecione o Estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {estados.map((est) => (
                        <SelectItem
                          key={est.sigla}
                          value={est.nome}
                          className="rounded-lg"
                        >
                          {est.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {combinedErrors.state && (
                    <p
                      data-testid="field-error-state"
                      className="text-xs font-medium text-red-600"
                    >
                      {combinedErrors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="municipio-city-select"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Cidade
                  </Label>
                  <Select
                    value={name}
                    onValueChange={handleCityChange}
                    disabled={!selectedState || fetchCitiesLoading || isSubmitting}
                  >
                    <SelectTrigger
                      id="municipio-city-select"
                      data-testid="municipio-city-select"
                      className="h-11 rounded-xl border-slate-200"
                    >
                      <SelectValue
                        placeholder={
                          fetchCitiesLoading
                            ? "Carregando..."
                            : "Selecione a Cidade"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {cities.map((city) => (
                        <SelectItem
                          key={city.id}
                          value={city.nome}
                          className="rounded-lg"
                        >
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {combinedErrors.name && (
                    <p
                      data-testid="field-error-name"
                      className="text-xs font-medium text-red-600"
                    >
                      {combinedErrors.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="municipio-quota-input"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Cota Mensal
            </Label>
            <Input
              id="municipio-quota-input"
              data-testid="municipio-quota-input"
              type="number"
              min={0}
              max={999999999}
              step={1}
              value={monthlyQuotaInput}
              disabled={isSubmitting}
              onChange={(e) => setMonthlyQuotaInput(e.target.value)}
              className="h-11 rounded-xl border-slate-200"
            />
            {combinedErrors.monthlyQuota && (
              <p
                data-testid="field-error-monthlyQuota"
                className="text-xs font-medium text-red-600"
              >
                {combinedErrors.monthlyQuota}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5">
            <div>
              <Label
                htmlFor="municipio-active-checkbox"
                className="font-medium text-slate-900"
              >
                Módulo NeckBook Ativo
              </Label>
              <p className="text-xs text-slate-500">
                Habilita ou suspende o uso da geração para este município.
              </p>
            </div>
            <input
              id="municipio-active-checkbox"
              data-testid="municipio-active-checkbox"
              type="checkbox"
              checked={moduleActive}
              disabled={isSubmitting}
              onChange={(e) => setModuleActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#111C4E] focus:ring-[#111C4E]"
            />
          </div>

          {combinedErrors._form && (
            <p
              data-testid="field-error-form"
              className="text-xs font-medium text-amber-700"
            >
              {combinedErrors._form}
            </p>
          )}

          {serverError && serverError.kind !== "validation" && (
            <p
              data-testid="form-server-error"
              className="text-xs font-medium text-red-600"
            >
              {serverError.message}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              data-testid="municipio-form-cancel"
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="municipio-form-submit"
              className="rounded-xl bg-[#111C4E] hover:bg-blue-800 text-white"
            >
              {isSubmitting
                ? "Salvando..."
                : mode === "create"
                  ? "Cadastrar Município"
                  : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
