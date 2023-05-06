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

  let angle = 45;
  let angle_rad = (angle * Math.PI) / 180;

  const aRotateScale = addSprite(sg, {
    animation: animation,
    left: 16,
    top: 16,
  });
  const scaleARotate = addSprite(sg, {
    animation: animation,
    left: 80,
    top: 16,
  });
  const rotateAScale = addSprite(sg, {
    animation: animation,
    left: 180,
    top: 16,
  });
  const aScaleRotate = addSprite(sg, {
    animation: animation,
    left: 240,
    top: 16,
  });

  playground.registerCallback(() => {
    aRotateScale.angle = angle_rad;
    aRotateScale.scale = 2;
    scaleARotate.scale = 2;
    scaleARotate.angle = -angle_rad;
    rotateAScale.angle = Math.PI / 4;
    rotateAScale.scale = Math.cos(angle_rad) * 2;
    aScaleRotate.scale = -Math.cos(angle_rad) * 2;
    aScaleRotate.angle = Math.PI / 4;
    angle -= 1;
    if (angle < -180) {
      angle = 180;
    }
    angle_rad = (angle * Math.PI) / 180;
  }, 30);
})();
