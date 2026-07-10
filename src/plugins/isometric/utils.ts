export function screenFromGrid(
  grid_x: number,
  grid_y: number,
): [screen_x: number, screen_y: number] {
  const screen_x = grid_x - grid_y;
  const screen_y = (grid_x + grid_y) / 2;

  return [screen_x, screen_y];
}

export function gridFromScreen(
  screen_x: number,
  screen_y: number,
): [grid_x: number, grid_y: number] {
  const grid_x = screen_y + screen_x / 2;
  const grid_y = screen_y - screen_x / 2;

  return [grid_x, grid_y];
}
