import sys
import xml.etree.ElementTree as ET
from decorators import (
    close_html,
    close_testsuite_table,
    decorate_details,
    decorate_issues,
    decorate_status,
    decorate_testcase_row,
    decorate_testsuite,
    open_html,
    open_testsuite_table,
)


file_report = "report.html"


def read_properties(element):
    """
    Returns a dict of properties from a <properties> block, if present.
    """
    props = {}
    properties_elem = element.find("properties")
    if properties_elem is not None:
        for prop in properties_elem.findall("property"):
            name = prop.get("name")
            value = prop.get("value")
            props[name] = value
    return props


def get_result_details(testcase):
    """
    Returns (status, message, type, details)
    """
    if testcase.find("failure") is not None:
        elem = testcase.find("failure")
        status = "failed"
    elif testcase.find("error") is not None:
        elem = testcase.find("error")
        status = "error"
    elif testcase.find("skipped") is not None:
        elem = testcase.find("skipped")
        status = "skipped"
    else:
        return "passed", None, None, None

    # Attributes (message/type are optional)
    message = elem.get("message")
    error_type = elem.get("type")

    # Text inside the tag (stack trace / reason)
    details = elem.text.strip() if elem is not None and elem.text is not None else None

    return status, message, error_type, details


def get_console_output(testcase):
    """
    Returns (status, message, type, details)
    """
    elem_out = None
    elem_err = None
    if testcase.find("system-out") is not None:
        elem_out = testcase.find("system-out")
    if testcase.find("system-err") is not None:
        elem_err = testcase.find("system-err")

    # Text inside the tag (stack trace / reason)
    text_out = elem_out.text.strip() if elem_out is not None and elem_out.text is not None else None
    text_err = elem_err.text.strip() if elem_err is not None and elem_err.text is not None  else None

    return text_out, text_err


def get_info(testcase):
    name = testcase.get('name')
    test_props = read_properties(testcase)
    issues = test_props.get("issues")
    issues = issues.split(',') if issues not in (None, '') else issues
    attachment = test_props.get("testrail_attachment")
    status, message, error_type, text_msg = get_result_details(testcase)
    text_out, text_err = get_console_output(testcase)
    return {
      'name': name,
      'status': status,
      'text_msg': text_msg,
      'issues': issues,
      'attachment': attachment,
      'text_out': text_out,
      'text_err': text_err,
    }


def parse_junit_report(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    # Root can be <testsuite> or <testsuites>
    if root.tag == "testsuite":
        testsuites = [root]
    else:
        testsuites = root.findall("testsuite")

    for suite in testsuites:
        suite_name = suite.get("name")
        print(f"\nSuite: {suite_name}")

        for testcase in suite.findall("testcase"):
            test_name = testcase.get("name")
            classname = testcase.get("classname")

            print(f"\n  Testcase: {test_name}")
            print(f"    Class: {classname}")

            # --- testcase-level properties ---
            test_props = read_properties(testcase)
            issues = test_props.get("issues")
            attachment = test_props.get("testrail_attachment")

            if issues or attachment:
                print(f"    Testcase properties:")
                if issues:
                    print(f"      issues: {issues}")
                if attachment:
                    print(f"      testrail_attachment: {attachment}")

            status, message, error_type, text_msg = get_result_details(testcase)
            print(f"    Status: {status}")
            if status != "passed":
                print(f"    Message: {message}")
                print(f"    Type: {error_type}")
                print(f"    Detail: {text_msg}")

            text_out, text_err = get_console_output(testcase)
            if text_out:
                print(f"    System Out: {text_out}")
            if text_err:
                print(f"    System Err: {text_err}")


def parse_junit_reports(xml_paths: list[str]):
    f = open(file_report, "w")
    f.close()
    f = open(file_report, "a")
    f.write(open_html())

    tree = [None] * len(xml_paths)
    root = [None] * len(xml_paths)
    testsuites = [None] * len(xml_paths)
    suite = [None] * len(xml_paths)
    testcases = [None] * len(xml_paths)
    testcase = [None] * len(xml_paths)

    # Root can be <testsuite> or <testsuites>
    for i in range(len(xml_paths)):
        tree[i] = ET.parse(xml_paths[i])
        root[i] = tree[i].getroot()
        if root[i].tag == "testsuite":
            testsuites[i] = [root[i]]
        else:
            testsuites[i] = root[i].findall("testsuite")
    verifySize(testsuites)

    for i in range(len(testsuites[0])):
        for s in range(len(xml_paths)):
            suite[s] = testsuites[s][i]
        verify(suite)

        suite_name = suite[0].get("name")
        f.write(decorate_testsuite(suite_name))
        f.write(open_testsuite_table())

        for s in range(len(xml_paths)):
            testcases[s] = suite[s].findall("testcase")
        verifySize(testcases)

        for j in range(len(testcases[0])):
            info = []
            for s in range(len(xml_paths)):
                testcase[s] = testcases[s][j]
                info.append(get_info(testcase[s]))
            verifyName(testcase)

            test_name = testcase[0].get("name")
            classname = testcase[0].get("classname")
            f.write(decorate_testcase_row(info))

        f.write(close_testsuite_table())

    f.write(close_html())
    f.close()


def verify(items: list):
    name = None
    size = -1
    for item in items:
        if size == -1:
            size = len(item)
        if name is None:
            name = item.get("name")
        if size != len(item) or name != item.get("name"):
            print("Items name and/or size mismatch", file=sys.stderr)
            sys.exit(1)


def verifyName(items: list):
    name = None
    for item in items:
        if name is None:
            name = item.get("name")
        if name != item.get("name"):
            print("Items name mismatch", file=sys.stderr)
            sys.exit(1)


def verifySize(items: list):
    size = -1
    for item in items:
        if size == -1:
            size = len(item)
        if size != len(item):
            print("Items size mismatch", file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    # parse_junit_report(sys.argv[1])
    parse_junit_reports(sys.argv[1:])


# python ./merge_reports.py folder/*.xml
