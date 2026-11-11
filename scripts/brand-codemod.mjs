import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");

// Carregar lib/brand/legacy-colors.ts usando typescript.transpileModule
const legacyColorsTsPath = path.join(frontendRoot, "lib", "brand", "legacy-colors.ts");
const legacyColorsSource = fs.readFileSync(legacyColorsTsPath, "utf-8");
const transpiled = ts.transpileModule(legacyColorsSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

// Executar código transpilado em sandbox básico
const moduleExports = {};
const evaluateModule = new Function("exports", transpiled.outputText);
evaluateModule(moduleExports);

const { replaceLegacyColors } = moduleExports;

const TARGET_DIRS = ["app", "components", "source", "lib", "styles", "contexts", "hooks"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git"
      ) {
        continue;
      }
      walkDir(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.has(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

console.log("=== Iniciando Brand Color Codemod ===");

const allFiles = [];
for (const relDir of TARGET_DIRS) {
  const fullDir = path.join(frontendRoot, relDir);
  walkDir(fullDir, allFiles);
}

let modifiedFilesCount = 0;
const allManualReviews = [];

for (const filePath of allFiles) {
  const relPath = path.relative(frontendRoot, filePath);
  // Não alterar o próprio legacy-colors.ts nem contrast-pairs.ts
  if (relPath.includes("legacy-colors") || relPath.includes("contrast-pairs")) {
    continue;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const { output, manualReview } = replaceLegacyColors(content, relPath);

  if (output !== content) {
    fs.writeFileSync(filePath, output, "utf-8");
    modifiedFilesCount++;
    console.log(`[Modificado] ${relPath}`);
  }

  if (manualReview.length > 0) {
    allManualReviews.push(...manualReview);
  }
}

console.log(`\nCodemod concluído: ${modifiedFilesCount} arquivos modificados de ${allFiles.length} analisados.`);
console.log(`Itens de revisão manual encontrados: ${allManualReviews.length}`);

if (allManualReviews.length > 0) {
  console.log("\n--- Itens para Revisão Manual ---");
  allManualReviews.forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.file}${item.line ? `:${item.line}` : ""}] ${item.reason}`);
    if (item.snippet) {
      console.log(`   Trecho: ${item.snippet.slice(0, 100)}`);
    }
  });
}
