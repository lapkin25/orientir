// Граф плана и поиск маршрута — перенос process_plan.js и find_route.js из v3
// с доведённой до конца связкой коридоров, лестниц и расчётом поворотов.

import {
  parsePlan,
  type Dir,
  type ParsedCorridor,
  type ParsedPlan,
  type ParsedSquare,
  type ParsedStairs,
  type SideObject,
} from "./parse-plan";
import { planXML } from "./plan-xml";

export type StepIcon =
  | "start"
  | "straight"
  | "left"
  | "right"
  | "back"
  | "stairs-up"
  | "stairs-down"
  | "finish";

// Соседняя зона для макро-карты «Основные направления»:
// куда можно выйти с площадки и что там приметного.
export interface MacroNeighbor {
  id: string;
  type: "square" | "corridor";
  name: string;
  direction: "forward" | "left" | "right";
  landmarks: string[];
}

// Данные микро-карты для шага маршрута: площадка со сторонами
// или коридор с ориентирами вдоль стен.
export interface SquareMapData {
  kind: "square";
  square: ParsedSquare;
  // Сторона, с которой пользователь вошёл на площадку; "" — старт маршрута.
  standSide: Dir | "";
  turn: "straight" | "left" | "right" | "back";
  macro?: MacroNeighbor[];
}

export interface CorridorMapData {
  kind: "corridor";
  corridor: ParsedCorridor;
  // true — движение от начала коридора к его концу.
  forward: boolean;
  endLabel: string;
}

// Вертикальная микро-карта лестницы: направление считается
// сравнением этажей стыков, через которые пользователь идёт.
export interface StairsMapData {
  kind: "stairs";
  stairs: ParsedStairs;
  fromFloor: number;
  toFloor: number;
  direction: "up" | "down";
  label: string;
  photo?: string;
}

export type StepMap = SquareMapData | CorridorMapData | StairsMapData;

export interface RouteStep {
  icon: StepIcon;
  text: string;
  detail?: string;
  photo?: string;
  photoNote?: string;
  map?: StepMap;
}

export interface RouteResult {
  fromName: string;
  toName: string;
  steps: RouteStep[];
}

export type PlaceKind = "room" | "orient" | "square" | "corridor";

export interface Place {
  id: string;
  name: string;
  kind: PlaceKind;
  floor: number;
  // Тип ориентира из XML плана, только для kind = "orient".
  orientType?: string;
  // Где точку искать: зона и сторона, например «Лестничная площадка № 1, впереди».
  description?: string;
}

type SideMark = Dir | "";

interface Vertex {
  key: string;
  kind: "square" | "joint" | "object" | "stairs";
  label: string;
  to: string;
  floor: number;
  neighbors: number[];
  inCatalog: boolean;
  parentSquare: number;
  side: SideMark;
  jointId: string;
  jointPhoto?: string;
  square?: ParsedSquare | ParsedCorridor;
  object?: SideObject;
  stairs?: ParsedStairs;
}

interface Graph {
  vertices: Vertex[];
  byKey: Map<string, number>;
  objectsBySquare: Map<number, number[]>;
}

// Контекст для безымянных площадок — из комментариев исходного плана.
// Нужен, чтобы развести одинаковые названия точек в каталоге.
const SQUARE_CONTEXT: Record<string, string> = {
  square_2: "Площадка у коридора",
  square_3: "Площадка-поворот",
};

const SIDE_INDEX: Record<string, number> = {
  forward: 0,
  right: 1,
  backward: 2,
  left: 3,
};

function sideIndex(v: Vertex): number {
  const idx = SIDE_INDEX[v.side];
  return idx === undefined ? -1 : idx;
}

function turnFor(exitSide: number, entrySide: number): number {
  return (((exitSide - entrySide + 2) % 4) + 4) % 4;
}

function objectBaseLabel(obj: SideObject): string {
  if (obj.kind === "room") {
    if (obj.name && obj.num) return `${obj.name} (${obj.num})`;
    if (obj.name) return obj.name;
    if (obj.num) return `Аудитория ${obj.num}`;
    return "";
  }
  return obj.kind === "joint" ? obj.text : obj.name;
}

