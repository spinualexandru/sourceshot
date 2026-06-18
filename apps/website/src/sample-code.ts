export const initialCode = `type Brick = {
  color: "red" | "yellow" | "green";
  studs: number;
};

const build = (bricks: Brick[]) =>
  bricks.map((brick) => brick.color).join(" + ");
`;
