import requests
from junitparser import JUnitXml
import argparse
import os

# -----------------------------
# CONFIG — UPDATE THESE VALUES
# -----------------------------
TESTRAIL_URL = "https://naxosautomation.testrail.io/"
USER = "dev@naxos.fr"
API_KEY = "rQ7REmd0Z79ksbq./OR/-9LoTy/AZnJdecXDXJGfa"

# -----------------------------
# HELPERS
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

def tr_post_file(api, filepath):
    url = TESTRAIL_URL + api
    with open(filepath, "rb") as f:
        response = requests.post(url, files={"attachment": f}, auth=(USER, API_KEY))
        response.raise_for_status()
        return response.json()

# -----------------------------
# BUILD CASE_ID → TEST_ID MAP
# -----------------------------
def get_test_ids(run_id):
    tests = tr_get(f"index.php?/api/v2/get_tests/{run_id}")

    # Some TestRail instances wrap tests in a dict
    if isinstance(tests, dict) and "tests" in tests:
        tests = tests["tests"]

    return {t["case_id"]: t["id"] for t in tests}

# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Upload JUnit results to TestRail Test Run")
    parser.add_argument("-r", "--run", required=True, type=int,
                        help="TestRail Run ID")
    parser.add_argument("-f", "--file", required=True,
                        help="Path to the JUnit XML report")
    parser.add_argument("-w", "--workspace_folder", default='.',
                        help="Folder for screenshots / attachments")
    args = parser.parse_args()

    RUN_ID = args.run
    JUNIT_FILE = args.file
    WORKSPACE_FOLDER = args.workspace_folder

    xml = JUnitXml.fromfile(JUNIT_FILE)
    case_id_to_test_id = get_test_ids(RUN_ID)

    for suite in xml:
        for case in suite:
            name = case.name
            case_id = None
            attachment = None
            user_comment = None

            # Extract properties
            for prop in case._elem.findall("properties/property"):
                key = prop.get("name")
                val = prop.get("value")
                if key == "testrail_case_id":
                    try:
                        case_id = int(val)
                    except:
                        pass
                if key == "testrail_attachment":
                    attachment = val
                if key == "testrail_result_comment":
                    user_comment = val

            # Fallback: look for "C1234" in name
            if not case_id and "C" in name:
                try:
                    case_id = int("".join(filter(str.isdigit, name.split("C")[-1])))
                except:
                    pass

            if not case_id or case_id not in case_id_to_test_id:
                print(f"Skipping '{name}' (case_id not found in run {RUN_ID})")
                continue

            test_id = case_id_to_test_id[case_id]

            # Determine status
            status_id = 1  # passed by default
            comment = user_comment or "Automated result"

            results = case.result
            if results:
                if not isinstance(results, list):
                    results = [results]
                for r in results:
                    tag = getattr(r, "_tag", "").lower()
                    if tag in ("failure", "error"):
                        status_id = 5  # failed
                        short_msg = getattr(r, "message", "") or "Test failed"
                        full_msg = getattr(r, "text", "").strip() if hasattr(r, "text") else ""
                        comment = f"❌ Test Failed\n\n**Message:**\n{short_msg}"
                        if full_msg:
                            comment += f"\n\n**Details:**\n{full_msg}"

            print(f"Uploading result for case {case_id} (status {status_id})")

            # Upload result
            result = tr_post(
                f"index.php?/api/v2/add_result/{test_id}",
                {"status_id": status_id, "comment": comment}
            )

            # Upload attachment if exists
            if attachment:
                attachment_path = os.path.join(WORKSPACE_FOLDER, attachment)
                if os.path.exists(attachment_path):
                    print(f"Attaching file: {attachment_path}")
                    tr_post_file(
                        f"index.php?/api/v2/add_attachment_to_result/{result['id']}",
                        attachment_path
                    )

if __name__ == "__main__":
    main()
