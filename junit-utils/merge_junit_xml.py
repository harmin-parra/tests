import xml.etree.ElementTree as ET
import glob
from pathlib import Path


def merge_junit_files(directory: str, merged_file: str) -> None:
    # Path to your JUnit XML files
    xml_files = glob.glob(f"{directory}/*.xml")  # adjust folder

    # Create the root <testsuites> element
    merged_root = ET.Element("testsuites")

    total_tests = 0
    total_failures = 0
    total_errors = 0
    total_skipped = 0
    total_time = 0.0

    for file in xml_files:
        tree = ET.parse(file)
        root = tree.getroot()
    
        # Handle both <testsuites> and <testsuite> root formats
        if root.tag == "testsuites":
            suites = root.findall("testsuite")
        elif root.tag == "testsuite":
            suites = [root]
        else:
            continue
    
        for suite in suites:
            merged_root.append(suite)
            total_tests += int(suite.attrib.get("tests", 0))
            total_failures += int(suite.attrib.get("failures", 0))
            total_errors += int(suite.attrib.get("errors", 0))
            total_skipped += int(suite.attrib.get("skipped", 0))
            total_time += float(suite.attrib.get("time", 0))

    # Update totals at the root if needed
    merged_root.attrib["tests"] = str(total_tests)
    merged_root.attrib["failures"] = str(total_failures)
    merged_root.attrib["errors"] = str(total_errors)
    merged_root.attrib["skipped"] = str(total_skipped)
    merged_root.attrib["time"] = f"{total_time:.3f}"

    # Write merged XML to file
    tree = ET.ElementTree(merged_root)
    tree.write(merged_file, encoding="utf-8", xml_declaration=True)

    print(f"Merged {len(xml_files)} files into {merged_file}")


# -----------------------------
# MAIN
# -----------------------------
def main():
    import argparse
    parser = argparse.ArgumentParser(description="Merge JUnit XML reports")
    parser.add_argument(
        "-d", "--directory",
        type=Path,
        default=Path('.'),
        help="Directory containing the JUnit XML files"
    )
    parser.add_argument(
        "-o", "--output",
        type=Path,
        help="The output file"
    )
    args = parser.parse_args()

    directory = Path(args.directory)
    merged_file = directory / "merged.xml" if args.output is None else Path(args.output)

    if not (directory.exists() and directory.is_dir()):
        raise ValueError(f"{directory} is not a valid directory")
    if not (merged_file.parent.exists() and merged_file.parent.is_dir()):
        raise ValueError(f"{merged_file.parent} is not a valid directory")

    merge_junit_files(directory, merged_file)

# -----------------------------
if __name__ == "__main__":
    main()
