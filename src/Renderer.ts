import type { Playground } from "./Playground.js";
import type { SpriteGroup } from "./SpriteGroup.js";
import type { Sprite } from "./Sprite.js";
import type { Rectangle } from "./Rectangle.js";

export interface Renderer {
  initPlayground(
    playground: Playground,
    dom?: string | HTMLElement | HTMLCanvasElement
  ): [number, number];
  drawPlayground(playground: Playground): void;
  drawGroup(group: SpriteGroup): void;
  drawSprite(sprite: Sprite): void;
  drawRectangle(rectangle: Rectangle): void;
}
