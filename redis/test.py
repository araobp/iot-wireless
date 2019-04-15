import redis
import time
import math

r = redis.Redis(host='localhost', port=6379, db=0)

DEVICE_NAME = "dev1"

def timestamp():
    score = math.floor(time.time()*1000)
    return (score, "{:.3f}".format(score/1000))

for i in range(1000):
    s, t = timestamp()
    d = "{}:{}".format(t, i)
    print(t, d)
    r.zadd(DEVICE_NAME, {d: s} ) 
