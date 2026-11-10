import { BUILDINGS, BUILDING_IDS, type BuildingId } from "./game/data";
import { bind } from "./reactive/bind";
import { Store } from "./reactive/store";
import "./style.css";

export type GameState = {
  cookies: number;
  bakeryName: string;
} & Record<BuildingId, number>;

export const createGame = () =>
  new Store<GameState>({
    cookies: 0,
    bakeryName: "My Bakery",
    cursor: 0,
    grandma: 0,
  });

const store = createGame();

export const cost = (store: Store<GameState>, id: BuildingId) =>
  Math.floor(BUILDINGS[id].baseCost * 1.15 ** store.get(id));

export const cps = (s: Store<GameState>) =>
  BUILDING_IDS.reduce((sum, id) => sum + s.get(id) * BUILDINGS[id].cps, 0);

export function buy(store: Store<GameState>, id: BuildingId) {
  const price = cost(store, id);
  if (store.get("cookies") < price) return;
  store.set("cookies", store.get("cookies") - price);
  store.set(id, store.get(id) + 1);
}

export function tick(s: Store<GameState>, dtSeconds: number) {
  s.set("cookies", s.get("cookies") + cps(s) * dtSeconds);
}

window.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  const bigCookie: HTMLDivElement | null = document.querySelector("#big-cookie");
  const cookieCounter: HTMLSpanElement | null = document.querySelector("#cookie-counter");
  const cpsCounter: HTMLSpanElement | null = document.querySelector("#cps-counter");
  const buildingStore: HTMLUListElement | null = document.querySelector("#building-store");

  bigCookie?.addEventListener("click", () => store.set("cookies", store.get("cookies") + 1));

  if (cookieCounter) {
    bind(store, ["cookies"], () => {
      cookieCounter.textContent = Math.floor(store.get("cookies")).toLocaleString();
    });
  }

  if (cpsCounter) {
    bind(store, BUILDING_IDS, () => {
      cpsCounter.textContent = cps(store).toFixed(1).toLocaleString();
    });
  }

  const storeItemTemplate: HTMLTemplateElement | null = document.querySelector(
    "#building-store template",
  );

  if (storeItemTemplate) {
    for (const id of BUILDING_IDS) {
      const item = document.importNode(storeItemTemplate.content, true);

      const icon = item.querySelector(".icon");
      if (icon) icon.classList.add(`-${BUILDINGS[id].name.toLowerCase()}`);

      const itemName = item.querySelector(".name");
      if (itemName) itemName.textContent = BUILDINGS[id].name;

      const itemCost = item.querySelector(".cost");

      const itemCps = item.querySelector(".cps");
      if (itemCps) itemCps.textContent = BUILDINGS[id].cps.toString();

      const itemOwned = item.querySelector(".owned");

      if (itemCost && itemOwned) {
        bind(store, [id], () => {
          itemCost.textContent = cost(store, id).toLocaleString();
          itemOwned.textContent = store.get(id).toLocaleString();
        });
      }

      const itemButton: HTMLButtonElement | null = item.querySelector(".button");

      if (itemButton) {
        itemButton.addEventListener("click", () => {
          itemButton.dispatchEvent(new CustomEvent("buy", { bubbles: true, detail: { id } }));
        });

        bind(store, ["cookies", id], () => {
          itemButton.disabled = store.get("cookies") < cost(store, id);
        });
      }

      buildingStore?.appendChild(item);
    }
  }

  app?.addEventListener("buy", (e) => {
    buy(store, (e as CustomEvent<{ id: BuildingId }>).detail.id);
  });

  let last = performance.now();
  setInterval(() => {
    const now = performance.now();
    tick(store, (now - last) / 1000);
    last = now;
  }, 100);
});
