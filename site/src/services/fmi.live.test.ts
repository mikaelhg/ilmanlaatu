// Network smoke test against the real FMI API. Excluded from `pnpm test`;
// run with `pnpm test:live` (e.g. from a scheduled workflow).
import { describe, expect, it } from "@rstest/core";
import { getFmiUrl } from "./fmi";

describe("FMI live API", () => {
  it("returns CSV with the expected header and numeric rows", async () => {
    const res = await fetch(getFmiUrl("PM10_PT1H_avg"));
    expect(res.status).toBe(200);
    const lines = (await res.text()).trim().split("\n");
    expect(lines[0]).toBe('"fmisid","time","PM10_PT1H_avg"');
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[1]).toMatch(/^\d+,"\d{8}T\d{6}",/);
  });
});
