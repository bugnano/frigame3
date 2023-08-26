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
    })
  );

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const rotate = sg.addChild(
    new Sprite({ animation: animation, left: 0, top: 16 })
  );
  const scale = sg.addChild(
    new Sprite({ animation: animation, left: 80, top: 16 })
  );
  const rotateScale = sg.addChild(
    new Sprite({
      animation: animation,
      left: 160,
      top: 16,
    })
  );
  const scaleRotate = sg.addChild(
    new Sprite({
      animation: animation,
      left: 240,
      top: 16,
    })
  );

  rotate.angle = Math.PI / 4;
  scale.scale = 2;
  rotateScale.angle = Math.PI / 4;
  rotateScale.scale = 2;
  scaleRotate.scale = 2;
  scaleRotate.angle = Math.PI / 4;
})();
