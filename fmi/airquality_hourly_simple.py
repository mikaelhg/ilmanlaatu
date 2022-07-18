from typing import List
from xml.etree.ElementTree import Element

import pandas as pd
from defusedxml import ElementTree as ET
import requests

from fmi.utils import FMI_WFS_SERVICE, _FMI_NS


def _fetch_airquality_hourly_simple() -> str:
    params = {
        'service': 'WFS',
        'version': '2.0.0',
        'request': 'getFeature',
        'storedquery_id': 'fmi::observations::airquality::hourly::simple'
    }
    response = requests.get(FMI_WFS_SERVICE, params=params)
    response.raise_for_status()
    return response.text


def _parse_airquality_hourly_simple(xml_text: str) -> List[List]:
    doc: Element = ET.fromstring(xml_text)
    res = []
    for m in doc.iterfind("wfs:member", _FMI_NS):
        pos = m.find(".//gml:pos", _FMI_NS).text
        time = m.find(".//BsWfs:Time", _FMI_NS).text
        name = m.find(".//BsWfs:ParameterName", _FMI_NS).text
        value = m.find(".//BsWfs:ParameterValue", _FMI_NS).text
        res.append([pos, time, name, value])
    return res


def airquality_hourly_simple() -> pd.DataFrame:
    xml_text = _fetch_airquality_hourly_simple()
    data = _parse_airquality_hourly_simple(xml_text)

    df = pd.DataFrame(data, columns=['pos', 'time', 'name', 'value'], dtype=str)
    df['pos'] = df['pos'].astype('category')
    df['time'] = pd.to_datetime(df['time'])
    df['name'] = df['name'].astype('category')
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    return df
