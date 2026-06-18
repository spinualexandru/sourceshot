import html from "../lib/highlighter.ts";

export function renderWindowDecoration() {
  return html`
    <div class="code__window-decoration">
      <div class="code-window-decoration" data-color="red"></div>
      <div class="code-window-decoration" data-color="yellow"></div>
      <div class="code-window-decoration" data-color="green"></div>
    </div>
  `;
}
