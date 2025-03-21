import { Gradient } from "frigame3/lib/Gradient.js";
import { Playground } from "frigame3/lib/Playground.js";
import { canvasRenderer } from "frigame3/lib/canvasRenderer.js";
import { Rectangle } from "frigame3/lib/Rectangle.js";
import { keyTracker } from "frigame3/lib/plugins/keyTracker.js";
import { Tweener } from "frigame3/lib/plugins/fx/Tweener.js";
import { Tilemap } from "frigame3/lib/plugins/Tilemap.js";

const GAME_SPEED = 24;
const TYPEMATIC_SPEED = 12;
const TYPEMATIC_DOWN_SPEED = 3;

type Piece = "I" | "O" | "J" | "L" | "S" | "Z" | "T" | " ";

// tgm3Randomizer function taken from: https://simon.lc/the-history-of-tetris-randomizers
function* tgm3Randomizer(): Generator<Piece> {
  let pieces: Piece[] = ["I", "J", "L", "O", "S", "T", "Z"];
  let order: Piece[] = [];

  // Create 35 pool.
  let pool = pieces.concat(pieces, pieces, pieces, pieces);

  // First piece special conditions
  let piece: Piece = (["I", "J", "L", "T"] as const)[
    Math.floor(Math.random() * 4)
  ];
  yield piece;

  let history: Piece[] = ["S", "Z", "S", piece];

  let i = 0;
  while (true) {
    // Roll For piece
    for (let roll = 0; roll < 6; roll += 1) {
      i = Math.floor(Math.random() * 35);
      piece = pool[i];

      if (history.includes(piece) === false || roll === 5) {
        break;
      }

      if (order.length) {
        pool[i] = order[0];
      }
    }

    // Update piece order
    if (order.includes(piece)) {
      order.splice(order.indexOf(piece), 1);
    }
    order.push(piece);

    pool[i] = order[0];

    // Update history
    history.shift();
    history.push(piece);

    yield piece;
  }
}

function clearPiece(
  level: Piece[][],
  block: Piece[][],
  pos_x: number,
  pos_y: number,
) {
  for (let y = 0; y < block.length; y += 1) {
    for (let x = 0; x < block.length; x += 1) {
      if (block[y][x] !== " ") {
        if (
          pos_y + y >= 0 &&
          pos_y + y < level.length &&
          pos_x + x >= 0 &&
          pos_x + x < level[pos_y + y].length
        ) {
          level[pos_y + y][pos_x + x] = " ";
        }
      }
    }
  }
}

function drawPiece(
  level: Piece[][],
  block: Piece[][],
  pos_x: number,
  pos_y: number,
) {
  for (let y = 0; y < block.length; y += 1) {
    for (let x = 0; x < block.length; x += 1) {
      if (block[y][x] !== " ") {
        if (
          pos_y + y >= 0 &&
          pos_y + y < level.length &&
          pos_x + x >= 0 &&
          pos_x + x < level[pos_y + y].length
        ) {
          level[pos_y + y][pos_x + x] = block[y][x];
        }
      }
    }
  }
}

function fitsPiece(
  level: Piece[][],
  block: Piece[][],
  pos_x: number,
  pos_y: number,
) {
  for (let y = 0; y < block.length; y += 1) {
    for (let x = 0; x < block.length; x += 1) {
      if (block[y][x] !== " ") {
        // Out of bounds check
        if (
          pos_y + y < 0 ||
          pos_y + y >= level.length ||
          pos_x + x < 0 ||
          pos_x + x >= level[pos_y + y].length
        ) {
          return false;
        }

        // Occupied check
        if (level[pos_y + y][pos_x + x] !== " ") {
          return false;
        }
      }
    }
  }

  return true;
}

