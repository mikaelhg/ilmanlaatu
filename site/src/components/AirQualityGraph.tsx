import { VegaEmbed } from "react-vega";
import { makeVegaSpec, vegaOptions } from "./aq-vega";

interface AirQualityProps {
  field: string;
  title: string;
  domainMax: number;
}

export default function AirQualityGraph({ field, title, domainMax = 100 }: AirQualityProps) {
  const spec = makeVegaSpec(field, title, domainMax);
  return (
    <VegaEmbed className="h-full w-full" spec={spec} options={vegaOptions} />
  );
}
