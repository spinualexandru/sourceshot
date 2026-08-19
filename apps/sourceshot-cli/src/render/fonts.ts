import { readFile } from "node:fs/promises";

/**
 * satori has no access to system fonts and does not synthesize faces, and the code
 * themes use italic comments and bold keywords — so all four faces must be real.
 */
const faces = [
  { file: "JetBrainsMono-Regular.ttf", weight: 400, style: "normal" },
  { file: "JetBrainsMono-Bold.ttf", weight: 700, style: "normal" },
  { file: "JetBrainsMono-Italic.ttf", weight: 400, style: "italic" },
  { file: "JetBrainsMono-BoldItalic.ttf", weight: 700, style: "italic" },
] as const;

export const codeFontFamily = "JetBrains Mono";

/** JetBrains Mono advances 600/1000 units per em; verified against satori's layout. */
export const codeCharAdvanceRatio = 0.6;

export type LoadedFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal" | "italic";
};

let fontsPromise: Promise<LoadedFont[]> | undefined;

export function loadCodeFonts() {
  fontsPromise ??= Promise.all(
    faces.map(async (face) => ({
      name: codeFontFamily,
      weight: face.weight,
      style: face.style,
      data: await readFile(new URL(`../../assets/fonts/${face.file}`, import.meta.url)),
    })),
  );

  return fontsPromise;
}
