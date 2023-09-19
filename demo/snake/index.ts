import { Gradient } from "frigame3/lib/Gradient.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { Rectangle } from "frigame3/lib/Rectangle.js";
import { keyTracker } from "frigame3/lib/plugins/keyTracker.js";
import { Tweener } from "frigame3/lib/plugins/fx/Tweener.js";

(() => {
  const green = new Gradient({ g: 128 });
  const red = new Gradient({ r: 240 });
  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;

  const fx = new Tweener(playground);
  const endTween = () => {
    fx.tween(
      green.startColor,
      {
        r: Math.random() * 256,
        g: 128 + Math.random() * 128,
        b: Math.random() * 256,
      },
      { callback: endTween },
    );
  };
  endTween();

  const rect_size = 40;
  const max_x = Math.trunc(playground.width / rect_size);
  const max_y = Math.trunc(playground.height / rect_size);
  const snake: Rectangle[] = [];
  let apple = sg.addChild(
    new Rectangle({
      left: (1 + Math.trunc(Math.random() * (max_x - 2))) * rect_size,
      top: (1 + Math.trunc(Math.random() * (max_y - 2))) * rect_size,
      width: rect_size,
      height: rect_size,
      background: red,
    }),
  );
  let x = Math.trunc(max_x / 2);
  let y = Math.trunc(max_y / 2);
  let snake_length = 3;
  let add_x = 1;
  let add_y = 0;

  playground.registerCallback(() => {
    // Process inputs at every frame to be responsive
    if (keyTracker.ArrowLeft && add_x === 0) {
      add_x = -1;
      add_y = 0;
    }
    if (keyTracker.ArrowRight && add_x === 0) {
      add_x = 1;
      add_y = 0;
    }
    if (keyTracker.ArrowUp && add_y === 0) {
      add_x = 0;
      add_y = -1;
    }
    if (keyTracker.ArrowDown && add_y === 0) {
      add_x = 0;
      add_y = 1;
    }
  });

  playground.registerCallback(() => {
    // Process game logic at 100ms intervals
    x += add_x;
    y += add_y;

    if (x < 0 || x >= max_x || y < 0 || y >= max_y) {
      console.log("Out of bounds");
      playground.stopGame();
      playground.clearCallbacks();
    }

    let r: Rectangle;
    if (snake.length < snake_length) {
      r = sg.insertChild(
        new Rectangle({
          left: x * rect_size,
          top: y * rect_size,
          width: rect_size,
          height: rect_size,
          background: green,
        }),
      );
    } else {
      r = snake.shift()!;
      r.left = x * rect_size;
      r.top = y * rect_size;
      r.teleport();
    }
    for (const s of snake) {
      if (r.collideRect(s)) {
        console.log("Snake crashed into itself");
        playground.stopGame();
        playground.clearCallbacks();
      }
    }
    if (r.collideRect(apple)) {
      snake_length += 3;
      apple.left = (1 + Math.trunc(Math.random() * (max_x - 2))) * rect_size;
      apple.top = (1 + Math.trunc(Math.random() * (max_y - 2))) * rect_size;
      apple.teleport();
    }
    snake.push(r);
  }, 100);
})();
