import { type AppTheme, isAppTheme, themeOptions } from "./code-options.ts";

const themeStorageKey = "sourceshot-theme";

export function getStoredTheme(): AppTheme {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return isAppTheme(storedTheme) ? storedTheme : themeOptions[0].value;
  } catch {
    return themeOptions[0].value;
  }
}

export function storeTheme(theme: AppTheme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme persistence is optional; blocked storage should not block the editor.
  }
}

export function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme;
}