function squareContext(square: ParsedSquare | ParsedCorridor): string {
  if (square.name) return square.name;
  const fallback = SQUARE_CONTEXT[square.id];
  if (fallback) return fallback;
  return square.kind === "corridor" ? "коридор" : "площадка";
}

function buildGraph(): Graph {
  const plan: ParsedPlan = parsePlan(planXML);
  const vertices: Vertex[] = [];
  const byKey = new Map<string, number>();
  const objectsBySquare = new Map<number, number[]>();
  const usedLabels = new Set<string>();
  const jointsById = new Map<string, number[]>();

  const addVertex = (v: Vertex): number => {
    const index = vertices.length;
    vertices.push(v);
    byKey.set(v.key, index);
    return index;
  };

  const connect = (a: number, b: number): void => {
    vertices[a].neighbors.push(b);
    vertices[b].neighbors.push(a);
  };

  const uniqueLabel = (base: string, context: string): string => {
    if (!base) return "";
    let candidate = base;
    if (usedLabels.has(candidate)) {
      candidate = `${base} — ${context}`;
      let n = 2;
      while (usedLabels.has(candidate)) {
        candidate = `${base} — ${context} (${n})`;
        n += 1;
      }
    }
    usedLabels.add(candidate);
    return candidate;
  };

  for (const square of [...plan.squares, ...plan.corridors]) {
    const squareIdx = addVertex({
      key: `sq:${square.id}`,
      kind: "square",
      // Безымянные коридоры «Коридор» на разных этажах различаем этажом в названии.
      label: uniqueLabel(
        square.kind === "corridor" && square.name === "Коридор"
          ? `Коридор на ${square.floor} этаже`
          : square.name,
        squareContext(square)
      ),
      to: square.to,
      floor: square.floor,
      neighbors: [],
      inCatalog: Boolean(square.name),
      parentSquare: -1,
      side: "",
      jointId: "",
      square,
    });
    const objectIndices: number[] = [];
    objectsBySquare.set(squareIdx, objectIndices);
    let objectCounter = 0;
    const jointCounter = new Map<string, number>();

    const addObject = (
      obj: SideObject,
      side: SideMark,
      context: string
    ): void => {
      const idx = addVertex({
        key: `o:${square.id}:${objectCounter}`,
        kind: "object",
        label: uniqueLabel(objectBaseLabel(obj), context),
        to: obj.to,
        floor: square.floor,
        neighbors: [],
        inCatalog: Boolean(objectBaseLabel(obj)),
        parentSquare: squareIdx,
        side,
        jointId: "",
        object: obj,
      });
      objectCounter += 1;
      objectIndices.push(idx);
      connect(idx, squareIdx);
    };

    if (square.kind === "square") {
      const context = squareContext(square);
      for (const side of square.sides) {
        for (const obj of side.objects) {
          if (obj.kind === "joint") {
            const occurrence = jointCounter.get(obj.id) ?? 0;
            jointCounter.set(obj.id, occurrence + 1);
            const jointIdx = addVertex({
              key: `j:${square.id}:${obj.id}:${occurrence}`,
              kind: "joint",
              label: obj.text || "Стык",
              to: obj.to,
              floor: square.floor,
              neighbors: [],
              inCatalog: false,
              parentSquare: squareIdx,
              side: side.dir,
              jointId: obj.id,
              jointPhoto: obj.photo || undefined,
            });
            const list = jointsById.get(obj.id) ?? [];
            list.push(jointIdx);
            jointsById.set(obj.id, list);
            connect(jointIdx, squareIdx);
          } else {
            addObject(obj, side.dir, context);
          }
        }
      }
    } else {
      for (const entry of square.objects) {
        addObject(entry.object, entry.wall, squareContext(square));
      }
    }
  }

  // Стыки с одинаковым id — это одна физическая точка между площадками.
  for (const list of jointsById.values()) {
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        connect(list[i], list[j]);
      }
    }
  }

  // Коридор начинается и заканчивается на стыках соседних площадок.
  for (const square of [...plan.squares, ...plan.corridors]) {
    if (square.kind !== "corridor") continue;
    const corridorIdx = byKey.get(`sq:${square.id}`);
    if (corridorIdx === undefined) continue;
    for (const end of [square.start, square.finish]) {
      const list = jointsById.get(end);
      if (!list) continue;
      for (const jointIdx of list) {
        connect(corridorIdx, jointIdx);
      }
    }
  }

  // Лестница соединяет два стыка на разных этажах. Если один из стыков
  // не найден или оба на одном этаже, лестницу пропускаем, чтобы
  // в графе не появилось тупиков и ложных переходов.
  for (const stairs of plan.stairs) {
    const starts = jointsById.get(stairs.startId);
    const finishes = jointsById.get(stairs.finishId);
    if (!starts || !finishes) continue;
    const startFloor = vertices[starts[0]].floor;
    const finishFloor = vertices[finishes[0]].floor;
    if (
      !Number.isFinite(startFloor) ||
      !Number.isFinite(finishFloor) ||
      startFloor === finishFloor
    ) {
      continue;
    }
    const stairsIdx = addVertex({
      key: `st:${stairs.id}`,
      kind: "stairs",
      label: stairs.id,
      to: "",
      floor: Math.min(startFloor, finishFloor),
      neighbors: [],
      inCatalog: false,
      parentSquare: -1,
      side: "",
      jointId: "",
      stairs,
    });
    for (const jointIdx of [...starts, ...finishes]) {
      connect(stairsIdx, jointIdx);
    }
  }

  return { vertices, byKey, objectsBySquare };
}

