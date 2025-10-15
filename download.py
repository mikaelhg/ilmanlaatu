from typing import List
from time import sleep
import os.path

import httpx
import pendulum
import polars as pl


_AQ_FIELDS = {
    'fmisid': pl.Int32,
    'utctime': pl.Datetime,
    'iso2': pl.String,
    'region': pl.String,
    'name': pl.String,
    'AQINDEX_PT1H_avg': pl.Float64,
    'PM10_PT1H_avg': pl.Float64,
    'PM25_PT1H_avg': pl.Float64,
    'O3_PT1H_avg': pl.Float64,
    'CO_PT1H_avg': pl.Float64,
    'SO2_PT1H_avg': pl.Float64,
    'NO2_PT1H_avg': pl.Float64,
    'TRSC_PT1H_avg': pl.Float64,
}

_TIMESERIES_URL = 'https://opendata.fmi.fi/timeseries'

_SLEEP_BETWEEN_QUERIES = 3.0


def fetch(
    start_time: pendulum.DateTime = pendulum.yesterday('UTC'),
    end_time: pendulum.DateTime = pendulum.tomorrow('UTC'),
    fields: List[str] = list(_AQ_FIELDS.keys()),
    other_params: dict = dict(),
) -> pl.DataFrame:
    params = {
        'format': 'json',
        'timeformat': 'xml',
        'precision': 'double',
        'groupareas': '0',
        'producer': 'airquality_urban',
        'keyword': 'air_quality_urban',
        'param': ','.join(fields),
        'starttime': start_time.isoformat(timespec="seconds"),
        'endtime': end_time.isoformat(timespec="seconds"),
        'tz': 'UTC',  # Output TZ
        **other_params,
    }
    result = httpx.get(_TIMESERIES_URL, params=params)
    result.raise_for_status()
    return pl.read_json(result.content)


def main():
    st = pendulum.today('UTC')

    while True:
        st = st.subtract(days=1)
        et = st.add(hours=23, minutes=59)
        file_name = f'''./data/airquality_{st.date().isoformat()}.parquet'''
        if not os.path.exists(file_name):
            print(f"getting {file_name}")
            df = fetch(st, et)
            if len(df) == 0:
                break
            df.write_parquet(file_name, compression='zstd')
            sleep(_SLEEP_BETWEEN_QUERIES)


if __name__ == '__main__':
    main()
