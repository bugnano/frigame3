import { resourceManager } from "frigame3/lib/resourceManager.js";
import { addAnimation } from "frigame3/lib/Animation.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { addSprite } from "frigame3/lib/Sprite.js";
import type { Sprite } from "frigame3/lib/Sprite.js";

(async () => {
  const simpleVerticalAnimation = addAnimation({
    imageURL: "sv.png",
    type: "vertical",
    numberOfFrame: 4,
    rate: 300,
  });

  const simpleHorizontalAnimation = addAnimation({
    imageURL: "sh.png",
    type: "horizontal",
    numberOfFrame: 4,
    rate: 300,
  });

  const multiVerticalAnimation = addAnimation({
    imageURL: "mv.png",
    type: "vertical",
    numberOfFrame: 4,
    rate: 300,
    frameWidth: 32,
  });

  const multiHorizontalAnimation = addAnimation({
    imageURL: "mh.png",
    type: "horizontal",
    numberOfFrame: 4,
    rate: 300,
    frameHeight: 32,
  });

  const simpleOffsetVerticalAnimation = addAnimation({
    imageURL: "sov.png",
    type: "vertical",
    numberOfFrame: 4,
    rate: 300,
    offsetx: 100,
    offsety: 100,
  });

  const simpleOffsetHorizontalAnimation = addAnimation({
    imageURL: "soh.png",
    type: "horizontal",
    numberOfFrame: 4,
    rate: 300,
    offsetx: 100,
    offsety: 100,
  });

  const multiOffsetVerticalAnimation = addAnimation({
    imageURL: "mov.png",
    type: "vertical",
    numberOfFrame: 4,
    rate: 300,
    offsetx: 100,
    offsety: 100,
    frameWidth: 32,
  });

  const multiOffsetHorizontalAnimation = addAnimation({
    imageURL: "moh.png",
    type: "horizontal",
    numberOfFrame: 4,
    rate: 300,
    offsetx: 100,
    offsety: 100,
    frameHeight: 32,
  });

  const pingpongAnimation = addAnimation({
    imageURL: "rebound.png",
    type: "horizontal",
    once: true,
    pingpong: true,
    numberOfFrame: 9,
    //rate: 60
    rate: 600,
  });

  const multiPingpongAnimation = addAnimation({
    imageURL: "reboundm.png",
    type: "horizontal",
    pingpong: true,
    numberOfFrame: 9,
    rate: 60,
    frameHeight: 64,
  });

  const pingpongBackwardsAnimation = addAnimation({
    imageURL: "rebound.png",
    type: "horizontal",
    once: true,
    pingpong: true,
    backwards: true,
    numberOfFrame: 9,
    //rate: 60
    rate: 600,
  });

  const multiPingpongBackwardsAnimation = addAnimation({
    imageURL: "reboundm.png",
    type: "horizontal",
    pingpong: true,
    backwards: true,
    numberOfFrame: 9,
    rate: 60,
    frameHeight: 64,
  });

  await resourceManager.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const simpleVertical = addSprite(sg, {
    animation: simpleVerticalAnimation,
    left: 0,
  });
  const simpleHorizontal = addSprite(sg, {
    animation: simpleHorizontalAnimation,
    backwards: true,
    left: 34,
  });
  const multiVertical = addSprite(sg, {
    animation: multiVerticalAnimation,
    left: 75,
  });
  const multiHorizontal = addSprite(sg, {
    animation: multiHorizontalAnimation,
    left: 109,
  });
  const simpleOffsetVertical = addSprite(sg, {
    animation: simpleOffsetVerticalAnimation,
    left: 150,
  });
  const simpleOffsetHorizontal = addSprite(sg, {
    animation: simpleOffsetHorizontalAnimation,
    left: 184,
  });
  const multiOffsetVertical = addSprite(sg, {
    animation: multiOffsetVerticalAnimation,
    animationIndex: 1,
    left: 225,
  });
  const multiOffsetHorizontal = addSprite(sg, {
    animation: multiOffsetHorizontalAnimation,
    animationIndex: 1,
    left: 259,
  });
  const pingpong = addSprite(sg, {
    animation: pingpongAnimation,
    left: 286,
  });
  const multiPingpong = addSprite(sg, {
    animation: multiPingpongAnimation,
    left: 350,
  });
  const backPingpong = addSprite(sg, {
    animation: pingpongBackwardsAnimation,
    left: 414,
  });
  const multiBackPingpong = addSprite(sg, {
    animation: multiPingpongBackwardsAnimation,
    animationIndex: 1,
    left: 478,
  });

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
