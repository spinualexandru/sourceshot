import { type CodeLanguage, languageOptions } from "@sourceshot/core";
import { extname } from "node:path";

const byExtension = new Map<string, CodeLanguage>(
  languageOptions
    .filter((option) => option.value !== "auto")
    .map((option) => [option.extension, option.value]),
);

/** Extensions the single-extension option list cannot express. */
const aliases = new Map<string, CodeLanguage>([
  ["mjs", "javascript"],
  ["cjs", "javascript"],
  ["mts", "typescript"],
  ["cts", "typescript"],
  ["htm", "html"],
  ["jsonc", "json"],
  ["markdown", "markdown"],
]);

/**
 * Returns "auto" when the extension is unknown, letting shiki's content-based
 * detection take over inside `renderCodeTokens`.
 */
export function inferLanguage(requested: CodeLanguage, file: string | undefined): CodeLanguage {
  if (requested !== "auto" || !file) {
    return requested;
  }

  const extension = extname(file).slice(1).toLowerCase();
  return byExtension.get(extension) ?? aliases.get(extension) ?? "auto";
}
