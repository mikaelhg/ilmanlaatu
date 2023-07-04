#!/usr/bin/env python

import io
from typing import List
import requests

from defusedxml import pulldom


_TIMESERIES_URL = 'https://opendata.fmi.fi/timeseries'

_AQ_FIELDS = ['PM10_PT1H_avg', 'PM25_PT1H_avg', 'SO2_PT1H_avg', 'NO2_PT1H_avg']


def fetch(
    start_time: str = '-1d',
    end_time: str = '-0m',
    fields: List[str] = _AQ_FIELDS,
    other_params: dict = dict(),
) -> io.StringIO:
    params = {
        'format': 'wxml',
        'precision': 'double',
        'groupareas': '0',
        'producer': 'airquality_urban',
        'param': ','.join(fields),
        'area': 'Finland',
        'starttime': start_time,
        'endtime': end_time,
        'tz': 'UTC',  # Output TZ
        **other_params,
    }
    result = requests.get(_TIMESERIES_URL, params=params)
    result.raise_for_status()
    return io.StringIO(result.text)


def to_float(value: str) -> float | None:
    if value is None or value == '':
        return None
    else:
        return float(value)


def main():
    location, observation, observations, params = tuple(), str(), list(), dict()
    for event, node in pulldom.parse(fetch()):
        match (str(event), getattr(node, 'tagName', '')):
            case ('START_ELEMENT', 'location'):
                location = (node.getAttribute('name'), node.getAttribute('id'),
                            node.getAttribute('lat'), node.getAttribute('lon'))
                observations = list()

            case ('END_ELEMENT', 'location'):
                print(location, observations)

            case ('START_ELEMENT', 'observation'):
                observation = node.getAttribute('time')
                params = dict()

            case ('END_ELEMENT', 'observation'):
                observations.append((observation, params))

            case ('START_ELEMENT', 'param'):
                params[node.getAttribute('name')] = to_float(node.getAttribute('value'))


if __name__ == '__main__':
    main()
