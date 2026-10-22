import { appThemeDefinitions } from "./theme-definitions.ts";

/**
 * The languages SourceShot offers, sorted by label. Values are Highlights language names
 * (`toHighlightLanguage` checks this); they appear in shared `#lang=` links and CLI flags,
 * so never rename one.
 */
export const syntaxLanguageOptions = [
  { label: "Angular HTML", value: "angular-html", extension: "component.html" },
  { label: "Assembly", value: "asm", extension: "asm" },
  { label: "Astro", value: "astro", extension: "astro" },
  { label: "Batch", value: "batch", extension: "bat" },
  { label: "C", value: "c", extension: "c" },
  { label: "C#", value: "csharp", extension: "cs" },
  { label: "C++", value: "cpp", extension: "cpp" },
  { label: "C3", value: "c3", extension: "c3" },
  { label: "Clojure", value: "clojure", extension: "clj" },
  { label: "CMake", value: "cmake", extension: "cmake" },
  { label: "CSS", value: "css", extension: "css" },
  { label: "CUDA", value: "cuda", extension: "cu" },
  { label: "Dart", value: "dart", extension: "dart" },
  { label: "Diff", value: "diff", extension: "diff" },
  { label: "Dockerfile", value: "dockerfile", extension: "dockerfile" },
  { label: "Elixir", value: "elixir", extension: "ex" },
  { label: "Elm", value: "elm", extension: "elm" },
  { label: "Erlang", value: "erlang", extension: "erl" },
  { label: "F#", value: "fsharp", extension: "fs" },
  { label: "Fortran", value: "fortran", extension: "f90" },
  { label: "Fortran (fixed form)", value: "fortran-fixed-form", extension: "f" },
  { label: "GDScript", value: "gdscript", extension: "gd" },
  { label: "Gleam", value: "gleam", extension: "gleam" },
  { label: "GLSL", value: "glsl", extension: "glsl" },
  { label: "Go", value: "go", extension: "go" },
  { label: "Godot Resource", value: "gdresource", extension: "tres" },
  { label: "Godot Shader", value: "gdshader", extension: "gdshader" },
  { label: "GraphQL", value: "graphql", extension: "graphql" },
  { label: "Groovy", value: "groovy", extension: "groovy" },
  { label: "Haskell", value: "haskell", extension: "hs" },
  { label: "HCL", value: "hcl", extension: "hcl" },
  { label: "HLSL", value: "hlsl", extension: "hlsl" },
  { label: "HTML", value: "html", extension: "html" },
  { label: "Java", value: "java", extension: "java" },
  { label: "JavaScript", value: "javascript", extension: "js" },
  { label: "JSON", value: "json", extension: "json" },
  { label: "JSON Lines", value: "jsonl", extension: "jsonl" },
  { label: "JSON5", value: "json5", extension: "json5" },
  { label: "JSONC", value: "jsonc", extension: "jsonc" },
  { label: "JSX", value: "jsx", extension: "jsx" },
  { label: "Julia", value: "julia", extension: "jl" },
  { label: "Kotlin", value: "kotlin", extension: "kt" },
  { label: "LaTeX", value: "latex", extension: "tex" },
  { label: "Less", value: "less", extension: "less" },
  { label: "Lisp", value: "lisp", extension: "lisp" },
  { label: "Lua", value: "lua", extension: "lua" },
  { label: "Makefile", value: "makefile", extension: "mk" },
  { label: "Markdown", value: "markdown", extension: "md" },
  { label: "MATLAB", value: "matlab", extension: "m" },
  { label: "MDX", value: "mdx", extension: "mdx" },
  { label: "Nim", value: "nim", extension: "nim" },
  { label: "Nix", value: "nix", extension: "nix" },
  { label: "Objective-C", value: "objc", extension: "m" },
  { label: "OCaml", value: "ocaml", extension: "ml" },
  { label: "Pascal", value: "pascal", extension: "pas" },
  { label: "Perl", value: "perl", extension: "pl" },
  { label: "PHP", value: "php", extension: "php" },
  { label: "Plain text", value: "plaintext", extension: "txt" },
  { label: "PowerShell", value: "powershell", extension: "ps1" },
  { label: "Protocol Buffers", value: "protobuf", extension: "proto" },
  { label: "Python", value: "python", extension: "py" },
  { label: "R", value: "r", extension: "r" },
  { label: "Ruby", value: "ruby", extension: "rb" },
  { label: "Rust", value: "rust", extension: "rs" },
  { label: "Sass", value: "sass", extension: "sass" },
  { label: "Scala", value: "scala", extension: "scala" },
  { label: "SCSS", value: "scss", extension: "scss" },
  { label: "Shell", value: "shell", extension: "sh" },
  { label: "Solidity", value: "solidity", extension: "sol" },
  { label: "SQL", value: "sql", extension: "sql" },
  { label: "Svelte", value: "svelte", extension: "svelte" },
  { label: "Swift", value: "swift", extension: "swift" },
  { label: "TOML", value: "toml", extension: "toml" },
  { label: "TSRX", value: "tsrx", extension: "tsrx" },
  { label: "TSX", value: "tsx", extension: "tsx" },
  { label: "TypeScript", value: "typescript", extension: "ts" },
  { label: "Vue", value: "vue", extension: "vue" },
  { label: "WebAssembly Text", value: "wat", extension: "wat" },
  { label: "WGSL", value: "wgsl", extension: "wgsl" },
  { label: "XML", value: "xml", extension: "xml" },
  { label: "YAML", value: "yaml", extension: "yaml" },
  { label: "Zig", value: "zig", extension: "zig" },
] as const;

export const languageOptions = [
  { label: "Auto", value: "auto", extension: "txt" },
  ...syntaxLanguageOptions,
] as const;

export type LanguageOption = (typeof languageOptions)[number];
export type CodeLanguage = LanguageOption["value"];
export type SyntaxLanguage = (typeof syntaxLanguageOptions)[number]["value"];

export const themeOptions = appThemeDefinitions.map(({ codeTheme, label, value }) => ({
  codeTheme,
  label,
  value,
}));

export type ThemeOption = (typeof themeOptions)[number];
export type AppTheme = ThemeOption["value"];
export type CodeTheme = ThemeOption["codeTheme"];

export const defaultTheme = "mono" satisfies AppTheme;

export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return languageOptions.some((language) => language.value === value);
}

export function isAppTheme(value: string | null): value is AppTheme {
  return themeOptions.some((theme) => theme.value === value);
}

export function getThemeOption(theme: AppTheme) {
  const defaultThemeOption =
    themeOptions.find((themeOption) => themeOption.value === defaultTheme) ?? themeOptions[0];

  return themeOptions.find((themeOption) => themeOption.value === theme) ?? defaultThemeOption;
}
