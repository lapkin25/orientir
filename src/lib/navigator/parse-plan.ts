// Разбор XML-плана здания. План статичен и генерируется вручную, поэтому
// используется компактный парсер без внешних зависимостей: на сервере,
// где считается маршрут, нет DOMParser.

export type Dir = "forward" | "backward" | "left" | "right";

export const DIRECTIONS: Dir[] = ["forward", "backward", "left", "right"];

export type SideObject =
  | { kind: "joint"; id: string; text: string; to: string; photo: string; desc: string }
  | { kind: "orient"; type: string; name: string; to: string; photo: string; desc: string }
  | { kind: "room"; num: string; name: string; to: string; photo: string; desc: string };

export interface SquareSide {
  dir: Dir;
  objects: SideObject[];
}

export interface ParsedSquare {
  kind: "square";
  id: string;
  name: string;
  to: string;
  cat: string;
  building: string;
  floor: number;
  sides: SquareSide[];
  desc: string;
  photo: string;
}

export interface CorridorObject {
  object: SideObject;
  wall: "left" | "right" | "";
}

export interface ParsedCorridor {
  kind: "corridor";
  id: string;
  name: string;
  to: string;
  building: string;
  floor: number;
  start: string;
  finish: string;
  objects: CorridorObject[];
  desc: string;
  photo: string;
}

// Лестница — площадка между двумя стыками на разных этажах:
// <Stairs id="…" start_id="…" finish_id="…"/>. Подписи и фотографии
// хранятся в атрибутах самих стыков.
export interface ParsedStairs {
  kind: "stairs";
  id: string;
  startId: string;
  finishId: string;
  building: string;
  // Необязательные подробности для путевой карточки.
  railing: string;
  width: string;
}

// Выход из здания — тупиковый стык: <Exit id="…" text="…" to="…"/>.
// Подпись и фотография, как у стыка, показываются на входе в точку.
export interface ParsedExit {
  kind: "exit";
  id: string;
  text: string;
  to: string;
  photo: string;
  desc: string;
}

export interface ParsedPlan {
  squares: ParsedSquare[];
  corridors: ParsedCorridor[];
  stairs: ParsedStairs[];
  exits: ParsedExit[];
}

interface XmlElement {
  tag: string;
  attrs: Record<string, string>;
  children: XmlElement[];
}

