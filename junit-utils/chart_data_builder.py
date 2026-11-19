#!/usr/bin/env python3

import argparse
import json


def parse_file(input_file: str, output_file: str) -> None:
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    history = data["history"]

    # Build output in json format
    output = {
        "labels": [entry["date"] for entry in history],
        "datasets": [
            [entry["passed"] for entry in history],
            [entry["failed"] for entry in history],
            [entry["skipped"] for entry in history],
            [entry["other"] for entry in history],
        ],
    }

    # Write output in json format
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    """
    # Build output in js format
    labels = [entry["date"] for entry in history]
    datasets = [
        [entry["passed"] for entry in history],
        [entry["failed"] for entry in history],
        [entry["skipped"] for entry in history],
        [entry["other"] for entry in history],
    ]

    # Write output in js format
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(f"const labels = {json.dumps(labels, indent=4)};\n\n")
        f.write(f"const datasets = {json.dumps(datasets, indent=4)};\n")
    """


# -----------------------------
# MAIN
# -----------------------------
def main():
    parser = argparse.ArgumentParser(description="Publish JUnit results to TestRail")
    parser.add_argument("-i", "--input", required=True, help="The input file")
    parser.add_argument("-o", "--output", required=False, default='output.json', help="The output file")
    args = parser.parse_args()
    parse_file(args.input, args.output)


# -----------------------------
if __name__ == "__main__":
    main()

