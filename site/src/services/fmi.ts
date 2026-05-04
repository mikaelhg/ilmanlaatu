const HELSINKI_BBOX = ["22.65", "59.61", "26.65", "60.84"];

export const getFmiUrl = (field: string): string => {
  const baseUrl = "https://opendata.fmi.fi/timeseries";

  const params = new URLSearchParams({
    format: "csv",
    precision: "double",
    tz: "UTC",
    groupareas: "0",
    producer: "airquality_urban",
    bbox: HELSINKI_BBOX.join(","),
    param: ["fmisid", "time", field].join(","),
    starttime: "-7d",
    endtime: "-0",
  });

  return `${baseUrl}?${params.toString()}`;
};
