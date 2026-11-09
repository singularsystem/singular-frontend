import { AlunoFormViewModel } from "@/source/view-model/alunos/AlunoFormViewModel";
import { MockAlunoRepository } from "../../../mocks/MockAlunoRepository";

describe("AlunoFormViewModel", () => {
  let viewModel: AlunoFormViewModel;
  let mockRepository: MockAlunoRepository;

  beforeEach(() => {
    mockRepository = new MockAlunoRepository();
    viewModel = new AlunoFormViewModel(mockRepository);
  });

  it("deve iniciar com estado vazio", () => {
    const state = viewModel.getState();
    expect(state.formData.fullName).toBe("");
    expect(state.isLoading).toBe(false);
  });

  it("deve atualizar campos do formulário", () => {
    viewModel.updateFormField("fullName", "Maria Silva");
    expect(viewModel.getState().formData.fullName).toBe("Maria Silva");
  });

  it("deve cadastrar aluno com sucesso", async () => {
    viewModel.updateFormField("fullName", "Maria Silva");
    viewModel.updateFormField("schoolID", "school-123");
    
    await viewModel.submit();

    const state = viewModel.getState();
    expect(state.isSuccess).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(mockRepository.alunos.length).toBe(1);
    expect(mockRepository.alunos[0].fullName).toBe("Maria Silva");
  });

  it("deve tratar erro no cadastro", async () => {
    jest.spyOn(mockRepository, "createAluno").mockRejectedValue(new Error("Erro de validação"));

    await viewModel.submit();

    const state = viewModel.getState();
    expect(state.error).toBe("Erro de validação");
    expect(state.isSuccess).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});
