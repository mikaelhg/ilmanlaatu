import { VegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";

const getFmiUrl = () => {
  const baseUrl = "https://opendata.fmi.fi/timeseries";

  const params = new URLSearchParams({
    format: "csv",
    precision: "double",
    tz: "UTC",
    groupareas: "0",
    producer: "airquality_urban",
    bbox: "22.65,59.61,26.65,60.84",
    param: ["fmisid", "time", "PM10_PT1H_avg"].join(","),
    starttime: "-7d",
    endtime: "-0",
  });

  return `${baseUrl}?${params.toString()}`;
};

const spec: VisualizationSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "PM10 air quality in Helsinki.",
  width: "container",
  height: "container",
  autosize: {
    type: "fit",
    contains: "padding",
  },
  config: {
    locale: {
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
    },
  },
  data: {
    url: getFmiUrl(),
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
      filter: "isValid(datum.PM10_PT1H_avg) && isFinite(+datum.PM10_PT1H_avg)",
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
          field: "PM10_PT1H_avg",
          type: "quantitative",
          title: "PM10 Helsinki: mean and error",
          scale: {
            domainMin: 0,
            domainMax: 100,
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
          field: "PM10_PT1H_avg",
          type: "quantitative",
          title: "PM10",
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
          field: "PM10_PT1H_avg",
        },
      },
    },
  ],
};

const options = {
  actions: false,
};

function AirQualityGraph() {
  return (
    <VegaEmbed className="w-[98dvw] h-[98dvh]" spec={spec} options={options} />
  );
}

export default AirQualityGraph;
