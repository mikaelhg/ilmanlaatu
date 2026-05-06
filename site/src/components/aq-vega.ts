import type { VisualizationSpec } from "vega-embed";
import type { Locale } from "vega-typings";
import { getFmiUrl } from "../services/fmi";

export function makeVegaSpec(
  field: string,
  title: string,
  domainMax = 100,
): VisualizationSpec {
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
    layer: [
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
          color: "red",
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
    ],
  };
}

export const vegaOptions = {
  actions: false,
};

export const finnishLocale = (): Locale => {
  return {
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
