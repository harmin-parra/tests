import allure
import json
import requests

headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
}


def ping():
    requests.get("https://petstore3.swagger.io/v3/pet")


def get(id):
    url = f"https://petstore3.swagger.io/api/v3/pet/{id}"
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
    url = "https://petstore3.swagger.io/api/v3/pet"
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
    url = f"https://petstore3.swagger.io/api/v3/pet/{id}"
    allure.attach(
        f"DELETE {url}",
        name="Query request",
        attachment_type=allure.attachment_type.TEXT
    )
    headers['api_key'] = 'special-key'
    result = requests.delete(url=url, headers=headers)
    allure.attach(
        result.text,
        name="Query response",
        attachment_type=allure.attachment_type.JSON
    )
    return result
