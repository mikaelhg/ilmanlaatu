#!/usr/bin/env python


from fmiopendata.wfs import download_stored_query
import pyarrow as pa

import json
import gzip



def main():
    obs = download_stored_query(
        'urban::observations::airquality::hourly::multipointcoverage',
        args=['timeseries=True'])

    if not obs:
        exit(1)

    with gzip.open('data/airquality.json.gz', 'wt', encoding='utf-8') as f:
        out = {'data': obs.data, 'location_metadata': obs.location_metadata}
        json.dump(out, f, default=str)

    for name in obs.data:
        field_names = list(obs.data[name].keys())
        field_names.remove('times')
        for i, time_ in enumerate(obs.data[name]['times']):
            for fn in field_names:
                print(name, time_, fn, obs.data[name][fn]['values'][i])


if __name__=='__main__':
    main()