(() => {
  const BLOCK_SIZE = 40;

  const BLOCK_I: Piece[][][] = [
    [
      [" ", " ", " ", " "],
      ["I", "I", "I", "I"],
      [" ", " ", " ", " "],
      [" ", " ", " ", " "],
    ],
    [
      [" ", " ", "I", " "],
      [" ", " ", "I", " "],
      [" ", " ", "I", " "],
      [" ", " ", "I", " "],
    ],
  ];

  const BLOCK_O: Piece[][][] = [
    [
      ["O", "O"],
      ["O", "O"],
    ],
  ];

  const BLOCK_J: Piece[][][] = [
    [
      [" ", " ", " "],
      ["J", "J", "J"],
      [" ", " ", "J"],
    ],
    [
      [" ", "J", "J"],
      [" ", "J", " "],
      [" ", "J", " "],
    ],
    [
      ["J", " ", " "],
      ["J", "J", "J"],
      [" ", " ", " "],
    ],
    [
      [" ", "J", " "],
      [" ", "J", " "],
      ["J", "J", " "],
    ],
  ];

  const BLOCK_L: Piece[][][] = [
    [
      [" ", " ", " "],
      ["L", "L", "L"],
      ["L", " ", " "],
    ],
    [
      [" ", "L", " "],
      [" ", "L", " "],
      [" ", "L", "L"],
    ],
    [
      [" ", " ", "L"],
      ["L", "L", "L"],
      [" ", " ", " "],
    ],
    [
      ["L", "L", " "],
      [" ", "L", " "],
      [" ", "L", " "],
    ],
  ];

  const BLOCK_S: Piece[][][] = [
    [
      [" ", " ", " "],
      [" ", "S", "S"],
      ["S", "S", " "],
    ],
    [
      [" ", "S", " "],
      [" ", "S", "S"],
      [" ", " ", "S"],
    ],
  ];

  const BLOCK_Z: Piece[][][] = [
    [
      [" ", " ", " "],
      ["Z", "Z", " "],
      [" ", "Z", "Z"],
    ],
    [
      [" ", "Z", " "],
      ["Z", "Z", " "],
      ["Z", " ", " "],
    ],
  ];

  const BLOCK_T: Piece[][][] = [
    [
      [" ", " ", " "],
      ["T", "T", "T"],
      [" ", "T", " "],
    ],
    [
      [" ", "T", " "],
      [" ", "T", "T"],
      [" ", "T", " "],
    ],
    [
      [" ", "T", " "],
      ["T", "T", "T"],
      [" ", " ", " "],
    ],
    [
      [" ", "T", " "],
      ["T", "T", " "],
      [" ", "T", " "],
    ],
  ];

  const BLOCKS: Record<Piece, Piece[][][]> = {
    I: BLOCK_I,
    O: BLOCK_O,
    J: BLOCK_J,
    L: BLOCK_L,
    S: BLOCK_S,
    Z: BLOCK_Z,
    T: BLOCK_T,
    " ": [[[]]],
  };

  const COLOURS: Record<Piece, Gradient> = {
    I: new Gradient([0, 176, 220]),
    O: new Gradient([253, 214, 49]),
    J: new Gradient([0, 116, 197]),
    L: new Gradient([255, 161, 18]),
    S: new Gradient([113, 209, 37]),
    Z: new Gradient([240, 65, 72]),
    T: new Gradient([148, 45, 154]),
    " ": new Gradient([28, 28, 28]),
  };

  // NES Tetris is 10x20 blocks
  const level: Piece[][] = [
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
    Array(10).fill(" "),
  ];

  const playground = new Playground(canvasRenderer);
  const sg = playground.scenegraph;
  const box = sg.addChild(
    new Rectangle({
      centerx: sg.width / 2,
      centery: sg.centery,
      width: 10 * BLOCK_SIZE,
      height: 20 * BLOCK_SIZE,
      borderWidth: BLOCK_SIZE,
      borderColor: [128, 128, 128],
    }),
  );

  const content = sg.addChild(
    new Tilemap({
      centerx: sg.width / 2,
      centery: sg.centery,
      sizex: 10,
      sizey: 20,
      tileWidth: BLOCK_SIZE,
      tileHeight: BLOCK_SIZE,
      data: Array(10 * 20).fill(1),
      animationList: { 1: { background: COLOURS[" "] } },
    }),
  );

  const preview_box = sg.addChild(
    new Rectangle({
      centerx: (sg.width * 3) / 4,
      centery: sg.height / 3,
      width: 6 * BLOCK_SIZE,
      height: 6 * BLOCK_SIZE,
      borderWidth: BLOCK_SIZE,
      borderColor: [128, 128, 128],
    }),
  );

  const preview = sg.addChild(
    new Tilemap({
      centerx: (sg.width * 3) / 4,
      centery: sg.height / 3,
      sizex: 6,
      sizey: 6,
      tileWidth: BLOCK_SIZE,
      tileHeight: BLOCK_SIZE,
      data: Array(6 * 6).fill(1),
      animationList: { 1: { background: COLOURS[" "] } },
    }),
  );

  const preview_pieces: Piece[][] = [
    Array(6).fill(" "),
    Array(6).fill(" "),
    Array(6).fill(" "),
    Array(6).fill(" "),
    Array(6).fill(" "),
    Array(6).fill(" "),
  ];

  let delay_counter = GAME_SPEED;
  const gen = tgm3Randomizer();
  let piece: Piece = gen.next().value;
  let next_piece: Piece = gen.next().value;
  let rotation = 0;
  let block = BLOCKS[piece][rotation];
  let next_block = BLOCKS[next_piece][0];
  let pos_x = Math.floor(5 - block.length / 2);
  let pos_y = 0;

  drawPiece(preview_pieces, next_block, 1, 1);

  for (let y = 0; y < block.length; y += 1) {
    for (let x = 0; x < block.length; x += 1) {
      if (block[y][x] !== " ") {
        if (
          pos_y + y >= 0 &&
          pos_y + y < level.length &&
          pos_x + x >= 0 &&
          pos_x + x < level[pos_y + y].length
        ) {
          level[pos_y + y][pos_x + x] = block[y][x];
        }
      }
    }
  }

  let typematic_left = 0;
  let typematic_right = 0;
  let old_up = true;
  let typematic_down = 0;
  let paused = false;
  let old_p = false;
  playground.registerCallback(() => {
    if (keyTracker.KeyP && !old_p) {
      paused = !paused;
    }

    old_p = keyTracker.KeyP;

    if (paused) {
      return;
    }

    // Process inputs at every frame to be responsive
    if (keyTracker.ArrowLeft) {
      if (typematic_left === 0) {
        typematic_left = TYPEMATIC_SPEED;
        clearPiece(level, block, pos_x, pos_y);

        if (fitsPiece(level, block, pos_x - 1, pos_y)) {
          pos_x -= 1;
        }

        drawPiece(level, block, pos_x, pos_y);
      } else {
        if (typematic_left > 0) {
          typematic_left -= 1;
        }
      }
    } else {
      typematic_left = 0;
    }

    if (keyTracker.ArrowRight) {
      if (typematic_right === 0) {
        typematic_right = TYPEMATIC_SPEED;
        clearPiece(level, block, pos_x, pos_y);

        if (fitsPiece(level, block, pos_x + 1, pos_y)) {
          pos_x += 1;
        }

        drawPiece(level, block, pos_x, pos_y);
      } else {
        if (typematic_right > 0) {
          typematic_right -= 1;
        }
      }
    } else {
      typematic_right = 0;
    }
    if (keyTracker.ArrowUp && !old_up) {
      clearPiece(level, block, pos_x, pos_y);

      const new_rotation = (rotation + 1) % BLOCKS[piece].length;
      const new_block = BLOCKS[piece][new_rotation];
      if (fitsPiece(level, new_block, pos_x, pos_y)) {
        rotation = new_rotation;
        block = new_block;
      }

      drawPiece(level, block, pos_x, pos_y);
    }

    old_up = keyTracker.ArrowUp;

    if (keyTracker.ArrowDown) {
      if (typematic_down === 0) {
        typematic_down = TYPEMATIC_DOWN_SPEED;
        delay_counter = 0;
      } else {
        if (typematic_down > 0) {
          typematic_down -= 1;
        }
      }
    } else {
      typematic_down = 0;
    }

    delay_counter -= 1;
    if (delay_counter <= 0) {
      delay_counter = GAME_SPEED;

      clearPiece(level, block, pos_x, pos_y);

      if (fitsPiece(level, block, pos_x, pos_y + 1)) {
        pos_y += 1;
      } else {
        drawPiece(level, block, pos_x, pos_y);

        // Delete cleared lines
        for (let y = level.length - 1; y >= 0; y -= 1) {
          if (!level[y].includes(" ")) {
            level.splice(y, 1);
          }
        }
        const lines_to_add = 20 - level.length;
        for (let i = 0; i < lines_to_add; i += 1) {
          level.unshift(Array(10).fill(" "));
        }

        // Next piece
        clearPiece(preview_pieces, next_block, 1, 1);
        piece = next_piece;
        next_piece = gen.next().value;
        rotation = 0;
        block = BLOCKS[piece][rotation];
        next_block = BLOCKS[next_piece][0];
        pos_x = Math.floor(5 - block.length / 2);
        pos_y = 0;
        if (!fitsPiece(level, block, pos_x, pos_y)) {
          // TODO: GAME OVER
          playground.stopGame();
        }

        drawPiece(preview_pieces, next_block, 1, 1);
      }

      drawPiece(level, block, pos_x, pos_y);
    }

    // Draw the level
    for (let y = 0; y < 20; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        const tile = content.getAt(y, x);
        if ("background" in tile) {
          tile.background = COLOURS[level[y][x]];
        }
      }
    }

    // Draw the preview
    for (let y = 0; y < 6; y += 1) {
      for (let x = 0; x < 6; x += 1) {
        const tile = preview.getAt(y, x);
        if ("background" in tile) {
          tile.background = COLOURS[preview_pieces[y][x]];
        }
      }
    }
  });
})();
