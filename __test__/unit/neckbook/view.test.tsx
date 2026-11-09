import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MunicipiosTable } from "@/source/view/components/neckbook/MunicipiosTable";
import {
  COPY_CONFIRMATION_DURATION_MS,
  GenerateApiKeyModal,
} from "@/source/view/components/neckbook/GenerateApiKeyModal";
import { ApiKeysDialog } from "@/source/view/components/neckbook/ApiKeysDialog";
import { MunicipioFormDialog } from "@/source/view/components/neckbook/MunicipioFormDialog";
import { MunicipiosCotasViewModel } from "@/source/view-model/neckbook/MunicipiosCotasViewModel";
import { NeckbookAdminError } from "@/source/model/entities/neckbook/NeckbookEntity";
import type { INeckbookAdminRepository } from "@/source/model/repositories/neckbook/INeckbookAdminRepository";

const sampleMunicipio = {
  id: "mun-1",
  name: "Fortaleza",
  monthlyQuota: 1000,
  currentUsage: 250,
  remaining: 750,
  quotaRenewsAt: "2026-11-01T00:00:00Z",
  moduleActive: true,
};

describe("View e orquestração — testes de exemplo e edge-case (Task 11.4)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("exibe skeletons com número de linhas igual a pageSize durante carregamento e oculta ao término", () => {
    const { rerender } = render(
      <MunicipiosTable
        municipios={[]}
        isLoading={true}
        pageSize={10}
        onViewKeys={jest.fn()}
        onEdit={jest.fn()}
        onGenerateKey={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId("municipio-skeleton-row")).toHaveLength(10);

    // Ao terminar com sucesso, oculta skeletons e exibe linha
    rerender(
      <MunicipiosTable
        municipios={[sampleMunicipio]}
        isLoading={false}
        pageSize={10}
        onViewKeys={jest.fn()}
        onEdit={jest.fn()}
        onGenerateKey={jest.fn()}
      />,
    );

    expect(screen.queryAllByTestId("municipio-skeleton-row")).toHaveLength(0);
    expect(screen.getByTestId("municipio-row-mun-1")).toBeTruthy();

    // Ao terminar vazio, exibe EmptyState e nenhum skeleton
    rerender(
      <MunicipiosTable
        municipios={[]}
        isLoading={false}
        pageSize={10}
        onViewKeys={jest.fn()}
        onEdit={jest.fn()}
        onGenerateKey={jest.fn()}
      />,
    );

    expect(screen.queryAllByTestId("municipio-skeleton-row")).toHaveLength(0);
    expect(screen.getByTestId("municipios-empty-state")).toBeTruthy();
  });

  it("preserva estado de listagem, chaves e formulário em falha de requisição", async () => {
    const repo: INeckbookAdminRepository = {
      listMunicipios: jest
        .fn()
        .mockResolvedValueOnce({ data: [sampleMunicipio], total: 1 })
        .mockRejectedValueOnce(
          new NeckbookAdminError(403, "CLIENT_INACTIVE", "Cliente inativo"),
        ),
      createMunicipio: jest.fn(),
      updateMunicipio: jest.fn(),
      listApiKeys: jest.fn().mockResolvedValue([
        {
          id: "key-1",
          maskedKey: "nbk_...abcd",
          isActive: true,
          createdAt: "2026-10-01T00:00:00Z",
          description: "Prod",
        },
      ]),
      generateApiKey: jest.fn(),
      toggleApiKey: jest
        .fn()
        .mockRejectedValue(
          new NeckbookAdminError(502, "NECKBOOK_UNAVAILABLE", "Erro de rede"),
        ),
      revokeApiKey: jest.fn(),
    };

    const vm = new MunicipiosCotasViewModel(repo);
    vm.setPageSize(30);
    vm.setSearchTerm("Fort");
    vm.setPage(2);

    await vm.loadMunicipios();
    expect(vm.getState().municipios).toHaveLength(1);

    // Falha no segundo loadMunicipios -> preserva municipios, currentPage, pageSize, searchTerm
    await vm.loadMunicipios();
    expect(vm.getState().municipios).toHaveLength(1);
    expect(vm.getState().currentPage).toBe(2);
    expect(vm.getState().pageSize).toBe(30);
    expect(vm.getState().searchTerm).toBe("Fort");
    expect(vm.getState().error?.kind).toBe("auth");

    // Falha no toggleApiKey -> preserva isActive original da chave
    await vm.loadApiKeys("mun-1");
    await vm.toggleApiKey("mun-1", "key-1", false);
    expect(vm.getState().apiKeys[0].isActive).toBe(true);
    expect(vm.getState().keysError?.kind).toBe("network");

    // Falha no submit do formulário -> preserva os valores preenchidos pelo usuário
    const onCreate = jest.fn().mockResolvedValue(false);
    render(
      <MunicipioFormDialog
        open={true}
        mode="create"
        isSubmitting={false}
        onClose={jest.fn()}
        onCreate={onCreate}
        onUpdate={jest.fn()}
      />,
    );

    const nameInput = screen.getByTestId("municipio-name-input") as HTMLInputElement;
    const quotaInput = screen.getByTestId("municipio-quota-input") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Caucaia" } });
    fireEvent.change(quotaInput, { target: { value: "450" } });

    await act(async () => {
      fireEvent.click(screen.getByTestId("municipio-form-submit"));
    });

    expect(onCreate).toHaveBeenCalledWith({
      name: "Caucaia",
      monthlyQuota: 450,
      moduleActive: true,
    });
    expect(nameInput.value).toBe("Caucaia");
    expect(quotaInput.value).toBe("450");
  });

  it("exibe o token em texto puro uma única vez, mostra confirmação de cópia entre 2s e 5s e descarta ao fechar", async () => {
    expect(COPY_CONFIRMATION_DURATION_MS).toBeGreaterThanOrEqual(2000);
    expect(COPY_CONFIRMATION_DURATION_MS).toBeLessThanOrEqual(5000);

    const onClose = jest.fn();
    render(
      <GenerateApiKeyModal
        open={true}
        municipio={sampleMunicipio}
        token="nbk_live_plain_secret_token_999"
        isGenerating={false}
        error={null}
        onRetry={jest.fn()}
        onClose={onClose}
      />,
    );

    expect(screen.getByTestId("single-display-warning")).toBeTruthy();
    expect(screen.getByTestId("generated-plain-token").textContent).toBe(
      "nbk_live_plain_secret_token_999",
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-token-button"));
    });

    expect(screen.getByTestId("copy-confirmation")).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(COPY_CONFIRMATION_DURATION_MS);
    });

    expect(screen.queryByTestId("copy-confirmation")).toBeNull();

    fireEvent.click(screen.getByTestId("close-generate-key-modal"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exige diálogo de confirmação destrutivo antes de desativar ou revogar chave", async () => {
    const onToggleKey = jest.fn().mockResolvedValue(undefined);
    const onRevokeKey = jest.fn().mockResolvedValue(undefined);

    render(
      <ApiKeysDialog
        open={true}
        municipio={sampleMunicipio}
        apiKeys={[
          {
            id: "key-1",
            maskedKey: "nbk_...abcd",
            isActive: true,
            createdAt: "2026-10-01T00:00:00Z",
            description: "Chave Principal",
          },
        ]}
        isLoading={false}
        error={null}
        onClose={jest.fn()}
        onToggleKey={onToggleKey}
        onRevokeKey={onRevokeKey}
      />,
    );

    // Clicar em Desativar abre confirmação destrutiva sem chamar onToggleKey ainda
    fireEvent.click(screen.getByTestId("toggle-api-key-key-1"));
    expect(onToggleKey).not.toHaveBeenCalled();
    expect(screen.getByTestId("destructive-confirm-dialog")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByTestId("confirm-destructive-action"));
    });
    expect(onToggleKey).toHaveBeenCalledWith("key-1", false);

    // Clicar em Revogar abre confirmação destrutiva informando revogação permanente
    fireEvent.click(screen.getByTestId("revoke-api-key-key-1"));
    expect(onRevokeKey).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("destructive-confirm-dialog").textContent,
    ).toContain("permanente");

    await act(async () => {
      fireEvent.click(screen.getByTestId("confirm-destructive-action"));
    });
    expect(onRevokeKey).toHaveBeenCalledWith("key-1");
  });
});
