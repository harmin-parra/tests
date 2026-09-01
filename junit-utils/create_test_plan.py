import requests
import argparse

# -----------------------------
# CONFIG — UPDATE THESE VALUES
# -----------------------------
TESTRAIL_URL = "https://naxosautomation.testrail.io/"
USER = "dev@naxos.fr"
API_KEY = "rQ7REmd0Z79ksbq./OR/-9LoTy/AZnJdecXDXJGfa"
PROJECT_ID = 1

# -----------------------------
# TESTRAIL HELPERS
# -----------------------------
def tr_get(api):
    url = TESTRAIL_URL + api
    response = requests.get(url, auth=(USER, API_KEY))
    response.raise_for_status()
    return response.json()

def tr_post(api, payload):
    url = TESTRAIL_URL + api
    response = requests.post(url, json=payload, auth=(USER, API_KEY))
    response.raise_for_status()
    return response.json()

# -----------------------------
# GET SUITES
# -----------------------------
def get_suites() -> list[int]:
    response = tr_get(f"index.php?/api/v2/get_suites/{PROJECT_ID}")
    suites = []
    for suite in response['suites']:
        suites.append(suite['id'])
    return suites

# -----------------------------
# CREATE PLAN
# -----------------------------
def add_plan(name: str, description: str = None) -> int:
    if description is None:
        description = ''
    suites = get_suites()
    suite_list = []
    for suite in suites:
        suite_list.append({
            "suite_id": suite,
            "include_all": True
        })
    plan = tr_post(
        f"index.php?/api/v2/add_plan/{PROJECT_ID}", 
        {
            "name": name,
            "description": description,
            "entries": suite_list
        }
    )
    print(f"➕ Creating plan {plan['id']}")
    return plan["id"]

# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Create plan in TestRail")
    parser.add_argument("-n", "--name", required=False, default="Test Plan", help="Test plan name")
    parser.add_argument("-d", "--description", required=False, default='', help="Test plan description")
    args = parser.parse_args()
    name = args.name
    description = args.description
    plan_id = add_plan(name, description)

# -----------------------------
if __name__ == "__main__":
    main()
