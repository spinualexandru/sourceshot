import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  type AppTheme,
  type LanguageOption,
  getThemeOption,
  languageOptions,
  themeOptions,
} from "./code-options.ts";
import { renderCodeHtml } from "./code-highlight.ts";
import { renderWindowDecoration } from "./components/window-decoration.ts";
import { initialCode } from "./sample-code.ts";
import { downloadPageSnapshot } from "./snapshot-export.ts";
import { applyTheme, getStoredTheme, storeTheme } from "./theme.ts";

type DropdownName = "language" | "theme";

export class SourceCodeEditor extends LitElement {
  static properties = {
    code: { state: true },
    codeHtml: { state: true },
    exportInProgress: { state: true },
    openDropdown: { state: true },
    selectedLanguage: { state: true },
    selectedTheme: { state: true },
  };

  declare private code: string;
  declare private codeHtml: string;
  declare private exportInProgress: boolean;
  declare private openDropdown: DropdownName | undefined;
  private renderId = 0;
  declare private selectedLanguage: LanguageOption;
  declare private selectedTheme: AppTheme;

  constructor() {
    super();
    this.code = initialCode;
    this.codeHtml = "";
    this.exportInProgress = false;
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
    if (!this.contains(event.target as Node)) {
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

  override createRenderRoot() {
    return this;
  }

  protected override updated() {
    this.syncScroll();
  }

  private closeDropdowns() {
    this.openDropdown = undefined;
  }

  private get codeOutputElement() {
    return this.querySelector<HTMLDivElement>(".code__output");
  }

  private get codeTextAreaElement() {
    return this.querySelector<HTMLTextAreaElement>(".code__textarea");
  }

  private isDropdownOpen(dropdownName: DropdownName) {
    return this.openDropdown === dropdownName;
  }

  private readonly syncScroll = () => {
    const codeOutputElement = this.codeOutputElement;
    const codeTextAreaElement = this.codeTextAreaElement;

    if (!codeOutputElement || !codeTextAreaElement) {
      return;
    }

    codeOutputElement.style.transform = `translate(${-codeTextAreaElement.scrollLeft}px, ${-codeTextAreaElement.scrollTop}px)`;
  };

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

  private readonly handleCodeInput = (event: Event) => {
    this.code = (event.currentTarget as HTMLTextAreaElement).value;
    void this.updateHighlightedCode();
  };

  private readonly handleCodeKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const codeTextAreaElement = event.currentTarget as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = codeTextAreaElement;
    codeTextAreaElement.setRangeText("  ", selectionStart, selectionEnd, "end");
    this.code = codeTextAreaElement.value;
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

  private renderCodeWindow() {
    return html`
      <div class="code__container">
        <div class="code__header">${unsafeHTML(renderWindowDecoration())}</div>
        <div class="code__editor">
          <div class="code__output" aria-hidden="true">${unsafeHTML(this.codeHtml)}</div>
          <textarea
            class="code__textarea"
            .value=${this.code}
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            wrap="off"
            aria-label=${`${this.selectedLanguage.label} code editor`}
            @input=${this.handleCodeInput}
            @keydown=${this.handleCodeKeydown}
            @scroll=${this.syncScroll}
          ></textarea>
        </div>
      </div>
    `;
  }

  private renderLanguageDropdown() {
    const isOpen = this.isDropdownOpen("language");

    return html`
      <div class=${`tool-island__dropdown${isOpen ? " is-open" : ""}`} data-dropdown="language">
        <button
          class="tool-island__button tool-island__select"
          type="button"
          aria-expanded=${String(isOpen)}
          aria-haspopup="listbox"
          @click=${() => this.toggleDropdown("language")}
        >
          <span data-language-label>${this.selectedLanguage.label}</span>
        </button>
        <div class="tool-island__menu">
          <div class="tool-island__menu-scroll" role="listbox" aria-label="Programming languages">
            ${languageOptions.map(
              (language) => html`
                <button
                  class="tool-island__option"
                  type="button"
                  role="option"
                  data-language=${language.value}
                  aria-selected=${String(language.value === this.selectedLanguage.value)}
                  @click=${() => this.selectLanguage(language)}
                >
                  ${language.label}
                </button>
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  private renderThemeDropdown() {
    const isOpen = this.isDropdownOpen("theme");

    return html`
      <div class=${`tool-island__dropdown${isOpen ? " is-open" : ""}`} data-dropdown="theme">
        <button
          class="theme-switcher__button tool-island__select"
          type="button"
          aria-expanded=${String(isOpen)}
          aria-haspopup="listbox"
          @click=${() => this.toggleDropdown("theme")}
        >
          <span data-theme-label>${getThemeOption(this.selectedTheme).label}</span>
        </button>
        <div class="tool-island__menu">
          <div class="tool-island__menu-scroll" role="listbox" aria-label="Themes">
            ${themeOptions.map(
              (theme) => html`
                <button
                  class="tool-island__option"
                  type="button"
                  role="option"
                  data-theme=${theme.value}
                  aria-selected=${String(theme.value === this.selectedTheme)}
                  @click=${() => this.selectTheme(theme.value)}
                >
                  ${theme.label}
                </button>
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  private renderThemeSwitcher() {
    return html`
      <div class="theme-switcher" aria-label="Theme selector">${this.renderThemeDropdown()}</div>
    `;
  }

  private renderToolIsland() {
    return html`
      <div class="tool-island" aria-label="SourceShot tools">
        <button
          class="tool-island__button"
          type="button"
          data-action="export"
          ?disabled=${this.exportInProgress}
          @click=${this.exportSnapshot}
        >
          Export
        </button>
        ${this.renderLanguageDropdown()}
      </div>
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
