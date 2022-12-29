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

function preload() {
  const completed = preloadList.reduce(
    (accumulator, resource) =>
      resource.complete() ? accumulator + 1 : accumulator,
    0
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

    if (loadCallback) {
      resourceManager.loadCallback = null;
    }

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
  addResource(resource: Resource): void;
  removeResource(
    resource: Resource | null,
    options?: { suppressWarning?: boolean }
  ): void;
  clear(): void;
  preload(): Promise<void>;
}

export const resourceManager: ResourceManager = {
  loadCallback: null,

  addResource(resource: Resource) {
    preloadList.push(resource);
  },

  removeResource(
    resource: Resource | null,
    options?: { suppressWarning?: boolean }
  ) {
    if (!resource) {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
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
        (!options || options.suppressWarning === false)
      ) {
        console.warn("No resources removed");
        console.trace();
      }
    }
  },

  clear() {
    preloadList.splice(0, preloadList.length);
  },

  preload() {
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

    return new Promise((resolve, reject) => {
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
