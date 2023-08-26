import { resourceManager as rm } from "frigame3/lib/resourceManager.js";
import { Animation } from "frigame3/lib/Animation.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { Sprite } from "frigame3/lib/Sprite.js";

(async () => {
  const simpleVerticalAnimation = rm.addResource(
    new Animation({
      imageURL: "sv.png",
      type: "vertical",
      numberOfFrame: 4,
      rate: 300,
    })
  );

  const simpleHorizontalAnimation = rm.addResource(
    new Animation({
      imageURL: "sh.png",
      type: "horizontal",
      numberOfFrame: 4,
      rate: 300,
    })
  );

  const multiVerticalAnimation = rm.addResource(
    new Animation({
      imageURL: "mv.png",
      type: "vertical",
      numberOfFrame: 4,
      rate: 300,
      frameWidth: 32,
    })
  );

  const multiHorizontalAnimation = rm.addResource(
    new Animation({
      imageURL: "mh.png",
      type: "horizontal",
      numberOfFrame: 4,
      rate: 300,
      frameHeight: 32,
    })
  );

  const simpleOffsetVerticalAnimation = rm.addResource(
    new Animation({
      imageURL: "sov.png",
      type: "vertical",
      numberOfFrame: 4,
      rate: 300,
      offsetx: 100,
      offsety: 100,
    })
  );

  const simpleOffsetHorizontalAnimation = rm.addResource(
    new Animation({
      imageURL: "soh.png",
      type: "horizontal",
      numberOfFrame: 4,
      rate: 300,
      offsetx: 100,
      offsety: 100,
    })
  );

  const multiOffsetVerticalAnimation = rm.addResource(
    new Animation({
      imageURL: "mov.png",
      type: "vertical",
      numberOfFrame: 4,
      rate: 300,
      offsetx: 100,
      offsety: 100,
      frameWidth: 32,
    })
  );

  const multiOffsetHorizontalAnimation = rm.addResource(
    new Animation({
      imageURL: "moh.png",
      type: "horizontal",
      numberOfFrame: 4,
      rate: 300,
      offsetx: 100,
      offsety: 100,
      frameHeight: 32,
    })
  );

  const pingpongAnimation = rm.addResource(
    new Animation({
      imageURL: "rebound.png",
      type: "horizontal",
      once: true,
      pingpong: true,
      numberOfFrame: 9,
      //rate: 60
      rate: 600,
    })
  );

  const multiPingpongAnimation = rm.addResource(
    new Animation({
      imageURL: "reboundm.png",
      type: "horizontal",
      pingpong: true,
      numberOfFrame: 9,
      rate: 60,
      frameHeight: 64,
    })
  );

  const pingpongBackwardsAnimation = rm.addResource(
    new Animation({
      imageURL: "rebound.png",
      type: "horizontal",
      once: true,
      pingpong: true,
      backwards: true,
      numberOfFrame: 9,
      //rate: 60
      rate: 600,
    })
  );

  const multiPingpongBackwardsAnimation = rm.addResource(
    new Animation({
      imageURL: "reboundm.png",
      type: "horizontal",
      pingpong: true,
      backwards: true,
      numberOfFrame: 9,
      rate: 60,
      frameHeight: 64,
    })
  );

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const simpleVertical = sg.addChild(
    new Sprite({
      animation: simpleVerticalAnimation,
      left: 0,
    })
  );
  const simpleHorizontal = sg.addChild(
    new Sprite({
      animation: simpleHorizontalAnimation,
      backwards: true,
      left: 34,
    })
  );
  const multiVertical = sg.addChild(
    new Sprite({
      animation: multiVerticalAnimation,
      left: 75,
    })
  );
  const multiHorizontal = sg.addChild(
    new Sprite({
      animation: multiHorizontalAnimation,
      left: 109,
    })
  );
  const simpleOffsetVertical = sg.addChild(
    new Sprite({
      animation: simpleOffsetVerticalAnimation,
      left: 150,
    })
  );
  const simpleOffsetHorizontal = sg.addChild(
    new Sprite({
      animation: simpleOffsetHorizontalAnimation,
      left: 184,
    })
  );
  const multiOffsetVertical = sg.addChild(
    new Sprite({
      animation: multiOffsetVerticalAnimation,
      animationIndex: 1,
      left: 225,
    })
  );
  const multiOffsetHorizontal = sg.addChild(
    new Sprite({
      animation: multiOffsetHorizontalAnimation,
      animationIndex: 1,
      left: 259,
    })
  );
  const pingpong = sg.addChild(
    new Sprite({
      animation: pingpongAnimation,
      left: 286,
    })
  );
  const multiPingpong = sg.addChild(
    new Sprite({
      animation: multiPingpongAnimation,
      left: 350,
    })
  );
  const backPingpong = sg.addChild(
    new Sprite({
      animation: pingpongBackwardsAnimation,
      left: 414,
    })
  );
  const multiBackPingpong = sg.addChild(
    new Sprite({
      animation: multiPingpongBackwardsAnimation,
      animationIndex: 1,
      left: 478,
    })
  );

  multiVertical.animationIndex = 1;
  multiHorizontal.animationIndex = 1;
  multiPingpong.animationIndex = 1;
  pingpong.callback = () => {
    const p = document.createElement("p");
    p.innerHTML = "Forwards Done";
    Object.assign(p.style, { position: "absolute", top: "64px" });
    document.getElementById("playground")!.append(p);
  };
  backPingpong.callback = () => {
    const p = document.createElement("p");
    p.innerHTML = "Backwards Done";
    Object.assign(p.style, { position: "absolute", top: "88px" });
    document.getElementById("playground")!.append(p);
  };
})();
