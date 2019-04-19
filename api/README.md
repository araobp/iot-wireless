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
GET /log/{device}
{"from": <epoch time> , "to": <epoch time>}
```

Body or "to" can be omitted. If "to" is negative, it means now.

200 OK example
```
temp-04017c00,1555631400.411,26
temp-04017c00,1555632665.063,26
temp-04017c00,1555634140.341,26
          :
```
