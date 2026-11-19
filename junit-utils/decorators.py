from typing import Literal


bugtracker_url = "https://bugtracker.com"
include_issues = False
sub_folders: list[str] = None
env: list[str] = None


def set_environment(folders: list[str], labels: list[str]) -> None:
    global sub_folders, env
    sub_folders = folders
    env = labels


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
              <th style="border: none; background: initial;"></th>
              <th>Suites</th>
              <th>Total tests</th>
              <th>Failures</th>
              <th>Errors</th>
              <th>Skipped</th>
              <th>Total time</th>
            </tr>
          </thead>

          <tbody>"""

    for summary, env_label in zip(summaries, env):
        content += f"""
            <tr>
              <th>{env_label}</th>
              <td>{summary['suites']}</td>
              <td>{summary['tests']}</td>
              <td>{summary['failures']}</td>
              <td>{summary['errors']}</td>
              <td>{summary['skipped']}</td>
              <td>{summary['time']}</td>
            </tr>"""
    content += """
          </tbody>
        <table>
        <br/>"""
    return content


def decorate_testsuite(name: str) -> str:
    return f"<h2>{name}</h2>"


def open_testsuite_table() -> str:
    content = f"""
        <table>
          <thead>
            <tr>
              <th>Test</th>"""
    for env_label in env:
        content += f"""
              <th>{env_label}</th>"""
    if include_issues:
        content += """
              <th>Issues</th>"""
    content += """
            </tr>
          </thead>
          <tbody>"""
    return content


def close_testsuite_table() -> str:
    return """
          </tbody>
        </table>"""


def decorate_testcase_row(testcases: list[dict]) -> str:
    overall_passed = True
    for i in range(len(testcases)):
        overall_passed = overall_passed and testcases[i]['status'] == "passed"
    if overall_passed:
        testcases[0]['issues'] = ''
    content = f"""
        <tr>
          <td>{testcases[0]['name']}</td>"""
    for i in range(len(testcases)):
        content += f"""
          <td class="cell_{testcases[i]['status']}">{decorate_details(testcases[i], sub_folders[i])}</td>"""
    if include_issues:
        content += f"""
          <td>{decorate_issues(testcases[0]['issues'])}</td>"""
    content += """
        </tr>"""
    return content


def decorate_details(testcase: dict, sub_folder: str) -> str:
    row = f"{decorate_status(testcase['status'])} "
    if testcase['trace'] not in (None, ''):
        row += (
          # f'<a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a>'
          # f'<a href="" onclick="event.preventDefault(); open_modal_pre(this.nextElementSibling.textContent)">🔍</a>'
          f'<button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>'
          f'<pre style="display:none;">{testcase["trace"]}</pre>'
        )
    if testcase['image'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_img(\'{sub_folder}/{testcase['image']}\')">📎</button>'
        )
    if testcase['video'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_video(\'{sub_folder}/{testcase['video']}\')">▶️</button>'
        )
    if testcase['pdf'] not in (None, ''):
        row += (
          f'<button class="link-button"><a href="{sub_folder}/{testcase['pdf']}" target="_blank">📄</a></button>'
        )
    if testcase['stdout'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">📙</button>'
          f'<pre style="display:none;">{testcase["stdout"]}</pre>'
        )
    if testcase['stderr'] not in (None, ''):
        row += (
          f'<button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">📕</button>'
          f'<pre style="display:none;">{testcase["stderr"]}</pre>'
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
    </html>"""

