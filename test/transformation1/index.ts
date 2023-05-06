import { resourceManager } from "frigame3/lib/resourceManager.js";
import { addAnimation } from "frigame3/lib/Animation.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { addSprite } from "frigame3/lib/Sprite.js";
import type { Sprite } from "frigame3/lib/Sprite.js";

(async () => {
  const animation = addAnimation({
    imageURL: "sh.png",
    type: "horizontal",
    numberOfFrame: 4,
    rate: 300,
  });

  await resourceManager.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const rotate = addSprite(sg, { animation: animation, left: 0, top: 16 });
  const scale = addSprite(sg, { animation: animation, left: 80, top: 16 });
  const rotateScale = addSprite(sg, {
    animation: animation,
    left: 160,
    top: 16,
  });
  const scaleRotate = addSprite(sg, {
    animation: animation,
    left: 240,
    top: 16,
  });

  rotate.angle = Math.PI / 4;
  scale.scale = 2;
  rotateScale.angle = Math.PI / 4;
  rotateScale.scale = 2;
  scaleRotate.scale = 2;
  scaleRotate.angle = Math.PI / 4;
})();
