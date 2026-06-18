import { LitElement, css, html } from "lit";
import markup from "../lib/highlighter.ts";

export function renderWindowDecoration() {
  return markup`
    <div class="code__window-decoration">
      <div class="code-window-decoration" data-color="red"></div>
      <div class="code-window-decoration" data-color="yellow"></div>
      <div class="code-window-decoration" data-color="green"></div>
    </div>
  `;
}

export class SourceWindowDecoration extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .code__window-decoration {
      display: flex;
      gap: 8px;
    }

    .code-window-decoration {
      width: 16px;
      height: 16px;
      border-radius: 16px;
    }

    .code-window-decoration[data-color="red"] {
      background-color: #d61613;
    }

    .code-window-decoration[data-color="yellow"] {
      background-color: #f5be25;
    }

    .code-window-decoration[data-color="green"] {
      background-color: #25f59f;
    }
  `;

  protected override render() {
    return html`
      <div class="code__window-decoration" aria-hidden="true">
        <div class="code-window-decoration" data-color="red"></div>
        <div class="code-window-decoration" data-color="yellow"></div>
        <div class="code-window-decoration" data-color="green"></div>
      </div>
    `;
  }
}

if (!customElements.get("source-window-decoration")) {
  customElements.define("source-window-decoration", SourceWindowDecoration);
}