let cachedGraph: Graph | null = null;

function getGraph(): Graph {
  if (!cachedGraph) {
    cachedGraph = buildGraph();
  }
  return cachedGraph;
}

export function listPlaces(): Place[] {
  const graph = getGraph();
  const places: Place[] = [];
  const sidePhrase = (side: SideMark, corridor: boolean): string => {
    if (corridor) {
      return side === "left"
        ? "по левую руку"
        : side === "right"
          ? "по правую руку"
          : "";
    }
    return side === "forward"
      ? "впереди"
      : side === "right"
        ? "справа"
        : side === "backward"
          ? "позади"
          : side === "left"
            ? "слева"
            : "";
  };

  for (const v of graph.vertices) {
    if (!v.inCatalog) continue;
    let description = "";
    if (v.kind === "object" && v.parentSquare >= 0) {
      const parent = graph.vertices[v.parentSquare];
      const zone =
        parent.label || (parent.square ? squareContext(parent.square) : "");
      const where = sidePhrase(v.side, parent.square?.kind === "corridor");
      description = [zone, where].filter(Boolean).join(", ");
    }
    const orientType =
      v.kind === "object" && v.object?.kind === "orient"
        ? v.object.type
        : undefined;
    places.push({
      id: v.key,
      name: v.label,
      kind:
        v.kind === "square"
          ? v.square!.kind
          : v.object!.kind === "joint"
            ? "orient"
            : v.object!.kind,
      floor: v.floor,
      orientType,
      description: description || undefined,
    });
  }
  places.sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return places;
}

function exitTarget(v: Vertex): string {
  if (v.to) return v.to;
  if (v.object) {
    if (v.object.kind === "room" && v.object.num) return `аудитории ${v.object.num}`;
    return `точки «${v.label}»`;
  }
  if (v.kind === "joint") return `точки «${v.label}»`;
  return "конца зоны";
}

