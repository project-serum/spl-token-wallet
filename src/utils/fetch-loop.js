import assert from 'assert';
import { useEffect, useReducer } from 'react';
import tuple from 'immutable-tuple';

const pageLoadTime = new Date();

const globalCache = new Map();

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

class FetchLoopListener {
  constructor(cacheKey, fn, refreshInterval, callback) {
    this.cacheKey = cacheKey;
    this.fn = fn;
    this.refreshInterval = refreshInterval;
    this.callback = callback;
  }
}

class FetchLoopInternal {
  constructor(cacheKey, fn) {
    this.cacheKey = cacheKey;
    this.fn = fn;
    this.timeoutId = null;
    this.listeners = new Set();
    this.errors = 0;
  }

  get refreshInterval() {
    return Math.min(
      ...[...this.listeners].map((listener) => listener.refreshInterval),
    );
  }

  get stopped() {
    return this.listeners.size === 0;
  }

  addListener(listener) {
    let previousRefreshInterval = this.refreshInterval;
    this.listeners.add(listener);
    if (this.refreshInterval < previousRefreshInterval) {
      this.refresh();
    }
  }

  removeListener(listener) {
    assert(this.listeners.delete(listener));
    if (this.stopped) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }

  notifyListeners() {
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
      let data = await this.fn();
      globalCache.set(this.cacheKey, data);
      this.errors = 0;
      this.notifyListeners();
      return data;
    } catch (error) {
      ++this.errors;
      console.warn(error);
    } finally {
      if (!this.timeoutId && !this.stopped) {
        let waitTime = this.refreshInterval;

        // Back off on errors.
        if (this.errors > 0) {
          waitTime = Math.min(1000 * Math.pow(2, this.errors - 1), 60000);
        }

        // Don't do any refreshing for the first five seconds, to make way for other things to load.
        let timeSincePageLoad = new Date() - pageLoadTime;
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

export function useAsyncData(
  asyncFn,
  cacheKey,
  { refreshInterval = 60000 } = {},
) {
  cacheKey = formatCacheKey(cacheKey);

  const [, rerender] = useReducer((i) => i + 1, 0);

  useEffect(() => {
    if (!cacheKey) {
      return () => {};
    }
    const listener = new FetchLoopListener(
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
    return [null, false];
  }

  const loaded = globalCache.has(cacheKey);
  const data = loaded ? globalCache.get(cacheKey) : undefined;
  return [data, loaded];
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
