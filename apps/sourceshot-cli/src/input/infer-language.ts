import { type CodeLanguage, type SyntaxLanguage, syntaxLanguageOptions } from "@sourceshot/core";

/**
 * Extensions and well-known filenames beyond each language's own value and its
 * `extension`. Keys are lowercase, without a leading dot. These win over `extension`,
 * which is how `.m` goes to Objective-C rather than MATLAB.
 */
const aliases: Partial<Record<SyntaxLanguage, readonly string[]>> = {
  asm: ["s"],
  batch: ["cmd"],
  c: ["h"],
  clojure: ["cljs", "cljc", "edn"],
  cmake: ["cmakelists.txt"],
  cpp: ["cc", "cxx", "hpp", "hh", "hxx"],
  cuda: ["cuh"],
  diff: ["patch"],
  dockerfile: ["containerfile"],
  elixir: ["exs"],
  erlang: ["hrl"],
  fortran: ["f95", "f03", "f08"],
  "fortran-fixed-form": ["for", "f77"],
  fsharp: ["fsi", "fsx"],
  gdresource: ["tscn"],
  gdshader: ["gdshaderinc"],
  glsl: ["vert", "frag", "geom", "comp", "tesc", "tese"],
  graphql: ["gql"],
  groovy: ["gradle"],
  hcl: ["tf", "tfvars"],
  html: ["htm"],
  javascript: ["mjs", "cjs"],
  kotlin: ["kts"],
  lisp: ["cl", "el", "lsp", "scm"],
  makefile: ["make", "gnumakefile"],
  markdown: ["markdown", "mdown"],
  nim: ["nims", "nimble"],
  objc: ["m", "mm"],
  ocaml: ["mli"],
  pascal: ["dpr", "lpr"],
  perl: ["pm"],
  php: ["phtml"],
  powershell: ["psm1", "psd1"],
  python: ["pyw", "pyi"],
  ruby: ["rake", "gemspec", "gemfile", "rakefile"],
  scala: ["sc"],
  shell: ["bash", "zsh", "ksh", "bashrc", "zshrc"],
  typescript: ["mts", "cts"],
  wat: ["wast"],
  xml: ["xsl", "xsd", "svg"],
  yaml: ["yml"],
};

const lookup = new Map<string, SyntaxLanguage>();
for (const { extension, value } of syntaxLanguageOptions) {
  lookup.set(value, value);
  lookup.set(extension, value);
}
for (const { value } of syntaxLanguageOptions) {
  for (const alias of aliases[value] ?? []) {
    lookup.set(alias, value);
  }
}

/**
 * Returns "auto" when the file is unknown, letting the content-based
 * detection take over inside `renderCodeTokens`.
 */
export function inferLanguage(requested: CodeLanguage, file: string | undefined): CodeLanguage {
  if (requested !== "auto" || !file) {
    return requested;
  }

  const name = (file.split(/[/\\]/).pop() ?? "").toLowerCase().replace(/^\./, "");
  if (name.startsWith("dockerfile.")) {
    return "dockerfile";
  }

  // The whole name first (`gemfile`), then ever shorter suffixes, so a compound
  // extension (`component.html`) beats the plain one (`html`).
  for (let suffix = name; ; suffix = suffix.slice(suffix.indexOf(".") + 1)) {
    const language = lookup.get(suffix);
    if (language) {
      return language;
    }
    if (!suffix.includes(".")) {
      return "auto";
    }
  }
}
