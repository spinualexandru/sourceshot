import type { ThemeRegistration } from "shiki/core";

const sourceShotLightVariables = {
  "--text": "#6b6375",
  "--text-h": "#08060d",
  "--bg": "#e07a5f",
  "--bg-glow-warm": "#f2b06f",
  "--bg-glow-rose": "#cf536d",
  "--bg-glow-violet": "#6f3e98",
  "--bg-glow-light": "#f3dfc7",
  "--bg-noise-opacity": "1",
  "--border": "#e5e4e7",
  "--code-bg": "#f4f3ec",
  "--accent": "#aa3bff",
  "--accent-bg": "rgba(170, 59, 255, 0.1)",
  "--accent-border": "rgba(170, 59, 255, 0.5)",
  "--social-bg": "rgba(244, 243, 236, 0.5)",
  "--shadow": "rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px",
  "--glass": "#ececf0",
  "--glass-light": "#ffffff",
  "--glass-dark": "#000000",
  "--glass-reflex-dark": "1",
  "--glass-reflex-light": "1",
  "--glass-saturation": "150%",
  "--code-container-border": "#ffffff",
  "--code-container-bg": "#fbf4ee",
  "--code-container-fill-start": "72%",
  "--code-container-fill-mid": "48%",
  "--code-container-shine": "34%",
  "--code-container-top-reflex": "34%",
  "--code-container-border-start": "86%",
  "--code-container-border-end": "96%",
  "--code-container-overlay-opacity": "0.72",
} as const;

type ThemeCssVariableName = keyof typeof sourceShotLightVariables;
export type ThemeCssVariables = Readonly<Record<ThemeCssVariableName, string>>;

const sourceShotDarkVariables = {
  "--text": "#a9b1bd",
  "--text-h": "#f6f2eb",
  "--bg": "#111116",
  "--bg-glow-warm": "#a44e39",
  "--bg-glow-rose": "#65324c",
  "--bg-glow-violet": "#302756",
  "--bg-glow-light": "#1e4c52",
  "--bg-noise-opacity": "0.72",
  "--border": "#2b2d35",
  "--code-bg": "#171820",
  "--accent": "#77dac8",
  "--accent-bg": "rgba(119, 218, 200, 0.14)",
  "--accent-border": "rgba(119, 218, 200, 0.48)",
  "--social-bg": "rgba(30, 33, 42, 0.52)",
  "--shadow": "rgba(0, 0, 0, 0.46) 0 16px 34px -8px, rgba(0, 0, 0, 0.32) 0 6px 12px -4px",
  "--glass": "#4a5360",
  "--glass-light": "#ffffff",
  "--glass-dark": "#000000",
  "--glass-reflex-dark": "2.1",
  "--glass-reflex-light": "0.36",
  "--glass-saturation": "176%",
  "--code-container-border": "#2e3340",
  "--code-container-bg": "#11151e",
  "--code-container-fill-start": "96%",
  "--code-container-fill-mid": "92%",
  "--code-container-shine": "10%",
  "--code-container-top-reflex": "10%",
  "--code-container-border-start": "28%",
  "--code-container-border-end": "38%",
  "--code-container-overlay-opacity": "0.28",
} as const satisfies ThemeCssVariables;

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
  "--glass": "#f0f6f0",
  "--glass-light": "#ffffff",
  "--glass-dark": "#222323",
  "--glass-reflex-dark": "1.18",
  "--glass-reflex-light": "0.82",
  "--glass-saturation": "0%",
  "--code-container-border": "#f0f6f0",
  "--code-container-bg": "#edf3ed",
  "--code-container-fill-start": "88%",
  "--code-container-fill-mid": "72%",
  "--code-container-shine": "38%",
  "--code-container-top-reflex": "40%",
  "--code-container-border-start": "92%",
  "--code-container-border-end": "72%",
  "--code-container-overlay-opacity": "0.42",
} as const satisfies ThemeCssVariables;

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
  "--glass": "#3d403d",
  "--glass-light": "#f0f6f0",
  "--glass-dark": "#000000",
  "--glass-reflex-dark": "1.9",
  "--glass-reflex-light": "0.34",
  "--glass-saturation": "0%",
  "--code-container-border": "#3d403d",
  "--code-container-bg": "#222323",
  "--code-container-fill-start": "96%",
  "--code-container-fill-mid": "88%",
  "--code-container-shine": "8%",
  "--code-container-top-reflex": "12%",
  "--code-container-border-start": "28%",
  "--code-container-border-end": "38%",
  "--code-container-overlay-opacity": "0.3",
} as const satisfies ThemeCssVariables;

function createMonoCodeTheme({
  background,
  displayName,
  foreground,
  muted,
  name,
  soft,
  type,
}: {
  background: string;
  displayName: string;
  foreground: string;
  muted: string;
  name: string;
  soft: string;
  type: "light" | "dark";
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
          foreground: muted,
          fontStyle: "italic",
        },
      },
      {
        scope: [
          "constant",
          "entity.name.function",
          "entity.name.tag",
          "entity.other.attribute-name",
          "keyword",
          "storage",
          "support",
        ],
        settings: {
          foreground,
          fontStyle: "bold",
        },
      },
      {
        scope: ["punctuation", "string", "variable"],
        settings: {
          foreground: soft,
        },
      },
    ],
  } satisfies ThemeRegistration;
}

export const customCodeThemes = {
  "sourceshot-mono": createMonoCodeTheme({
    name: "sourceshot-mono",
    displayName: "SourceShot Mono",
    type: "light",
    foreground: sourceShotMonoVariables["--text-h"],
    background: sourceShotMonoVariables["--bg"],
    muted: sourceShotMonoVariables["--bg-glow-violet"],
    soft: sourceShotMonoVariables["--text"],
  }),
  "sourceshot-mono-dark": createMonoCodeTheme({
    name: "sourceshot-mono-dark",
    displayName: "SourceShot Mono Dark",
    type: "dark",
    foreground: sourceShotMonoDarkVariables["--text-h"],
    background: sourceShotMonoDarkVariables["--bg"],
    muted: sourceShotMonoDarkVariables["--bg-glow-light"],
    soft: sourceShotMonoDarkVariables["--text"],
  }),
} as const satisfies Record<string, ThemeRegistration>;

export const appThemeDefinitions = [
  {
    label: "SourceShot Light",
    value: "light",
    codeTheme: "vitesse-light",
    colorScheme: "light",
    variables: sourceShotLightVariables,
  },
  {
    label: "SourceShot Dark",
    value: "dark",
    codeTheme: "vitesse-dark",
    colorScheme: "dark",
    variables: sourceShotDarkVariables,
  },
  {
    label: "SourceShot Mono",
    value: "mono",
    codeTheme: "sourceshot-mono",
    colorScheme: "light",
    variables: sourceShotMonoVariables,
  },
  {
    label: "SourceShot Mono Dark",
    value: "mono-dark",
    codeTheme: "sourceshot-mono-dark",
    colorScheme: "dark",
    variables: sourceShotMonoDarkVariables,
  },
] as const;

export type AppThemeDefinition = (typeof appThemeDefinitions)[number];
export type AppThemeValue = AppThemeDefinition["value"];
export type CodeThemeName = AppThemeDefinition["codeTheme"];

export const themeCssVariableNames = Object.keys(
  sourceShotLightVariables,
) as readonly ThemeCssVariableName[];

export function getThemeDefinition(theme: AppThemeValue) {
  return (
    appThemeDefinitions.find((themeDefinition) => themeDefinition.value === theme) ??
    appThemeDefinitions[0]
  );
}
