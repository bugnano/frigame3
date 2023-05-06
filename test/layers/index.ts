import { resourceManager } from "frigame3/lib/resourceManager.js";
import { addAnimation } from "frigame3/lib/Animation.js";
import { Gradient } from "frigame3/lib/Gradient.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { addSprite, insertSprite } from "frigame3/lib/Sprite.js";
import { addGroup, insertGroup } from "frigame3/lib/SpriteGroup.js";
import { addRectangle } from "frigame3/lib/Rectangle.js";
import { startKeyTracker } from "frigame3/lib/plugins/keyTracker.js";

(async () => {
  const ruler = addAnimation("ruler.png");
  const animation = addAnimation({
    imageURL: "sh.png",
    type: "horizontal",
    numberOfFrame: 4,
    rate: 300,
  });
  const gradient = new Gradient({ r: 128 }, { b: 255, a: 0.3 }, "horizontal");
  const red = new Gradient({ r: 128 });
  const blue = new Gradient({ b: 255, a: 0.6 });
  const grassblock = addAnimation("grassblock.png");
  const boy = addAnimation("boy.png");
  const catgirl = addAnimation("catgirl.png");
  const horngirl = addAnimation("horngirl.png");
  const pinkgirl = addAnimation("pinkgirl.png");

  await resourceManager.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const group1 = addGroup(sg);
  const rectangle1 = addRectangle(group1, { background: gradient });
  const sprite1 = addSprite(group1, {
    animation: animation,
    left: 16,
    top: 32,
  });
  const sprite2 = addSprite(group1, {
    animation: animation,
    centerx: 0,
    top: 192,
  });

  const group2 = addGroup(sg, {
    left: 100,
    top: 150,
    width: 300,
    height: 200,
  });
  const rectangle2 = addRectangle(group2);
  const catgirl1 = addSprite(group2, {
    animation: catgirl,
    left: 32,
    top: 32,
  });
  const horngirl1 = addSprite(group2, {
    animation: horngirl,
    left: 48,
    top: 32,
  });
  const pinkgirl1 = addSprite(group2, {
    animation: pinkgirl,
    left: 64,
    top: 32,
  });
  const boy1 = insertSprite(group2, { animation: boy, left: 16, top: 32 });

  const gbackground = insertGroup(sg, { width: 1, height: 1 });
  const ruler1 = addSprite(gbackground, { animation: ruler });

  const rg1 = addGroup(sg, {
    left: 48,
    top: 48,
    width: 64,
    height: 64,
  });
  const rectangle3 = addRectangle(rg1, {
    background: red,
    borderColor: blue,
    borderRadius: 14,
    borderWidth: 12,
  });
  const rect1 = addGroup(rg1, {
    borderRadius: 14,
  });
  const catgirl2 = addSprite(rect1, {
    animation: catgirl,
    left: 32,
    top: 32,
  });

  const group3 = addGroup(sg, {
    left: 100,
    top: 370,
  });
  const rectangle4 = addRectangle(group3, {
    width: 300,
    height: 100,
    borderRadius: 20,
    borderColor: blue,
    borderWidth: 12,
  });
  const catgirl3 = addSprite(group3, {
    animation: catgirl,
    left: 32,
    top: 32,
  });

  const sprite3 = addSprite(sg, {
    animation: animation,
    centerx: 304,
    centery: 48,
  });

  group1.left = 64;
  group1.top = 128;
  group1.width -= 64;
  group1.height -= 128;
  rectangle1.width -= 64;
  rectangle1.height -= 128;
  sprite1.angle = (45 * Math.PI) / 180;
  sprite2.scale = 2;
  rect1.crop = true;

  sprite3.transformOriginx = 12;
  sprite3.transformOriginy = "height";
  sprite3.scalex = 3;
  sprite3.scaley = 2;
  sprite3.angle = (27 * Math.PI) / 180;

  console.log(group1);
  console.log(rectangle1);
  startKeyTracker();
})();
