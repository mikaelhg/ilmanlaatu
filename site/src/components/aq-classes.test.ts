import { describe, expect, it } from "@rstest/core";
import {
  CLASS_COLORS,
  CLASS_NAMES,
  classIndex,
  FIELD_CLASSES,
  makeBands,
} from "./aq-classes";

describe("FIELD_CLASSES", () => {
  it("has strictly ascending limits for the four class boundaries", () => {
    for (const { limits } of Object.values(FIELD_CLASSES)) {
      expect(limits).toHaveLength(CLASS_NAMES.length - 1);
      for (let i = 1; i < limits.length; i++) {
        expect(limits[i]).toBeGreaterThan(limits[i - 1]);
      }
    }
  });

  it("matches the official FMI particulate limits", () => {
    expect(FIELD_CLASSES.PM25_PT1H_avg.limits).toEqual([10, 25, 50, 75]);
    expect(FIELD_CLASSES.PM10_PT1H_avg.limits).toEqual([20, 50, 100, 200]);
  });

  it("has a colour for every class", () => {
    expect(CLASS_COLORS).toHaveLength(CLASS_NAMES.length);
  });
});

describe("classIndex", () => {
  const pm10 = FIELD_CLASSES.PM10_PT1H_avg.limits;

  it("puts a value on a limit into the worse class", () => {
    expect(classIndex(pm10, 19.9)).toBe(0);
    expect(classIndex(pm10, 20)).toBe(1);
    expect(classIndex(pm10, 200)).toBe(4);
  });

  it("rounds the station mean of the index to a whole class", () => {
    const aqi = FIELD_CLASSES.AQINDEX_PT1H_avg.limits;
    expect(classIndex(aqi, 1)).toBe(0);
    expect(classIndex(aqi, 1.49)).toBe(0);
    expect(classIndex(aqi, 1.5)).toBe(1);
    expect(classIndex(aqi, 5)).toBe(4);
  });
});

describe("makeBands", () => {
  it("covers the whole fixed domain without gaps", () => {
    const bands = makeBands(FIELD_CLASSES.PM25_PT1H_avg.limits, 100);
    expect(bands[0].lo).toBe(0);
    expect(bands[bands.length - 1].hi).toBe(100);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].lo).toBe(bands[i - 1].hi);
    }
  });

  it("clips bands to the domain and drops those above it", () => {
    const bands = makeBands(FIELD_CLASSES.PM10_PT1H_avg.limits, 100);
    expect(bands.map((b) => b.name)).toEqual([
      "hyvä",
      "tyydyttävä",
      "välttävä",
    ]);
    expect(bands[2].hi).toBe(100);
  });
});
