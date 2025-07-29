import type { Playground, PlaygroundOptions } from "./Playground.js";
import type { Rectangle } from "./Rectangle.js";
import type { Sprite } from "./Sprite.js";
import type { SpriteGroup } from "./SpriteGroup.js";

export interface RendererElement {
  offsetWidth: number;
  offsetHeight: number;
}

export interface Renderer {
  initPlayground(
    playground: Playground,
    options?: Partial<PlaygroundOptions>,
  ): [number, number];
  drawPlaygroundBeforeChildren(playground: Playground, interp: number): void;
  drawPlaygroundAfterChildren(playground: Playground, interp: number): void;
  initGroup(group: SpriteGroup): void;
  removeGroup(group: SpriteGroup): void;
  drawGroupBeforeChildren(group: SpriteGroup, interp: number): void;
  drawGroupAfterChildren(group: SpriteGroup, interp: number): void;
  initSprite(sprite: Sprite): void;
  removeSprite(sprite: Sprite): void;
  drawSprite(sprite: Sprite, interp: number): void;
  initRectangle(rectangle: Rectangle): void;
  removeRectangle(rectangle: Rectangle): void;
  drawRectangle(rectangle: Rectangle, interp: number): void;
}
