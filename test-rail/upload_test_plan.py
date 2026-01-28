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

PROJECT_ID = 1

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
# FIND RUN FOR CASE IN PLAN
# -----------------------------
def find_run_for_case(plan_id, case_id):
    plan = tr_get(f"index.php?/api/v2/get_plan/{plan_id}")

    # print(f"\n=== Searching for case C{case_id} in plan {plan_id} ===")

    for entry in plan["entries"]:
        entry_name = entry.get("name", "(no name)")
        # print(f"\n→ Checking entry: {entry_name}")

        for run in entry["runs"]:
            run_id = run["id"]
            run_name = run["name"]
            suite_id = run["suite_id"]

            # print(f"  → Checking run {run_id}: {run_name} (suite {suite_id})")

            # IMPORTANT: CORRECT API FORMAT
            suite_cases = tr_get(
                f"index.php?/api/v2/get_cases/{PROJECT_ID}&suite_id={suite_id}"
            )

            # Some instances wrap it under "cases"
            if isinstance(suite_cases, dict) and "cases" in suite_cases:
                suite_cases = suite_cases["cases"]

            for c in suite_cases:
                if c.get("id") == case_id:
                    # print(f"     ✅ Found case C{case_id} in suite {suite_id}")
                    # print(f"     → Assigned to run {run_id}")
                    return run_id

    print(f"❌ Case C{case_id} not found in ANY run of plan {PLAN_ID}")
    return None


# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Upload JUnit results to TestRail")
    parser.add_argument("-p", "--plan", required=True, type=int,
                        help="TestRail Plan ID")
    parser.add_argument("-f", "--file", required=True,
                        help="Path to the JUnit XML report")
    parser.add_argument("-w", "--workspace_folder", default='.',
                        help="TestRail screenshots folder")
    args = parser.parse_args()

    PLAN_ID = args.plan
    JUNIT_FILE = args.file
    WORKSPACE_FOLDER = args.workspace_folder

    xml = JUnitXml.fromfile(JUNIT_FILE)

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
                    case_id = int(val)
                if key == "testrail_attachment":
                    attachment = val
                if key == "testrail_result_comment":
                    user_comment = val

            # Fallback: look for "C1234" in name
            if not case_id and "C" in name:
                try:
                    case_id = int(name.split("C")[-1])
                except:
                    pass

            if not case_id:
                print(f"Skipping '{name}' (no testrail_case_id)")
                continue

            # Locate run inside the plan
            run_id = find_run_for_case(PLAN_ID, case_id)

            if not run_id:
                print(f"❌ Case C{case_id} skipped (not found in plan {PLAN_ID})")
                continue

            # print(f"→ Case C{case_id} belongs to run {run_id}")

            # Determine status
            status_id = 1  # passed
            comment = user_comment or "Automated result"

            results = case.result
            if results:
                if not isinstance(results, list):
                    results = [results]
                for r in results:
                    tag = getattr(r, "_tag", "").lower()
                    if tag in ("failure", "error"):
                        status_id = 5  # failed
                        # Extract short failure message (message="...")
                        short_msg = getattr(r, "message", "") or "Test failed"

                        # Extract full CDATA text (stack trace / error context)
                        full_msg = ""
                        if hasattr(r, "text") and r.text:
                            full_msg = r.text.strip()

                        # Build final comment
                        comment = f"❌ Test Failed\n\n**Message:**\n{short_msg}"
                        if full_msg:
                            # comment += f"\n\n**Details:**\n{full_msg}"
                            comment = f"**Details:**\n{full_msg}"
                        
                        # Append user comment if present
                        # if user_comment:
                        #     comment += f"\n\n**Note:**\n{user_comment}"

            print(f"   Uploading result for case {case_id} (status {status_id})")

            result = tr_post(
                f"index.php?/api/v2/add_result_for_case/{run_id}/{case_id}",
                {"status_id": status_id, "comment": comment}
            )

            # Upload attachment if exists
            if attachment:
              attachment = os.path.join(WORKSPACE_FOLDER, attachment)
            if attachment and os.path.exists(attachment):
                print(f"   Attaching file: {attachment}")
                tr_post_file(
                    f"index.php?/api/v2/add_attachment_to_result/{result['id']}",
                    attachment
                )


if __name__ == "__main__":
    main()
