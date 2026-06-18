import { ts } from "./lib/highlighter";

export const initialCode = ts`type Brick = { color: "red" | "yellow" | "green"; studs: number; };
const build = (bricks: Brick[]) => bricks.map((brick) => brick.color).join(" + "); `;
