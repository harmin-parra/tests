import json
import requests

base_url = "https://api.restful-api.dev/objects"

headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
}

def get(id):
    url = f"{base_url}/{id}"
    result = requests.get(url=url, headers=headers)
    return result


def post(payload):
    url = f"{base_url}"
    result = requests.post(
        url=url,
        data=json.dumps(payload),
        headers=headers
    )
    return result


def delete(id):
    url = f"{base_url}/{id}"
    result = requests.delete(url=url)
    return result
