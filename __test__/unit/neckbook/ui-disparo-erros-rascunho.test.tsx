import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EdicaoRascunhoScreen } from "@/source/view/screens/neckbook/EdicaoRascunhoScreen";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

const mockGetDraft = jest.fn();
const mockSaveDraft = jest.fn();
const mockApprove = jest.fn();

jest.mock("@/source/infrastructure/neckbook/NeckbookBooksRepositoryImpl", () => ({
  NeckbookBooksRepositoryImpl: jest.fn().mockImplementation(() => ({
    getDraft: mockGetDraft,
    saveDraft: mockSaveDraft,
    approve: mockApprove,
    generate: jest.fn(),
    getJobStatus: jest.fn(),
  })),
}));

const mockSecureFetch = jest.fn();
jest.mock("@/hooks/useSecureFetch", () => ({
  useSecureFetch: () => mockSecureFetch,
}));

describe("UI Tests — Rascunho, Edição, Salvar e Aprovar (Task 14.3)", () => {
  const sampleDraft = {
    title: "Aventuras na Floresta",
    chapters: [
      {
        id: "ch-1",
        order: 1,
        title: "Capítulo 1 - As Árvores Altas",
        content: "Era uma vez uma floresta cheia de árvores.",
        exercises: ["Onde se passa a história?"],
        image_prompt: "Desenho suave de árvores",
      },
      {
        id: "ch-2",
        order: 2,
        title: "Capítulo 2 - O Rio Cristalino",
        content: "No meio da floresta passava um rio límpido.",
        exercises: ["O que passava no meio da floresta?"],
        image_prompt: "Rio azul com peixinhos",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe o rascunho carregado com título e capítulos", async () => {
    mockGetDraft.mockResolvedValueOnce(sampleDraft);

    render(<EdicaoRascunhoScreen bookId="book-100" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Aventuras na Floresta")).toBeTruthy();
    });

    expect(screen.getByDisplayValue("Capítulo 1 - As Árvores Altas")).toBeTruthy();
    expect(screen.getByDisplayValue("Capítulo 2 - O Rio Cristalino")).toBeTruthy();
  });

  it("exibe mensagem de erro e botão de retry se o carregamento falhar", async () => {
    mockGetDraft.mockRejectedValueOnce(new Error("Falha 500"));

    render(<EdicaoRascunhoScreen bookId="book-fail" />);

    await waitFor(() => {
      expect(
        screen.getByText("Não foi possível carregar o rascunho. Tente novamente"),
      ).toBeTruthy();
    });

    expect(screen.getByText("Tentar Novamente")).toBeTruthy();
  });

  it("permite editar título, salvar com sucesso e exibir mensagem", async () => {
    mockGetDraft.mockResolvedValueOnce(sampleDraft);
    mockSaveDraft.mockResolvedValueOnce(undefined);

    render(<EdicaoRascunhoScreen bookId="book-save-1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Aventuras na Floresta")).toBeTruthy();
    });

    const titleInput = screen.getByDisplayValue("Aventuras na Floresta");
    fireEvent.change(titleInput, { target: { value: "Aventuras no Espaço" } });

    const saveButton = screen.getByRole("button", { name: /Salvar Alterações/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveDraft).toHaveBeenCalledWith("book-save-1", expect.objectContaining({
        title: "Aventuras no Espaço",
      }));
    });

    await waitFor(() => {
      expect(screen.getByText("Alterações salvas com sucesso!")).toBeTruthy();
    });
  });

  it("permite aprovar o rascunho e redireciona para /livros/gerar", async () => {
    mockGetDraft.mockResolvedValueOnce(sampleDraft);
    mockApprove.mockResolvedValueOnce(undefined);

    render(<EdicaoRascunhoScreen bookId="book-approve-1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Aventuras na Floresta")).toBeTruthy();
    });

    const approveButton = screen.getByRole("button", { name: /Aprovar e Gerar Livro/i });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(mockApprove).toHaveBeenCalledWith("book-approve-1");
      expect(mockPush).toHaveBeenCalledWith("/livros/gerar");
    });
  });

  it("preserva edições em falha de salvar", async () => {
    mockGetDraft.mockResolvedValueOnce(sampleDraft);
    mockSaveDraft.mockRejectedValueOnce(new Error("Network Error"));

    render(<EdicaoRascunhoScreen bookId="book-save-fail" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Aventuras na Floresta")).toBeTruthy();
    });

    const titleInput = screen.getByDisplayValue("Aventuras na Floresta");
    fireEvent.change(titleInput, { target: { value: "Título Modificado" } });

    const saveButton = screen.getByRole("button", { name: /Salvar Alterações/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Não foi possível salvar as alterações. Tente novamente"),
      ).toBeTruthy();
    });

    // Edição preservada
    expect(screen.getByDisplayValue("Título Modificado")).toBeTruthy();
  });
});
