import { writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { CliError } from "../errors.ts";

export function resolveOutputPath(output: string | undefined, file: string | undefined) {
  if (output) {
    return output;
  }

  if (!file) {
    return join(process.cwd(), "snapshot.png");
  }

  const name = basename(file, extname(file));
  return `${name}.png`;
}

export async function writePng(path: string, png: Buffer) {
  try {
    await writeFile(path, png);
  } catch (error: unknown) {
    throw new CliError(`Could not write ${path}: ${(error as Error).message}`, 2);
  }
}

export function writePngToStdout(png: Buffer) {
  return new Promise<void>((resolve, reject) => {
    process.stdout.write(png, (error) => (error ? reject(error) : resolve()));
  });
}
