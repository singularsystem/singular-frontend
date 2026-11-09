import fc from "fast-check";
import {
  ALLOWED_PAGE_SIZES,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEARCH_TERM,
  MunicipiosCotasViewModel,
  SESSION_STORAGE_KEY,
  persistSessionState,
  restoreSessionState,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";
import type { INeckbookAdminRepository } from "@/source/model/repositories/neckbook/INeckbookAdminRepository";

const noopRepo = {} as INeckbookAdminRepository;

describe("Property 3: Round-trip de persistência de estado com fallback para defaults", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  // Feature: neckbook-municipios-cotas-admin, Property 3: Round-trip de persistência de estado com fallback para defaults
  it("persistir e restaurar recupera exatamente currentPage, pageSize e searchTerm", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10_000 }),
        fc.constantFrom(...ALLOWED_PAGE_SIZES),
        fc.string({ minLength: 0, maxLength: 255 }),
        (currentPage, pageSize, searchTerm) => {
          window.sessionStorage.clear();
          persistSessionState({ currentPage, pageSize, searchTerm });

          const restored = restoreSessionState();
          expect(restored).toEqual({ currentPage, pageSize, searchTerm });

          const vm = new MunicipiosCotasViewModel(noopRepo);
          vm.restoreStateFromSession();
          expect(vm.getState().currentPage).toBe(currentPage);
          expect(vm.getState().pageSize).toBe(pageSize);
          expect(vm.getState().searchTerm).toBe(searchTerm);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: neckbook-municipios-cotas-admin, Property 3: Round-trip de persistência de estado com fallback para defaults
  it("retorna os defaults quando a chave está ausente ou contém valor inválido/corrompido", () => {
    window.sessionStorage.clear();
    expect(restoreSessionState()).toEqual({
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      searchTerm: DEFAULT_SEARCH_TERM,
    });

    fc.assert(
      fc.property(
        fc.oneof(
          fc.string().filter((s) => {
            try {
              const p = JSON.parse(s);
              return (
                !p ||
                typeof p !== "object" ||
                typeof p.currentPage !== "number" ||
                p.currentPage < 1 ||
                typeof p.pageSize !== "number" ||
                p.pageSize < 1 ||
                typeof p.searchTerm !== "string"
              );
            } catch {
              return true;
            }
          }),
          fc.constant("{invalid-json"),
          fc.constant(JSON.stringify({ currentPage: 0, pageSize: 15, searchTerm: "" })),
          fc.constant(JSON.stringify({ currentPage: -3, pageSize: 15, searchTerm: "x" })),
          fc.constant(JSON.stringify({ currentPage: 1, pageSize: 0, searchTerm: "x" })),
          fc.constant(JSON.stringify({ currentPage: 1, pageSize: 15, searchTerm: 123 })),
        ),
        (corrupted) => {
          window.sessionStorage.setItem(SESSION_STORAGE_KEY, corrupted);
          expect(restoreSessionState()).toEqual({
            currentPage: DEFAULT_PAGE,
            pageSize: DEFAULT_PAGE_SIZE,
            searchTerm: DEFAULT_SEARCH_TERM,
          });
        },
      ),
      { numRuns: 100 },
    );
  });
});
