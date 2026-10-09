import type { VisualizationSpec } from "vega-embed";
import type { Locale } from "vega-typings";
import { getFmiUrl } from "../services/fmi";
import { CLASS_NAMES, FIELD_CLASSES, makeBands } from "./aq-classes";

/** Vega expression mapping `datum.now` to its class name. */
function className(limits: readonly number[]): string {
  return limits.reduceRight(
    (rest, limit, i) => `datum.now < ${limit} ? '${CLASS_NAMES[i]}' : ${rest}`,
    `'${CLASS_NAMES[limits.length]}'`,
  );
}

/** Vega-Lite layer showing the latest hourly station mean and its class. */
function makeNowLayer(field: string) {
  const classes = FIELD_CLASSES[field];
  const unit = classes?.unit ? ` ${classes.unit}` : "";
  const value = `format(datum.now, '.1f') + '${unit}'`;
  const label = classes
    ? `${value} + ' · ' + (${className(classes.limits)})`
    : value;
  return {
    transform: [
      { joinaggregate: [{ op: "max", field: "time", as: "latest" }] },
      { filter: "+datum.time === +datum.latest" },
      { aggregate: [{ op: "mean", field, as: "now" }] },
      { calculate: label, as: "label" },
    ],
    mark: {
      type: "text",
      align: "left",
      baseline: "top",
      fontSize: 18,
      fontWeight: "bold",
      color: "#222",
    },
    encoding: {
      x: { value: 8 },
      y: { value: 6 },
      text: { field: "label", type: "nominal" },
    },
  } as const;
}

export function makeVegaSpec(
  field: string,
  title: string,
  domainMax = 100,
): VisualizationSpec {
  const classes = FIELD_CLASSES[field];
  const bandsLayer = classes && {
    data: { values: makeBands(classes.limits, domainMax) },
    mark: { type: "rect", opacity: 0.2, clip: true },
    encoding: {
      x: { value: 0 },
      x2: { value: { expr: "width" } },
      y: {
        field: "lo",
        type: "quantitative",
        title: null,
        scale: { domainMin: 0, domainMax },
      },
      y2: { field: "hi" },
      color: { field: "color", type: "nominal", scale: null, legend: null },
    },
  };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: title,
    title: {
      text: title,
      anchor: "end",
      dy: 35,
      dx: -20,
    },
    width: "container",
    height: "container",
    autosize: {
      type: "fit",
      contains: "padding",
    },
    config: {
      locale: finnishLocale(),
    },
    data: {
      url: getFmiUrl(field),
      format: {
        type: "csv",
        parse: { time: "utc:'%Y%m%dT%H%M%S'" },
      },
    },
    encoding: {
      x: {
        field: "time",
        type: "temporal",
        title: null,
        axis: {
          formatType: "time",
          format: {
            year: "%Y",
            quarter: "%B",
            month: "%B",
            week: "%b %d",
            date: "%a %d",
            hours: "%H",
            minutes: "%I:%M",
            seconds: ":%S",
            milliseconds: ".%L",
          },
        },
      },
    },
    transform: [
      {
        // drop invalid values, such as "NaN"
        filter: `isValid(datum.${field}) && isFinite(+datum.${field})`,
      },
    ],
    resolve: { scale: { color: "independent" } },
    layer: [
      ...(bandsLayer ? [bandsLayer] : []),
      {
        mark: {
          type: "errorband",
          extent: "ci",
          clip: true,
        },
        encoding: {
          y: {
            field: field,
            type: "quantitative",
            title: null,
            scale: {
              domainMin: 0,
              domainMax: domainMax,
            },
          },
        },
      },
      {
        mark: {
          type: "line",
          strokeWidth: 1,
          opacity: 0.3,
          clip: true,
        },
        encoding: {
          y: {
            field: field,
            type: "quantitative",
            // title: "value",
          },
          color: {
            field: "fmisid",
            type: "nominal",
            legend: null,
          },
        },
      },
      {
        mark: {
          type: "line",
          strokeWidth: 3,
          color: "#222",
          interpolate: "basis",
          clip: true,
        },
        encoding: {
          y: {
            aggregate: "mean",
            field: field,
          },
        },
      },
      makeNowLayer(field),
    ],
  } as VisualizationSpec;
}

export const vegaOptions = {
  actions: false,
};

export const finnishLocale = (): Locale => {
  return {
    number: {
      decimal: ",",
      thousands: "\u00a0",
      grouping: [3],
      currency: ["", "\u00a0€"],
    },
    time: {
      dateTime: "%A, %-d. %Bta %Y klo %X",
      date: "%-d.%-m.%Y",
      time: "%H:%M:%S",
      periods: ["", ""],
      days: [
        "sunnuntai",
        "maanantai",
        "tiistai",
        "keskiviikko",
        "torstai",
        "perjantai",
        "lauantai",
      ],
      shortDays: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
      months: [
        "tammikuu",
        "helmikuu",
        "maaliskuu",
        "huhtikuu",
        "toukokuu",
        "kesäkuu",
        "heinäkuu",
        "elokuu",
        "syyskuu",
        "lokakuu",
        "marraskuu",
        "joulukuu",
      ],
      shortMonths: [
        "Tammi",
        "Helmi",
        "Maalis",
        "Huhti",
        "Touko",
        "Kesä",
        "Heinä",
        "Elo",
        "Syys",
        "Loka",
        "Marras",
        "Joulu",
      ],
    },
  };
};
