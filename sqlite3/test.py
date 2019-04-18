import sqlite3
import time
import math

DB = 'log.sqlite3'

def timestamp():
    return math.floor(time.time()*1000)/1000

conn = sqlite3.connect(DB)

conn.execute("insert into log values ('dev1', {}, 23)".format(timestamp()))

conn.commit()
conn.close()


