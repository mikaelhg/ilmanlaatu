// FMI air quality index classes.
// https://www.ilmatieteenlaitos.fi/ilmanlaatuindeksi

export const CLASS_NAMES = [
  "hyvä",
  "tyydyttävä",
  "välttävä",
  "huono",
  "erittäin huono",
] as const;

export const CLASS_COLORS = [
  "#4caf50",
  "#cddc39",
  "#ffc107",
  "#f44336",
  "#9c27b0",
] as const;

export interface FieldClasses {
  /** Ascending lower bounds of classes 2..5; a value on a limit belongs to the worse class. */
  limits: readonly number[];
  unit: string;
}

/**
 * Class limits per FMI field. Fields without an entry (e.g. black carbon)
 * have no official classification and get no bands.
 */
export const FIELD_CLASSES: Record<string, FieldClasses> = {
  // The index is a whole number 1..5; its station mean is rounded to a class.
  AQINDEX_PT1H_avg: { limits: [1.5, 2.5, 3.5, 4.5], unit: "" },
  PM25_PT1H_avg: { limits: [10, 25, 50, 75], unit: "µg/m³" },
  PM10_PT1H_avg: { limits: [20, 50, 100, 200], unit: "µg/m³" },
};

export interface Band {
  lo: number;
  hi: number;
  name: string;
  color: string;
}

export function classIndex(limits: readonly number[], value: number): number {
  return limits.filter((l) => l <= value).length;
}

/** Class bands clipped to the fixed scale [0, domainMax]. */
export function makeBands(
  limits: readonly number[],
  domainMax: number,
): Band[] {
  const edges = [0, ...limits, Number.POSITIVE_INFINITY];
  return CLASS_NAMES.map((name, i) => ({
    lo: edges[i],
    hi: Math.min(edges[i + 1], domainMax),
    name,
    color: CLASS_COLORS[i],
  })).filter((b) => b.lo < domainMax);
}
