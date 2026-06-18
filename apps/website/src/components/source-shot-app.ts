import { LitElement, css, html } from "lit";
import "../code-editor.ts";
import "./brand-lockup.ts";

export class SourceShotApp extends LitElement {
  static styles = css`
    :host {
      display: contents;
      font: inherit;
      color: inherit;
    }

    *,
    *::before,
    *::after {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #center {
      display: flex;
      flex-direction: column;
      gap: 25px;
      place-content: center;
      place-items: center;
      flex-grow: 1;
      padding-bottom: 112px;
    }

    source-code-editor {
      display: block;
    }

    @media (max-width: 1024px) {
      #center {
        padding: 32px 20px 112px;
        gap: 18px;
      }
    }
  `;

  protected override render() {
    return html`
      <section id="center">
        <brand-lockup></brand-lockup>
        <source-code-editor id="code"></source-code-editor>
      </section>
    `;
  }
}

if (!customElements.get("source-shot-app")) {
  customElements.define("source-shot-app", SourceShotApp);
}
