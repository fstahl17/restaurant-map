// src/lib/normalizePlaces.ts
export type RawRow = Record<string, unknown>;

export type Dish = {
  title?: string;
  recommend?: string;
  score?: number;
  file?: string;
  filePath?: string;
  sourceIndex: number;
};

export type Place = {
  placeId?: string;
  name?: string;
  address?: string;
  date?: string;
  restype?: string;
  firstImpression?: string;
  service?: string;
  ambience?: string;
  wouldReturn?: string;
  priceValue?: string;
  notes?: string;
  reviewer?: string;
  lat?: number;
  lng?: number;
  raw: RawRow;
  dishes: Dish[];
};

const S_TITLE = "Bestellte Gerichte - Titel der bestellten Speise:";
const S_REC = "Bestellte Gerichte - Dieses Gericht würde ich weiterempfehlen";
const S_SCORE = "Bestellte Gerichte - Wie gut mir dieses Gericht im direkten Vergleich zu ähnlichen Speisen geschmeckt hat.";
const S_FILE = "Bestellte Gerichte - File Upload";
const S_FILE_PATH = "Bestellte Gerichte - File Upload-path";

function s(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const t = String(v).trim();
  return t.length ? t : undefined;
}

function n(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const num = Number(v);
  return Number.isFinite(num) ? num : undefined;
}

function toPlace(r: RawRow): Place {
  return {
    placeId: s(r["Place Id - Location"]),
    name: s(r["Name - Location"]),
    address: s(r["Formatted Address - Location"]),
    date: s(r["Submitted Date"]),
    restype: s(r["Restaurant Type"]),
    firstImpression: s(r["Überzeugt der erste Eindruck?"]),
    service: s(r["Ist das Service den Umständen entsprechend hochwertig?"]),
    ambience: s(r["Ist das Ambiente / Einrichtung des Objekts passend?"]),
    wouldReturn: s(r["Würde ich dieses Restaurant weiterempfehlen / bzw. wiederkommen?"]),
    priceValue: s(r["War das Verhältnis von Preis / Leistung gerechtfertigt?"]),
    notes: s(r["Weitere Anmerkungen zum Personal / Empfohlenen Speisen / ..."]),
    reviewer: s(r["Review von:"]),
    lat: n(r["Latitude - Location"]),
    lng: n(r["Longitude - Location"]),
    raw: r,
    dishes: [],
  };
}

function extractDish(r: RawRow, sourceIndex: number): Dish | undefined {
  const title = s(r[S_TITLE]);
  if (!title) return undefined;
  return {
    title,
    recommend: s(r[S_REC]),
    score: n(r[S_SCORE]),
    file: s(r[S_FILE]),
    filePath: s(r[S_FILE_PATH]),
    sourceIndex,
  };
}

function hasPlaceInfo(r: RawRow): boolean {
  return Boolean(
    s(r["Place Id - Location"]) ||
    s(r["Name - Location"]) ||
    s(r["Formatted Address - Location"])
  );
}

/**
 * Aggregiert Zeilen mit Gerichtstiteln ohne Ortsdaten („Waisen“-Zeilen)
 * zur zuletzt gesehenen echten Location nach oben („forward attach“).
 * Zusätzlich wird das Gericht der „echten“ Zeile selbst mit aufgenommen.
 */
export function normalizePlaces(rows: RawRow[]): Place[] {
  const out: Place[] = [];
  let current: Place | null = null;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    if (hasPlaceInfo(r)) {
      current = toPlace(r);
      const d = extractDish(r, i);
      if (d) current.dishes.push(d);
      out.push(current);
      continue;
    }

    const orphanDish = extractDish(r, i);
    if (orphanDish && current) {
      current.dishes.push(orphanDish);
    }
  }

  return out;
}
