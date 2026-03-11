import xml.etree.ElementTree as ET
import glob

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
    parser = argparse.ArgumentParser(description="Upload JUnit results to TestRail Plan")
    parser.add_argument("-d", "--directoy", required=True, help="Directory containing the JUnit XML files")
    parser.add_argument("-o", "--output", required=True, help="The output file")
    args = parser.parse_args()

    directory = args.directoy
    merged_file = args.output

    merge_junit_files(directory, merged_file)

# -----------------------------
if __name__ == "__main__":
    main()
