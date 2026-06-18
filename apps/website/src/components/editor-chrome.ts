import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./theme-switcher.ts";
import "./tool-island.ts";

@customElement("editor-chrome")
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
