import pprint
import requests
from urllib.parse import urlencode

URL = 'http://localhost:18080{}'
headers = {'Content-type': 'application/json'}

DEVICE = 'pub'
FROM = 1555799654.957
TO = 1555799669.976

def _pprint(resp, comment=None):
    print()
    if comment:
        print(comment)

    print('status code: {}'.format(resp.status_code))

    if resp.status_code == 200:
        try:
            pprint.pprint(resp.json())
        except:
            print(resp.text)
    else:
        print(resp.text)

def _get(path, body=None):
    r= requests.get(URL.format(path), json=body)
    _pprint(r, path)


if __name__ == '__main__':

    r = _get('/devices')

    r = _get('/log')

    r = _get('/log/'+DEVICE)

    params = {'from': FROM}
    r = _get('/log/'+DEVICE+'?'+urlencode(params))

    params = {'from': FROM, 'to': TO}
    r = _get('/log/'+DEVICE+'?'+urlencode(params))

    params = {'from': FROM, 'to': -1}
    r = _get('/log/'+DEVICE+'?'+urlencode(params))
	

