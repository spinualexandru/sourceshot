import { Resvg } from "@resvg/resvg-js";

/**
 * The website's film grain is an feTurbulence SVG at `mix-blend-mode: overlay`.
 * resvg renders the filter but ignores the blend mode (verified), so we bake the
 * tile once and composite it with straight alpha instead.
 *
 * Straight alpha reads milkier than overlay at the same opacity, hence the default
 * strength multiplier below.
 */
export const defaultGrainStrength = 0.35;

export const grainTileSize = 90;

/** Byte-identical to the filter inlined in the website's style.css. */
const grainSvg = `<svg viewBox="0 0 ${grainTileSize} ${grainTileSize}" width="${grainTileSize}" height="${grainTileSize}" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="1.35" numOctaves="5" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="${grainTileSize}" height="${grainTileSize}" filter="url(#noise)" opacity="0.95"/></svg>`;

let grainTile: string | undefined;

/** A cached 90x90 grayscale noise tile as a PNG data URI. */
export function getGrainTile() {
  grainTile ??= `data:image/png;base64,${new Resvg(grainSvg, {
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng()
    .toString("base64")}`;

  return grainTile;
}
