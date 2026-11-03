import { Signal, Effect } from './reactive';

import './style.css';


interface Upgrade {
  name: string;
  base_cost: number;
  cps: number; // cookies per second
}

export const UPGRADES: { [key: string]: Upgrade } = {
  cursor: { name: "Cursor", base_cost: 15, cps: 0.1 }
}

export const UPGRADE_IDS = ["cursor"]

export const cookies = new Signal(0);

export const owned: { [key: string]: Signal<number> } = {
  cursor: new Signal(0)
}

// interface GameState {
//   cookies: number;
//   clicks: number;
//   cps: number;
//   owned_upgrades: {
//     [key: string]: number;
//   }
// }

// // -------

// const state: Signal<GameState> = new Signal({
//   cookies: 0,
//   clicks: 0,
//   cps: 0,
//   owned_upgrades: {
//     cursor: 0,
//   }
// })


export const cost = (id: string) =>
  Math.floor(UPGRADES[id].base_cost * 1.15);


const cookieEl = document.querySelector("#big-cookie");
const counterEl = document.querySelector("#counter");
const upgradeShop = document.querySelector<HTMLUListElement>("#upgrade-shop")!;
const tpl = document.querySelector<HTMLTemplateElement>("#shop-item")!;

new Effect(() => {
  if (counterEl) {
    counterEl.textContent = Math.floor(cookies.value).toString();
  }
})

cookieEl?.addEventListener('click', () => {
  cookies.value += 1;
})

function shopItem(id: string): HTMLLIElement {
  const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
  const btn = li.querySelector("button")!;
  const q = (sel: string) => li.querySelector(sel)!;

  btn.dataset.id = id;
  q(".name").textContent = UPGRADES[id].name; // static: set once

  new Effect(() => { q(".cost").textContent = cost(id).toString(); });
  new Effect(() => { q(".owned").textContent = owned[id].value.toString(); });
  new Effect(() => { btn.disabled = cookies.value < cost(id); });

  return li;
}

upgradeShop.append(...UPGRADE_IDS.map(shopItem));

upgradeShop.addEventListener("click", (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>("button[data-id]");
  if (btn) buy(btn.dataset.id);
  // if (btn) buy(btn.dataset.id);
});

function buy(id?: string) {
  if (!id) return;

  const price = cost(id);
  if (cookies.value < price) return;
  cookies.value -= price;
  owned[id].value += 1;
}

// // let state: GameState = {
// //   cookies: 0,
// //   totalClicks: 0,
// //   cps: 0,
// //   upgrades: [
// //     { name: "Cursor", cost: 15, cps: 0.1, count: 0 }
// //   ],
// // }





// const cookie = document.querySelector("#big-cookie");
// const counter = document.querySelector("#counter");
// const upgradeShop = document.querySelector("#upgrade-shop")

// const buyUpgrade = (upgrade_name: string) => {
//   let upgrade = state.upgrades.find(u => u.name == upgrade_name);

//   if (!upgrade) {
//     alert(`Error: upgrade "${upgrade_name}" not found`);
//     return;
//   }

//   if (state.cookies < upgrade.cost) {
//     alert(`Error: Not enough cookies!`);
//     return;
//   }

//   state.cookies -= upgrade.cost;
//   state.cps += upgrade.cps

//   upgrade.cost *= 1.15;
// }

// cookie?.addEventListener("click", () => {
//   state.totalClicks++;
//   state.cookies++;

//   if (counter) {
//     counter.textContent = `${state.cookies}`;
//   }
// })

// const collectIdleCookies = setInterval(() => {
//   state.cookies += state.cps;
// }, 1000)

// const renderUpgradeShop = () => {
//   state.upgrades.forEach((upgrade) => {

//     let container = document.createElement('div')
//     container.classList.add("upgrade-listing")
//     let title = document.createElement('h3')
//     title.textContent = `${upgrade.name} (${upgrade.cps} CPS) [COST: ${upgrade.cost}]`;
//     let button = document.createElement('button')
//     button.textContent = 'Buy'
//     button.dataset.upgrade = upgrade.name

//     button.addEventListener('click', (e) => {
//       if (e.target instanceof HTMLButtonElement && e.target.dataset.upgrade) {
//         buyUpgrade(e.target.dataset.upgrade)
//       }
//     })

//     container.appendChild(title)
//     container.appendChild(button)
//     upgradeShop?.appendChild(container)
//   })
// }

// renderUpgradeShop()
