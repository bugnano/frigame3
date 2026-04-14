import { canvasRenderer } from "frigame3/dist/canvasRenderer.js";
import { Playground } from "frigame3/dist/Playground.js";
import { ISOSpriteGroup } from "frigame3/dist/plugins/isometric/ISOSpriteGroup.js";
import { ISOTilemap } from "frigame3/dist/plugins/isometric/ISOTilemap.js";
import { SortedAnimation } from "frigame3/dist/plugins/sorted/SortedAnimation.js";
import { resourceManager as rm } from "frigame3/dist/resourceManager.js";
import { SpriteGroup } from "frigame3/dist/SpriteGroup.js";

void (async (): Promise<void> => {
  const beach = rm.addResource(
    new SortedAnimation({
      imageURL: "beach.png",
      originx: 50,
      originy: 25,
    }),
  );
  const grass = rm.addResource(new SortedAnimation("grass.png"));
  const water = rm.addResource(
    new SortedAnimation({
      imageURL: "water.png",
      originx: 50,
      originy: 25,
    }),
  );

  const tileDescription = {
    sizex: 8,
    sizey: 8,
    tileSize: 50,
    // biome-ignore format: reason
    data: [
      3,1,1,1,1,1,1,2,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      2,1,1,1,1,1,1,3,
    ],
    animationList: {
      1: { animation: beach },
      2: { animation: grass, originx: 50, originy: 25 },
      3: { animation: water },
    },
  };

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const my_group = sg.addChild(new SpriteGroup({ left: 400 }));
  const iso_group = my_group.addChild(
    new ISOSpriteGroup({
      referencex: 0,
      referencey: 0,
      originx: 0,
      originy: 0,
    }),
  );
  const tilemap = iso_group.addChild(new ISOTilemap(tileDescription));

  // biome-ignore lint/suspicious/noExplicitAny: reason
  (window as any).tilemap = tilemap;
})();
