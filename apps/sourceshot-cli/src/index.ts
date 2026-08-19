#!/usr/bin/env node

import { Command, InvalidArgumentError } from "commander";
import { defaultTheme, languageOptions, themeOptions } from "@sourceshot/core";
import { runShot } from "./commands/shot.ts";
import { CliError } from "./errors.ts";
import { defaultGrainStrength } from "./render/grain.ts";

function parseNumber(name: string, min: number, max: number) {
  return (value: string) => {
    const parsed = Number.parseFloat(value);

    if (Number.isNaN(parsed) || parsed < min || parsed > max) {
      throw new InvalidArgumentError(`${name} expects a number between ${min} and ${max}.`);
    }

    return parsed;
  };
}

const themeNames = themeOptions.map((option) => option.value).join(", ");
const languageNames = languageOptions.map((option) => option.value).join(", ");

const program = new Command()
  .name("sourceshot")
  .description("Render source code to a PNG snapshot")
  .version("0.0.0")
  .argument("[file]", "source file to render; omit to read stdin")
  .option("-o, --output <path>", "output PNG path")
  .option("--stdout", "write PNG bytes to stdout instead of a file")
  .option("--copy", "also copy the PNG to the system clipboard")
  .option("-t, --theme <theme>", `theme (${themeNames})`, defaultTheme)
  .option("-l, --lang <language>", `language (${languageNames})`, "auto")
  .option(
    "-s, --scale <number>",
    "pixel ratio (default: automatic)",
    parseNumber("--scale", 0.1, 8),
  )
  .option(
    "--viewport <px>",
    "simulated viewport width, controls padding and clamps",
    parseNumber("--viewport", 320, 8192),
    1280,
  )
  .option("--max-width <px|none>", "card width ceiling; 1126 matches the website", "none")
  .option(
    "--grain <0..1>",
    "film grain strength",
    parseNumber("--grain", 0, 1),
    defaultGrainStrength,
  )
  .option("--debug-svg <path>", "also write the intermediate SVG")
  .showHelpAfterError()
  // Commander exits 1 on a usage error; align it with the CLI's exit code table.
  .exitOverride((error) => process.exit(error.exitCode === 0 ? 0 : 2))
  .action(runShot);

// Reading stdin is a first-class mode, so only show help when there is nothing to read.
if (process.argv.length === 2 && process.stdin.isTTY) {
  program.outputHelp();
  process.exit(2);
}

try {
  await program.parseAsync();
} catch (error: unknown) {
  if (error instanceof CliError) {
    console.error(error.message);
    process.exitCode = error.exitCode;
  } else {
    console.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
    process.exitCode = 1;
  }
}
