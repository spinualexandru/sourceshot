/**
 * Minimal element factory. satori accepts plain `{ type, props }` objects, so there is
 * no need for JSX or a React runtime here — `@types/react` is a devDependency purely
 * because satori's own type definitions import `ReactNode`.
 */

export type Style = Record<string, unknown>;
export type Element = { type: string; props: { style: Style; children?: unknown } };

export function h(type: string, style: Style, children?: unknown): Element {
  return { type, props: { style, children } };
}

/** An absolutely positioned layer filling its parent, used for stacked backgrounds. */
export function layer(style: Style, children?: unknown): Element {
  return h(
    "div",
    { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", ...style },
    children,
  );
}
