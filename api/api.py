from flask import Flask, render_template, request, redirect, url_for

api = Flask('api')

@api.route('/')
def index():
    title = "Welcome!"
    message = "Hello World!"
    return render_template('index.html', message=message, title=title)

@api.route('/devices', methods=['GET'])
def devices():
    title = "Devices"
    message = "Devices"
    return render_template('index.html', message=message, title=title)

if __name__ == '__main__':
    api.debug = True
    api.run(host='0.0.0.0')

