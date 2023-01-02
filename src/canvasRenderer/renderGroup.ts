import { SpriteGroup } from "../SpriteGroup.js";
import { playgroundMap } from "./renderPlayground.js";
import { roundRect } from "./renderRectangle.js";

export const spriteGroupMap = new WeakMap<
  SpriteGroup,
  {
    oldAlpha: number;
    alphaChanged: boolean;
    oldBlendMode: GlobalCompositeOperation;
    blendModeChanged: boolean;
    left: number;
    top: number;
    contextSaved: boolean;
  }
>();

export function initGroup(group: SpriteGroup) {
  spriteGroupMap.set(group, {
    oldAlpha: 1,
    alphaChanged: false,
    oldBlendMode: "source-over",
    blendModeChanged: false,
    left: 0,
    top: 0,
    contextSaved: false,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeGroup(group: SpriteGroup) {
  // no-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function drawGroupBeforeChildren(group: SpriteGroup, interp: number) {
  const opacity = group._opacity;
  const scaleh = group._scaleh;
  const scalev = group._scalev;

  if (group._layers.length && opacity && scaleh && scalev && !group.hidden) {
    const playground = group.playground!;

    const playgroundData = playgroundMap.get(playground)!;
    const ctx = playgroundData.ctx;

    const groupData = spriteGroupMap.get(group)!;

    const angle = group.angle;
    const crop = group.crop;

    groupData.contextSaved = false;
    if (angle || scaleh !== 1 || scalev !== 1 || crop) {
      ctx.save();
      groupData.contextSaved = true;
    }

    groupData.oldAlpha = playgroundData.globalAlpha;
    groupData.alphaChanged = false;
    if (opacity !== 1) {
      // Don't save the entire context only for opacity changes
      playgroundData.globalAlpha *= opacity;

      ctx.globalAlpha = playgroundData.globalAlpha;

      groupData.alphaChanged = true;
    }

    groupData.blendModeChanged = false;
    const blendMode = group.blendMode;
    if (blendMode !== "normal") {
      groupData.oldBlendMode = ctx.globalCompositeOperation;

      if (blendMode === "add") {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = blendMode;
      }

      groupData.blendModeChanged = true;
    }

    const trunc = Math.trunc;
    const left = group._drawLeft;
    const top = group._drawTop;

    if (angle || scaleh !== 1 || scalev !== 1) {
      let transformOriginx = group.transformOriginx;

      if (typeof transformOriginx === "string") {
        transformOriginx = group[transformOriginx];
      }

      transformOriginx = trunc(transformOriginx);

      let transformOriginy = group.transformOriginy;

      if (typeof transformOriginy === "string") {
        transformOriginy = group[transformOriginy];
      }

      transformOriginy = trunc(transformOriginy);

      ctx.translate(left + transformOriginx, top + transformOriginy);

      if (angle) {
        ctx.rotate(angle);
      }

      if (scaleh !== 1 || scalev !== 1) {
        ctx.scale(scaleh, scalev);
      }

      ctx.translate(-transformOriginx, -transformOriginy);
    } else {
      groupData.left = left;
      groupData.top = top;

      if (left || top) {
        ctx.translate(left, top);
      }
    }

    if (group.crop) {
      // Prepare a rect path for the clipping region
      ctx.beginPath();

      const width = group._drawWidth;
      const height = group._drawHeight;
      const border_radius = trunc(group.borderRadius);

      if (border_radius > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (ctx.roundRect) {
          ctx.roundRect(0, 0, width, height, border_radius);
        } else {
          roundRect(ctx, 0, 0, width, height, border_radius);
        }
      } else {
        ctx.rect(0, 0, width, height);
      }

      ctx.closePath();

      ctx.clip();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function drawGroupAfterChildren(group: SpriteGroup, interp: number) {
  if (
    group._layers.length &&
    group._opacity &&
    group._scaleh &&
    group._scalev &&
    !group.hidden
  ) {
    const playground = group.playground!;
    const playgroundData = playgroundMap.get(playground)!;
    const groupData = spriteGroupMap.get(group)!;

    const ctx = playgroundData.ctx;

    if (groupData.contextSaved) {
      // ctx.restore restores also the globalCompositeOperation and globalAlpha values
      ctx.restore();

      playgroundData.globalAlpha = groupData.oldAlpha;
    } else {
      const left = groupData.left;
      const top = groupData.top;

      if (left || top) {
        ctx.translate(-left, -top);
      }

      if (groupData.blendModeChanged) {
        ctx.globalCompositeOperation = groupData.oldBlendMode;
      }

      if (groupData.alphaChanged) {
        ctx.globalAlpha = groupData.oldAlpha;

        playgroundData.globalAlpha = groupData.oldAlpha;
      }
    }
  }
}
