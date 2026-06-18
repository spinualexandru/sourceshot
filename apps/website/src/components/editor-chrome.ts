import { LitElement, css, html } from "lit";
import "./theme-switcher.ts";
import "./tool-island.ts";

export class EditorChrome extends LitElement {
  static styles = css`
    :host {
      display: contents;
      font: inherit;
      color: inherit;
    }
  `;

  protected override render() {
    return html`<slot></slot>`;
  }
}

if (!customElements.get("editor-chrome")) {
  customElements.define("editor-chrome", EditorChrome);
}
