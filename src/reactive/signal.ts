import { getActiveEffect, type Effect } from "./effect";

export class Signal<T> {
  #value: T;
  #subscribers = new Set<Effect>();

  constructor(value: T) {
    this.#value = value;
  }

  get value(): T {
    const e = getActiveEffect();
    if (e) {
      this.#subscribers.add(e);
      e.addDependency(this);
    }
    return this.#value;
  }

  set value(next: T) {
    if (Object.is(next, this.#value)) return;
    this.#value = next;
    for (const s of [...this.#subscribers]) s.run();
  }

  unsubscribe(e: Effect): void {
    this.#subscribers.delete(e);
  }
}
