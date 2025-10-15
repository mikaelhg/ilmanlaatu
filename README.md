# Ilmanlaatu

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/mikaelhg/ilmanlaatu/HEAD?labpath=timeseries.ipynb)

## Using the new and nice FMI time series interface

https://github.com/fmidev/smartmet-plugin-timeseries/blob/master/docs/Using-the-Timeseries-API.md

https://github.com/fmidev/smartmet-plugin-timeseries/blob/master/docs/Examples.md

Helsinki, all fields, default period, JSON.

https://opendata.fmi.fi/timeseries?format=json&groupareas=0&producer=airquality_urban&area=Helsinki&param=time,fmisid,PM10_PT1H_avg,PM25_PT1H_avg,O3_PT1H_avg,CO_PT1H_avg,SO2_PT1H_avg,NO2_PT1H_avg,TRSC_PT1H_avg

# ALL STATIONS, ALL VALUES, LAST DAY, USING KEYWORD

https://opendata.fmi.fi/timeseries?format=csv&precision=double&groupareas=0&producer=airquality_urban&param=fmisid,iso2,region,name,latitude,longitude,isotime,PM10_PT1H_avg,PM25_PT1H_avg,O3_PT1H_avg,CO_PT1H_avg,SO2_PT1H_avg,NO2_PT1H_avg,TRSC_PT1H_avg&starttime=-1d&endtime=-0&keyword=air_quality_urban

https://opendata.fmi.fi/timeseries?format=json&precision=double&groupareas=0&producer=airquality_urban&param=fmisid,iso2,region,name,latitude,longitude,isotime,PM10_PT1H_avg,PM25_PT1H_avg,O3_PT1H_avg,CO_PT1H_avg,SO2_PT1H_avg,NO2_PT1H_avg,TRSC_PT1H_avg&starttime=-1d&endtime=-0&keyword=air_quality_urban

Bounding box for Uusimaa.

https://opendata.fmi.fi/timeseries?format=ascii&separator=,&precision=double&groupareas=0&producer=airquality_urban&bbox=22.65,59.61,26.65,60.84&param=fmisid,time,PM10_PT1H_avg&timesteps=24

CSV PM10 last 24h for whole Finland, quickly because Finland bbox and timesteps. 

https://opendata.fmi.fi/timeseries?format=ascii&separator=,&precision=double&groupareas=0&producer=airquality_urban&bbox=20.6455928891,59.846373196,31.5160921567,70.1641930203&param=fmisid,time,PM10_PT1H_avg&timesteps=24

Last week of PM10 in Finland. Timestamp as UTC, XML-formatted.

https://opendata.fmi.fi/timeseries?format=json&precision=double&timeformat=xml&groupareas=0&producer=airquality_urban&bbox=20.6455928891,59.846373196,31.5160921567,70.1641930203&param=fmisid,utctime,PM10_PT1H_avg&starttime=-7d&endtime=-0

### `fmisid` locations

https://opendata.fmi.fi/timeseries?format=json&precision=double&groupareas=0&producer=airquality_urban&param=fmisid,region,name,latitude,longitude&starttime=-1d&timestep=1d&bbox=20.6455928891,59.846373196,31.5160921567,70.1641930203

https://opendata.fmi.fi/timeseries?format=json&precision=double&groupareas=0&producer=airquality_urban&param=fmisid,region,iso2,name,latitude,longitude&starttime=-1d&timestep=1d&keyword=air_quality_urban

## Old and slow FMI WFS based stuff

https://www.ilmatieteenlaitos.fi/ilmanlaatu

https://en.ilmatieteenlaitos.fi/open-data-manual

https://github.com/fmidev/smartmet-plugin-wfs/blob/master/cnf/opendata_stored_queries_github/urban::observations::airquality::hourly::multipointcoverage.conf

http://catalog.fmi.fi/geonetwork/srv/fin/catalog.search#/metadata/cf1b68b2-78d8-481c-9c2c-2b950214d477
