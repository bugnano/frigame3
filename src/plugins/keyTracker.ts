let started = false;

export const keyTracker: Record<string, boolean> = {};

function onKeydown(e: KeyboardEvent) {
  keyTracker[e.code] = true;
}

function onKeyup(e: KeyboardEvent) {
  keyTracker[e.code] = false;
}

export function startKeyTracker() {
  if (!started) {
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    started = true;
  }
}

export function stopKeyTracker() {
  if (started) {
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("keyup", onKeyup);

    started = false;
  }
}

startKeyTracker();
