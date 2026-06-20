export interface Resource {
  complete: () => boolean;
  onLoad: () => void;
}

export class ResourceManager {
  loadCallback: ((percent: number) => void) | null = null;

  // Implementation details

  _idPreload: number | null = null;
  _preloadList: Resource[] = [];
  _resolveCallback: ((value?: undefined) => void) | null = null;
  _rejectCallback: (() => void) | null = null;
  _complete = true;

  complete(): boolean {
    return this._complete;
  }

  percent(): number {
    const len_preload_list = this._preloadList.length;

    if (len_preload_list === 0) {
      return 1;
    }

    const completed = this._preloadList.reduce(
      (accumulator: number, resource: Resource): number =>
        accumulator + Number(resource.complete()),
      0,
    );

    return completed / len_preload_list;
  }

  addResource<T extends Resource>(resource: T): T {
    this._preloadList.push(resource);

    return resource;
  }

  removeResource(
    resource: Resource | null,
    options?: { suppressWarning?: boolean },
  ): void {
    if (resource === null) {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("resource is null");
        console.trace();
      }
      return;
    }

    const index = this._preloadList.indexOf(resource);
    if (index >= 0) {
      this._preloadList.splice(index, 1);
    } else {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("No resources removed");
        console.trace();
      }
    }
  }

  clear(): void {
    this._preloadList.splice(0, this._preloadList.length);
  }

  preload(): Promise<void> {
    const reject_callback = this._rejectCallback;

    this._resolveCallback = null;
    this._rejectCallback = null;

    reject_callback?.();

    this._complete = false;

    // Call this._doPreload() now, in order to have the resources initialize
    // inside the function that called resourceManager.preload().
    // This is useful for preloading sounds in mobile environments, for
    // example, where the sounds will not load if audio.load() is not called in
    // an user event handler such as mousedown.
    this._doPreload();

    return new Promise((resolve: () => void, reject: () => void): void => {
      if (this._complete) {
        resolve();
      } else {
        this._resolveCallback = resolve;
        this._rejectCallback = reject;

        if (this._idPreload === null) {
          this._idPreload = setInterval(this._doPreload, 100);
        }
      }
    });
  }

  // Implementation details

  _doPreload = (): void => {
    const completed = this._preloadList.reduce(
      (accumulator: number, resource: Resource): number =>
        accumulator + Number(resource.complete()),
      0,
    );

    const len_preload_list = this._preloadList.length;
    const loadCallback = this.loadCallback;

    if (loadCallback !== null) {
      if (len_preload_list !== 0) {
        loadCallback(completed / len_preload_list);
      } else {
        loadCallback(1);
      }
    }

    if (completed === len_preload_list) {
      this._complete = true;

      if (this._idPreload !== null) {
        clearInterval(this._idPreload);
        this._idPreload = null;
      }

      for (const resource of this._preloadList) {
        resource.onLoad();
      }
      this._preloadList.splice(0, len_preload_list);

      const resolve_callback = this._resolveCallback;

      // Set to null this._resolveCallback before calling resolve_callback
      // in order to enable recursion
      this._resolveCallback = null;
      this._rejectCallback = null;

      resolve_callback?.();
    }
  };
}
