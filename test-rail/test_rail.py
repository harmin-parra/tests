#!/usr/bin/env python3

import argparse
from create_test_plan import add_plan
from update_test_plan import update_plan


# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Publish JUnit results to TestRail")
    parser.add_argument("-p", "--plan", required=False, type=int, default=0, help="Test plan id. Use -1 to create a new plan")
    parser.add_argument("-n", "--name", required=False, default='Test plan', help="Test plan name")
    parser.add_argument("-d", "--description", required=False, default=None, help="Test plan description")
    parser.add_argument("-f", "--file", required=True, help="JUnit XML file")
    parser.add_argument("-w", "--folder", required=False, default=".", help="Attachment base folder")
    args = parser.parse_args()

    if args.plan == -1:
        plan_id = add_plan(args.name, args.description)
    else:
        plan_id = args.plan

    if plan_id > 0:
        update_plan(plan_id, args.file, args.folder, args.description)



# -----------------------------
if __name__ == "__main__":
    main()

