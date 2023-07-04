#!/usr/bin/env python

from typing import List
from time import sleep
import os.path

import requests
import pendulum
import pandas as pd
from rich.console import Console


_AQ_FIELDS = {
    'fmisid': 'int32[pyarrow]',
    'utctime': 'datetime64[ns, UTC]',
    'AQINDEX_PT1H_avg': 'float64[pyarrow]',
    'PM10_PT1H_avg': 'float64[pyarrow]',
    'PM25_PT1H_avg': 'float64[pyarrow]',
    'O3_PT1H_avg': 'float64[pyarrow]',
    'CO_PT1H_avg': 'float64[pyarrow]',
    'SO2_PT1H_avg': 'float64[pyarrow]',
    'NO2_PT1H_avg': 'float64[pyarrow]',
    'TRSC_PT1H_avg': 'float64[pyarrow]',
}

_TIMESERIES_URL = 'https://opendata.fmi.fi/timeseries'

_SLEEP_BETWEEN_QUERIES = 3.0


def fetch(
    start_time: pendulum.DateTime = pendulum.yesterday('UTC'),
    end_time: pendulum.DateTime = pendulum.tomorrow('UTC'),
    fields: List[str] = list(_AQ_FIELDS.keys()),
    other_params: dict = dict(),
) -> List[dict]:
    params = {
        'format': 'json',
        'timeformat': 'xml',
        'precision': 'double',
        'groupareas': '0',
        'producer': 'airquality_urban',
        'param': ','.join(fields),
        'bbox': '20.6455928891,59.846373196,31.5160921567,70.1641930203',
        'starttime': start_time.isoformat(timespec="seconds"),
        'endtime': end_time.isoformat(timespec="seconds"),
        'tz': 'UTC',  # Output TZ
        **other_params,
    }
    result = requests.get(_TIMESERIES_URL, params=params)
    result.raise_for_status()
    return result.json()


def to_df(data: List[dict], types: dict = _AQ_FIELDS) -> pd.DataFrame:
    return pd.DataFrame(data).astype(types)


def main():
    console = Console()
    st = pendulum.today('UTC')

    while True:
        st = st.subtract(days=1)
        et = st.add(hours=23, minutes=59)
        file_name = f'''./data/airquality_{st.date().isoformat()}.parquet'''
        if not os.path.exists(file_name):
            console.print(f"getting {file_name}")
            data = fetch(st, et)
            if not data or len(data) == 0:
                break
            df = to_df(data)
            df.to_parquet(file_name, compression='gzip')
            sleep(_SLEEP_BETWEEN_QUERIES)


if __name__ == '__main__':
    main()
