import { AlunoEditViewModel } from "@/source/view-model/alunos/AlunoEditViewModel";
import { MockAlunoRepository } from "../../../mocks/MockAlunoRepository";

describe("AlunoEditViewModel", () => {
  let viewModel: AlunoEditViewModel;
  let mockRepository: MockAlunoRepository;

  beforeEach(() => {
    mockRepository = new MockAlunoRepository();
    viewModel = new AlunoEditViewModel(mockRepository);
  });

  it("deve carregar dados do aluno para edição", async () => {
    mockRepository.alunos = [
      { id: "123", nome: "Carlos", fullName: "Carlos Silva", sex: "M", sexo: "M", dataNascimento: "2000-01-01", schoolID: "sch1", schoolName: "Escola B", city: "SP", state: "SP", uf: "SP", cidade: "SP", address: "Rua Y", serie: "2", nameOfPersonResponsible: "Mãe", maritalStatusParents: "S", skinColor: "P", status: true, cpf: "111", rg: "222", susCard: "333", email: "", telefone: "" } as any
    ];

    await viewModel.loadAluno("123");

    const state = viewModel.getState();
    expect(state.formData.fullName).toBe("Carlos Silva");
    expect(state.id).toBe("123");
    expect(state.isFetching).toBe(false);
  });

  it("deve atualizar aluno com sucesso", async () => {
    mockRepository.alunos = [
      { id: "123", nome: "Carlos", fullName: "Carlos Silva", sex: "M", sexo: "M", dataNascimento: "2000-01-01", schoolID: "sch1", schoolName: "Escola B", city: "SP", state: "SP", uf: "SP", cidade: "SP", address: "Rua Y", serie: "2", nameOfPersonResponsible: "Mãe", maritalStatusParents: "S", skinColor: "P", status: true, cpf: "111", rg: "222", susCard: "333", email: "", telefone: "" } as any
    ];
    await viewModel.loadAluno("123");
    
    viewModel.updateFormField("fullName", "Carlos Editado");
    await viewModel.submit();

    const state = viewModel.getState();
    expect(state.isSuccess).toBe(true);
    expect(mockRepository.alunos[0].fullName).toBe("Carlos Editado");
  });

  it("deve tratar erro ao carregar", async () => {
    jest.spyOn(mockRepository, "getAlunoById").mockRejectedValue(new Error("Não encontrado"));

    await viewModel.loadAluno("999");

    const state = viewModel.getState();
    expect(state.error).toBe("Não encontrado");
    expect(state.isFetching).toBe(false);
  });
});
