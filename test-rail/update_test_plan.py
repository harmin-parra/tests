import requests
from junitparser import JUnitXml
import argparse
import os
from collections import defaultdict

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

def tr_post_file(api, filepath):
    url = TESTRAIL_URL + api
    with open(filepath, "rb") as f:
        response = requests.post(url, files={"attachment": f}, auth=(USER, API_KEY))
        response.raise_for_status()
        return response.json()

# -----------------------------
# BUILD CASE → RUN MAP & RUN - NAME MAP
# -----------------------------
def build_case_run_map(plan_id: int) -> (dict, dict):
    print(f"🚚 Loading plan {plan_id}")
    plan = tr_get(f"index.php?/api/v2/get_plan/{plan_id}")

    case_to_run = {}
    run_name = {}

    for entry in plan["entries"]:
        for run in entry["runs"]:
            run_id = run["id"]
            suite_id = run["suite_id"]
            suite_name = run["name"]
            run_name[run_id] = suite_name

            suite_cases = tr_get(f"index.php?/api/v2/get_cases/{PROJECT_ID}&suite_id={suite_id}")
            if isinstance(suite_cases, dict):
                suite_cases = suite_cases.get("cases", [])

            for case in suite_cases:
                case_to_run[case["id"]] = run_id

    print(f"✅ Mapped {len(case_to_run)} cases to runs")
    return case_to_run, run_name

# -----------------------------
# UPLOAD RESULTS TO PLAN
# -----------------------------
def add_results_for_plan(plan_id: int, junit_file: str, folder: str = '.'):
    xml = JUnitXml.fromfile(junit_file)

    # Build case-to-run map
    case_run_map, run_name = build_case_run_map(plan_id)

    results_by_run = defaultdict(list)
    attachments_by_case = {}

    # -----------------------------
    # PARSE JUNIT RESULTS
    # -----------------------------
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
                elif key == "testrail_attachment":
                    attachment = val
                elif key == "testrail_result_comment":
                    user_comment = val

            # Fallback: extract C1234 from test name
            if not case_id and "C" in name:
                try:
                    case_id = int(name.split("C")[-1])
                except Exception:
                    pass

            if not case_id:
                print(f"🔷 Skipping '{name}' (no TestRail case ID)")
                continue

            run_id = case_run_map.get(case_id)
            if not run_id:
                print(f"❌ Case C{case_id} not found in plan")
                continue

            # Determine status
            status_id = 1  # passed
            comment = user_comment or "Automated test result"

            results = case.result
            if results:
                if not isinstance(results, list):
                    results = [results]

                for r in results:
                    tag = getattr(r, "_tag", "").lower()
                    if tag in ("failure", "error"):
                        status_id = 5  # failed
                        short_msg = getattr(r, "message", "") or "Test failed"
                        full_msg = (r.text or "").strip()

                        comment = f"❌ Test Failed\n\n**Message:**\n{short_msg}"
                        if full_msg:
                            comment += f"\n\n**Details:**\n{full_msg}"

            results_by_run[run_id].append({
                "case_id": case_id,
                "status_id": status_id,
                "comment": comment
            })

            if attachment:
                attachments_by_case[case_id] = attachment

    # -----------------------------
    # BULK UPLOAD RESULTS WITH ATTACHMENTS
    # -----------------------------
    for run_id, results in results_by_run.items():
        print(f'🚀 Uploading {len(results)} results to run "{run_name[run_id]}"')

        # Prepare parallel list of attachments for this batch
        attachment_result_map = []
        for r in results:
            attach_path = attachments_by_case.get(r["case_id"])
            if attach_path:
                attach_path = os.path.join(folder, attach_path)
            attachment_result_map.append(attach_path)

        # Upload results
        response = tr_post(
            f"index.php?/api/v2/add_results_for_cases/{run_id}",
            {"results": results}
        )

        # Loop over results and attachments in order
        for i, r in enumerate(response):
            # Get result_id
            result_id = r["id"] if isinstance(r, dict) else r
            attach_path = attachment_result_map[i]
            if attach_path and os.path.exists(attach_path):
                print(f"📎 Attaching {attach_path}")
                tr_post_file(
                    f"index.php?/api/v2/add_attachment_to_result/{result_id}",
                    attach_path
                )

    print("✅ TestRail upload complete")

# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Upload JUnit results to TestRail")
    parser.add_argument("-p", "--plan", required=True, type=int, help="Test plan id")
    parser.add_argument("-f", "--file", required=True, help="JUnit XML file")
    parser.add_argument("-w", "--folder", default=".", help="Attachment base folder")
    args = parser.parse_args()
    plan_id: int = args.plan
    junit_file: str = args.file
    folder: str = args.folder

    add_results_for_plan(plan_id, junit_file, folder)

# -----------------------------
if __name__ == "__main__":
    main()
