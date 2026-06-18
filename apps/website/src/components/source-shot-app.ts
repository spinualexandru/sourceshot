import { LitElement, html } from "lit";
import "../code-editor.ts";
import { renderBrandLockup } from "./brand-lockup.ts";

export class SourceShotApp extends LitElement {
  override createRenderRoot() {
    return this;
  }

  protected override render() {
    return html`
      <section id="center">
        ${renderBrandLockup()}
        <source-code-editor id="code"></source-code-editor>
      </section>
    `;
  }
}

if (!customElements.get("source-shot-app")) {
  customElements.define("source-shot-app", SourceShotApp);
}
