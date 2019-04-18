# SQLITE3 usage

## Initiating sqlite3 

```
$ sqlite3 log.sqlite3
```

## Creating a table

```
sqlite> create table log(device text, timestamp real, data real);
sqlite> select * from sqlite_master;
table|log|log|2|CREATE TABLE log(device text, timestamp real, data real)
'''

## Dumping data from the table

```
sqlite> select * from log;
RRRR|12345.6789|27.0
RRRR|15453.6435|28.0
AAAA|15653.6534|21.0
```

