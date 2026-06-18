export const syntaxLanguageOptions = [
  { label: "TypeScript", value: "typescript", extension: "ts" },
  { label: "JavaScript", value: "javascript", extension: "js" },
  { label: "TSX", value: "tsx", extension: "tsx" },
  { label: "JSX", value: "jsx", extension: "jsx" },
  { label: "Python", value: "python", extension: "py" },
  { label: "Go", value: "go", extension: "go" },
  { label: "Rust", value: "rust", extension: "rs" },
  { label: "HTML", value: "html", extension: "html" },
  { label: "CSS", value: "css", extension: "css" },
  { label: "JSON", value: "json", extension: "json" },
  { label: "Markdown", value: "markdown", extension: "md" },
] as const;

export const languageOptions = [
  { label: "Auto", value: "auto", extension: "txt" },
  ...syntaxLanguageOptions,
] as const;

export type LanguageOption = (typeof languageOptions)[number];
export type CodeLanguage = LanguageOption["value"];
export type SyntaxLanguage = (typeof syntaxLanguageOptions)[number]["value"];

export const themeOptions = [
  { label: "SourceShot Light", value: "light", codeTheme: "vitesse-light" },
  { label: "SourceShot Dark", value: "dark", codeTheme: "vitesse-dark" },
] as const;

export type ThemeOption = (typeof themeOptions)[number];
export type AppTheme = ThemeOption["value"];
export type CodeTheme = ThemeOption["codeTheme"];

export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return languageOptions.some((language) => language.value === value);
}

export function isAppTheme(value: string | null): value is AppTheme {
  return themeOptions.some((theme) => theme.value === value);
}

export function getThemeOption(theme: AppTheme) {
  return themeOptions.find((themeOption) => themeOption.value === theme) ?? themeOptions[0];
}
