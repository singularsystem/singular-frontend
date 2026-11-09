import fc from "fast-check";
import {
  ALLOWED_PAGE_SIZES,
  MunicipiosCotasViewModel,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";
import type { INeckbookAdminRepository } from "@/source/model/repositories/neckbook/INeckbookAdminRepository";

const noopRepo = {} as INeckbookAdminRepository;

describe("Property 2: Transições de paginação e busca", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 2: Transições de paginação e busca
  it("setPageSize atualiza pageSize e reinicia currentPage=1; setPage atualiza currentPage; setSearchTerm reinicia currentPage=1 sse o termo mudou", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }),
        fc.constantFrom(...ALLOWED_PAGE_SIZES),
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.constantFrom(...ALLOWED_PAGE_SIZES),
        fc.integer({ min: 1, max: 500 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        (initPage, initSize, initSearch, nextSize, nextPage, nextSearch) => {
          const vm = new MunicipiosCotasViewModel(noopRepo);
          vm.setPageSize(initSize);
          vm.setSearchTerm(initSearch);
          vm.setPage(initPage);

          // (a) setPageSize(size) -> pageSize == size e currentPage == 1
          vm.setPageSize(nextSize);
          expect(vm.getState().pageSize).toBe(nextSize);
          expect(vm.getState().currentPage).toBe(1);

          // (b) setPage(page) -> currentPage == page
          vm.setPage(nextPage);
          expect(vm.getState().currentPage).toBe(nextPage);

          // (c1) setSearchTerm com o mesmo termo -> estado inalterado
          const beforeSame = vm.getState();
          vm.setSearchTerm(initSearch);
          expect(vm.getState()).toBe(beforeSame);
          expect(vm.getState().currentPage).toBe(nextPage);

          // (c2) setSearchTerm com termo distinto -> searchTerm == nextSearch e currentPage == 1
          if (nextSearch !== initSearch) {
            vm.setSearchTerm(nextSearch);
            expect(vm.getState().searchTerm).toBe(nextSearch);
            expect(vm.getState().currentPage).toBe(1);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
