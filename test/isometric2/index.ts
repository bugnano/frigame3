import { canvasRenderer } from "frigame3/dist/canvasRenderer.js";
import { Playground } from "frigame3/dist/Playground.js";
import { ISOSprite } from "frigame3/dist/plugins/isometric/ISOSprite.js";
import { ISOTilemap } from "frigame3/dist/plugins/isometric/ISOTilemap.js";
import { gridFromScreen } from "frigame3/dist/plugins/isometric/utils.js";
import { SortedAnimation } from "frigame3/dist/plugins/sorted/SortedAnimation.js";
import { resourceManager as rm } from "frigame3/dist/resourceManager.js";
import { SpriteGroup } from "frigame3/dist/SpriteGroup.js";

void (async () => {
  const floor = rm.addResource(
    new SortedAnimation({
      imageURL: "tile.png",
      originx: 64,
      originy: 32,
    }),
  );
  const ice_floor = rm.addResource(
    new SortedAnimation({
      imageURL: "ice.png",
      originx: 64,
      originy: 54,
    }),
  );
  const block = rm.addResource(
    new SortedAnimation({
      imageURL: "tile.png",
      originx: 64,
      originy: 96,
    }),
  );
  const ice = rm.addResource(
    new SortedAnimation({
      imageURL: "ice.png",
      originx: 64,
      originy: 118,
    }),
  );
  const knight = rm.addResource(
    new SortedAnimation({
      imageURL: "knight_se.png",
      numberOfFrame: 8,
    }),
  );

  const animationList = {
    1: { animation: floor },
    2: { animation: ice_floor },
    3: { animation: block },
    4: { animation: ice, opacity: 0.8 },
  };

  const floorTiles = {
    sizex: 8,
    sizey: 8,
    tileSize: 64,
    // biome-ignore format: reason
    data: [
      1,1,1,1,1,1,1,1,
      1,1,1,1,2,2,2,1,
      1,1,1,1,2,1,2,1,
      1,1,1,1,1,1,2,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
    ],
    animationList,
  };

  const objectTiles = {
    sizex: 8,
    sizey: 8,
    tileSize: 64,
    // biome-ignore format: reason
    data: [
      4,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,3,0,0,
      0,0,0,0,0,3,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,4,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
    ],
    animationList,
  };

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const my_group = sg.addChild(new SpriteGroup({ left: 512, top: 64 }));

  // floor_tilemap
  my_group.addChild(new ISOTilemap(floorTiles));

  const object_tilemap = my_group.addChild(new ISOTilemap(objectTiles));
  const iso_knight = object_tilemap.addChild(
    new ISOSprite({
      centerx: 256,
      centery: 256,
      radius: 32,
      animation: knight,
      rate: 100,
    }),
  );

  document.getElementById("playground")!.addEventListener("mousedown", (e) => {
    const box = document.getElementById("playground")!.getBoundingClientRect();

    const clicked_x = e.pageX - box.left;
    const clicked_y = e.pageY - box.top;

    const [iso_x, iso_y] = gridFromScreen(
      clicked_x - my_group.left,
      clicked_y - my_group.top,
    );

    iso_knight.centerx = iso_x;
    iso_knight.centery = iso_y;
  });

  // biome-ignore lint/suspicious/noExplicitAny: reason
  (window as any).object_tilemap = object_tilemap;
})();
