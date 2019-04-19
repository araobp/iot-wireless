import pprint
import requests

URL = 'http://localhost:18080{}'
headers = {'Content-type': 'application/json'}

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

def _get(path):
    r= requests.get(URL.format(path))
    _pprint(r, path)


if __name__ == '__main__':

    r = _get('/devices')
    #r = _get('/log')
    #r = _get('/log/temp-04017c00')
	
