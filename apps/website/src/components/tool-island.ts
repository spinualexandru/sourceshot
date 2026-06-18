import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { type CodeLanguage, type LanguageOption, languageOptions } from "../code-options.ts";
import "./tool-dropdown.ts";
import type { ToolDropdownOption, ToolDropdownSelectEvent } from "./tool-dropdown.ts";

export type ToolIslandActionEvent = CustomEvent<{
  action: "copy" | "export" | "format";
}>;

export type ToolIslandLanguageChangeEvent = CustomEvent<{
  language: CodeLanguage;
}>;

@customElement("tool-island")
export class ToolIsland extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: 20;
      left: 50%;
      bottom: max(22px, env(safe-area-inset-bottom));
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 64px;
      box-sizing: border-box;
      padding: 8px;
      border-radius: 999px;
      background-color: color-mix(in srgb, var(--glass) 18%, transparent);
      backdrop-filter: blur(12px) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(12px) saturate(var(--glass-saturation));
      box-shadow:
        inset 0 0 0 1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 14%), transparent),
        inset 1.8px 3px 0 -2px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 88%), transparent),
        inset -2px -2px 0 -2px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 76%), transparent),
        inset -3px -8px 1px -6px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 58%), transparent),
        inset -0.3px -1px 4px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
        inset -1.5px 2.5px 0 -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
        inset 0 3px 4px -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
        inset 2px -6.5px 1px -4px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 1px 5px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 18px 44px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 16%), transparent);
      translate: -50% 0;
      font: inherit;
      color: inherit;
    }

    .tool-island__button {
      appearance: none;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 104px;
      height: 48px;
      box-sizing: border-box;
      border: 0;
      border-radius: 999px;
      padding: 0 18px;
      color: var(--text-h);
      background-color: color-mix(in srgb, var(--glass) 34%, transparent);
      font: 700 14px/1 var(--sans);
      letter-spacing: 0;
      white-space: nowrap;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 12%), transparent),
        inset 2px 1px 0 -1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 88%), transparent),
        inset -1.5px -1px 0 -1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 72%), transparent),
        inset -2px -6px 1px -5px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 56%), transparent),
        inset -1px 2px 3px -1px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 18%), transparent),
        inset 0 -4px 1px -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 3px 6px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 8%), transparent);
      transition:
        background-color 180ms ease,
        box-shadow 180ms ease,
        color 180ms ease,
        transform 180ms ease;
    }

    .tool-island__button:hover {
      color: var(--accent);
      background-color: color-mix(in srgb, var(--glass) 42%, transparent);
      transform: translateY(-1px);
    }

    .tool-island__button:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent) 82%, white);
      outline-offset: 3px;
    }

    .tool-island__button:disabled {
      cursor: wait;
      opacity: 0.72;
    }

    tool-dropdown {
      flex: 0 1 auto;
    }

    @media (max-width: 560px) {
      :host {
        width: calc(100% - 28px);
        justify-content: center;
        flex-wrap: wrap;
        border-radius: 28px;
      }

      .tool-island__button {
        flex: 1 1 0;
        min-width: 0;
        padding: 0 14px;
      }

      tool-dropdown {
        flex: 1 1 96px;
        min-width: 0;
      }
    }
  `;

  @property({ type: Boolean, attribute: "export-in-progress" })
  exportInProgress = false;

  @property({ type: Boolean, attribute: "copy-in-progress" })
  copyInProgress = false;

  @property({ type: Boolean, attribute: "format-in-progress" })
  formatInProgress = false;

  @property({ type: Boolean, attribute: "language-open" })
  languageOpen = false;

  @property({ attribute: false })
  selectedLanguage: LanguageOption = languageOptions[0];

  private get languageDropdownOptions(): ToolDropdownOption[] {
    return languageOptions.map((language) => ({
      label: language.label,
      selected: language.value === this.selectedLanguage.value,
      value: language.value,
    }));
  }

  private emitAction(action: "copy" | "export" | "format") {
    this.dispatchEvent(
      new CustomEvent("tool-action", {
        bubbles: true,
        composed: true,
        detail: { action },
      }) satisfies ToolIslandActionEvent,
    );
  }

  private readonly handleLanguageSelect = (event: ToolDropdownSelectEvent) => {
    const language = languageOptions.find((option) => option.value === event.detail.value);

    if (!language) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("language-change", {
        bubbles: true,
        composed: true,
        detail: { language: language.value },
      }) satisfies ToolIslandLanguageChangeEvent,
    );
  };

  protected override render() {
    return html`
      <button
        class="tool-island__button"
        type="button"
        data-action="format"
        ?disabled=${this.formatInProgress}
        @click=${() => this.emitAction("format")}
      >
        Format
      </button>
      <button
        class="tool-island__button"
        type="button"
        data-action="export"
        ?disabled=${this.exportInProgress}
        @click=${() => this.emitAction("export")}
      >
        Export
      </button>
      <button
        class="tool-island__button"
        type="button"
        data-action="copy"
        aria-label="Copy image to clipboard"
        title="Copy image to clipboard"
        ?disabled=${this.copyInProgress}
        @click=${() => this.emitAction("copy")}
      >
        Copy
      </button>
      <tool-dropdown
        button-class-name="tool-island__button"
        dropdown-name="language"
        label=${this.selectedLanguage.label}
        label-data-attribute="data-language-label"
        listbox-label="Programming languages"
        option-data-attribute="data-language"
        .open=${this.languageOpen}
        .options=${this.languageDropdownOptions}
        @tool-dropdown-select=${this.handleLanguageSelect}
      ></tool-dropdown>
    `;
  }
}
