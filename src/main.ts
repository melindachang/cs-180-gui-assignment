import { BUILDINGS } from "./game/data";
import { Signal, Effect } from "./reactive";

import "./style.css";

export const cookies = new Signal(0);

export const owned: { [key: string]: Signal<number> } = Object.fromEntries(
  Object.keys(BUILDINGS).map((u) => [u, new Signal(0)]),
);

export const cost = (id: string) => Math.round(BUILDINGS[id].base_cost * 1.15 ** owned[id].value);

export const cps = () =>
  Object.keys(BUILDINGS).reduce((sum, id) => sum + BUILDINGS[id].cps * owned[id].value, 0);

const cookieEl = document.querySelector("#big-cookie");
const counterEl = document.querySelector("#counter")!;
const cpsCounterEl = document.querySelector("#cps-counter")!;
const buildingShop = document.querySelector<HTMLUListElement>("#building-shop")!;
const tpl = document.querySelector<HTMLTemplateElement>("#shop-item")!;

new Effect(() => {
  counterEl.textContent = Math.floor(cookies.value).toString();
});

new Effect(() => {
  cpsCounterEl.textContent = (Math.round(cps() * 100) / 100).toString();
});

cookieEl?.addEventListener("click", () => {
  cookies.value += 1;
});

function shopItem(id: string): HTMLLIElement {
  const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
  const btn = li.querySelector("button")!;

  btn.dataset.id = id;

  li.querySelector(".name")!.textContent = BUILDINGS[id].name;

  new Effect(() => {
    btn.disabled = cookies.value < cost(id);
  });

  new Effect(() => {
    li.querySelector(".cost")!.textContent = cost(id).toString();
    li.querySelector(".owned")!.textContent = owned[id].value.toString();
  });

  return li;
}

buildingShop.append(...Object.keys(BUILDINGS).map(shopItem));

buildingShop.addEventListener("click", (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>("button[data-id]");
  if (btn) buy(btn.dataset.id);
});

function buy(id?: string) {
  if (!id) return;

  const price = cost(id);
  if (cookies.value < price) return;
  cookies.value -= price;
  owned[id].value += 1;
}

setInterval(() => {
  cookies.value += cps();
}, 1000);

