import assert from 'assert';
import { useEffect, useReducer } from 'react';
import tuple from 'immutable-tuple';

const pageLoadTime = new Date();

const globalCache: Map<any, any> = new Map();
const errorCache: Map<any, any> = new Map();

class FetchLoops {
  loops = new Map();

  addListener(listener) {
    if (!this.loops.has(listener.cacheKey)) {
      this.loops.set(
        listener.cacheKey,
        new FetchLoopInternal(listener.cacheKey, listener.fn),
      );
    }
    this.loops.get(listener.cacheKey).addListener(listener);
  }

  removeListener(listener) {
    let loop = this.loops.get(listener.cacheKey);
    loop.removeListener(listener);
    if (loop.stopped) {
      this.loops.delete(listener.cacheKey);
    }
  }

  refresh(cacheKey) {
    if (this.loops.has(cacheKey)) {
      this.loops.get(cacheKey).refresh();
    }
  }

  refreshAll() {
    return Promise.all([...this.loops.values()].map((loop) => loop.refresh()));
  }
}
const globalLoops = new FetchLoops();

class FetchLoopListener<T = any> {
  cacheKey: any;
  fn: () => Promise<T>;
  refreshInterval: number;
  callback: () => void;

  constructor(
    cacheKey: any,
    fn: () => Promise<T>,
    refreshInterval: number,
    callback: () => void,
  ) {
    this.cacheKey = cacheKey;
    this.fn = fn;
    this.refreshInterval = refreshInterval;
    this.callback = callback;
  }
}

class FetchLoopInternal<T = any> {
  cacheKey: any;
  fn: () => Promise<T>;
  timeoutId: null | any;
  listeners: Set<FetchLoopListener<T>>;
  errors: number;

  constructor(cacheKey: any, fn: () => Promise<T>) {
    this.cacheKey = cacheKey;
    this.fn = fn;
    this.timeoutId = null;
    this.listeners = new Set();
    this.errors = 0;
  }

  get refreshInterval(): number {
    return Math.min(
      ...[...this.listeners].map((listener) => listener.refreshInterval),
    );
  }

  get stopped(): boolean {
    return this.listeners.size === 0;
  }

  addListener(listener: FetchLoopListener<T>): void {
    const previousRefreshInterval = this.refreshInterval;
    this.listeners.add(listener);
    if (this.refreshInterval < previousRefreshInterval) {
      this.refresh();
    }
  }

  removeListener(listener: FetchLoopListener<T>): void {
    assert(this.listeners.delete(listener));
    if (this.stopped) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }

  notifyListeners(): void {
    this.listeners.forEach((listener) => listener.callback());
  }

  refresh = async () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.stopped) {
      return;
    }

    try {
      const data = await this.fn();
      globalCache.set(this.cacheKey, data);
      errorCache.delete(this.cacheKey);
      this.errors = 0;
      return data;
    } catch (error) {
      ++this.errors;
      globalCache.delete(this.cacheKey);
      errorCache.set(this.cacheKey, error);
      console.warn(error);
    } finally {
      this.notifyListeners();
      if (!this.timeoutId && !this.stopped) {
        let waitTime = this.refreshInterval;

        // Back off on errors.
        if (this.errors > 0) {
          waitTime = Math.min(1000 * 2 ** (this.errors - 1), 60000);
        }

        // Don't do any refreshing for the first five seconds, to make way for other things to load.
        const timeSincePageLoad = +new Date() - +pageLoadTime;
        if (timeSincePageLoad < 5000) {
          waitTime += 5000 - timeSincePageLoad / 2;
        }

        // Refresh background pages slowly.
        if (document.visibilityState === 'hidden') {
          waitTime = 60000;
        } else if (!document.hasFocus()) {
          waitTime *= 1.5;
        }

        // Add jitter so we don't send all requests at the same time.
        waitTime *= 0.8 + 0.4 * Math.random();

        this.timeoutId = setTimeout(this.refresh, waitTime);
      }
    }
  };
}

// returns [data, loaded, error]
// loaded is false when error is present for backwards compatibility
export function useAsyncData<T = any>(
  asyncFn: () => Promise<T>,
  cacheKey: any,
  { refreshInterval = 60000 } = {},
): [null | undefined | T, boolean, any] {
  const [, rerender] = useReducer((i) => i + 1, 0);
  cacheKey = formatCacheKey(cacheKey);

  useEffect(() => {
    if (!cacheKey) {
      return;
    }
    const listener = new FetchLoopListener<T>(
      cacheKey,
      asyncFn,
      refreshInterval,
      rerender,
    );
    globalLoops.addListener(listener);
    return () => globalLoops.removeListener(listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, refreshInterval]);

  if (!cacheKey) {
    return [null, false, undefined];
  }

  const loaded = globalCache.has(cacheKey);
  const error = errorCache.has(cacheKey) ? errorCache.get(cacheKey) : undefined;
  const data = loaded ? globalCache.get(cacheKey) : undefined;
  return [data, loaded, error];
}

export function refreshCache(cacheKey, clearCache = false) {
  cacheKey = formatCacheKey(cacheKey);
  if (clearCache) {
    globalCache.delete(cacheKey);
  }
  const loop = globalLoops.loops.get(cacheKey);
  if (loop) {
    loop.refresh();
    if (clearCache) {
      loop.notifyListeners();
    }
  }
}

export function setCache(cacheKey, value, { initializeOnly = false } = {}) {
  cacheKey = formatCacheKey(cacheKey);
  if (initializeOnly && globalCache.has(cacheKey)) {
    return;
  }
  globalCache.set(cacheKey, value);
  const loop = globalLoops.loops.get(cacheKey);
  if (loop) {
    loop.notifyListeners();
  }
}

function formatCacheKey(cacheKey) {
  if (Array.isArray(cacheKey)) {
    return tuple(...cacheKey);
  }
  return cacheKey;
}
