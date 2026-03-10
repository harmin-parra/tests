import xml.etree.ElementTree as ET
import glob

# Path to your JUnit XML files
xml_files = glob.glob("junit-report/*.xml")  # adjust folder

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
tree.write("junit-report/merged.xml", encoding="utf-8", xml_declaration=True)

print(f"Merged {len(xml_files)} files into junit-report/merged.xml")
