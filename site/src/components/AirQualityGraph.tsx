import { useMemo } from "react";
import { VegaEmbed } from "react-vega";
import { makeVegaSpec, vegaOptions } from "./aq-vega";

interface AirQualityProps {
  field: string;
  title: string;
  domainMax?: number;
}

export default function AirQualityGraph({ field, title, domainMax = 100 }: AirQualityProps) {
  const spec = useMemo(() => {
    return makeVegaSpec(field, title, domainMax);
  }, [field, title, domainMax]);
  return (
    <VegaEmbed className="h-full w-full" spec={spec} options={vegaOptions} />
  );
}
