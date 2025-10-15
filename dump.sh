#!/bin/bash

START_TIME="-48h"
START_TIME="-7d"
FIELDS="fmisid,iso2,region,name,latitude,longitude,isotime,aqindex_pt1h_avg,PM10_PT1H_avg,PM25_PT1H_avg,O3_PT1H_avg,SO2_PT1H_avg,NO2_PT1H_avg"

URL="https://opendata.fmi.fi/timeseries?format=csv&precision=double&groupareas=0&timestep=data&producer=airquality_urban&keyword=air_quality_urban&param=${FIELDS}&starttime=${START_TIME}&endtime=-0h"

FILE="./data/air_quality_urban_`date -I`.csv"

curl -s -o- "${URL}" | zstd -zcf -19 -T8 > ./data/air_quality_urban_`date -I`.csv.zst
