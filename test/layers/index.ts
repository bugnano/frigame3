import { resourceManager as rm } from "frigame3/lib/resourceManager.js";
import { Animation } from "frigame3/lib/Animation.js";
import { Gradient } from "frigame3/lib/Gradient.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { Sprite } from "frigame3/lib/Sprite.js";
import { SpriteGroup } from "frigame3/lib/SpriteGroup.js";
import { Rectangle } from "frigame3/lib/Rectangle.js";
import { startKeyTracker } from "frigame3/lib/plugins/keyTracker.js";

(async () => {
  const ruler = rm.addResource(new Animation("ruler.png"));
  const animation = rm.addResource(
    new Animation({
      imageURL: "sh.png",
      type: "horizontal",
      numberOfFrame: 4,
      rate: 300,
    })
  );
  const gradient = new Gradient({ r: 128 }, { b: 255, a: 0.3 }, "horizontal");
  const red = new Gradient({ r: 128 });
  const blue = new Gradient({ b: 255, a: 0.6 });
  const grassblock = rm.addResource(new Animation("grassblock.png"));
  const boy = rm.addResource(new Animation("boy.png"));
  const catgirl = rm.addResource(new Animation("catgirl.png"));
  const horngirl = rm.addResource(new Animation("horngirl.png"));
  const pinkgirl = rm.addResource(new Animation("pinkgirl.png"));

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const group1 = sg.addChild(
    new SpriteGroup({ width: sg.width, height: sg.height })
  );
  const rectangle1 = group1.addChild(
    new Rectangle({
      width: group1.width,
      height: group1.height,
      background: gradient,
    })
  );
  const sprite1 = group1.addChild(
    new Sprite({
      animation: animation,
      left: 16,
      top: 32,
    })
  );
  const sprite2 = group1.addChild(
    new Sprite({
      animation: animation,
      centerx: 0,
      top: 192,
    })
  );

  const group2 = sg.addChild(
    new SpriteGroup({
      left: 100,
      top: 150,
      width: 300,
      height: 200,
    })
  );
  const rectangle2 = group2.addChild(
    new Rectangle({ width: group2.width, height: group2.height })
  );
  const catgirl1 = group2.addChild(
    new Sprite({
      animation: catgirl,
      left: 32,
      top: 32,
    })
  );
  const horngirl1 = group2.addChild(
    new Sprite({
      animation: horngirl,
      left: 48,
      top: 32,
    })
  );
  const pinkgirl1 = group2.addChild(
    new Sprite({
      animation: pinkgirl,
      left: 64,
      top: 32,
    })
  );
  const boy1 = group2.insertChild(
    new Sprite({ animation: boy, left: 16, top: 32 })
  );

  const gbackground = sg.insertChild(new SpriteGroup({ width: 1, height: 1 }));
  const ruler1 = gbackground.addChild(new Sprite({ animation: ruler }));

  const rg1 = sg.addChild(
    new SpriteGroup({
      left: 48,
      top: 48,
      width: 64,
      height: 64,
    })
  );
  const rectangle3 = rg1.addChild(
    new Rectangle({
      width: rg1.width,
      height: rg1.height,
      background: red,
      borderColor: blue,
      borderRadius: 14,
      borderWidth: 12,
    })
  );
  const rect1 = rg1.addChild(
    new SpriteGroup({
      width: rg1.width,
      height: rg1.height,
      borderRadius: 14,
    })
  );
  const catgirl2 = rect1.addChild(
    new Sprite({
      animation: catgirl,
      left: 32,
      top: 32,
    })
  );

  const group3 = sg.addChild(
    new SpriteGroup({
      width: sg.width,
      height: sg.height,
      left: 100,
      top: 370,
    })
  );
  const rectangle4 = group3.addChild(
    new Rectangle({
      width: 300,
      height: 100,
      borderRadius: 20,
      borderColor: blue,
      borderWidth: 12,
    })
  );
  const catgirl3 = group3.addChild(
    new Sprite({
      animation: catgirl,
      left: 32,
      top: 32,
    })
  );

  const sprite3 = sg.addChild(
    new Sprite({
      animation: animation,
      centerx: 304,
      centery: 48,
    })
  );

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
