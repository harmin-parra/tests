import os
import re
import requests
from junitparser import JUnitXml

# -----------------------------
# CONFIG — UPDATE THESE VALUES
# -----------------------------
TESTRAIL_URL = "https://my_company.testrail.io/index.php?/api/v2/"
USER = "user@email.com"
API_KEY = "YOUR_TOKEN"

# -----------------------------
# HELPER FUNCTIONS
# -----------------------------
def tr_get(endpoint: str):
    """GET request to TestRail API"""
    url = TESTRAIL_URL + endpoint
    r = requests.get(url, auth=(USER, API_KEY))
    r.raise_for_status()
    return r.json()

def tr_post(endpoint: str, payload: dict):
    """POST request to TestRail API"""
    url = TESTRAIL_URL + endpoint
    r = requests.post(url, json=payload, auth=(USER, API_KEY))
    r.raise_for_status()
    return r.json()

def tr_post_file(endpoint: str, path):
    """Upload attachment to a result"""
    url = TESTRAIL_URL + endpoint
    with open(path, "rb") as f:
        r = requests.post(url, files={"attachment": f}, auth=(USER, API_KEY))
        r.raise_for_status()

# -----------------------------
# PAGINATED TEST FETCH
# -----------------------------
def get_all_tests(run_id: int) -> list:
    """Fetch all tests from a run, following pagination links."""
    all_tests = []
    url = f"get_tests/{run_id}&limit=250"

    while url:
        resp = tr_get(url)
        all_tests.extend(resp["tests"])
        url = resp["_links"].get("next")
        if url:
            url = url.removeprefix("/api/v2/")
    return all_tests

# -----------------------------
# PARSE JUNIT XML
# -----------------------------
def parse_junit(junit_file: str) -> dict:
    """Parse JUnit XML and return dictionary of results keyed by TestRail case_id"""
    print("Parsing JUnit XML:", junit_file)
    xml = JUnitXml.fromfile(junit_file)
    results = {}

    for suite in xml:
        for case in suite:
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
            if not case_id:
                match = re.search(r'-\s*C(\d+)', case.name, re.IGNORECASE)
                if match:
                    case_id = int(match.group(1))

            if not case_id:
                print(f"🔷 Skipping '{case.name}' (no TestRail case ID)")
                continue

            # Determine status
            status_id = 1  # passed
            comment = user_comment or "Automated test passed"

            results_list = case.result
            if results_list:
                if not isinstance(results_list, list):
                    results_list = [results_list]
                for r in results_list:
                    tag = getattr(r, "_tag", "").lower()
                    if tag in ("failure", "error"):
                        status_id = 5  # failed
                        short_msg = getattr(r, "message", "") or "Test failed"
                        full_msg = (r.text or "").strip()
                        comment = f"❌ Test Failed\n\n**Message:**\n{short_msg}"
                        if full_msg:
                            comment += f"\n\n**Details:**\n{full_msg}"

            results[case_id] = {
                "name": case.name,
                "status_id": status_id,
                "comment": comment,
                "attachment": attachment
            }

    print("✅ Parsed", len(results), "tests from JUnit XML")
    return results

# -----------------------------
# UPLOAD RESULTS TO PLAN
# -----------------------------
def update_plan(plan_id: int, junit_file: str, folder: str = ".", description: str = None) -> None:
    """Upload test results from a JUnit XML file to a TestRail plan"""
    junit_results = parse_junit(junit_file)
    print(f"🚚 Loading plan: {plan_id}\n")
    plan = tr_get(f"get_plan/{plan_id}")
    total_uploaded = 0
    uploaded_cases = []

    for entry in plan["entries"]:
        for run in entry["runs"]:
            run_id = run["id"]
            run_name = run["name"]
            print(f"Processing run {run_id}: {run_name}")

            tests = get_all_tests(run_id)

            results_to_upload = []
            attachments = []

            for test in tests:
                case_id = test["case_id"]

                if case_id in junit_results:
                    r = junit_results[case_id]
                    results_to_upload.append({
                        "case_id": case_id,
                        "status_id": r["status_id"],
                        "comment": r["comment"]
                    })
                    attachments.append(r["attachment"])
                    uploaded_cases.append(case_id)

            if not results_to_upload:
                # print("No matching JUnit results for this run")
                continue

            # Upload results
            response = tr_post(
                f"add_results_for_cases/{run_id}",
                {"results": results_to_upload}
            )
            for result in results_to_upload:
                print(f"🚀 Uploading result of test case id: {result['case_id']}")

            # Attach files
            for i, result in enumerate(response):
                attach = attachments[i]
                if attach:
                    path = os.path.join(folder, attach)
                    if os.path.exists(path):
                        tr_post_file(f"add_attachment_to_result/{result['id']}", path)

            total_uploaded += len(results_to_upload)

    print(f"\n✅ Upload complete: {total_uploaded} results uploaded.")

    missing_cases_total = []
    for cid in junit_results:
        if cid not in uploaded_cases:
            missing_cases_total.append(cid)
    missing_cases_total = sorted(set(missing_cases_total))

    if missing_cases_total:
        print("\n⚠️ JUnit test results NOT uploaded (missing in TestRail plan):")
        for cid in missing_cases_total:
            r = junit_results.get(cid, {})
            name = r.get("name", "?")
            print(f"{name}")

    # Update test plan description
    if description:
        current_description = tr_get(f"get_plan/{plan_id}")["description"]
        if current_description and len(current_description) > 1:
            description = current_description + "<br><br>" + description
        tr_post(f"update_plan/{plan_id}", { "description": description })

# -----------------------------
# MAIN
# -----------------------------
def main():
    import argparse
    parser = argparse.ArgumentParser(description="Upload JUnit results to TestRail Plan")
    parser.add_argument(
        "-p", "--plan",
        required=True,
        type=int,
        help="TestRail plan ID"
    )
    parser.add_argument(
        "-f", "--file",
        required=True,
        help="JUnit XML file path"
    )
    parser.add_argument(
        "-w", "--folder",
        default=".",
        help="Attachment folder"
    )
    parser.add_argument(
        "-d", "--description",
        default=None,
        help="Test plan description"
    )
    args = parser.parse_args()

    plan_id = args.plan
    junit_file = args.file
    folder = args.folder
    description = args.description

    update_plan(plan_id, junit_file, folder, description)


# -----------------------------
if __name__ == "__main__":
    main()

