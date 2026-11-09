import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GeracaoLivroScreen } from "@/source/view/screens/neckbook/GeracaoLivroScreen";
import { SeletorAluno } from "@/source/view/components/neckbook/SeletorAluno";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

const mockAuthValue = {
  user: null as any,
  isLoading: false,
  isAuthenticated: false,
};

jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => mockAuthValue,
}));

jest.mock("@/hooks/useSecureFetch", () => ({
  useSecureFetch: () => jest.fn(),
}));

const mockGetAlunos = jest.fn();
jest.mock("@/source/infrastructure/alunos/AlunoRepositoryImpl", () => ({
  AlunoRepositoryImpl: jest.fn().mockImplementation(() => ({
    getAlunos: mockGetAlunos,
  })),
}));

describe("UI Tests — Gate de Papel e Seleção de Aluno (Task 14.2)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Gate de Papel (Req 1.4 - 1.7)", () => {
    it("exibe skeleton e oculta formulário enquanto auth está carregando (isLoading: true)", () => {
      mockAuthValue.isLoading = true;
      mockAuthValue.isAuthenticated = false;
      mockAuthValue.user = null;

      const { container } = render(<GeracaoLivroScreen />);

      expect(screen.queryByText("Geração de Livro Didático Adaptado")).toBeNull();
      expect(
        screen.queryByText("Você não tem permissão para acessar esta tela"),
      ).toBeNull();
      expect(container.getElementsByClassName("animate-pulse").length).toBeGreaterThan(0);
    });

    it("redireciona para /login quando não autenticado (isLoading: false, isAuthenticated: false)", () => {
      mockAuthValue.isLoading = false;
      mockAuthValue.isAuthenticated = false;
      mockAuthValue.user = null;

      render(<GeracaoLivroScreen />);

      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("exibe mensagem 'Você não tem permissão para acessar esta tela' quando usuário não é Teacher nem Admin", () => {
      mockAuthValue.isLoading = false;
      mockAuthValue.isAuthenticated = true;
      mockAuthValue.user = { id: "u-1", name: "Outro", roles: ["Student"] };

      render(<GeracaoLivroScreen />);

      expect(
        screen.getByText("Você não tem permissão para acessar esta tela"),
      ).toBeTruthy();
      expect(screen.queryByText("Geração de Livro Didático Adaptado")).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("exibe o formulário quando usuário possui o papel Teacher", () => {
      mockAuthValue.isLoading = false;
      mockAuthValue.isAuthenticated = true;
      mockAuthValue.user = { id: "u-2", name: "Prof", roles: ["Teacher"] };

      render(<GeracaoLivroScreen />);

      expect(screen.getByText("Geração de Livro Didático Adaptado")).toBeTruthy();
      expect(screen.getByText("Parâmetros do Livro")).toBeTruthy();
      expect(screen.getByText("Gerar Livro")).toBeTruthy();
    });

    it("exibe o formulário quando usuário possui o papel Admin", () => {
      mockAuthValue.isLoading = false;
      mockAuthValue.isAuthenticated = true;
      mockAuthValue.user = { id: "u-3", name: "Admin", roles: ["Admin"] };

      render(<GeracaoLivroScreen />);

      expect(screen.getByText("Geração de Livro Didático Adaptado")).toBeTruthy();
    });
  });

  describe("Seleção de Aluno (Req 2.1 - 2.6)", () => {
    it("busca alunos a partir de 1 caractere digitado", async () => {
      mockGetAlunos.mockResolvedValue({
        data: [
          { id: "aluno-1", fullName: "Lucas Silva", schoolName: "Escola A" },
          { id: "aluno-2", fullName: "Mariana Souza", schoolName: "Escola B" },
        ],
        total: 2,
      });

      const onSelect = jest.fn();
      render(<SeletorAluno selectedStudentId={null} onSelectStudent={onSelect} />);

      const input = screen.getByPlaceholderText(/Buscar aluno por nome/i);
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "Lu" } });

      await waitFor(
        () => {
          expect(mockGetAlunos).toHaveBeenCalledWith(
            1,
            50,
            expect.objectContaining({ searchTerm: "Lu" }),
          );
        },
        { timeout: 3000 },
      );

      await waitFor(
        () => {
          expect(screen.getByText("Lucas Silva")).toBeTruthy();
        },
        { timeout: 3000 },
      );

      fireEvent.click(screen.getByText("Lucas Silva"));
      expect(onSelect).toHaveBeenCalledWith("aluno-1");
    });

    it("exibe mensagem 'Nenhum aluno encontrado' quando a busca retorna 0 resultados", async () => {
      mockGetAlunos.mockResolvedValue({
        data: [],
        total: 0,
      });

      render(<SeletorAluno selectedStudentId={null} onSelectStudent={jest.fn()} />);

      const input = screen.getByPlaceholderText(/Buscar aluno por nome/i);
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "Inexistente" } });

      await waitFor(
        () => {
          expect(screen.getByText("Nenhum aluno encontrado")).toBeTruthy();
        },
        { timeout: 3000 },
      );
    });

    it("exibe mensagem de erro quando a busca de alunos falha", async () => {
      mockGetAlunos.mockRejectedValue(new Error("Erro de rede"));

      render(<SeletorAluno selectedStudentId={null} onSelectStudent={jest.fn()} />);

      const input = screen.getByPlaceholderText(/Buscar aluno por nome/i);
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "Qualquer" } });

      await waitFor(
        () => {
          expect(
            screen.getByText("Não foi possível carregar a lista de alunos. Tente novamente"),
          ).toBeTruthy();
        },
        { timeout: 3000 },
      );
    });
  });
});
