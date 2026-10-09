import { readFileSync } from "node:fs";
import { describe, expect, it } from "@rstest/core";
import { vega } from "vega-embed";
import { compile } from "vega-lite";
import { getFmiUrl } from "../services/fmi";
import { finnishLocale, makeVegaSpec } from "./aq-vega";

const FIELD = "PM10_PT1H_avg";

describe("makeVegaSpec", () => {
  it("compiles with Vega-Lite without warnings", () => {
    const warnings: unknown[] = [];
    const logger = {
      level: () => logger,
      warn: (...a: unknown[]) => {
        warnings.push(a);
        return logger;
      },
      info: () => logger,
      debug: () => logger,
      error: (...a: unknown[]) => {
        warnings.push(a);
        return logger;
      },
    };
    // biome-ignore lint/suspicious/noExplicitAny: partial logger stub
    compile(makeVegaSpec(FIELD, "PM10") as any, { logger: logger as any });
    expect(warnings).toEqual([]);
  });

  it("wires field, title, url and domain into the spec", () => {
    // biome-ignore lint/suspicious/noExplicitAny: inspecting the spec shape
    const spec = makeVegaSpec(FIELD, "PM10", 42) as any;
    expect(spec.data.url).toBe(getFmiUrl(FIELD));
    expect(spec.title.text).toBe("PM10");
    expect(spec.transform[0].filter).toContain(`datum.${FIELD}`);
    const band = spec.layer.find((l: any) => l.mark.type === "errorband");
    expect(band.encoding.y.field).toBe(FIELD);
    expect(band.encoding.y.scale.domainMax).toBe(42);
    for (const layer of spec.layer.filter((l: any) => l.mark.type === "line")) {
      expect(layer.encoding.y.field).toBe(FIELD);
    }
  });

  it("defaults the domain maximum to 100", () => {
    // biome-ignore lint/suspicious/noExplicitAny: inspecting the spec shape
    const spec = makeVegaSpec(FIELD, "PM10") as any;
    const band = spec.layer.find((l: any) => l.mark.type === "errorband");
    expect(band.encoding.y.scale.domainMax).toBe(100);
  });
});

describe("class bands and current value", () => {
  // biome-ignore lint/suspicious/noExplicitAny: inspecting the spec shape
  const layers = (field: string) => (makeVegaSpec(field, "x") as any).layer;

  it("draws bands first, behind everything else, for classified fields", () => {
    for (const f of ["AQINDEX_PT1H_avg", "PM25_PT1H_avg", "PM10_PT1H_avg"]) {
      // biome-ignore lint/suspicious/noExplicitAny: inspecting the spec shape
      expect(layers(f)[0].mark.type).toBe("rect");
    }
  });

  it("draws no bands for fields without an official classification", () => {
    // biome-ignore lint/suspicious/noExplicitAny: inspecting the spec shape
    expect(
      layers("QBCPM25_PT1H_avg").some((l: any) => l.mark.type === "rect"),
    ).toBe(false);
  });

  it("always shows a current-value text layer on top", () => {
    const l = layers("QBCPM25_PT1H_avg");
    expect(l[l.length - 1].mark.type).toBe("text");
  });
});

describe("data contract with FMI CSV", () => {
  it("parses UTC timestamps and drops NaN values", async () => {
    const csv = readFileSync(
      new URL("../__fixtures__/pm10.csv", import.meta.url),
      "utf8",
    );
    // biome-ignore lint/suspicious/noExplicitAny: spec is a Vega-Lite object
    const { spec } = compile(makeVegaSpec(FIELD, "PM10") as any);

    const loader = vega.loader();
    loader.load = async () => csv;

    const view = new vega.View(vega.parse(spec), {
      loader,
      renderer: "none",
    });
    await view.runAsync();

    // source_0 holds the parsed rows after the NaN filter
    // biome-ignore lint/suspicious/noExplicitAny: data accessor
    const filtered = view.data("source_0") as any[];
    expect(filtered).toHaveLength(4);
    for (const r of filtered) {
      expect(Number.isFinite(+r[FIELD])).toBe(true);
    }

    // latest hour (12:00): mean of 12.6 and 18.4 = 15.5 -> "hyvä" for PM10
    // biome-ignore lint/suspicious/noExplicitAny: data accessor
    const labels = (spec.data ?? []).flatMap((d) => view.data(d.name) as any[]);
    expect(labels.find((r) => r.label)?.label).toBe("15,5 µg/m³ · hyvä");

    const first = filtered[0];
    expect(first.time).toBeInstanceOf(Date);
    expect((first.time as Date).toISOString()).toBe("2026-10-02T10:00:00.000Z");
  });
});

describe("finnishLocale", () => {
  const { time } = finnishLocale();

  it("has full calendar names", () => {
    expect(time?.months).toHaveLength(12);
    expect(time?.shortMonths).toHaveLength(12);
    expect(time?.days).toHaveLength(7);
    expect(time?.shortDays).toHaveLength(7);
  });

  it("starts the week on Sunday, as d3-time-format expects", () => {
    expect(time?.days?.[0]).toBe("sunnuntai");
    expect(time?.shortDays?.[0]).toBe("Su");
  });

  it("starts the year in January", () => {
    expect(time?.months?.[0]).toBe("tammikuu");
    expect(time?.months?.[11]).toBe("joulukuu");
  });
});
