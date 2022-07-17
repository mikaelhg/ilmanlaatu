from typing import List
from xml.etree.ElementTree import Element

import pandas as pd
from defusedxml import ElementTree as ET
import requests

from fmi.utils import FMI_WFS_SERVICE


def _fetch_airquality_hourly_timevaluepair() -> str:
    params = {
        'service': 'WFS',
        'version': '2.0.0',
        'request': 'getFeature',
        'storedquery_id': 'fmi::observations::airquality::hourly::timevaluepair'
    }
    response = requests.get(FMI_WFS_SERVICE, params=params)
    response.raise_for_status()
    return response.text


def _parse_airquality_hourly_timevaluepair(xml_text: str) -> List[List]:
    res = []
    doc: Element = ET.fromstring(xml_text)

    for m in doc.iter('{http://www.opengis.net/wfs/2.0}member'):

        pt = m.find('.//{http://www.opengis.net/om/2.0}phenomenonTime')
        pt_link = pt.get('{http://www.w3.org/1999/xlink}href')
        if pt_link:
            pt_begin, pt_end = None, None
        else:
            pt_tp = pt.find('.//{http://www.opengis.net/gml/3.2}TimePeriod')
            pt_link = pt_tp.get('{http://www.opengis.net/gml/3.2}id')
            pt_begin = pt_tp.find('.//{http://www.opengis.net/gml/3.2}beginPosition').text
            pt_end = pt_tp.find('.//{http://www.opengis.net/gml/3.2}endPosition').text

        rt = m.find('.//{http://www.opengis.net/om/2.0}resultTime')
        rt_link = rt.get('{http://www.w3.org/1999/xlink}href')
        if rt_link:
            rt_time_position = None
        else:
            rt_ti = rt.find('.//{http://www.opengis.net/gml/3.2}TimeInstant')
            rt_link = rt_ti.get('{http://www.opengis.net/gml/3.2}id')
            rt_time_position = rt_ti.find('.//{http://www.opengis.net/gml/3.2}timePosition').text

        foi = m.find('.//{http://www.opengis.net/om/2.0}featureOfInterest')

        print(pt_link, pt_begin, pt_end)
        print(rt_link, rt_time_position)

    return res


def airquality_hourly_timevaluepair() -> pd.DataFrame:
    xml_text = _fetch_airquality_hourly_timevaluepair()
    data = _parse_airquality_hourly_timevaluepair(xml_text)

    df = pd.DataFrame(data, columns=['pos', 'time', 'name', 'value'], dtype=str)
    return df
