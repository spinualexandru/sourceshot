import html from "../lib/highlighter.ts";
import { renderWindowDecoration } from "./window-decoration.ts";

type CodeWindowOptions = {
  codeHtml?: string;
  snapshot?: boolean;
};

export function renderCodeWindow({ codeHtml = "", snapshot = false }: CodeWindowOptions = {}) {
  const snapshotModifier = snapshot ? " code__container--snapshot" : "";
  const editorModifier = snapshot ? " code__editor--snapshot" : "";
  const outputModifier = snapshot ? " code__output--snapshot" : "";

  return html`
    <div class="code__container${snapshotModifier}">
      <div class="code__header">${renderWindowDecoration()}</div>
      <div class="code__editor${editorModifier}">
        <div class="code__output${outputModifier}" aria-hidden="true">${codeHtml}</div>
      </div>
    </div>
  `;
}
