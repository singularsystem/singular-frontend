import { AlunosListViewModel } from "@/source/view-model/alunos/AlunosListViewModel";
import { MockAlunoRepository } from "../../../mocks/MockAlunoRepository";

describe("AlunosListViewModel", () => {
  let viewModel: AlunosListViewModel;
  let mockRepository: MockAlunoRepository;

  beforeEach(() => {
    mockRepository = new MockAlunoRepository();
    viewModel = new AlunosListViewModel(mockRepository, {} as any);
  });

  it("deve iniciar com estado inicial correto", () => {
    const state = viewModel.getState();
    expect(state.alunos).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.currentPage).toBe(1);
  });

  it("deve carregar alunos com sucesso", async () => {
    mockRepository.alunos = [
      { id: "1", nome: "João", fullName: "João Silva", status: true } as any
    ];

    await viewModel.loadAlunos();

    const state = viewModel.getState();
    expect(state.alunos.length).toBe(1);
    expect(state.alunos[0].fullName).toBe("João Silva");
    expect(state.isLoading).toBe(false);
  });

  it("deve tratar erro ao carregar alunos", async () => {
    jest.spyOn(mockRepository, "getAlunos").mockRejectedValue(new Error("Erro de conexão"));

    await viewModel.loadAlunos();

    const state = viewModel.getState();
    expect(state.error).toBe("Erro de conexão");
    expect(state.isLoading).toBe(false);
  });

  it("deve mudar de página e carregar novos dados", async () => {
    const spy = jest.spyOn(mockRepository, "getAlunos");
    
    viewModel.setPage(2);
    
    expect(viewModel.getState().currentPage).toBe(2);
    expect(spy).toHaveBeenCalledWith(2, 15, expect.anything(), expect.anything());
  });
});
