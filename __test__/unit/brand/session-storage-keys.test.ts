import { AlunosListViewModel } from "@/source/view-model/alunos/AlunosListViewModel";
import { EscolasListViewModel } from "@/source/view-model/escolas/EscolasListViewModel";
import { PAEEListViewModel } from "@/source/view-model/paee/PAEEListViewModel";
import { CaseStudiesTrackingViewModel } from "@/source/view-model/acompanhamento/CaseStudiesTrackingViewModel";
import { BiopsychosocialTrackingViewModel } from "@/source/view-model/acompanhamento/BiopsychosocialTrackingViewModel";
import {
  MunicipiosCotasViewModel,
  SESSION_STORAGE_KEY,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";

describe("sessionStorage keys migration (ipaags_ -> singular_)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("ignores legacy ipaags_* keys without error and preserves default state", () => {
    // Populate legacy keys
    sessionStorage.setItem(
      "ipaags_alunos_list_state",
      JSON.stringify({ currentPage: 99, pageSize: 50, filters: { searchTerm: "legacy-student" } })
    );
    sessionStorage.setItem(
      "ipaags_escolas_list_state",
      JSON.stringify({ currentPage: 88, pageSize: 20, searchTerm: "legacy-school" })
    );
    sessionStorage.setItem(
      "ipaags_paee_list_state",
      JSON.stringify({ currentPage: 77, pageSize: 30, filters: { searchTerm: "legacy-paee" } })
    );
    sessionStorage.setItem(
      "ipaags_case_studies_tracking_state",
      JSON.stringify({ currentPage: 66, pageSize: 25, searchTerm: "legacy-case" })
    );
    sessionStorage.setItem(
      "ipaags_biopsychosocial_tracking_state",
      JSON.stringify({ currentPage: 55, pageSize: 15, searchTerm: "legacy-bio" })
    );
    sessionStorage.setItem(
      "ipaags_neckbook_cotas_state",
      JSON.stringify({ currentPage: 44, pageSize: 50, searchTerm: "legacy-quota" })
    );

    // Instantiate viewmodels
    const fakeRepo = {} as any;

    const alunosVm = new AlunosListViewModel(fakeRepo, fakeRepo);
    expect(() => alunosVm.restoreStateFromSession()).not.toThrow();
    expect(alunosVm.state.currentPage).toBe(1);
    expect(alunosVm.state.filters.searchTerm).toBe("");

    const escolasVm = new EscolasListViewModel(fakeRepo);
    expect(() => escolasVm.restoreStateFromSession()).not.toThrow();
    expect(escolasVm.state.currentPage).toBe(1);
    expect(escolasVm.state.searchTerm).toBe("");

    const paeeVm = new PAEEListViewModel(fakeRepo);
    expect(() => paeeVm.restoreStateFromSession()).not.toThrow();
    expect(paeeVm.state.currentPage).toBe(1);
    expect(paeeVm.state.filters.searchTerm).toBe("");

    const caseVm = new CaseStudiesTrackingViewModel(fakeRepo);
    expect(() => caseVm.restoreStateFromSession()).not.toThrow();
    expect(caseVm.state.currentPage).toBe(1);
    expect(caseVm.state.searchTerm).toBe("");

    const bioVm = new BiopsychosocialTrackingViewModel(fakeRepo);
    expect(() => bioVm.restoreStateFromSession()).not.toThrow();
    expect(bioVm.state.currentPage).toBe(1);
    expect(bioVm.state.searchTerm).toBe("");

    expect(SESSION_STORAGE_KEY).toBe("singular_neckbook_cotas_state");
    const cotasVm = new MunicipiosCotasViewModel(fakeRepo);
    expect(cotasVm.state.currentPage).toBe(1);
    expect(cotasVm.state.searchTerm).toBe("");
  });

  it("reads and restores state when singular_* keys are present", () => {
    sessionStorage.setItem(
      "singular_alunos_list_state",
      JSON.stringify({ currentPage: 5, pageSize: 15, filters: { searchTerm: "joao", city: "teresina" } })
    );
    sessionStorage.setItem(
      "singular_escolas_list_state",
      JSON.stringify({ currentPage: 3, pageSize: 10, searchTerm: "escola central" })
    );
    sessionStorage.setItem(
      "singular_paee_list_state",
      JSON.stringify({ currentPage: 4, pageSize: 15, filters: { searchTerm: "maria" } })
    );
    sessionStorage.setItem(
      "singular_case_studies_tracking_state",
      JSON.stringify({ currentPage: 2, pageSize: 10, searchTerm: "pedro" })
    );
    sessionStorage.setItem(
      "singular_biopsychosocial_tracking_state",
      JSON.stringify({ currentPage: 6, pageSize: 10, searchTerm: "ana" })
    );

    const fakeRepo = {} as any;

    const alunosVm = new AlunosListViewModel(fakeRepo, fakeRepo);
    alunosVm.restoreStateFromSession();
    expect(alunosVm.state.currentPage).toBe(5);
    expect(alunosVm.state.filters.searchTerm).toBe("joao");

    const escolasVm = new EscolasListViewModel(fakeRepo);
    escolasVm.restoreStateFromSession();
    expect(escolasVm.state.currentPage).toBe(3);
    expect(escolasVm.state.searchTerm).toBe("escola central");

    const paeeVm = new PAEEListViewModel(fakeRepo);
    paeeVm.restoreStateFromSession();
    expect(paeeVm.state.currentPage).toBe(4);
    expect(paeeVm.state.filters.searchTerm).toBe("maria");

    const caseVm = new CaseStudiesTrackingViewModel(fakeRepo);
    caseVm.restoreStateFromSession();
    expect(caseVm.state.currentPage).toBe(2);
    expect(caseVm.state.searchTerm).toBe("pedro");

    const bioVm = new BiopsychosocialTrackingViewModel(fakeRepo);
    bioVm.restoreStateFromSession();
    expect(bioVm.state.currentPage).toBe(6);
    expect(bioVm.state.searchTerm).toBe("ana");
  });
});
