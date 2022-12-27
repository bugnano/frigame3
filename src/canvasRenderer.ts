import type { Renderer } from "./Renderer.js";
import {
  initPlayground,
  drawPlaygroundBeforeChildren,
  drawPlaygroundAfterChildren,
} from "./canvasRenderer/renderPlayground.js";
import {
  initGroup,
  drawGroupBeforeChildren,
  drawGroupAfterChildren,
} from "./canvasRenderer/renderGroup.js";
import { initSprite, drawSprite } from "./canvasRenderer/renderSprite.js";
import {
  initRectangle,
  drawRectangle,
} from "./canvasRenderer/renderRectangle.js";

export const canvasRenderer: Renderer = {
  initPlayground,
  drawPlaygroundBeforeChildren,
  drawPlaygroundAfterChildren,
  initGroup,
  drawGroupBeforeChildren,
  drawGroupAfterChildren,
  initSprite,
  drawSprite,
  initRectangle,
  drawRectangle,
};
