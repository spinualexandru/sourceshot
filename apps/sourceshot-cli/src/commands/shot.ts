import { writeFile } from "node:fs/promises";
import { type AppTheme, type CodeLanguage, isAppTheme, isCodeLanguage } from "@sourceshot/core";
import { CliError } from "../errors.ts";
import { inferLanguage } from "../input/infer-language.ts";
import { readSource } from "../input/read-source.ts";
import { copyPngToClipboard } from "../output/clipboard.ts";
import { resolveOutputPath, writePng, writePngToStdout } from "../output/write-output.ts";
import { renderSnapshot } from "../render/render-snapshot.ts";

export type ShotOptions = {
  output?: string;
  stdout?: boolean;
  copy?: boolean;
  theme: string;
  lang: string;
  scale?: number;
  viewport: number;
  maxWidth: string;
  grain: number;
  debugSvg?: string;
};

function parseMaxWidth(value: string) {
  if (value === "none") {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new CliError(`--max-width expects a positive number or "none", got "${value}".`, 2);
  }

  return parsed;
}

export async function runShot(file: string | undefined, options: ShotOptions) {
  if (options.stdout && options.copy) {
    throw new CliError("--stdout and --copy cannot be combined.", 2);
  }

  if (!isAppTheme(options.theme)) {
    throw new CliError(`Unknown theme "${options.theme}".`, 2);
  }

  if (!isCodeLanguage(options.lang)) {
    throw new CliError(`Unknown language "${options.lang}".`, 2);
  }

  const theme: AppTheme = options.theme;
  const requested: CodeLanguage = options.lang;
  const { code, file: sourceFile } = await readSource(file);

  const { png, svg, width, height } = await renderSnapshot({
    code,
    language: inferLanguage(requested, sourceFile),
    theme,
    viewport: options.viewport,
    maxCardWidth: parseMaxWidth(options.maxWidth),
    grainStrength: options.grain,
    scale: options.scale,
  });

  if (options.debugSvg) {
    await writeFile(options.debugSvg, svg);
  }

  if (options.stdout) {
    await writePngToStdout(png);
    return;
  }

  const path = resolveOutputPath(options.output, sourceFile);
  await writePng(path, png);
  console.error(`Wrote ${path} (${width}x${height})`);

  if (options.copy) {
    await copyPngToClipboard(png);
    console.error("Copied to clipboard.");
  }
}
