import { AlunoDetailsViewModel } from "@/source/view-model/alunos/AlunoDetailsViewModel";
import { MockAlunoRepository } from "../../../mocks/MockAlunoRepository";

describe("AlunoDetailsViewModel", () => {
  let viewModel: AlunoDetailsViewModel;
  let mockRepository: MockAlunoRepository;

  beforeEach(() => {
    mockRepository = new MockAlunoRepository();
    viewModel = new AlunoDetailsViewModel(mockRepository);
  });

  it("deve carregar detalhes do aluno, documentos e anexos", async () => {
    mockRepository.alunos = [{ id: "1", nome: "João", fullName: "João Silva", sex: "M", sexo: "M", dataNascimento: "2000-01-01", schoolID: "1", schoolName: "Escola A", city: "Cidade", state: "Estado", address: "Rua X", serie: "1", nameOfPersonResponsible: "Pai", maritalStatusParents: "C", skinColor: "B", status: true, cpf: "123", rg: "456", susCard: "789", email: "", telefone: "" } as any];
    const docSpy = jest.spyOn(mockRepository, "getDocuments").mockResolvedValue([]);
    const attSpy = jest.spyOn(mockRepository, "getAttachments").mockResolvedValue([]);


    await viewModel.loadDetails("1");

    const state = viewModel.getState();
    expect(state.aluno?.nome).toBe("João");
    expect(docSpy).toHaveBeenCalledWith("1");
    expect(attSpy).toHaveBeenCalledWith("1");
  });

  it("deve lidar com upload de arquivos", async () => {
    mockRepository.alunos = [{ id: "1", nome: "João" } as any];
    const loadAttSpy = jest.spyOn(mockRepository, "getAttachments");

    await viewModel.loadDetails("1");
    
    const uploadSpy = jest.spyOn(mockRepository, "uploadAttachments").mockResolvedValue();


    const files = { length: 1, 0: new File([], "test.pdf") } as any;
    await viewModel.uploadFiles(files);

    expect(uploadSpy).toHaveBeenCalled();
    expect(loadAttSpy).toHaveBeenCalledTimes(2); // Uma no loadDetails e uma após upload
  });
});
