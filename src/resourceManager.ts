export interface Resource {
  complete: () => boolean;
  onLoad: () => void;
}

// Implementation details

let idPreload: number | null = null;
const preloadList: Resource[] = [];
let resolveCallback: ((value?: undefined) => void) | null = null;
let rejectCallback: (() => void) | null = null;
let complete = false;

function preload(): void {
  const completed = preloadList.reduce(
    (accumulator: number, resource: Resource): number =>
      resource.complete() ? accumulator + 1 : accumulator,
    0,
  );

  const len_preload_list = preloadList.length;
  const loadCallback = resourceManager.loadCallback;

  if (loadCallback) {
    if (len_preload_list !== 0) {
      loadCallback(completed / len_preload_list);
    } else {
      loadCallback(1);
    }
  }

  if (completed === len_preload_list) {
    complete = true;

    if (idPreload !== null) {
      clearInterval(idPreload);
      idPreload = null;
    }

    for (const resource of preloadList) {
      resource.onLoad();
    }
    preloadList.splice(0, len_preload_list);

    const resolve_callback = resolveCallback;

    // Set to null the resolveCallback before calling the resolveCallback
    // in order to enable recursion
    resolveCallback = null;
    rejectCallback = null;

    if (resolve_callback) {
      resolve_callback();
    }
  }
}

export interface ResourceManager {
  loadCallback: ((percent: number) => void) | null;
  addResource<T extends Resource>(resource: T): T;
  removeResource(
    resource: Resource | null,
    options?: { suppressWarning?: boolean },
  ): void;
  clear(): void;
  preload(): Promise<void>;
}

export const resourceManager: ResourceManager = {
  loadCallback: null,

  addResource<T extends Resource>(resource: T): T {
    preloadList.push(resource);

    return resource;
  },

  removeResource(
    resource: Resource | null,
    options?: { suppressWarning?: boolean },
  ): void {
    if (!resource) {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("resource is null");
        console.trace();
      }
      return;
    }

    const index = preloadList.indexOf(resource);
    if (index >= 0) {
      preloadList.splice(index, 1);
    } else {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("No resources removed");
        console.trace();
      }
    }
  },

  clear(): void {
    preloadList.splice(0, preloadList.length);
  },

  preload(): Promise<void> {
    const reject_callback = rejectCallback;

    resolveCallback = null;
    rejectCallback = null;

    reject_callback?.();

    complete = false;

    // Call preload() now, in order to have the resources initialize inside the
    // function that called resourceManager.preload().
    // This is useful for preloading sounds in mobile environments, for
    // example, where the sounds will not load if audio.load() is not called in
    // an user event handler such as mousedown.
    preload();

    return new Promise((resolve: () => void, reject: () => void): void => {
      if (complete) {
        resolve();
      } else {
        resolveCallback = resolve;
        rejectCallback = reject;

        if (idPreload === null) {
          idPreload = setInterval(preload, 100);
        }
      }
    });
  },
};
