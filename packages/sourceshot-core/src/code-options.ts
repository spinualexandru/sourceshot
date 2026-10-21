import { appThemeDefinitions } from "./theme-definitions.ts";

/**
 * Every language kirari ships, sorted by label. Values are kirari's export names; they
 * appear in shared `#lang=` links and CLI flags, so never rename one.
 */
export const syntaxLanguageOptions = [
  { label: "C", value: "c", extension: "c" },
  { label: "C#", value: "csharp", extension: "cs" },
  { label: "C++", value: "cpp", extension: "cpp" },
  { label: "Clojure", value: "clojure", extension: "clj" },
  { label: "CSS", value: "css", extension: "css" },
  { label: "Dart", value: "dart", extension: "dart" },
  { label: "Diff", value: "diff", extension: "diff" },
  { label: "Dockerfile", value: "dockerfile", extension: "dockerfile" },
  { label: "Dotenv", value: "dotenv", extension: "env" },
  { label: "Elixir", value: "elixir", extension: "ex" },
  { label: "GLSL", value: "glsl", extension: "glsl" },
  { label: "Go", value: "go", extension: "go" },
  { label: "GraphQL", value: "graphql", extension: "graphql" },
  { label: "Groovy", value: "groovy", extension: "groovy" },
  { label: "HCL", value: "hcl", extension: "hcl" },
  { label: "HTML", value: "html", extension: "html" },
  { label: "INI", value: "ini", extension: "ini" },
  { label: "Java", value: "java", extension: "java" },
  { label: "JavaScript", value: "javascript", extension: "js" },
  { label: "JSON", value: "json", extension: "json" },
  { label: "JSONC", value: "jsonc", extension: "jsonc" },
  { label: "JSX", value: "jsx", extension: "jsx" },
  { label: "Julia", value: "julia", extension: "jl" },
  { label: "Kotlin", value: "kotlin", extension: "kt" },
  { label: "Lua", value: "lua", extension: "lua" },
  { label: "Makefile", value: "makefile", extension: "mk" },
  { label: "Markdown", value: "markdown", extension: "md" },
  { label: "Nginx", value: "nginx", extension: "conf" },
  { label: "PHP", value: "php", extension: "php" },
  { label: "Plain text", value: "plaintext", extension: "txt" },
  { label: "PowerShell", value: "powershell", extension: "ps1" },
  { label: "Protocol Buffers", value: "protobuf", extension: "proto" },
  { label: "Python", value: "python", extension: "py" },
  { label: "R", value: "r", extension: "r" },
  { label: "Ruby", value: "ruby", extension: "rb" },
  { label: "Rust", value: "rust", extension: "rs" },
  { label: "Scala", value: "scala", extension: "scala" },
  { label: "Shell", value: "shell", extension: "sh" },
  { label: "SQL", value: "sql", extension: "sql" },
  { label: "Svelte", value: "svelte", extension: "svelte" },
  { label: "Swift", value: "swift", extension: "swift" },
  { label: "TOML", value: "toml", extension: "toml" },
  { label: "TSX", value: "tsx", extension: "tsx" },
  { label: "TypeScript", value: "typescript", extension: "ts" },
  { label: "Vue", value: "vue", extension: "vue" },
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
