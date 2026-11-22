// Отсеки — именованные части здания из нескольких площадок и коридоров.
// zones — id площадок и коридоров из плана здания; entry — площадка,
// куда ведёт маршрут, если выбрать отсек целью.
// Чтобы добавить отсек, достаточно дописать запись в этот список.

export interface Section {
  id: string;
  name: string;
  floor: number;
  zones: string[];
  entry: string;
  desc?: string;
  photo?: string;
}

export const SECTIONS: Section[] = [
  {
    id: "floor4_left",
    name: "Левое крыло 4 этажа",
    floor: 4,
    zones: ["landing_1", "square_2", "corridor_1"],
    entry: "landing_1",
  },
  {
    id: "floor4_right",
    name: "Правое крыло 4 этажа",
    floor: 4,
    zones: ["square_3", "square_rest", "corridor_2", "landing_2"],
    entry: "square_rest",
  },
];

export const SECTION_PREFIX = "sec:";

export function sectionByZone(zoneId: string): Section | undefined {
  return SECTIONS.find((section) => section.zones.includes(zoneId));
}
