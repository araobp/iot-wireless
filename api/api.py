from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import json

DB = 'log.sqlite3'
conn = None

api = Flask('api')

@api.route('/')
def index():
    title = "Welcome!"
    message = "Hello World!"
    return render_template('index.html', message=message, title=title)

@api.route('/devices', methods=['GET'])
def devices():
    devices = {'devices': ['a', 'b', 'c']}
    return json.dumps(devices)

if __name__ == '__main__':
    conn = sqlite3.connect(DB)
    api.debug = True
    try:
        api.run(host='0.0.0.0')
    except KeyboardInterrupt:
        conn.close()