const TAG_RE =
  /<(\/?)([A-Za-z_][A-Za-z0-9_-]*)((?:\s+[A-Za-z_][A-Za-z0-9_-]*\s*=\s*"[^"]*")*)\s*(\/?)>/g;
const ATTR_RE = /([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*"([^"]*)"/g;

function parseXml(xml: string): XmlElement {
  const root: XmlElement = { tag: "#root", attrs: {}, children: [] };
  const stack: XmlElement[] = [root];
  const cleaned = xml.replace(/<!--[\s\S]*?-->/g, "");
  let lastEnd = 0;
  let match: RegExpExecArray | null;
  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(cleaned)) !== null) {
    if (cleaned.slice(lastEnd, match.index).trim() !== "") {
      throw new Error("Неожиданный текст внутри плана");
    }
    lastEnd = TAG_RE.lastIndex;
    const [, closing, tag, attrsSource, selfClosing] = match;
    if (closing) {
      const top = stack.pop();
      if (!top || top.tag !== tag) {
        throw new Error(`Непарный закрывающий тег </${tag}>`);
      }
      continue;
    }
    const attrs: Record<string, string> = {};
    let attrMatch: RegExpExecArray | null;
    ATTR_RE.lastIndex = 0;
    while ((attrMatch = ATTR_RE.exec(attrsSource)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    const element: XmlElement = { tag, attrs, children: [] };
    stack[stack.length - 1].children.push(element);
    if (!selfClosing) {
      stack.push(element);
    }
  }
  if (cleaned.slice(lastEnd).trim() !== "") {
    throw new Error("Неожиданный текст внутри плана");
  }
  if (stack.length !== 1) {
    throw new Error("В плане есть незакрытые теги");
  }
  return root;
}

function attr(element: XmlElement, name: string): string {
  return Object.prototype.hasOwnProperty.call(element.attrs, name)
    ? element.attrs[name]
    : "";
}

function parseFloor(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readSideObject(element: XmlElement): SideObject | null {
  if (element.tag === "Joint") {
    return {
      kind: "joint",
      id: attr(element, "id"),
      text: attr(element, "text"),
      to: attr(element, "to"),
      photo: attr(element, "photo"),
      desc: attr(element, "desc"),
    };
  }
  if (element.tag === "Orient") {
    return {
      kind: "orient",
      type: attr(element, "type"),
      name: attr(element, "name"),
      to: attr(element, "to"),
      photo: attr(element, "photo"),
      desc: attr(element, "desc"),
    };
  }
  if (element.tag === "Room") {
    return {
      kind: "room",
      num: attr(element, "num"),
      name: attr(element, "name"),
      to: attr(element, "to"),
      photo: attr(element, "photo"),
      desc: attr(element, "desc"),
    };
  }
  return null;
}

function readSquare(element: XmlElement, building: string, floor: number): ParsedSquare {
  const sides: SquareSide[] = [];
  for (const child of element.children) {
    if (child.tag !== "Side") {
      continue;
    }
    const dir = attr(child, "dir") as Dir;
    if (!DIRECTIONS.includes(dir)) {
      continue;
    }
    const objects: SideObject[] = [];
    for (const sideChild of child.children) {
      if (sideChild.tag === "Part") {
        for (const partChild of sideChild.children) {
          const object = readSideObject(partChild);
          if (object) {
            objects.push(object);
          }
        }
      } else {
        const object = readSideObject(sideChild);
        if (object) {
          objects.push(object);
        }
      }
    }
    sides.push({ dir, objects });
  }
  return {
    kind: "square",
    id: attr(element, "id"),
    name: attr(element, "name"),
    to: attr(element, "to"),
    cat: attr(element, "cat"),
    building,
    floor,
    sides,
    desc: attr(element, "desc"),
    photo: attr(element, "photo"),
  };
}

function readCorridor(
  element: XmlElement,
  building: string,
  floor: number
): ParsedCorridor {
  const objects: CorridorObject[] = [];
  for (const child of element.children) {
    const object = readSideObject(child);
    if (!object) {
      continue;
    }
    const wall = attr(child, "wall");
    objects.push({
      object,
      wall: wall === "left" || wall === "right" ? wall : "",
    });
  }
  return {
    kind: "corridor",
    id: attr(element, "id"),
    name: attr(element, "name"),
    to: attr(element, "to"),
    building,
    floor,
    start: attr(element, "start"),
    finish: attr(element, "finish"),
    objects,
    desc: attr(element, "desc"),
    photo: attr(element, "photo"),
  };
}

// Без обоих концов лестница разорвала бы маршрут, поэтому такую не берём.
function readStairs(element: XmlElement, building: string): ParsedStairs | null {
  const startId = attr(element, "start_id").trim();
  const finishId = attr(element, "finish_id").trim();
  if (!startId || !finishId || startId === finishId) {
    return null;
  }
  return {
    kind: "stairs",
    id: attr(element, "id") || `${startId}-${finishId}`,
    startId,
    finishId,
    building: attr(element, "building") || building,
    railing: attr(element, "railing"),
    width: attr(element, "width"),
  };
}

function readExit(element: XmlElement): ParsedExit {
  return {
    kind: "exit",
    id: attr(element, "id"),
    text: attr(element, "text"),
    to: attr(element, "to"),
    photo: attr(element, "photo"),
    desc: attr(element, "desc"),
  };
}

function readBlock(
  element: XmlElement,
  building: string,
  floor: number,
  plan: ParsedPlan
): void {
  const blockBuilding = attr(element, "building") || building;
  const blockFloor = element.attrs.floor
    ? parseFloor(attr(element, "floor"), floor)
    : floor;
  for (const child of element.children) {
    if (child.tag === "Block") {
      readBlock(child, blockBuilding, blockFloor, plan);
    } else if (child.tag === "Square") {
      plan.squares.push(readSquare(child, blockBuilding, blockFloor));
    } else if (child.tag === "Corridor") {
      plan.corridors.push(readCorridor(child, blockBuilding, blockFloor));
    } else if (child.tag === "Stairs") {
      const stairs = readStairs(child, blockBuilding);
      if (stairs) {
        plan.stairs.push(stairs);
      }
    }
  }
}

export function parsePlan(xml: string): ParsedPlan {
  const root = parseXml(xml);
  const planElement = root.children.find((child) => child.tag === "Plan");
  if (!planElement) {
    throw new Error("В плане нет корневого тега <Plan>");
  }
  const plan: ParsedPlan = { squares: [], corridors: [], stairs: [], exits: [] };
  for (const child of planElement.children) {
    if (child.tag === "Block") {
      readBlock(child, "", Number.NaN, plan);
    } else if (child.tag === "Exit") {
      const exit = readExit(child);
      if (exit.id) {
        plan.exits.push(exit);
      }
    }
  }
  return plan;
}
