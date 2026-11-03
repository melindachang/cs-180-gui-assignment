import { runTracked } from "./tracking";
import type { Subscriber, Dependency } from "./tracking";

export class Effect implements Subscriber {
  #fn: () => void;
  #dependencies = new Set<Dependency>();

  constructor(fn: () => void) {
    this.#fn = fn;
    this.run();
  }

  addDependency(d: Dependency): void {
    this.#dependencies.add(d);
  }

  run(): void {
    this.#cleanup();
    runTracked(this, this.#fn);
  }

  #cleanup(): void {
    for (const d of this.#dependencies) d.unsubscribe(this);
    this.#dependencies.clear();
  }
}
