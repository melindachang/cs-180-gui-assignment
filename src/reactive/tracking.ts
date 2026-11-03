export interface Subscriber {
  run(): void;
  addDependency(d: Dependency): void;
}

export interface Dependency {
  unsubscribe(s: Subscriber): void;
}

let active: Subscriber | null = null;

export function getActiveSubscriber(): Subscriber | null {
  return active;
}

export function runTracked<T>(sub: Subscriber, fn: () => T): T {
  const prev = active;
  active = sub;
  try {
    return fn();
  } finally {
    active = prev;
  }
}
