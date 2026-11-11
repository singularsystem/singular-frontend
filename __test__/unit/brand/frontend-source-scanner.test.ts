import fs from "fs";
import path from "path";
import { scan, BrandException } from "@/lib/brand/legacy-scanner";

/**
 * Feature: modulo-2-rebranding-pdfs, Task 3.7
 * Teste de regressão do scanner no Frontend que percorre o código-fonte e falha
 * em qualquer Termo_Legado ou hex da Paleta_Legada fora da Lista_Excecoes.
 * Validates: Requirements 17.1, 17.2, 18.2
 */
describe("Feature: modulo-2-rebranding-pdfs, Task 3.7 - Scanner de Regressão Frontend", () => {
  const rootDir = path.resolve(__dirname, "../../../");
  const exceptionsFile = path.join(rootDir, "brand-exceptions.json");
  const exceptions: BrandException[] = JSON.parse(
    fs.readFileSync(exceptionsFile, "utf-8")
  );

  function walkDirectory(dir: string): string[] {
    let files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === ".next" ||
          entry.name === "build" ||
          entry.name === ".git" ||
          entry.name === "__test__"
        ) {
          continue;
        }
        files = files.concat(walkDirectory(fullPath));
      } else if (
        /\.(ts|tsx|js|jsx|json|css|html)$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts")
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  test("nenhum arquivo fonte do Frontend contém termos ou cores legadas fora da Lista_Excecoes", () => {
    const targetDirs = [
      "app",
      "components",
      "source",
      "lib",
      "hooks",
      "contexts",
      "styles",
      "public/data",
    ];

    const violations: ReturnType<typeof scan> = [];

    for (const dirName of targetDirs) {
      const fullDirPath = path.join(rootDir, dirName);
      if (!fs.existsSync(fullDirPath)) continue;

      const files = walkDirectory(fullDirPath);
      for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");
        const relativePath = path.relative(rootDir, file).replace(/\\/g, "/");
        const fileViolations = scan(content, relativePath, exceptions);
        violations.push(...fileViolations);
      }
    }

    if (violations.length > 0) {
      console.error(
        "Violações encontradas no Frontend:",
        JSON.stringify(violations, null, 2)
      );
    }

    expect(violations).toEqual([]);
  });
});
