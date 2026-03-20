from typing import Literal


bugtracker_url = "https://bugtracker.com"
include_issues = False


def decorate_status(status: Literal['passed', 'error', 'failed', 'skipped']) -> str:
    if status == "passed":
        return "✅"
    if status == "error":
        return "🔥"
    if status == "failed":
        return "❌"
    if status == "skipped":
        return "🔷"


def decorate_summary(summaries: list[dict]) -> str:
    content = f"""
        <h3>Summary</h3>
        <table style="width: unset">
          <thead>
            <tr>
              <td></td>
              <th>Suites</th>
              <th>Total tests</th>
              <th>Failures</th>
              <th>Errors</th>
              <th>Skipped</th>
              <th>Total time</th>
            </tr>
          </thead>

          <tbody>
    """
    for summary in summaries:
        content += f"""
            <tr>
              <th>{summary['env']}</th>
              <td>{summary['suites']}</td>
              <td>{summary['tests']}</td>
              <td>{summary['failures']}</td>
              <td>{summary['errors']}</td>
              <td>{summary['skipped']}</td>
              <td>{summary['time']}</td>
            </tr>
        """
    content += """
          </tbody>
        <table>
        <br/>
    """
    return content


def decorate_testsuite(name: str) -> str:
    return f"<h2>{name}</h2>"


def open_testsuite_table(summaries: list[dict]) -> str:
    content = f"""
        <table>
          <thead>
            <tr>
              <th>Test</th>
        """
    for summary in summaries:
        content += f"""
              <th>{summary['env']}</th>
        """
    if include_issues:
        content += "<th>Issues</th>"
    content += """
            </tr>
          </thead>
          <tbody>
    """
    return content


def close_testsuite_table() -> str:
    return """
          </tbody>
        </table>
    """  


def decorate_testcase_row(testcases: list[dict], summaries: list[dict]) -> str:
    overall_passed = True
    for i in range(len(testcases)):
        overall_passed = overall_passed and testcases[i]['status'] == "passed"
    if overall_passed:
        testcases[0]['issues'] = ''
    content = f"""
        <tr>
          <td>{testcases[0]['name']}</td>
    """
    for i in range(len(testcases)):
        content += f"""
          <td class="cell_{testcases[i]['status']}">{decorate_details(testcases[i], summaries[i]['screenshot_folder'])}</td>
        """
    if include_issues:
        content += f"""<td>{decorate_issues(testcases[0]['issues'])}</td>"""
    content += """
        </tr>
    """
    return content


def decorate_details(testcase: dict, sub_folder: str) -> str:
    row = f"{decorate_status(testcase['status'])} "
    if testcase['text_msg'] not in (None, ''):
        row += (
          # f'<a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a>'
          # f'<a href="" onclick="event.preventDefault(); open_modal_pre(this.nextElementSibling.textContent)">🔍</a>'
          f'<button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>'
          f'<pre style="display:none;">{testcase["text_msg"]}</pre>'
        )
    if testcase['attachment'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_img(\'{sub_folder}/{testcase['attachment']}\')">📎</button>'
        )
    if testcase['text_out'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">📜</button>'
          f'<pre style="display:none;">{testcase["text_out"]}</pre>'
        )
    if testcase['text_err'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🛑</button>'
          f'<pre style="display:none;">{testcase["text_err"]}</pre>'
        )
    return row


def decorate_issues(issues: list[str]) -> str:
    if issues in (None, '', []):
        return ""
    cell = "🐞 "
    for issue in issues:
        cell += f'<a href="{bugtracker_url}/{issue}" target="_blank">{issue}</a> '
    return cell


def open_html() -> str:
    return """
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>JUnit Report</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <script src="script.js" defer="defer"></script>
      </head>
      <body>
        <div id="modal" class="modal">
          <div id="modal-box" class="modal-box">
            <span id="close-btn" class="close-btn">×</span>  <!-- &#215; -->
            <div id="modal-content"></div>
          </div>
        </div>
        <h1>JUnit Test Report</h1>
    """


def close_html() -> str:
    return """
      </body>
    </html>
    """
