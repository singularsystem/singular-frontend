"use client";

import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMunicipiosCotas } from "@/source/view/hooks/neckbook/useMunicipiosCotas";
import type { MunicipioCotaEntity } from "@/source/model/entities/neckbook/NeckbookEntity";
import { MunicipiosTable } from "@/source/view/components/neckbook/MunicipiosTable";
import { PageSizeSelector } from "@/source/view/components/neckbook/PageSizeSelector";
import { ErrorBanner } from "@/source/view/components/neckbook/ErrorBanner";
import { MunicipioFormDialog } from "@/source/view/components/neckbook/MunicipioFormDialog";
import { GenerateApiKeyModal } from "@/source/view/components/neckbook/GenerateApiKeyModal";
import { ApiKeysDialog } from "@/source/view/components/neckbook/ApiKeysDialog";

export function MunicipiosCotasScreen() {
  const { state, actions } = useMunicipiosCotas();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedMunicipio, setSelectedMunicipio] =
    useState<MunicipioCotaEntity | null>(null);

  const [generateKeyOpen, setGenerateKeyOpen] = useState(false);
  const [generateKeyTarget, setGenerateKeyTarget] =
    useState<MunicipioCotaEntity | null>(null);

  const [keysDialogOpen, setKeysDialogOpen] = useState(false);
  const [keysDialogTarget, setKeysDialogTarget] =
    useState<MunicipioCotaEntity | null>(null);

  const handleOpenCreate = () => {
    actions.clearFormErrors();
    setSelectedMunicipio(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleOpenEdit = (municipio: MunicipioCotaEntity) => {
    actions.clearFormErrors();
    setSelectedMunicipio(municipio);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleOpenGenerateKey = async (municipio: MunicipioCotaEntity) => {
    setGenerateKeyTarget(municipio);
    setGenerateKeyOpen(true);
    await actions.generateApiKey(municipio.id);
  };

  const handleCloseGenerateKey = () => {
    actions.clearGeneratedToken();
    setGenerateKeyOpen(false);
    setGenerateKeyTarget(null);
  };

  const handleOpenViewKeys = async (municipio: MunicipioCotaEntity) => {
    setKeysDialogTarget(municipio);
    setKeysDialogOpen(true);
    await actions.loadApiKeys(municipio.id);
  };

  const handleCloseViewKeys = () => {
    setKeysDialogOpen(false);
    setKeysDialogTarget(null);
  };

  return (
    <div
      data-testid="municipios-cotas-screen"
      className="mx-auto max-w-7xl space-y-6 p-6"
    >
      {/* Cabeçalho e ação primária */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
            Administração de Municípios &amp; Cotas (NeckBook)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gerencie municípios participantes, cotas mensais compartilhadas e
            chaves de API da integração NeckBook.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenCreate}
          data-testid="open-create-municipio-button"
          className="bg-brand-navy hover:bg-blue-800 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Município
        </Button>
      </div>

      {/* Filtro de busca por nome */}
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            maxLength={255}
            value={state.searchTerm}
            onChange={(e) => void actions.setSearchTerm(e.target.value)}
            placeholder="Buscar município pelo nome..."
            aria-label="Buscar município pelo nome"
            data-testid="municipio-search-input"
            className="pl-9"
          />
        </div>
      </div>

      {/* Banner de erro */}
      {state.error && !formOpen && !generateKeyOpen && (
        <ErrorBanner
          error={state.error}
          onRetry={() => void actions.loadMunicipios()}
          onDismiss={actions.clearError}
        />
      )}

      {/* Tabela de municípios + rodapé com PageSizeSelector à esquerda da paginação */}
      <div className="space-y-0">
        <MunicipiosTable
          municipios={state.municipios}
          isLoading={state.isLoading}
          pageSize={state.pageSize}
          onViewKeys={(m) => void handleOpenViewKeys(m)}
          onEdit={handleOpenEdit}
          onGenerateKey={(m) => void handleOpenGenerateKey(m)}
        />
        <PageSizeSelector
          currentPage={state.currentPage}
          pageSize={state.pageSize}
          total={state.total}
          disabled={state.isLoading}
          onPageChange={(page) => void actions.setPage(page)}
          onPageSizeChange={(size) => void actions.setPageSize(size)}
        />
      </div>

      {/* Diálogo de criação / edição */}
      <MunicipioFormDialog
        open={formOpen}
        mode={formMode}
        municipio={selectedMunicipio}
        isSubmitting={state.isSubmitting}
        serverFieldErrors={state.formFieldErrors}
        serverError={state.error}
        onClose={() => setFormOpen(false)}
        onCreate={actions.createMunicipio}
        onUpdate={actions.updateMunicipio}
      />

      {/* Modal de exibição única do token recém-gerado */}
      <GenerateApiKeyModal
        open={generateKeyOpen}
        municipio={generateKeyTarget}
        token={state.generatedToken}
        isGenerating={state.isGeneratingKey}
        error={state.error}
        onRetry={() => {
          if (generateKeyTarget) {
            void actions.generateApiKey(generateKeyTarget.id);
          }
        }}
        onClose={handleCloseGenerateKey}
      />

      {/* Diálogo de listagem, ativação/desativação e revogação de chaves */}
      <ApiKeysDialog
        open={keysDialogOpen}
        municipio={keysDialogTarget}
        apiKeys={state.apiKeys}
        isLoading={state.isLoadingKeys}
        error={state.keysError}
        onClose={handleCloseViewKeys}
        onToggleKey={async (keyId, nextActive) => {
          if (keysDialogTarget) {
            await actions.toggleApiKey(keysDialogTarget.id, keyId, nextActive);
          }
        }}
        onRevokeKey={async (keyId) => {
          if (keysDialogTarget) {
            await actions.revokeApiKey(keysDialogTarget.id, keyId);
          }
        }}
      />
    </div>
  );
}
