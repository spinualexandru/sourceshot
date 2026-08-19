import { readFile } from "node:fs/promises";
import { text } from "node:stream/consumers";
import { CliError } from "../errors.ts";

export type Source = { code: string; file: string | undefined };

function normalize(code: string) {
  return code.replace(/^﻿/, "").replace(/\r\n/g, "\n");
}

export async function readSource(file: string | undefined): Promise<Source> {
  if (file) {
    try {
      return { code: normalize(await readFile(file, "utf8")), file };
    } catch (error: unknown) {
      throw new CliError(`Could not read ${file}: ${(error as Error).message}`, 2);
    }
  }

  if (process.stdin.isTTY) {
    throw new CliError("No input. Pass a file path, or pipe source code on stdin.", 2);
  }

  return { code: normalize(await text(process.stdin)), file: undefined };
}
