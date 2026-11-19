// Разбор XML-плана здания. План статичен и генерируется вручную, поэтому
// используется компактный парсер без внешних зависимостей: на сервере,
// где считается маршрут, нет DOMParser.

export type Dir = "forward" | "backward" | "left" | "right";

export const DIRECTIONS: Dir[] = ["forward", "backward", "left", "right"];

export type SideObject =
  | { kind: "joint"; id: string; text: string; to: string }
  | { kind: "orient"; type: string; name: string; to: string }
  | { kind: "room"; num: string; name: string; to: string };

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
}

export interface ParsedStairs {
  kind: "stairs";
  id: string;
  joint: string;
  floorDown: number;
  floorUp: number;
  building: string;
  textUp: string;
  textDown: string;
}

export interface ParsedPlan {
  squares: ParsedSquare[];
  corridors: ParsedCorridor[];
  stairs: ParsedStairs[];
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
    };
  }
  if (element.tag === "Orient") {
    return {
      kind: "orient",
      type: attr(element, "type"),
      name: attr(element, "name"),
      to: attr(element, "to"),
    };
  }
  if (element.tag === "Room") {
    return {
      kind: "room",
      num: attr(element, "num"),
      name: attr(element, "name"),
      to: attr(element, "to"),
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
  };
}

function readStairs(element: XmlElement, building: string): ParsedStairs {
  return {
    kind: "stairs",
    id: attr(element, "id"),
    joint: attr(element, "joint"),
    floorDown: parseFloor(attr(element, "floor_down"), Number.NaN),
    floorUp: parseFloor(attr(element, "floor_up"), Number.NaN),
    building: attr(element, "building") || building,
    textUp: attr(element, "text_up"),
    textDown: attr(element, "text_down"),
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
      plan.stairs.push(readStairs(child, blockBuilding));
    }
  }
}

export function parsePlan(xml: string): ParsedPlan {
  const root = parseXml(xml);
  const planElement = root.children.find((child) => child.tag === "Plan");
  if (!planElement) {
    throw new Error("В плане нет корневого тега <Plan>");
  }
  const plan: ParsedPlan = { squares: [], corridors: [], stairs: [] };
  for (const child of planElement.children) {
    if (child.tag === "Block") {
      readBlock(child, "", Number.NaN, plan);
    }
  }
  return plan;
}
