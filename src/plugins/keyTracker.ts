export const keyTracker: Record<string, boolean> = {};

function onKeydown(e: KeyboardEvent) {
  keyTracker[e.code] = true;
}

function onKeyup(e: KeyboardEvent) {
  keyTracker[e.code] = false;
}

export function startKeyTracker() {
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("keyup", onKeyup);
}

export function stopKeyTracker() {
  document.removeEventListener("keydown", onKeydown);
  document.removeEventListener("keyup", onKeyup);
}
