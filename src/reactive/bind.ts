import type { Store, Changed } from "./store";

type AnyState = Record<string, unknown>;

function onChange<S extends AnyState>(
  store: Store<S>,
  handler: (changed: Changed<S>) => void,
  signal?: AbortSignal,
): void {
  store.addEventListener("change", (e) => handler((e as CustomEvent<Changed<S>>).detail), {
    signal,
  });
}

export function bind<S extends AnyState>(
  store: Store<S>,
  keys: (keyof S)[],
  run: () => void,
  signal?: AbortSignal,
) {
  run();
  onChange(
    store,
    (changed) => {
      if (keys.some((k) => changed.has(k))) run();
    },
    signal,
  );
}

// export function bindAuto<S extends AnyState>(
//   store: Store<S>,
//   run: () => void,
//   signal?: AbortSignal,
// ) {
//   let keys = store.addDependency(run);
//   onChange(
//     store,
//     (changed) => {
//       if ([...keys].some((k) => changed.has(k))) keys = store.addDependency(run);
//     },
//     signal,
//   );
// }

// export function bindAll<S extends AnyState>(
//   store: Store<S>,
//   run: () => void,
//   signal?: AbortSignal,
// ): void {
//   run();
//   onChange(store, run, signal);
// }
