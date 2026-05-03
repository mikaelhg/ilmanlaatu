import { VegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";
import { finnishLocale, getFmiUrl } from "../services/fmi";

function spec(
  field: string,
  title: string,
  domainMax = 100,
): VisualizationSpec {
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
  };
}

const options = {
  actions: false,
};

interface AirQualityProps {
  field: string;
  title: string;
  domainMax: number;
}

function AirQualityGraph({ field, title, domainMax = 100 }: AirQualityProps) {
  const graphSpec = spec(field, title, domainMax);
  return (
    <VegaEmbed className="h-full w-full" spec={graphSpec} options={options} />
  );
}

export default AirQualityGraph;
