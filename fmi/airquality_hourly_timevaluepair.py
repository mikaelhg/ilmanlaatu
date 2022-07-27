from typing import List
from xml.etree.ElementTree import Element

import pandas as pd
from defusedxml import ElementTree as ET
import requests

from fmi.utils import _FMI_WFS_SERVICE, _FMI_NS


_XLINK_HREF = '{http://www.w3.org/1999/xlink}href'
_GML_ID = '{http://www.opengis.net/gml/3.2}id'


def _fetch_airquality_hourly_timevaluepair() -> str:
    params = {
        'service': 'WFS',
        'version': '2.0.0',
        'request': 'getFeature',
        'storedquery_id': 'fmi::observations::airquality::hourly::timevaluepair'
    }
    response = requests.get(_FMI_WFS_SERVICE, params=params)
    response.raise_for_status()
    return response.text


def _parse_airquality_hourly_timevaluepair(xml_text: str) -> List[List]:
    res = []
    doc: Element = ET.fromstring(xml_text)

    for m in doc.iterfind('wfs:member', _FMI_NS):

        pt = m.find('.//om:phenomenonTime', _FMI_NS)
        pt_link = pt.get(_XLINK_HREF)
        if pt_link:
            pt_begin, pt_end = None, None
        else:
            pt_tp = pt.find('.//gml:TimePeriod', _FMI_NS)
            pt_link = pt_tp.get(_GML_ID)
            pt_begin = pt_tp.find('.//gml:beginPosition', _FMI_NS).text
            pt_end = pt_tp.find('.//gml:endPosition', _FMI_NS).text

        rt = m.find('.//om:resultTime', _FMI_NS)
        rt_link = rt.get(_XLINK_HREF)
        if rt_link:
            rt_time_position = None
        else:
            rt_ti = rt.find('.//gml:TimeInstant', _FMI_NS)
            rt_link = rt_ti.get(_GML_ID)
            rt_time_position = rt_ti.find('.//gml:timePosition', _FMI_NS).text

        foi = m.find('.//om:featureOfInterest', _FMI_NS)

        print(pt_link, pt_begin, pt_end)
        print(rt_link, rt_time_position)

    return res


def airquality_hourly_timevaluepair() -> pd.DataFrame:
    xml_text = _fetch_airquality_hourly_timevaluepair()
    data = _parse_airquality_hourly_timevaluepair(xml_text)

    df = pd.DataFrame(data, columns=['pos', 'time', 'name', 'value'], dtype=str)
    return df
