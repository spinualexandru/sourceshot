import { languageOptions, syntaxLanguageOptions } from "@sourceshot/core";
import * as languages from "@vortexlabs/kirari/languages";
import { describe, expect, it } from "vite-plus/test";
import { inferLanguage } from "./infer-language.ts";

describe("syntaxLanguageOptions", () => {
  it("offers exactly the languages kirari ships", () => {
    const values = syntaxLanguageOptions.map((option) => option.value).toSorted();

    expect(values).toEqual(Object.keys(languages).toSorted());
  });

  it("lists Auto first, then the rest sorted by label", () => {
    const labels = syntaxLanguageOptions.map((option) => option.label);
    const sorted = labels.toSorted((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    expect(languageOptions[0].value).toBe("auto");
    expect(labels).toEqual(sorted);
  });
});

describe("inferLanguage", () => {
  it("keeps an explicit language", () => {
    expect(inferLanguage("rust", "main.py")).toBe("rust");
  });

  it("stays on auto without a file", () => {
    expect(inferLanguage("auto", undefined)).toBe("auto");
  });

  it("falls back to auto for unknown files", () => {
    expect(inferLanguage("auto", "photo.png")).toBe("auto");
    expect(inferLanguage("auto", "README")).toBe("auto");
  });

  it.each(syntaxLanguageOptions.filter((option) => option.value !== "nginx"))(
    "maps the .$extension extension to $value",
    ({ extension, value }) => {
      expect(inferLanguage("auto", `src/sample.${extension}`)).toBe(value);
    },
  );

  it.each([
    ["app.mjs", "javascript"],
    ["app.cjs", "javascript"],
    ["mod.mts", "typescript"],
    ["mod.cts", "typescript"],
    ["index.htm", "html"],
    ["notes.markdown", "markdown"],
    ["settings.jsonc", "jsonc"],
    ["config.yml", "yaml"],
    ["header.h", "c"],
    ["main.hpp", "cpp"],
    ["main.tf", "hcl"],
    ["build.gradle", "groovy"],
    ["script.bash", "shell"],
    ["schema.gql", "graphql"],
    ["fix.patch", "diff"],
    ["icon.svg", "xml"],
    ["SHADER.FRAG", "glsl"],
  ] as const)("maps %s to %s", (file, language) => {
    expect(inferLanguage("auto", file)).toBe(language);
  });

  it.each([
    ["Dockerfile", "dockerfile"],
    ["deploy/Dockerfile.prod", "dockerfile"],
    ["Makefile", "makefile"],
    ["GNUmakefile", "makefile"],
    [".env", "dotenv"],
    [".env.local", "dotenv"],
    ["/etc/nginx/nginx.conf", "nginx"],
    ["Gemfile", "ruby"],
    ["Rakefile", "ruby"],
  ] as const)("maps the well-known filename %s to %s", (file, language) => {
    expect(inferLanguage("auto", file)).toBe(language);
  });
});
