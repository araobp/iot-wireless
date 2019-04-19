# API server

## REST API spec

#### GET /devices

```
GET /devices
A set of device names
```
Response body (200 OK)

Example
```
['RN079D', 'switch-00297f2d', 'temp-04017c00']
```

#### GET /log

```
GET /log
Dump all the records.
```
Response body (200 OK)

Example
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
GET /log/{device}
A list of data pertaining to the device name
```
Response body (200 OK)

Example
```
temp-04017c00,1555631400.411,26
temp-04017c00,1555632665.063,26
temp-04017c00,1555634140.341,26
          :
```
