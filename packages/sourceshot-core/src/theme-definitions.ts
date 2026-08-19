import type { ThemeRegistration } from "shiki/core";

const sourceShotMonoVariables = {
  "--text": "#4f554f",
  "--text-h": "#222323",
  "--bg": "#f0f6f0",
  "--bg-glow-warm": "#f8fff8",
  "--bg-glow-rose": "#dbe2db",
  "--bg-glow-violet": "#626862",
  "--bg-glow-light": "#ffffff",
  "--bg-noise-opacity": "0.44",
  "--border": "#cdd6cd",
  "--code-bg": "#eef4ee",
  "--accent": "#222323",
  "--accent-bg": "rgba(34, 35, 35, 0.08)",
  "--accent-border": "rgba(34, 35, 35, 0.46)",
  "--social-bg": "rgba(240, 246, 240, 0.58)",
  "--shadow": "rgba(34, 35, 35, 0.16) 0 14px 28px -8px, rgba(34, 35, 35, 0.08) 0 6px 12px -4px",
  "--brand-title": "#222323",
  "--glass": "#f0f6f0",
  "--glass-light": "#ffffff",
  "--glass-dark": "#222323",
  "--glass-reflex-dark": "1.18",
  "--glass-reflex-light": "0.82",
  "--glass-saturation": "0%",
  "--code-container-border": "#f0f6f0",
  "--code-container-bg": "#edf3ed",
  "--code-container-fill-start": "50%",
  "--code-container-fill-mid": "18%",
  "--code-container-shine": "34%",
  "--code-container-top-reflex": "40%",
  "--code-container-border-start": "84%",
  "--code-container-border-end": "70%",
  "--code-container-overlay-opacity": "0.5",
} as const;

type ThemeCssVariableName = keyof typeof sourceShotMonoVariables;
export type ThemeCssVariables = Readonly<Record<ThemeCssVariableName, string>>;

const sourceShotMonoDarkVariables = {
  "--text": "#d7ded7",
  "--text-h": "#f0f6f0",
  "--bg": "#222323",
  "--bg-glow-warm": "#f0f6f0",
  "--bg-glow-rose": "#3d403d",
  "--bg-glow-violet": "#111212",
  "--bg-glow-light": "#697069",
  "--bg-noise-opacity": "0.36",
  "--border": "#444944",
  "--code-bg": "#1f2020",
  "--accent": "#f0f6f0",
  "--accent-bg": "rgba(240, 246, 240, 0.1)",
  "--accent-border": "rgba(240, 246, 240, 0.48)",
  "--social-bg": "rgba(34, 35, 35, 0.58)",
  "--shadow": "rgba(0, 0, 0, 0.52) 0 16px 34px -8px, rgba(0, 0, 0, 0.34) 0 6px 12px -4px",
  "--brand-title": "#f7fff7",
  "--glass": "#303431",
  "--glass-light": "#f0f6f0",
  "--glass-dark": "#000000",
  "--glass-reflex-dark": "1.9",
  "--glass-reflex-light": "0.34",
  "--glass-saturation": "0%",
  "--code-container-border": "#3d403d",
  "--code-container-bg": "#171a18",
  "--code-container-fill-start": "78%",
  "--code-container-fill-mid": "44%",
  "--code-container-shine": "12%",
  "--code-container-top-reflex": "18%",
  "--code-container-border-start": "58%",
  "--code-container-border-end": "44%",
  "--code-container-overlay-opacity": "0.48",
} as const satisfies ThemeCssVariables;

