export type Changed<S> = ReadonlySet<keyof S>;

export class Store<S extends Record<string, unknown>> extends EventTarget {
  #state: S;
  #dirty = new Set<keyof S>();
  #queued = false;
  #dependencies: Set<keyof S> | null = null;

  constructor(initial: S) {
    super();
    this.#state = { ...initial };
  }

  get<K extends keyof S>(key: K): S[K] {
    this.#dependencies?.add(key);
    return this.#state[key];
  }

  set<K extends keyof S>(key: K, value: S[K]): void {
    if (Object.is(this.#state[key], value)) return;
    this.#state[key] = value;
    this.#dirty.add(key);
    if (!this.#queued) {
      this.#queued = true;
      queueMicrotask(() => this.flush());
    }
  }

  flush(): void {
    this.#queued = false;
    if (this.#dirty.size === 0) return;
    const changed = this.#dirty;
    this.#dirty = new Set();
    this.dispatchEvent(new CustomEvent("change", { detail: changed }));
  }

  addDependency(fn: () => void): Set<keyof S> {
    const prev = this.#dependencies;
    const seen = new Set<keyof S>();
    this.#dependencies = seen;
    try {
      fn();
    } finally {
      this.#dependencies = prev;
    }
    return seen;
  }
}
