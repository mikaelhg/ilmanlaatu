#!/usr/bin/env python

from typing import List
import requests
import pendulum
from pendulum import DateTime
import pandas as pd
import numpy as np
import duckdb


_AQ_FIELDS = {
    'fmisid': np.int32,
    'time': np.datetime64,
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
        'area': 'Uusimaa',
        'starttime': start_time.isoformat(timespec="seconds"),
        'endtime': end_time.isoformat(timespec="seconds"),
        'tz': 'UTC',  # Output TZ
        **other_params,
    }
    return requests.get(_TIMESERIES_URL, params=params).json()


def to_df(data: List[dict]) -> pd.DataFrame:
    return pd.DataFrame(data).astype(_AQ_FIELDS)


def open_db():
    pass


def main():
    start_time = pendulum.yesterday('UTC')
    end_time = pendulum.tomorrow('UTC')
    data = fetch(start_time, end_time)
    df = to_df(data)
    print(df)


if __name__ == '__main__':
    main()
