interface Building {
  name: string;
  base_cost: number;
  cps: number; // cookies per second
}

export const BUILDINGS: { [key: string]: Building } = {
  cursor: { name: "Cursor", base_cost: 15, cps: 0.1 },
  grandma: { name: "Grandma", base_cost: 100, cps: 1.0 },
  farm: { name: "Farm", base_cost: 1100, cps: 8.0 },
};
