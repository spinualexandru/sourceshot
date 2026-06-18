import { LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { windowDecorationTemplate } from "./window-decoration.ts";
import "./window-decoration.ts";

type CodeWindowOptions = {
  codeHtml?: string;
  snapshot?: boolean;
};

type CodeScrollPosition = {
  left: number;
  top: number;
};

export function renderCodeWindow({
  codeHtml = "",
  snapshot = false,
}: CodeWindowOptions = {}): TemplateResult {
  return html`
    <div class=${`code__container${snapshot ? " code__container--snapshot" : ""}`}>
      <div class="code__header">${windowDecorationTemplate()}</div>
      <div class=${`code__editor${snapshot ? " code__editor--snapshot" : ""}`}>
        <div class=${`code__output${snapshot ? " code__output--snapshot" : ""}`} aria-hidden="true">
          ${unsafeHTML(codeHtml)}
        </div>
      </div>
    </div>
  `;
}

@customElement("source-code-window")
export class SourceCodeWindow extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .code__container {
      position: relative;
      width: min(80vw, 1126px);
      height: 50vh;
      box-sizing: border-box;
      background:
        radial-gradient(
            circle at 82% 0%,
            color-mix(
                in srgb,
                var(--glass-light)
                  calc(var(--glass-reflex-light) * var(--code-container-top-reflex)),
                transparent
              )
              0 18%,
            transparent 44%
          )
          padding-box,
        radial-gradient(
            circle at 50% 100%,
            color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 9%), transparent),
            transparent 48%
          )
          padding-box,
        linear-gradient(
            145deg,
            color-mix(
              in srgb,
              var(--code-container-bg) var(--code-container-fill-start),
              transparent
            ),
            color-mix(in srgb, var(--glass) var(--code-container-fill-mid), transparent) 46%,
            color-mix(in srgb, var(--glass-light) var(--code-container-shine), transparent) 100%
          )
          padding-box,
        linear-gradient(
            45deg,
            color-mix(in srgb, var(--glass-light) var(--code-container-border-start), transparent),
            color-mix(in srgb, var(--glass-light) 40%, transparent) 22%,
            color-mix(in srgb, var(--glass-dark) 16%, transparent) 38%,
            color-mix(in srgb, var(--glass) 48%, transparent) 62%,
            color-mix(in srgb, var(--glass-dark) 11%, transparent) 78%,
            color-mix(in srgb, var(--glass-light) var(--code-container-border-end), transparent)
          )
          border-box;
      background-color: color-mix(in srgb, var(--glass) 12%, transparent);
      backdrop-filter: blur(30px) saturate(var(--glass-saturation)) brightness(1.08);
      -webkit-backdrop-filter: blur(30px) saturate(var(--glass-saturation)) brightness(1.08);
      border-radius: 32px;
      border: 6px solid transparent;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow: hidden;
      box-shadow:
        inset 0 0 0 1px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 14%), transparent),
        inset 2px 3px 0 -2px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 92%), transparent),
        inset -3px -2px 0 -2px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 78%), transparent),
        inset -6px -11px 2px -8px
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 62%), transparent),
        inset -0.5px -1px 5px 0
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
        inset -2px 3px 0 -2px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 18%), transparent),
        inset 0 4px 5px -3px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 16%), transparent),
        inset 3px -9px 2px -6px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 1px 6px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
        0 18px 46px
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 18%), transparent);
    }

    .code__container::before {
      content: "";
      position: absolute;
      z-index: 0;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(
          115deg,
          color-mix(in srgb, var(--glass-light) calc(var(--glass-reflex-light) * 34%), transparent),
          transparent 28% 70%,
          color-mix(in srgb, var(--glass-dark) calc(var(--glass-reflex-dark) * 6%), transparent)
        ),
        radial-gradient(
          circle at 82% 88%,
          color-mix(in srgb, var(--bg-glow-rose) 14%, transparent),
          transparent 44%
        );
      mix-blend-mode: normal;
      opacity: var(--code-container-overlay-opacity);
    }

    .code__header {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .code__editor {
      --editor-padding: 18px;
      --editor-font-size: 16px;
      --editor-line-height: 1.55;

      position: relative;
      z-index: 1;
      flex: 1;
      min-height: 0;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    .code__textarea {
      position: absolute;
      z-index: 1;
      inset: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      resize: none;
      border: 0;
      margin: 0;
      padding: var(--editor-padding);
      overflow: auto;
      background: transparent;
      color: transparent;
      caret-color: var(--text-h);
      font: var(--editor-font-size) / var(--editor-line-height) var(--mono);
      letter-spacing: 0;
      tab-size: 2;
      white-space: pre;
      -webkit-text-fill-color: transparent;
    }

    .code__textarea:hover,
    .code__textarea:focus {
      outline: none;
    }

    .code__textarea::selection {
      background: rgba(224, 148, 78, 0.26);
    }

    .code__output {
      position: absolute;
      z-index: 0;
      inset: 0;
      box-sizing: border-box;
      padding: var(--editor-padding);
      overflow: visible;
      pointer-events: none;
      transform-origin: 0 0;
    }

    .code__output .shiki {
      min-width: 100%;
      min-height: 100%;
      margin: 0;
      overflow: visible;
      background: transparent !important;
      font: var(--editor-font-size) / var(--editor-line-height) var(--mono);
      letter-spacing: 0;
      tab-size: 2;
    }

    .code__output code {
      display: block;
      padding: 0;
      background: transparent;
      font: inherit;
    }
  `;

  @property({ type: String })
  code = "";

  @property({ type: String, attribute: "code-html" })
  codeHtml = "";

  @property({ type: String, attribute: "language-label" })
  languageLabel = "TypeScript";

  @query(".code__output")
  private readonly codeOutputElement?: HTMLDivElement;

  @query(".code__textarea")
  private readonly codeTextAreaElement?: HTMLTextAreaElement;

  get cursorOffset() {
    return this.codeTextAreaElement?.selectionStart ?? this.code.length;
  }

  get scrollPosition(): CodeScrollPosition {
    const codeTextAreaElement = this.codeTextAreaElement;

    return {
      left: codeTextAreaElement?.scrollLeft ?? 0,
      top: codeTextAreaElement?.scrollTop ?? 0,
    };
  }

  override updated() {
    this.syncScroll();
  }

  focusEditor() {
    this.codeTextAreaElement?.focus();
  }

  restoreCursor(cursorOffset: number, scrollPosition: CodeScrollPosition) {
    const codeTextAreaElement = this.codeTextAreaElement;

    if (!codeTextAreaElement) {
      return;
    }

    codeTextAreaElement.focus();
    codeTextAreaElement.setSelectionRange(cursorOffset, cursorOffset);
    codeTextAreaElement.scrollLeft = scrollPosition.left;
    codeTextAreaElement.scrollTop = scrollPosition.top;
    this.syncScroll();
  }

  private readonly syncScroll = () => {
    const codeOutputElement = this.codeOutputElement;
    const codeTextAreaElement = this.codeTextAreaElement;

    if (!codeOutputElement || !codeTextAreaElement) {
      return;
    }

    codeOutputElement.style.transform = `translate(${-codeTextAreaElement.scrollLeft}px, ${-codeTextAreaElement.scrollTop}px)`;
  };

  private emitCodeChange(code: string) {
    this.dispatchEvent(
      new CustomEvent<{ code: string }>("code-change", {
        detail: { code },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private readonly handleCodeInput = (event: Event) => {
    this.emitCodeChange((event.currentTarget as HTMLTextAreaElement).value);
  };

  private readonly handleCodeKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const codeTextAreaElement = event.currentTarget as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = codeTextAreaElement;
    codeTextAreaElement.setRangeText("  ", selectionStart, selectionEnd, "end");
    this.emitCodeChange(codeTextAreaElement.value);
  };

  protected override render() {
    return html`
      <div class="code__container">
        <div class="code__header">
          <source-window-decoration></source-window-decoration>
        </div>
        <div class="code__editor">
          <div class="code__output" aria-hidden="true">${unsafeHTML(this.codeHtml)}</div>
          <textarea
            class="code__textarea"
            .value=${this.code}
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            wrap="off"
            aria-label=${`${this.languageLabel} code editor`}
            @input=${this.handleCodeInput}
            @keydown=${this.handleCodeKeydown}
            @scroll=${this.syncScroll}
          ></textarea>
        </div>
      </div>
    `;
  }
}
