import { type CodeLanguage, isCodeLanguage } from "@sourceshot/core";
import * as languages from "@vortexlabs/kirari/languages";
import { createRegistry } from "@vortexlabs/kirari/registry";

/**
 * Kirari's registry knows every grammar's extensions and well-known filenames
 * (`Dockerfile`, `Makefile`, `.env`, `nginx.conf`, ...). Its language names are the
 * same strings SourceShot uses as language values.
 */
const registry = createRegistry(Object.values(languages));

/**
 * Returns "auto" when the file is unknown, letting the content-based
 * detection take over inside `renderCodeTokens`.
 */
export function inferLanguage(requested: CodeLanguage, file: string | undefined): CodeLanguage {
  if (requested !== "auto" || !file) {
    return requested;
  }

  const name = registry.resolve(file)?.name ?? null;
  return isCodeLanguage(name) ? name : "auto";
}
