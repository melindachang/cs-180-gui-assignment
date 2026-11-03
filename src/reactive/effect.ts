import type { Signal } from "./signal";

let active: Effect | null = null;
export const getActiveEffect = () => active;

function runAs<T>(e: Effect, fn: () => T): T {
  const prev = active;
  active = e;
  try {
    return fn();
  } finally {
    active = prev;
  }
}

export class Effect {
  #fn: () => void;
  #dependencies = new Set<Signal<unknown>>();

  constructor(fn: () => void) {
    this.#fn = fn;
    this.run();
  }

  addDependency(s: Signal<unknown>): void {
    this.#dependencies.add(s);
  }

  run(): void {
    for (const s of this.#dependencies) s.unsubscribe(this);
    this.#dependencies.clear();
    runAs(this, this.#fn);
  }
}
