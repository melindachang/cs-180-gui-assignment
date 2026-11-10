export const BUILDINGS = {
  cursor: {
    name: "Cursor",
    baseCost: 15,
    cps: 0.1,
  },
  grandma: {
    name: "Grandma",
    baseCost: 100,
    cps: 1,
  },
} as const;

export type BuildingId = keyof typeof BUILDINGS;
export const BUILDING_IDS = Object.keys(BUILDINGS) as BuildingId[];
