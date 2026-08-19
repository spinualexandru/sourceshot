import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CliError } from "../errors.ts";

type Piped = { kind: "pipe"; command: string; args: string[] };
type FileBased = { kind: "file"; command: string; args: (path: string) => string[] };
type Strategy = Piped | FileBased;

/**
 * Note pbcopy and clip.exe are deliberately absent: neither can carry image data,
 * and using them would silently put garbage on the clipboard.
 */
function getStrategies(): Strategy[] {
  if (process.platform === "darwin") {
    return [
      {
        kind: "file",
        command: "osascript",
        args: (path) => [
          "-e",
          `set the clipboard to (read (POSIX file "${path}") as «class PNGf»)`,
        ],
      },
    ];
  }

  if (process.platform === "win32") {
    return [
      {
        kind: "file",
        command: "powershell",
        args: (path) => [
          "-NoProfile",
          "-Command",
          `Add-Type -Assembly System.Windows.Forms; Add-Type -Assembly System.Drawing; [Windows.Forms.Clipboard]::SetImage([Drawing.Image]::FromFile('${path}'))`,
        ],
      },
    ];
  }

  const wayland: Piped = { kind: "pipe", command: "wl-copy", args: ["--type", "image/png"] };
  const x11: Piped = {
    kind: "pipe",
    command: "xclip",
    args: ["-selection", "clipboard", "-t", "image/png", "-i"],
  };

  return process.env["WAYLAND_DISPLAY"] ? [wayland, x11] : [x11, wayland];
}

function run(command: string, args: string[], input?: Buffer) {
  return new Promise<boolean>((resolve) => {
    const child = spawn(command, args, { stdio: [input ? "pipe" : "ignore", "ignore", "ignore"] });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));

    if (input) {
      child.stdin?.end(input);
    }
  });
}

export async function copyPngToClipboard(png: Buffer) {
  for (const strategy of getStrategies()) {
    if (strategy.kind === "pipe") {
      if (await run(strategy.command, strategy.args, png)) {
        return;
      }
      continue;
    }

    const path = join(tmpdir(), `sourceshot-${process.pid}.png`);
    await writeFile(path, png);

    if (await run(strategy.command, strategy.args(path))) {
      return;
    }
  }

  const hint =
    process.platform === "linux"
      ? "Install wl-copy (Wayland) or xclip (X11)"
      : "No working clipboard helper was found";

  throw new CliError(`--copy failed. ${hint}, or use -o to write a file instead.`, 3);
}
