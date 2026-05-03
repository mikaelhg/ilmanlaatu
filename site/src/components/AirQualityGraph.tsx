import { VegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";
import { string } from "zod";
import { getFmiUrl, finnishLocale } from "../services/fmi";

const spec = (field: string, title: string, domainMax: number = 100) : VisualizationSpec => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: title,
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
            title: title,
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
  }
};

const options = {
  actions: false,
};

function AirQualityGraph({field, title, domainMax = 100}: {field: string, title: string, domainMax: number}) {
  const graphSpec = spec(field, title, domainMax)
  return (
    <VegaEmbed className="w-[98dvw] h-[49dvh]"
      spec={graphSpec} options={options} />
  );
}

export default AirQualityGraph;
