import argparse
from create_test_plan import add_plan
from update_test_plan import update_plan

# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Publish JUnit results to TestRail")
    parser.add_argument("-p", "--plan", required=False, type=int, default=0, help="Test plan id")
    parser.add_argument("-n", "--name", required=False, default='Test plan', help="Test plan name")
    parser.add_argument("-d", "--description", required=False, default=None, help="Test plan description")
    parser.add_argument("-f", "--file", required=True, help="JUnit XML file")
    parser.add_argument("-w", "--folder", required=False, default=".", help="Attachment base folder")
    args = parser.parse_args()

    plan_id = args.plan
    name = args.name
    description = args.description
    junit_file = args.file
    folder = args.folder

    if plan_id == -1:
        plan_id = add_plan(name, description)
    if plan_id > 0:
        update_plan(plan_id, junit_file, folder, description)

# -----------------------------
if __name__ == "__main__":
    main()
