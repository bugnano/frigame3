let started = false;

export const keyTracker: Record<string, boolean> = {};

function onKeydown(e: KeyboardEvent): void {
  keyTracker[e.code] = true;
}

function onKeyup(e: KeyboardEvent): void {
  keyTracker[e.code] = false;
}

export function startKeyTracker(): void {
  if (!started) {
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    started = true;
  }
}

export function stopKeyTracker(): void {
  if (started) {
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("keyup", onKeyup);

    started = false;
  }
}

startKeyTracker();
