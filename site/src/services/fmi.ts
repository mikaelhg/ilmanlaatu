import type { Locale } from "vega-typings"

export const getFmiUrl = (field: string) => {
  const baseUrl = "https://opendata.fmi.fi/timeseries";

  const params = new URLSearchParams({
    format: "csv",
    precision: "double",
    tz: "UTC",
    groupareas: "0",
    producer: "airquality_urban",
    bbox: ["22.65", "59.61", "26.65", "60.84"].join(','),
    param: ["fmisid", "time", field].join(","),
    starttime: "-7d",
    endtime: "-0",
  });

  return `${baseUrl}?${params.toString()}`;
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
    }
  }
};