import { languageOptions, syntaxLanguageOptions } from "@sourceshot/core";
import { describe, expect, it } from "vite-plus/test";
import { inferLanguage } from "./infer-language.ts";

describe("syntaxLanguageOptions", () => {
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
    expect(inferLanguage("auto", ".env")).toBe("auto");
  });

  // `.m` is Objective-C's, so MATLAB is only ever picked explicitly or by alias.
  it.each(syntaxLanguageOptions.filter((option) => option.value !== "matlab"))(
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
    ["view.m", "objc"],
    ["view.mm", "objc"],
    ["types.mli", "ocaml"],
    ["boot.s", "asm"],
    ["kernel.cuh", "cuda"],
    ["main.tscn", "gdresource"],
    ["legacy.f77", "fortran-fixed-form"],
    ["src/app/app.component.html", "angular-html"],
    ["page.html", "html"],
  ] as const)("maps %s to %s", (file, language) => {
    expect(inferLanguage("auto", file)).toBe(language);
  });

  it.each([
    ["Dockerfile", "dockerfile"],
    ["deploy/Dockerfile.prod", "dockerfile"],
    ["Makefile", "makefile"],
    ["GNUmakefile", "makefile"],
    ["Gemfile", "ruby"],
    ["Rakefile", "ruby"],
    ["CMakeLists.txt", "cmake"],
    ["Containerfile", "dockerfile"],
  ] as const)("maps the well-known filename %s to %s", (file, language) => {
    expect(inferLanguage("auto", file)).toBe(language);
  });
});
