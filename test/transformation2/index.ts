import { resourceManager as rm } from "frigame3/lib/resourceManager.js";
import { Animation } from "frigame3/lib/Animation.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { Sprite } from "frigame3/lib/Sprite.js";

(async () => {
  const animation = rm.addResource(
    new Animation({
      imageURL: "sh.png",
      type: "horizontal",
      numberOfFrame: 4,
      rate: 300,
    }),
  );

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  let angle = 45;
  let angle_rad = (angle * Math.PI) / 180;

  const aRotateScale = sg.addChild(
    new Sprite({
      animation: animation,
      left: 16,
      top: 16,
    }),
  );
  const scaleARotate = sg.addChild(
    new Sprite({
      animation: animation,
      left: 80,
      top: 16,
    }),
  );
  const rotateAScale = sg.addChild(
    new Sprite({
      animation: animation,
      left: 180,
      top: 16,
    }),
  );
  const aScaleRotate = sg.addChild(
    new Sprite({
      animation: animation,
      left: 240,
      top: 16,
    }),
  );

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
