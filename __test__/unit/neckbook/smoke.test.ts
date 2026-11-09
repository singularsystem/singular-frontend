import fs from "fs";
import path from "path";
import { ADMIN_ROLE } from "@/source/infrastructure/common/config/roles";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/source/view/components/neckbook/PageSizeSelector";

const FRONTEND_ROOT = path.resolve(__dirname, "../../..");

describe("Smoke tests de configuração e estrutura estática (Task 13.1)", () => {
  it("mantém ADMIN_ROLE como constante única em roles.ts sem repetir a literal 'ADMIN' nos demais arquivos da feature", () => {
    expect(ADMIN_ROLE).toBe("ADMIN");

    const rolesFile = path.join(
      FRONTEND_ROOT,
      "source/infrastructure/common/config/roles.ts",
    );
    expect(fs.existsSync(rolesFile)).toBe(true);

    const featureFilesToCheck = [
      "app/admin/neckbook-cotas/page.tsx",
      "app/api/neckbook/admin/_lib/forward.ts",
      "source/view/screens/neckbook/MunicipiosCotasScreen.tsx",
      "source/view/hooks/neckbook/useMunicipiosCotas.ts",
      "source/view-model/neckbook/MunicipiosCotasViewModel.ts",
      "source/infrastructure/neckbook/NeckbookAdminRepositoryImpl.ts",
      "components/dashboard-nav.tsx",
    ];

    for (const rel of featureFilesToCheck) {
      const fullPath = path.join(FRONTEND_ROOT, rel);
      const content = fs.readFileSync(fullPath, "utf-8");
      expect(content).not.toMatch(/["']ADMIN["']/);
    }
  });

  it("possui todos os arquivos exigidos pela estrutura MVVM e route handlers do Backend_Proxy", () => {
    const requiredPaths = [
      "source/model/entities/neckbook/NeckbookEntity.ts",
      "source/model/repositories/neckbook/INeckbookAdminRepository.ts",
      "source/infrastructure/neckbook/NeckbookAdminAdapter.ts",
      "source/infrastructure/neckbook/NeckbookAdminErrorParser.ts",
      "source/infrastructure/neckbook/NeckbookAdminRepositoryImpl.ts",
      "source/view-model/neckbook/MunicipiosCotasViewModel.ts",
      "source/view/hooks/neckbook/useMunicipiosCotas.ts",
      "source/view/screens/neckbook/MunicipiosCotasScreen.tsx",
      "source/view/components/neckbook/MunicipiosTable.tsx",
      "source/view/components/neckbook/PageSizeSelector.tsx",
      "source/view/components/neckbook/MunicipioFormDialog.tsx",
      "source/view/components/neckbook/GenerateApiKeyModal.tsx",
      "source/view/components/neckbook/ApiKeysDialog.tsx",
      "source/view/components/neckbook/EmptyState.tsx",
      "source/view/components/neckbook/ErrorBanner.tsx",
      "app/admin/neckbook-cotas/page.tsx",
      "app/api/neckbook/admin/_lib/forward.ts",
      "app/api/neckbook/admin/municipalities/route.ts",
      "app/api/neckbook/admin/municipalities/[id]/route.ts",
      "app/api/neckbook/admin/municipalities/[id]/api-keys/route.ts",
      "app/api/neckbook/admin/municipalities/[id]/api-keys/[keyId]/route.ts",
    ];

    for (const rel of requiredPaths) {
      expect(fs.existsSync(path.join(FRONTEND_ROOT, rel))).toBe(true);
    }
  });

  it("configura o seletor de itens por página com as opções [10, 15, 30, 50] e default 15", () => {
    expect(Array.from(PAGE_SIZE_OPTIONS)).toEqual([10, 15, 30, 50]);
    expect(DEFAULT_PAGE_SIZE).toBe(15);
  });

  it("não expõe NECKBOOK_ADMIN_KEY nem variáveis NEXT_PUBLIC_*ADMIN* em env.ts ou nos componentes da View", () => {
    const envFileContent = fs.readFileSync(
      path.join(FRONTEND_ROOT, "source/infrastructure/common/config/env.ts"),
      "utf-8",
    );
    expect(envFileContent).not.toContain("NECKBOOK_ADMIN_KEY");
    expect(envFileContent).not.toContain("NECKBOOK_API_URL");
    expect(envFileContent).not.toMatch(/NEXT_PUBLIC_.*ADMIN/i);

    const screenContent = fs.readFileSync(
      path.join(
        FRONTEND_ROOT,
        "source/view/screens/neckbook/MunicipiosCotasScreen.tsx",
      ),
      "utf-8",
    );
    expect(screenContent).not.toContain("NECKBOOK_ADMIN_KEY");
    expect(screenContent).not.toMatch(/NEXT_PUBLIC_.*ADMIN/i);
    expect(screenContent).toContain("useMunicipiosCotas");
  });
});
