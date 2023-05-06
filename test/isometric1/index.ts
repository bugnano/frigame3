import { resourceManager } from "frigame3/lib/resourceManager.js";
import { addSortedAnimation } from "frigame3/lib/plugins/sorted/SortedAnimation.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { addGroup } from "frigame3/lib/SpriteGroup.js";
import { addISOGroup } from "frigame3/lib/plugins/isometric/ISOSpriteGroup.js";
import { addISOTilemap } from "frigame3/lib/plugins/isometric/ISOTilemap.js";

(async () => {
  const beach = addSortedAnimation({
    imageURL: "beach.png",
    originx: 50,
    originy: 25,
  });
  const grass = addSortedAnimation("grass.png");
  const water = addSortedAnimation({
    imageURL: "water.png",
    originx: 50,
    originy: 25,
  });

  const tileDescription = {
    sizex: 8,
    sizey: 8,
    tileSize: 50,
    data: /* prettier-ignore */ [
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

  await resourceManager.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const my_group = addGroup(sg, { left: 400 });
  const iso_group = addISOGroup(my_group, {
    referencex: 0,
    referencey: 0,
    originx: 0,
    originy: 0,
  });
  const tilemap = addISOTilemap(iso_group, tileDescription);

  (window as any).tilemap = tilemap;
})();
