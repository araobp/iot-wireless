# API server

## REST API spec

#### GET /devices

```
GET /devices
```

200 OK example
```
['RN079D', 'switch-00297f2d', 'temp-04017c00']
```

#### GET /log

```
GET /log
```

200 OK example
```
switch-00297f2d,1555631198.894,0
switch-00297f2d,1555631199.421,132
switch-00297f2d,1555631199.614,0
temp-04017c00,1555631400.411,26
temp-04017c00,1555632665.063,26
temp-04017c00,1555634140.341,26
              :
```

#### GET /log/{device}

```
GET /log/{device}?<from>&<to>
```

URL parameters or "to" can be omitted. If "to" is negative, it means now.

GET and 200 OK example
```
GET /log/temp-04017c00?from=1555631400.411&to=-1

temp-04017c00,1555631400.411,26
temp-04017c00,1555632665.063,26
temp-04017c00,1555634140.341,26
          :
```

#### GET /applications

```
GET /applications
```

200 OK example
```
["room-temperature", "life-log", "wireless-switch", "dynamic-nfc"]
```

#### GET /applications/{application}

```
GET /applications/life-log
```

200 OK example
```
{"devices": ["BLE1", "BLE2"], "html5": "life-log/main.html"}
```