function squareMacro(
  graph: Graph,
  squareIdx: number,
  standSide: Dir | ""
): MacroNeighbor[] {
  const V = graph.vertices;
  // Пользователь стоит на стороне входа и смотрит на противоположную,
  // поэтому направления считаем от стороны напротив входа.
  const standIndex = standSide ? SIDE_INDEX[standSide] : -1;
  const facing = standIndex >= 0 ? (standIndex + 2) % 4 : 0;
  const neighbors: MacroNeighbor[] = [];
  const seen = new Set<number>();
  for (const jointIdx of V[squareIdx].neighbors) {
    const joint = V[jointIdx];
    if (joint.kind !== "joint") continue;
    const sideIdx = SIDE_INDEX[joint.side];
    if (sideIdx === undefined) continue;
    const slot = (sideIdx - facing + 4) % 4;
    const direction: MacroNeighbor["direction"] | null =
      slot === 0 ? "forward" : slot === 1 ? "right" : slot === 3 ? "left" : null;
    if (!direction) continue;
    for (const nextIdx of joint.neighbors) {
      if (nextIdx === squareIdx || seen.has(nextIdx)) continue;
      const next = V[nextIdx];
      if (next.kind !== "square" || !next.square) continue;
      seen.add(nextIdx);
      // Для коридора перечисляем комнаты от стороны, которой он примыкает.
      const labels = (graph.objectsBySquare.get(nextIdx) ?? [])
        .map((i) => V[i].label)
        .filter(Boolean);
      if (
        next.square.kind === "corridor" &&
        joint.jointId === next.square.finish
      ) {
        labels.reverse();
      }
      neighbors.push({
        id: next.key,
        type: next.square.kind,
        name: next.label,
        direction,
        landmarks: labels.slice(0, 3),
      });
    }
  }
  return neighbors;
}

function corridorForward(
  graph: Graph,
  corridorIdx: number,
  entryIdx: number,
  exitIdx: number
): boolean {
  const corridor = graph.vertices[corridorIdx].square as ParsedCorridor;
  const entry = entryIdx >= 0 ? graph.vertices[entryIdx] : null;
  const exit = exitIdx >= 0 ? graph.vertices[exitIdx] : null;
  if (entry && entry.kind === "joint") return entry.jointId === corridor.start;
  if (exit && exit.kind === "joint") return exit.jointId === corridor.finish;
  return true;
}

function landmarkDetail(
  graph: Graph,
  squareIdx: number,
  skip: Set<number>,
  forward: boolean
): string | undefined {
  const indices = (graph.objectsBySquare.get(squareIdx) ?? []).filter(
    (i) => !skip.has(i) && graph.vertices[i].label
  );
  if (indices.length === 0) return undefined;
  const ordered = forward ? indices : [...indices].reverse();
  return `мимо: ${ordered.map((i) => graph.vertices[i].label).join(", ")}`;
}

function floorPhrase(floor: number): string {
  return floor <= 0 ? "в цоколь" : `на ${floor} этаж`;
}

