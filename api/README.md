# API server

I used to use Tornado as a web framework, but I use [Flask](http://flask.pocoo.org/) this time to implement a simple API server.

## REST API spec

#### GET /devices

```
GET /devices
A set of device names
```
Response body (200 OK)

Example
```
["device0", "device1", "device2"]
```

#### GET /{device}/log

```
GET /{device}/log
A list of data pertaining to the device name
```
Response body (200 OK)

Example
