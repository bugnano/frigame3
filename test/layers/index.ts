import { resourceManager as rm } from "frigame3/lib/resourceManager.js";
import { Animation } from "frigame3/lib/Animation.js";
import { Gradient } from "frigame3/lib/Gradient.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { Sprite } from "frigame3/lib/Sprite.js";
import { SpriteGroup } from "frigame3/lib/SpriteGroup.js";
import { Rectangle } from "frigame3/lib/Rectangle.js";
import { startKeyTracker } from "frigame3/lib/plugins/keyTracker.js";
import { spriteRef } from "frigame3/lib/utils.js";

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

  const rectangle1 = spriteRef<Rectangle>();
  const sprite1 = spriteRef<Sprite>();
  const sprite2 = spriteRef<Sprite>();
  const group1 = spriteRef<SpriteGroup>();
  sg.addChild(
    new SpriteGroup({
      width: sg.width,
      height: sg.height,
      ref: group1,
      children: [
        new Rectangle({
          width: sg.width,
          height: sg.height,
          background: gradient,
          ref: rectangle1,
        }),
        new Sprite({
          animation: animation,
          left: 16,
          top: 32,
          ref: sprite1,
        }),
        new Sprite({
          animation: animation,
          centerx: 0,
          top: 192,
          ref: sprite2,
        }),
      ],
    })
  );

  const group2 = sg.addChild(
    new SpriteGroup({
      left: 100,
      top: 150,
      width: 300,
      height: 200,
      children: [
        new Rectangle({ width: 300, height: 200 }),
        new Sprite({
          animation: catgirl,
          left: 32,
          top: 32,
        }),
        new Sprite({
          animation: horngirl,
          left: 48,
          top: 32,
        }),
        new Sprite({
          animation: pinkgirl,
          left: 64,
          top: 32,
        }),
      ],
    })
  );
  group2.insertChild(new Sprite({ animation: boy, left: 16, top: 32 }));

  sg.insertChild(
    new SpriteGroup({
      width: 1,
      height: 1,
      children: [new Sprite({ animation: ruler })],
    })
  );

  const rect1 = spriteRef<SpriteGroup>();
  sg.addChild(
    new SpriteGroup({
      left: 48,
      top: 48,
      width: 64,
      height: 64,
      children: [
        new Rectangle({
          width: 64,
          height: 64,
          background: red,
          borderColor: blue,
          borderRadius: 14,
          borderWidth: 12,
        }),
        new SpriteGroup({
          width: 64,
          height: 64,
          borderRadius: 14,
          ref: rect1,
          children: [
            new Sprite({
              animation: catgirl,
              left: 32,
              top: 32,
            }),
          ],
        }),
      ],
    })
  );

  sg.addChild(
    new SpriteGroup({
      width: sg.width,
      height: sg.height,
      left: 100,
      top: 370,
      children: [
        new Rectangle({
          width: 300,
          height: 100,
          borderRadius: 20,
          borderColor: blue,
          borderWidth: 12,
        }),
        new Sprite({
          animation: catgirl,
          left: 32,
          top: 32,
        }),
      ],
    })
  );

  sg.addChild(
    new Sprite({
      animation: animation,
      centerx: 304,
      centery: 48,
      transformOriginx: 12,
      transformOriginy: "height",
      scalex: 3,
      scaley: 2,
      angle: (27 * Math.PI) / 180,
    })
  );

  group1.current!.left = 64;
  group1.current!.top = 128;
  group1.current!.width -= 64;
  group1.current!.height -= 128;
  rectangle1.current!.width -= 64;
  rectangle1.current!.height -= 128;
  sprite1.current!.angle = (45 * Math.PI) / 180;
  sprite2.current!.scale = 2;
  rect1.current!.crop = true;

  console.log(group1);
  console.log(rectangle1);
  startKeyTracker();
})();
