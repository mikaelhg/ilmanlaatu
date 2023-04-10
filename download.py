#!/usr/bin/env python

from typing import List
from time import sleep
import os.path

import requests
import pendulum
import pandas as pd
import numpy as np
from rich.console import Console
from rich.progress import track


_AQ_FIELDS = {
    'fmisid': np.int32,
    'time': 'datetime64[ns]',
#    'time': np.datetime64,
    'AQINDEX_PT1H_avg': np.float64,
    'PM10_PT1H_avg': np.float64,
    'PM25_PT1H_avg': np.float64,
    'O3_PT1H_avg': np.float64,
    'CO_PT1H_avg': np.float64,
    'SO2_PT1H_avg': np.float64,
    'NO2_PT1H_avg': np.float64,
    'TRSC_PT1H_avg': np.float64,
}

_TIMESERIES_URL = 'https://opendata.fmi.fi/timeseries'

_SLEEP_BETWEEN_QUERIES = 10.0


def fetch(
    start_time: pendulum.DateTime = pendulum.yesterday('UTC'),
    end_time: pendulum.DateTime = pendulum.tomorrow('UTC'),
    fields: List[str] = _AQ_FIELDS.keys(),
    other_params: dict = dict(),
) -> List[dict]:
    params = {
        'format': 'json',
        'precision': 'double',
        'groupareas': '0',
        'producer': 'airquality_urban',
        'param': ','.join(fields),
        'area': 'Finland',
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
            console.log(f"getting {file_name}")
            data = fetch(st, et)
            if not data or len(data) == 0:
                break
            df = to_df(data)
            df.to_parquet(file_name, compression='gzip')
            for step in track(range(20), description='Sleeping...'):
                sleep(_SLEEP_BETWEEN_QUERIES / 20)


if __name__ == '__main__':
    main()
