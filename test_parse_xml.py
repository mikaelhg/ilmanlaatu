#!/usr/bin/env python

from owslib.wfs import WebFeatureService

from fmi import airquality_hourly_simple
from fmi import airquality_hourly_timevaluepair


def wfs():
    fmi = WebFeatureService('https://opendata.fmi.fi/wfs', version='2.0.0')
    print(fmi.identification.title)
    print(fmi.contents)


def main():
    df = airquality_hourly_simple()
    df.to_parquet('simple.parquet')
    print(df)
    print(df.dtypes)

    df = airquality_hourly_timevaluepair()


if __name__ == '__main__':
    main()
