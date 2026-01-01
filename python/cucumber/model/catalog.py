import allure
import json
import requests

base_url = "https://api.restful-api.dev/objects"

headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
}

def get(id):
    url = f"{base_url}/{id}"
    allure.attach(
        f"GET {url}",
        name="Query request",
        attachment_type=allure.attachment_type.TEXT
    )
    result = requests.get(url=url, headers=headers)
    allure.attach(
        result.text,
        name="Query response",
        attachment_type=allure.attachment_type.JSON
    )
    return result


def post(payload):
    url = f"{base_url}"
    allure.attach(
        f"POST {url}",
        name="Query request",
        attachment_type=allure.attachment_type.TEXT
    )
    allure.attach(
        json.dumps(payload),
        name="Query payload",
        attachment_type=allure.attachment_type.JSON
    )
    result = requests.post(url=url,
                           data=json.dumps(payload),
                           headers=headers)
    allure.attach(
        result.text,
        name="Query response",
        attachment_type=allure.attachment_type.JSON
    )
    return result


def delete(id):
    url = f"{base_url}/{id}"
    allure.attach(
        f"DELETE {url}",
        name="Query request",
        attachment_type=allure.attachment_type.TEXT
    )
    result = requests.delete(url=url)
    allure.attach(
        result.text,
        name="Query response",
        attachment_type=allure.attachment_type.JSON
    )
    return result