const sourceShotPeachVariables = {
  "--text": "#7a403b",
  "--text-h": "#4f2527",
  "--bg": "#f5ebe7",
  "--bg-glow-warm": "#ffd4c5",
  "--bg-glow-rose": "#fb6838",
  "--bg-glow-violet": "#b94743",
  "--bg-glow-light": "#fffaf8",
  "--bg-noise-opacity": "0.46",
  "--border": "#edc6be",
  "--code-bg": "#fff8f5",
  "--accent": "#b94743",
  "--accent-bg": "rgba(185, 71, 67, 0.1)",
  "--accent-border": "rgba(185, 71, 67, 0.44)",
  "--social-bg": "rgba(255, 248, 245, 0.62)",
  "--shadow": "rgba(79, 37, 39, 0.18) 0 16px 34px -8px, rgba(122, 64, 59, 0.1) 0 6px 12px -4px",
  "--brand-title": "#4f2527",
  "--glass": "#f7cfc5",
  "--glass-light": "#fffaf8",
  "--glass-dark": "#6a292c",
  "--glass-reflex-dark": "1.28",
  "--glass-reflex-light": "0.88",
  "--glass-saturation": "172%",
  "--code-container-border": "#fff8f5",
  "--code-container-bg": "#fff8f5",
  "--code-container-fill-start": "54%",
  "--code-container-fill-mid": "24%",
  "--code-container-shine": "42%",
  "--code-container-top-reflex": "44%",
  "--code-container-border-start": "92%",
  "--code-container-border-end": "82%",
  "--code-container-overlay-opacity": "0.58",
} as const satisfies ThemeCssVariables;

const sourceShotOceanVariables = {
  "--text": "#315176",
  "--text-h": "#142b57",
  "--bg": "#d2ebed",
  "--bg-glow-warm": "#8ac8dd",
  "--bg-glow-rose": "#4196c3",
  "--bg-glow-violet": "#3d5c9c",
  "--bg-glow-light": "#f3feff",
  "--bg-noise-opacity": "0.48",
  "--border": "#9fcbd7",
  "--code-bg": "#e8f6f7",
  "--accent": "#3d5c9c",
  "--accent-bg": "rgba(61, 92, 156, 0.1)",
  "--accent-border": "rgba(61, 92, 156, 0.44)",
  "--social-bg": "rgba(232, 246, 247, 0.62)",
  "--shadow": "rgba(20, 43, 87, 0.18) 0 16px 34px -8px, rgba(49, 81, 118, 0.1) 0 6px 12px -4px",
  "--brand-title": "#142b57",
  "--glass": "#b7dce3",
  "--glass-light": "#f3feff",
  "--glass-dark": "#142b57",
  "--glass-reflex-dark": "1.3",
  "--glass-reflex-light": "0.9",
  "--glass-saturation": "164%",
  "--code-container-border": "#e8f6f7",
  "--code-container-bg": "#e8f6f7",
  "--code-container-fill-start": "54%",
  "--code-container-fill-mid": "24%",
  "--code-container-shine": "42%",
  "--code-container-top-reflex": "44%",
  "--code-container-border-start": "92%",
  "--code-container-border-end": "82%",
  "--code-container-overlay-opacity": "0.58",
} as const satisfies ThemeCssVariables;

function createCodeTheme({
  background,
  comment,
  displayName,
  foreground,
  functionName,
  keyword,
  literal,
  name,
  string,
  type,
  typeName,
}: {
  background: string;
  comment: string;
  displayName: string;
  foreground: string;
  functionName: string;
  keyword: string;
  literal: string;
  name: string;
  string: string;
  type: "light" | "dark";
  typeName: string;
}) {
  return {
    name,
    displayName,
    type,
    fg: foreground,
    bg: background,
    settings: [
      {
        settings: {
          foreground,
          background,
        },
      },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: {
          foreground: comment,
          fontStyle: "italic",
        },
      },
      {
        scope: ["keyword", "storage", "entity.name.tag"],
        settings: {
          foreground: keyword,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "keyword.operator",
          "keyword.operator.assignment",
          "keyword.operator.type",
          "storage.type.function.arrow",
        ],
        settings: {
          foreground: comment,
          fontStyle: "",
        },
      },
      {
        scope: [
          "entity.name.class",
          "entity.name.type",
          "entity.other.inherited-class",
          "support.class",
          "support.type",
        ],
        settings: {
          foreground: typeName,
          fontStyle: "bold",
        },
      },
      {
        scope: ["entity.name.function", "support.function", "variable.function"],
        settings: {
          foreground: functionName,
          fontStyle: "bold",
        },
      },
      {
        scope: ["string", "constant.character", "markup.inline.raw"],
        settings: {
          foreground: string,
        },
      },
      {
        scope: ["constant", "constant.language", "constant.numeric", "support.constant"],
        settings: {
          foreground: literal,
          fontStyle: "bold",
        },
      },
      {
        scope: ["punctuation", "meta.brace", "meta.delimiter"],
        settings: {
          foreground: comment,
        },
      },
    ],
  } satisfies ThemeRegistration;
}