function buildSteps(graph: Graph, path: number[]): RouteStep[] {
  const V = graph.vertices;
  const steps: RouteStep[] = [];
  steps.push({
    icon: "start",
    text: `Вы отправляетесь из точки «${V[path[0]].label}».`,
  });

  for (let t = 0; t < path.length; t += 1) {
    const idx = path[t];
    const v = V[idx];

    if (v.kind === "stairs") {
      // Лестница всегда стоит в пути между двумя стыками разных этажей.
      const prevV = V[path[t - 1]];
      const nextV = V[path[t + 1]];
      if (!prevV || !nextV) continue;
      const up = nextV.floor > prevV.floor;
      const label = up
        ? `Подъём ${floorPhrase(nextV.floor)}`
        : `Спуск ${floorPhrase(nextV.floor)}`;
      steps.push({
        icon: up ? "stairs-up" : "stairs-down",
        text: `${up ? "Поднимитесь" : "Спуститесь"} по лестнице ${floorPhrase(nextV.floor)}.`,
        map: {
          kind: "stairs",
          stairs: v.stairs!,
          fromFloor: prevV.floor,
          toFloor: nextV.floor,
          direction: up ? "up" : "down",
          label,
          photo: prevV.jointPhoto ?? nextV.jointPhoto,
        },
      });
      continue;
    }

    if (v.kind !== "square") continue;

    const entryIdx = t > 0 ? path[t - 1] : -1;
    const exitIdx = t + 1 < path.length ? path[t + 1] : -1;
    if (exitIdx < 0) continue;
    const entryV = entryIdx >= 0 ? V[entryIdx] : null;
    const exitV = V[exitIdx];

    if (v.square && v.square.kind === "corridor") {
      const forward = corridorForward(graph, idx, entryIdx, exitIdx);
      const name = v.square.name;
      const where = name && name !== "Коридор"
        ? name.startsWith("Коридор ")
          ? `Коридору ${name.slice("Коридор ".length)}`
          : name.startsWith("коридор ")
            ? `коридору ${name.slice("коридор ".length)}`
            : name
        : "коридору";
      const target = exitTarget(exitV);
      steps.push({
        icon: "straight",
        text: `Пройдите прямо по ${where} до ${target}.`,
        detail: landmarkDetail(graph, idx, new Set([entryIdx, exitIdx]), forward),
        map: {
          kind: "corridor",
          corridor: v.square,
          forward,
          endLabel: target,
        },
      });
      continue;
    }

    const entrySide = entryV ? sideIndex(entryV) : -1;
    const exitSide = sideIndex(exitV);
    const turn = entrySide >= 0 ? turnFor(exitSide, entrySide) : 0;
    const phrase =
      turn === 0
        ? "Пройдите прямо"
        : turn === 1
          ? "Поверните направо и пройдите"
          : turn === 3
            ? "Поверните налево и пройдите"
            : "Развернитесь и пройдите";
    const icon: StepIcon =
      turn === 1 ? "right" : turn === 3 ? "left" : turn === 2 ? "back" : "straight";
    const photo =
      v.square?.name === "Зона отдыха"
        ? "orientir/images/plan/3/garden1_forward.jpg"
        : undefined;
    steps.push({
      icon,
      text: `${phrase} до ${exitTarget(exitV)}.`,
      detail: landmarkDetail(graph, idx, new Set([entryIdx, exitIdx]), true),
      photo,
      photoNote: photo ? "Зона отдыха на 4 этаже" : undefined,
      map:
        v.square && v.square.kind === "square"
          ? {
              kind: "square",
              square: v.square,
              standSide: entryV ? entryV.side : "",
              turn:
                icon === "left" || icon === "right" || icon === "back"
                  ? icon
                  : "straight",
              macro: squareMacro(graph, idx, entryV ? entryV.side : ""),
            }
          : undefined,
    });
  }

  const dest = V[path[path.length - 1]];
  let detail: string | undefined;
  if (dest.kind === "object" && dest.parentSquare >= 0) {
    const parent = V[dest.parentSquare];
    const entryIdx = path.length >= 2 ? path[path.length - 2] : -1;
    if (parent.square && parent.square.kind === "corridor") {
      const forward = corridorForward(graph, dest.parentSquare, entryIdx, -1);
      if (dest.side === "left" || dest.side === "right") {
        const onLeft = forward ? dest.side === "left" : dest.side === "right";
        detail = `${dest.label} — ${onLeft ? "слева" : "справа"}.`;
      }
    }
  }
  steps.push({ icon: "finish", text: "Вы на месте!", detail });
  return steps;
}

export function findRoute(fromId: string, toId: string): RouteResult {
  const graph = getGraph();
  const from = graph.byKey.get(fromId);
  const to = graph.byKey.get(toId);
  if (from === undefined || to === undefined) {
    throw new Error("Выберите точки отправления и назначения из списка");
  }
  if (from === to) {
    throw new Error("Пункты отправления и назначения совпадают");
  }

  const prev = new Map<number, number>();
  const visited = new Set<number>([from]);
  const queue: number[] = [from];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === to) break;
    for (const neighbor of graph.vertices[current].neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        prev.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }
  if (!visited.has(to)) {
    throw new Error("Маршрут не найден: до выбранной точки не добраться");
  }

  const path: number[] = [to];
  let cursor = to;
  while (cursor !== from) {
    cursor = prev.get(cursor)!;
    path.push(cursor);
  }
  path.reverse();

  return {
    fromName: graph.vertices[from].label,
    toName: graph.vertices[to].label,
    steps: buildSteps(graph, path),
  };
}
