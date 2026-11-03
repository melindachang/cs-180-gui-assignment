import { getActiveSubscriber } from "./tracking";
import type { Subscriber, Dependency } from "./tracking";

export class Signal<T> implements Dependency {
  #value: T;
  #subscribers = new Set<Subscriber>();

  constructor(value: T) {
    this.#value = value;
  }

  get value(): T {
    const sub = getActiveSubscriber();
    if (sub) {
      this.#subscribers.add(sub);
      sub.addDependency(this);
    }
    return this.#value;
  }

  set value(next: T) {
    if (Object.is(next, this.#value)) return;
    this.#value = next;
    for (const s of [...this.#subscribers]) s.run();
  }

  unsubscribe(s: Subscriber): void {
    this.#subscribers.delete(s);
  }
}
