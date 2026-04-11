import { canvasRenderer } from "frigame3/dist/canvasRenderer.js";
import { Playground } from "frigame3/dist/Playground.js";
import { SortedAnimation } from "frigame3/dist/plugins/sorted/SortedAnimation.js";
import { SortedGroup } from "frigame3/dist/plugins/sorted/SortedGroup.js";
import { SortedSprite } from "frigame3/dist/plugins/sorted/SortedSprite.js";
import { resourceManager as rm } from "frigame3/dist/resourceManager.js";

void (async () => {
  const floor = rm.addResource(
    new SortedAnimation({
      imageURL: "Brown Block.png",
      originy: 128,
    }),
  );

  await rm.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const grp_sorted = sg.addChild(
    new SortedGroup({ width: sg.width, height: sg.height }),
  );

  for (let y = 1024; y > 0; y -= 80) {
    for (let x = 0; x < 1024; x += floor.width) {
      grp_sorted.addChild(
        new SortedSprite({
          left: x,
          top: y,
          animation: floor,
        }),
      );
    }
  }
})();
