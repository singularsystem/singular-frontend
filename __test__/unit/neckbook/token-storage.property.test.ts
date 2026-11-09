import fc from "fast-check";
import {
  ALLOWED_PAGE_SIZES,
  MunicipiosCotasViewModel,
  SESSION_STORAGE_KEY,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";
import type { INeckbookAdminRepository } from "@/source/model/repositories/neckbook/INeckbookAdminRepository";

describe("Property 6: Token de API nunca persiste em storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  // Feature: neckbook-municipios-cotas-admin, Property 6: Token de API nunca persiste em storage
  it("nenhum sessionStorage ou localStorage contém o Api_Key_Token gerado e a chave da sessão contém apenas currentPage, pageSize e searchTerm", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .string({ minLength: 16, maxLength: 80 })
          .filter((t) => t.trim().length >= 16),
        fc.integer({ min: 1, max: 100 }),
        fc.constantFrom(...ALLOWED_PAGE_SIZES),
        fc
          .string({ minLength: 0, maxLength: 30 })
          .filter((s) => s.length < 10),
        async (secretToken, page, pageSize, searchTerm) => {
          window.sessionStorage.clear();
          window.localStorage.clear();

          const repo: INeckbookAdminRepository = {
            listMunicipios: jest.fn(),
            createMunicipio: jest.fn(),
            updateMunicipio: jest.fn(),
            listApiKeys: jest.fn(),
            generateApiKey: jest.fn().mockResolvedValue({
              key: {
                id: "key-1",
                maskedKey: "nbk_...1234",
                isActive: true,
                createdAt: "2026-10-28T00:00:00Z",
                description: null,
              },
              token: secretToken,
            }),
            toggleApiKey: jest.fn(),
            revokeApiKey: jest.fn(),
          };

          const vm = new MunicipiosCotasViewModel(repo);
          await vm.generateApiKey("mun-1");

          expect(vm.getState().generatedToken).toBe(secretToken);

          // Executar transições subsequentes que persistem no sessionStorage
          vm.setPage(page);
          vm.setPageSize(pageSize);
          vm.setSearchTerm(searchTerm);

          for (let i = 0; i < window.sessionStorage.length; i++) {
            const k = window.sessionStorage.key(i)!;
            const v = window.sessionStorage.getItem(k) ?? "";
            expect(v).not.toContain(secretToken);
          }

          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i)!;
            const v = window.localStorage.getItem(k) ?? "";
            expect(v).not.toContain(secretToken);
          }

          const rawSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
          expect(rawSession).not.toBeNull();
          const parsedSession = JSON.parse(rawSession!);
          expect(Object.keys(parsedSession).sort()).toEqual([
            "currentPage",
            "pageSize",
            "searchTerm",
          ]);
        },
      ),
      { numRuns: 100 },
    );
  });
});
