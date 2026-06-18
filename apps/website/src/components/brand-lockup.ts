import { LitElement, css, html } from "lit";

export class BrandLockup extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .brand-lockup {
      display: grid;
      place-items: center;
      gap: 6px;
      text-align: center;
    }

    .brand-title {
      margin: 0;
      color: transparent;
      background: var(--brand-title);
      background-clip: text;
      -webkit-background-clip: text;
      font-family: "Instrument Serif", var(--heading);
      font-size: 128px;
      font-weight: 400;
      line-height: 0.92;
      letter-spacing: 0;
      -webkit-text-fill-color: transparent;
    }

    .brand-byline {
      margin: 0;
      color: color-mix(in srgb, var(--text-h) 62%, transparent);
      font: 650 12px/1.2 var(--sans);
      letter-spacing: 0;
    }

    .brand-byline a {
      color: inherit;
      text-decoration: none;
      border-bottom: 1px solid color-mix(in srgb, currentColor 34%, transparent);
      transition:
        border-color 160ms ease,
        color 160ms ease;
    }

    .brand-byline a:hover {
      color: var(--text-h);
      border-bottom-color: currentColor;
    }

    .brand-byline a:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent) 82%, white);
      outline-offset: 4px;
      border-radius: 4px;
    }

    @media (max-width: 1024px) {
      .brand-title {
        font-size: 64px;
      }
    }

    @media (max-width: 560px) {
      .brand-lockup {
        gap: 4px;
      }

      .brand-title {
        font-size: 48px;
      }
    }
  `;

  protected override render() {
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
}

if (!customElements.get("brand-lockup")) {
  customElements.define("brand-lockup", BrandLockup);
}
