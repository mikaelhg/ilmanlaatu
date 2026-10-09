import { describe, expect, it, rs } from "@rstest/core";
import { render } from "@testing-library/react";
import MainView from "./MainView";

rs.mock("../components/AirQualityGraph", () => ({
  default: (p: { field: string; title: string; domainMax?: number }) => (
    <div
      data-testid="graph"
      data-field={p.field}
      data-title={p.title}
      data-max={p.domainMax}
    />
  ),
}));

describe("MainView", () => {
  it("renders the four expected graphs with their scales", () => {
    const { getAllByTestId } = render(<MainView />);
    const graphs = getAllByTestId("graph").map((g) => ({
      field: g.dataset.field,
      title: g.dataset.title,
      max: Number(g.dataset.max),
    }));
    expect(graphs).toEqual([
      { field: "AQINDEX_PT1H_avg", title: "Air quality index", max: 5 },
      { field: "QBCPM25_PT1H_avg", title: "Black coal", max: 5 },
      { field: "PM25_PT1H_avg", title: "PM2.5", max: 25 },
      { field: "PM10_PT1H_avg", title: "PM10", max: 100 },
    ]);
  });

  it("requests each field only once", () => {
    const { getAllByTestId } = render(<MainView />);
    const fields = getAllByTestId("graph").map((g) => g.dataset.field);
    expect(new Set(fields).size).toBe(fields.length);
  });
});
