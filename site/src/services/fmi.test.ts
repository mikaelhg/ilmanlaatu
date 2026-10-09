import { describe, expect, it } from "@rstest/core";
import { getFmiUrl } from "./fmi";

describe("getFmiUrl", () => {
  const url = new URL(getFmiUrl("PM10_PT1H_avg"));
  const p = url.searchParams;

  it("targets the FMI timeseries endpoint over https", () => {
    expect(url.origin + url.pathname).toBe(
      "https://opendata.fmi.fi/timeseries",
    );
  });

  it("requests only station id, time and the given field", () => {
    expect(p.get("param")).toBe("fmisid,time,PM10_PT1H_avg");
  });

  it("asks for UTC CSV from the urban air quality producer", () => {
    expect(p.get("format")).toBe("csv");
    expect(p.get("tz")).toBe("UTC");
    expect(p.get("producer")).toBe("airquality_urban");
    expect(p.get("groupareas")).toBe("0");
  });

  it("covers the last 7 days up to now", () => {
    expect(p.get("starttime")).toBe("-7d");
    expect(p.get("endtime")).toBe("-0");
  });

  it("uses a well-formed bbox of lon,lat,lon,lat", () => {
    const [minLon, minLat, maxLon, maxLat] = (p.get("bbox") ?? "")
      .split(",")
      .map(Number);
    expect(minLon).toBeLessThan(maxLon);
    expect(minLat).toBeLessThan(maxLat);
    // sanity: within Finland
    expect(minLon).toBeGreaterThan(19);
    expect(maxLon).toBeLessThan(32);
    expect(minLat).toBeGreaterThan(59);
    expect(maxLat).toBeLessThan(61);
  });

  it("reflects a different field", () => {
    const other = new URL(getFmiUrl("AQINDEX_PT1H_avg"));
    expect(other.searchParams.get("param")).toBe(
      "fmisid,time,AQINDEX_PT1H_avg",
    );
  });
});
