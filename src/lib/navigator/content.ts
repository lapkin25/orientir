// Каталог ориентиров: категории по эскизу content1._tsx, сверенные
// с планом здания. Категория находится и по типу ориентира из XML,
// и по ключевым словам в названии и расположении точки.

import type { Place, PlaceKind } from "./graph";

export interface ContentCategory {
  id: string;
  title: string;
  // Типы ориентиров из XML плана.
  types: string[];
  // Подстроки в названии или расположении точки.
  keywords: string[];
}

export const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: "sections",
    title: "Отсеки",
    types: [],
    keywords: [],
  },
  {
    id: "exits",
    title: "Выходы",
    types: [],
    keywords: [],
  },
  {
    id: "rest",
    title: "Отдых и ожидание",
    types: ["rest", "rest+charge"],
    keywords: ["диван", "зона отдыха", "зона ожидания"],
  },
  {
    id: "wc",
    title: "Туалеты",
    types: ["wc", "wc_m", "wc_f"],
    keywords: ["туалет"],
  },
  {
    id: "info",
    title: "Справка и информация",
    types: ["info_desk"],
    keywords: ["стенд", "схема этажа", "план эвакуации", "указатель", "приёмная"],
  },
  {
    id: "copy",
    title: "Копии и документы",
    types: ["copy"],
    keywords: ["копировальн", "копи-центр", "копи центр"],
  },
  {
    id: "food",
    title: "Еда и кафе",
    types: ["cafe", "canteen"],
    keywords: ["кафе", "столовая", "буфет", "кофе"],
  },
  {
    id: "admin",
    title: "Офисы и отделы",
    types: [],
    keywords: ["отдел", "ректорат", "директор", "управление", "студенческий офис"],
  },
  {
    id: "study",
    title: "Учёба и работа",
    types: [],
    keywords: ["библиотек", "лаборатория", "кафедра", "мастерская"],
  },
  {
    id: "safety",
    title: "Безопасность",
    types: ["fire_extinguisher"],
    keywords: ["огнетушитель"],
  },
  { id: "other", title: "Прочее", types: [], keywords: [] },
];

export const CONTENT_CATEGORY_TITLES = new Map(
  CONTENT_CATEGORIES.map((category) => [category.id, category.title])
);

export const KIND_LABELS: Record<PlaceKind, string> = {
  room: "Аудитория",
  orient: "Ориентир",
  square: "Площадка",
  corridor: "Коридор",
  section: "Отсек",
  exit: "Выход",
};

export interface ContentEntry {
  id: string;
  name: string;
  kind: PlaceKind;
  floor: number;
  category: string;
  // Где точку искать: зона и сторона.
  location?: string;
  // Необязательное описание для карточки в справочнике.
  desc?: string;
  // Необязательное фото (путь внутри public) для карточки в справочнике.
  photo?: string;
}

export function categorize(
  place: Pick<Place, "kind" | "name" | "description" | "orientType">
): string {
  if (place.kind === "section") return "sections";
  if (place.kind === "exit") return "exits";
  const text = `${place.name} ${place.description ?? ""}`.toLowerCase();
  for (const category of CONTENT_CATEGORIES) {
    if (
      category.types.length > 0 &&
      place.orientType !== undefined &&
      category.types.includes(place.orientType)
    ) {
      return category.id;
    }
    if (category.keywords.some((keyword) => text.includes(keyword))) {
      return category.id;
    }
  }
  return "other";
}

export function buildContentEntries(places: Place[]): ContentEntry[] {
  return places.map((place) => ({
    id: place.id,
    name: place.name,
    kind: place.kind,
    floor: place.floor,
    category: categorize(place),
    location: place.description,
    desc: place.desc,
    photo: place.photo,
  }));
}

export function searchContent(
  entries: ContentEntry[],
  query: string,
  category: string
): ContentEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter((entry) => {
    if (category !== "all" && entry.category !== category) return false;
    if (!q) return true;
    const label =
      entry.category === "other"
        ? KIND_LABELS[entry.kind]
        : (CONTENT_CATEGORY_TITLES.get(entry.category) ?? "Прочее");
    return [entry.name, entry.location, entry.desc, label]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}