export const customCodeThemes = {
  "sourceshot-mono": createCodeTheme({
    name: "sourceshot-mono",
    displayName: "Mono Light",
    type: "light",
    background: sourceShotMonoVariables["--bg"],
    foreground: "#252a27",
    comment: "#68736c",
    keyword: "#62486d",
    typeName: "#356455",
    functionName: "#3d5f83",
    string: "#8a5038",
    literal: "#705e20",
  }),
  "sourceshot-mono-dark": createCodeTheme({
    name: "sourceshot-mono-dark",
    displayName: "Mono Dark",
    type: "dark",
    background: sourceShotMonoDarkVariables["--bg"],
    foreground: "#f1f5f1",
    comment: "#bec8c0",
    keyword: "#efb6db",
    typeName: "#9bd6c1",
    functionName: "#abc7ed",
    string: "#eebc96",
    literal: "#ddd092",
  }),
  "sourceshot-peach": createCodeTheme({
    name: "sourceshot-peach",
    displayName: "Peach",
    type: "light",
    background: sourceShotPeachVariables["--code-bg"],
    foreground: "#562e30",
    comment: "#8c5e58",
    keyword: "#a23938",
    typeName: "#8e3d58",
    functionName: "#b94743",
    string: "#a94724",
    literal: "#87510e",
  }),
  "sourceshot-ocean": createCodeTheme({
    name: "sourceshot-ocean",
    displayName: "Ocean Light",
    type: "light",
    background: sourceShotOceanVariables["--code-bg"],
    foreground: "#1b365e",
    comment: "#587791",
    keyword: "#3d5c9c",
    typeName: "#246d94",
    functionName: "#3155a0",
    string: "#176983",
    literal: "#80518f",
  }),
} as const satisfies Record<string, ThemeRegistration>;

export const appThemeDefinitions = [
  {
    label: "Mono",
    value: "mono",
    codeTheme: "sourceshot-mono",
    colorScheme: "light",
    variables: sourceShotMonoVariables,
  },
  {
    label: "Mono Dark",
    value: "mono-dark",
    codeTheme: "sourceshot-mono-dark",
    colorScheme: "dark",
    variables: sourceShotMonoDarkVariables,
  },
  {
    label: "Peach",
    value: "peach",
    codeTheme: "sourceshot-peach",
    colorScheme: "light",
    variables: sourceShotPeachVariables,
  },
  {
    label: "Ocean",
    value: "ocean",
    codeTheme: "sourceshot-ocean",
    colorScheme: "light",
    variables: sourceShotOceanVariables,
  },
] as const;

export type AppThemeDefinition = (typeof appThemeDefinitions)[number];
export type AppThemeValue = AppThemeDefinition["value"];
export type CodeThemeName = AppThemeDefinition["codeTheme"];

export const themeCssVariableNames = Object.keys(
  sourceShotMonoVariables,
) as readonly ThemeCssVariableName[];

export function getThemeDefinition(theme: AppThemeValue) {
  return (
    appThemeDefinitions.find((themeDefinition) => themeDefinition.value === theme) ??
    appThemeDefinitions[0]
  );
}
