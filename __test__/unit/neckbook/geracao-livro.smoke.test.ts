import {
  DISCIPLINAS,
  type Disciplina,
  type ModoGeracao,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { TEACHER_ROLE, isTeacher } from "@/source/infrastructure/common/config/roles";
import { GeracaoLivroViewModel } from "@/source/view-model/neckbook/GeracaoLivroViewModel";
import type { INeckbookBooksRepository } from "@/source/model/repositories/neckbook/INeckbookBooksRepository";

describe("Testes de fumaça e estrutura — Geração de Livro (Task 15.1)", () => {
  it("DISCIPLINAS contém exatamente os 7 valores canônicos na ordem correta (Req 3.1)", () => {
    expect(DISCIPLINAS).toHaveLength(7);
    expect(DISCIPLINAS).toEqual([
      "Língua Portuguesa",
      "Matemática",
      "Ciências",
      "História",
      "Geografia",
      "Inglês",
      "Educação Infantil",
    ]);
  });

  it("TEACHER_ROLE possui o valor esperado e isTeacher está definido (Req 1.1, 1.2)", () => {
    expect(TEACHER_ROLE).toBe("TEACHER");
    expect(typeof isTeacher).toBe("function");
    expect(isTeacher(["teacher"])).toBe(true);
    expect(isTeacher(["Teacher"])).toBe(true);
    expect(isTeacher(["ADMIN"])).toBe(false);
  });

  it("ModoGeracao aceita valores full_auto e draft_first (Req 9.1)", () => {
    const modo1: ModoGeracao = "full_auto";
    const modo2: ModoGeracao = "draft_first";
    expect(modo1).toBe("full_auto");
    expect(modo2).toBe("draft_first");
  });

  it("GeracaoLivroViewModel expõe a interface observável getState, subscribe, notify, updateState (Req 9.1, 14.1)", () => {
    const mockRepo: INeckbookBooksRepository = {
      generate: jest.fn(),
      getJobStatus: jest.fn(),
      getDraft: jest.fn(),
      saveDraft: jest.fn(),
      approve: jest.fn(),
    };

    const vm = new GeracaoLivroViewModel(mockRepo);

    expect(typeof vm.getState).toBe("function");
    expect(typeof vm.subscribe).toBe("function");
    expect(typeof vm.notify).toBe("function");
    expect(typeof vm.updateState).toBe("function");

    const initialState = vm.getState();
    expect(initialState.form.numCapitulos).toBe(4);
    expect(initialState.form.exerciciosPorCapitulo).toBe(1);
    expect(initialState.form.estiloVisual).toBe("aquarela_infantil");
    expect(initialState.form.suporteCaa).toBe(false);

    let notificationReceived = false;
    const unsub = vm.subscribe((st) => {
      notificationReceived = true;
      expect(st.form.estiloVisual).toBe("3d_suave");
    });

    vm.updateState({ form: { ...initialState.form, estiloVisual: "3d_suave" } });
    expect(notificationReceived).toBe(true);

    unsub();
  });
});
