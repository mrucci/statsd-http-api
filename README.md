# statsd-http-api

A statsd backend that exposes the latest aggregated metrics via a simple HTTP API.

## API

[Statsd][statsd] internally keeps all metrics in a javascript object of the form:

    {
      "counters": {
        "statsd.bad_lines_seen": 0,
        "statsd.packets_received": 3,
        "test.hello": 3
      },
      "gauges": {},
      "timers": {},
      "timer_counters": {},
      "sets": {},
      "counter_rates": {
        "statsd.bad_lines_seen": 0,
        "statsd.packets_received": 0.2,
        "test.hello": 0.2
      },
      "timer_data": {},
      "pctThreshold": [
        90
      ],
      "statsd_metrics": {
        "processing_time": 0
      }
    }

Using the API, you can access all parts of the metrics object via obvious URLs:

 * `GET /counters/test.hello` returns `3`

 * `GET /counter_rates` returns:

        {
          "statsd.bad_lines_seen": 0,
          "statsd.packets_received": 0.2,
          "test.hello": 0.2
        }

 * `GET /` returns the whole metrics object.

## Installation

Copy `statsd-http-api.js` into the `statsd/backends` folder of your local statsd installation.  Then change the statsd configuration file to include the `statsd-http-api` in the backend list:

    {
      "backends": ["backends/statsd-http-server"]
    }

## Run

    node statsd.js config.js

The http server listens on TCP port 8127.  Test that everything is working by visiting `http://localhost:8127`

## Use it with Cubism

This backend was designed to expose metrics for graph visualization using [cubism][cubism].

Check out [cubismino][cubismino] to get up and running with statsd and cubism.

[statsd]: http://statsd
[cubism]: https://github.com/square/cubism
[cubismino]: https://github.com/mrucci/cubismino

