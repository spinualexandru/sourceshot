import { LitElement, css, html } from "lit";
import {
  type AppTheme,
  type LanguageOption,
  isAppTheme,
  isCodeLanguage,
  languageOptions,
} from "./code-options.ts";
import { formatCode } from "./code-format.ts";
import { renderCodeHtml } from "./code-highlight.ts";
import "./components/code-window.ts";
import type { SourceCodeWindow } from "./components/code-window.ts";
import "./components/theme-switcher.ts";
import type { ThemeSwitcherChangeEvent } from "./components/theme-switcher.ts";
import type { ToolDropdownToggleEvent } from "./components/tool-dropdown.ts";
import "./components/tool-island.ts";
import type {
  ToolIslandActionEvent,
  ToolIslandLanguageChangeEvent,
} from "./components/tool-island.ts";
import { initialCode } from "./sample-code.ts";
import { downloadPageSnapshot } from "./snapshot-export.ts";
import { applyTheme, getStoredTheme, storeTheme } from "./theme.ts";

type DropdownName = "language" | "theme";

export class SourceCodeEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      font: inherit;
      color: inherit;
    }

    *,
    *::before,
    *::after {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    button,
    textarea {
      font-smooth: always;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;

  static properties = {
    code: { state: true },
    codeHtml: { state: true },
    exportInProgress: { state: true },
    formatInProgress: { state: true },
    openDropdown: { state: true },
    selectedLanguage: { state: true },
    selectedTheme: { state: true },
  };

  declare private code: string;
  declare private codeHtml: string;
  declare private exportInProgress: boolean;
  declare private formatInProgress: boolean;
  declare private openDropdown: DropdownName | undefined;
  private renderId = 0;
  declare private selectedLanguage: LanguageOption;
  declare private selectedTheme: AppTheme;

  constructor() {
    super();
    this.code = initialCode;
    this.codeHtml = "";
    this.exportInProgress = false;
    this.formatInProgress = false;
    this.openDropdown = undefined;
    this.selectedLanguage = languageOptions[0];
    this.selectedTheme = getStoredTheme();
  }

  private readonly handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.closeDropdowns();
    }
  };

  private readonly handleDocumentPointerDown = (event: PointerEvent) => {
    if (!event.composedPath().includes(this)) {
      this.closeDropdowns();
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    applyTheme(this.selectedTheme);
    document.addEventListener("keydown", this.handleDocumentKeydown);
    document.addEventListener("pointerdown", this.handleDocumentPointerDown);
    void this.updateHighlightedCode();
  }

  override disconnectedCallback() {
    document.removeEventListener("keydown", this.handleDocumentKeydown);
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    super.disconnectedCallback();
  }

  private closeDropdowns() {
    this.openDropdown = undefined;
  }

  private get codeWindowElement() {
    return this.renderRoot.querySelector<SourceCodeWindow>("source-code-window");
  }

  private isDropdownOpen(dropdownName: DropdownName) {
    return this.openDropdown === dropdownName;
  }

  private toggleDropdown(dropdownName: DropdownName) {
    this.openDropdown = this.isDropdownOpen(dropdownName) ? undefined : dropdownName;
  }

  private async updateHighlightedCode() {
    const nextRenderId = ++this.renderId;
    const html = await renderCodeHtml(this.code, this.selectedLanguage.value, this.selectedTheme);

    if (nextRenderId !== this.renderId) {
      return;
    }

    this.codeHtml = html;
  }

  private readonly exportSnapshot = async () => {
    if (this.exportInProgress) {
      return;
    }

    this.exportInProgress = true;

    try {
      await downloadPageSnapshot(this.code, this.selectedLanguage.value, this.selectedTheme);
    } catch (error: unknown) {
      console.error("Failed to export snapshot", error);
    } finally {
      this.exportInProgress = false;
    }
  };

  private readonly formatCurrentCode = async () => {
    if (this.formatInProgress) {
      return;
    }

    const codeWindowElement = this.codeWindowElement;
    const cursorOffset = codeWindowElement?.cursorOffset ?? this.code.length;
    const scrollPosition = codeWindowElement?.scrollPosition ?? { left: 0, top: 0 };
    this.formatInProgress = true;

    try {
      const result = await formatCode(this.code, this.selectedLanguage.value, cursorOffset);

      if (!result.formatted) {
        return;
      }

      this.code = result.code;
      await this.updateHighlightedCode();
      await this.updateComplete;

      await this.codeWindowElement?.updateComplete;
      this.codeWindowElement?.restoreCursor(result.cursorOffset, scrollPosition);
    } catch (error: unknown) {
      console.error("Failed to format code", error);
    } finally {
      this.formatInProgress = false;
    }
  };

  private readonly handleCodeChange = (event: CustomEvent<{ code: string }>) => {
    this.code = event.detail.code;
    void this.updateHighlightedCode();
  };

  private selectLanguage(nextLanguage: LanguageOption) {
    this.selectedLanguage = nextLanguage;
    this.closeDropdowns();
    void this.updateHighlightedCode();
  }

  private selectTheme(nextTheme: AppTheme) {
    this.selectedTheme = nextTheme;
    applyTheme(nextTheme);
    storeTheme(nextTheme);
    this.closeDropdowns();
    void this.updateHighlightedCode();
  }

  private readonly handleDropdownToggle = (event: ToolDropdownToggleEvent) => {
    const dropdownName = event.detail.dropdownName;

    if (dropdownName !== "language" && dropdownName !== "theme") {
      return;
    }

    this.toggleDropdown(dropdownName);
  };

  private readonly handleLanguageChange = (event: ToolIslandLanguageChangeEvent) => {
    const nextLanguage = event.detail.language;

    if (!isCodeLanguage(nextLanguage)) {
      return;
    }

    const language = languageOptions.find((option) => option.value === nextLanguage);

    if (language) {
      this.selectLanguage(language);
    }
  };

  private readonly handleThemeChange = (event: ThemeSwitcherChangeEvent) => {
    const nextTheme = event.detail.theme;

    if (isAppTheme(nextTheme)) {
      this.selectTheme(nextTheme);
    }
  };

  private readonly handleToolAction = (event: ToolIslandActionEvent) => {
    if (event.detail.action === "format") {
      void this.formatCurrentCode();
      return;
    }

    void this.exportSnapshot();
  };

  private renderCodeWindow() {
    return html`
      <source-code-window
        .code=${this.code}
        .codeHtml=${this.codeHtml}
        .languageLabel=${this.selectedLanguage.label}
        @code-change=${this.handleCodeChange}
      ></source-code-window>
    `;
  }

  private renderThemeSwitcher() {
    return html`
      <theme-switcher
        aria-label="Theme selector"
        .open=${this.isDropdownOpen("theme")}
        .selectedTheme=${this.selectedTheme}
        @theme-change=${this.handleThemeChange}
        @tool-dropdown-toggle=${this.handleDropdownToggle}
      ></theme-switcher>
    `;
  }

  private renderToolIsland() {
    return html`
      <tool-island
        aria-label="SourceShot tools"
        .exportInProgress=${this.exportInProgress}
        .formatInProgress=${this.formatInProgress}
        .languageOpen=${this.isDropdownOpen("language")}
        .selectedLanguage=${this.selectedLanguage}
        @language-change=${this.handleLanguageChange}
        @tool-action=${this.handleToolAction}
        @tool-dropdown-toggle=${this.handleDropdownToggle}
      ></tool-island>
    `;
  }

  protected override render() {
    return html`
      ${this.renderCodeWindow()} ${this.renderThemeSwitcher()} ${this.renderToolIsland()}
    `;
  }
}

if (!customElements.get("source-code-editor")) {
  customElements.define("source-code-editor", SourceCodeEditor);
}
