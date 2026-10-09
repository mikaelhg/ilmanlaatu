import { describe, expect, it, rs } from "@rstest/core";
import { render } from "@testing-library/react";
import AirQualityGraph from "./AirQualityGraph";
import { makeVegaSpec } from "./aq-vega";

const embedCalls: { spec: unknown; options: unknown }[] = [];

rs.mock("react-vega", () => ({
  VegaEmbed: (props: { spec: unknown; options: unknown }) => {
    embedCalls.push({ spec: props.spec, options: props.options });
    return <div data-testid="vega" />;
  },
}));

describe("AirQualityGraph", () => {
  it("passes a spec built from its props to VegaEmbed", () => {
    embedCalls.length = 0;
    const { getByTestId } = render(
      <AirQualityGraph field="PM25_PT1H_avg" title="PM2.5" domainMax={25} />,
    );
    expect(getByTestId("vega")).toBeTruthy();
    expect(embedCalls[0].spec).toEqual(
      makeVegaSpec("PM25_PT1H_avg", "PM2.5", 25),
    );
    expect(embedCalls[0].options).toEqual({ actions: false });
  });

  it("does not rebuild the spec when re-rendered with the same props", () => {
    embedCalls.length = 0;
    const { rerender } = render(
      <AirQualityGraph field="PM25_PT1H_avg" title="PM2.5" />,
    );
    rerender(<AirQualityGraph field="PM25_PT1H_avg" title="PM2.5" />);
    expect(embedCalls.length).toBeGreaterThanOrEqual(2);
    expect(embedCalls[1].spec).toBe(embedCalls[0].spec);
  });

  it("rebuilds the spec when the field changes", () => {
    embedCalls.length = 0;
    const { rerender } = render(
      <AirQualityGraph field="PM25_PT1H_avg" title="PM2.5" />,
    );
    rerender(<AirQualityGraph field="PM10_PT1H_avg" title="PM2.5" />);
    const last = embedCalls[embedCalls.length - 1];
    expect(last.spec).not.toBe(embedCalls[0].spec);
  });
});
