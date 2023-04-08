export function screenFromGrid(x: number, y: number) {
  const screen_x = x - y;
  const screen_y = (x + y) / 2;

  return [screen_x, screen_y];
}

export function gridFromScreen(x: number, y: number) {
  const grid_x = y + x / 2;
  const grid_y = y - x / 2;

  return [grid_x, grid_y];
}
