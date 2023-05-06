import { resourceManager } from "frigame3/lib/resourceManager.js";
import { addSortedAnimation } from "frigame3/lib/plugins/sorted/SortedAnimation.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { addSortedGroup } from "frigame3/lib/plugins/sorted/SortedGroup.js";
import { addSortedSprite } from "frigame3/lib/plugins/sorted/SortedSprite.js";

(async () => {
  const floor = addSortedAnimation({
    imageURL: "Brown Block.png",
    originy: 128,
  });

  await resourceManager.preload();

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const grp_sorted = addSortedGroup(sg);

  for (let y = 1024; y > 0; y -= 80) {
    for (let x = 0; x < 1024; x += floor.width) {
      addSortedSprite(grp_sorted, {
        left: x,
        top: y,
        animation: floor,
      });
    }
  }
})();
