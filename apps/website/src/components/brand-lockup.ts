import { html } from "lit";

export function renderBrandLockup() {
  return html`
    <header class="brand-lockup" aria-label="SourceShot by Alex Spinu">
      <h1 class="brand-title" data-text="SourceShot">SourceShot</h1>
      <p class="brand-byline">
        by
        <a href="https://github.com/spinualexandru" rel="me noopener" target="_blank">
          Alex Spinu
        </a>
      </p>
    </header>
  `;
}
