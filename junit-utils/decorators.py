from typing import Literal


bugtracker_url = "https://naxosdionysos.atlassian.net/browse"


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
              <td/>
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
    content += """
              <th>Issues</th>
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
        <style type="text/css">
          body { font-family: Arial, Helvetica, sans-serif; margin: 20px; }
          h1, h2 { margin: 0.2em 0; }
          .summary { margin: 0.5em 0 1em; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 6px 8px; }
          th { background: #f7f7f7; text-align: left; }
          .passed { color: #1a7f37; }
          .failed { color: #d1242f; }
          .skipped { color: #42a5f5; }
          .error { color: #b000b5; }
          .small { color: #666; font-size: 0.9em; }
          a, a:hover, a:focus, a:active {
            text-decoration: none;
            color: inherit;
          }
          /* button styled as a link */
          .link-button {
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            color: inherit;
            cursor: pointer;
            text-decoration: none;
          }

          /* Modal window */
          .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            padding-top: 100px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
          }

          /* Modal box */
          .modal-box {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 1440px;    /* cap width for large screens */
            max-height: 85vh;     /* prevent modal from exceeding viewport height */
            overflow: auto;       /* add scrollbars if content is too tall */
            box-sizing: border-box;
          }

          /* Style for images */
          .modal-content-img {
             margin: auto;
             display: block;
             width: 95%;   /* scales responsively */
             height: auto; /* preserves aspect ratio */
             box-shadow: 0 0 16px rgba(0,0,0,0.8);
          }

          /* The close button */
          .close-btn {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .close-btn:hover,
          .close-btn:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
          }

          .cell_passed {
            background-color: #6aff6a35;
          }
          .cell_error {
            background-color: #ff6a6a35;  /* #ff6a6a75; */
          }
          .cell_failed {
            background-color: #ff6a6a35;
          }
          .cell_skipped {
            background-color: #6adcff35;
          }
        </style>
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
        <script type="text/javascript">
          var modal = document.getElementById("modal");
          var modal_box = document.getElementById("modal-box");
          var close_btn = document.getElementById("close-btn");
          var modal_content = document.getElementById("modal-content");

          function open_modal_pre(content) {
            modal.style.display = "block";
            modal.style.paddingTop = "100px";
            modal_box.style.width = "80%";
            modal_content.innerHTML = `<pre>${content}</pre>`;
          }

          function open_modal_img(filepath) {
            modal.style.display = "block";
            modal.style.paddingTop = "80px";
            modal_box.style.width = "90%";
            modal_content.innerHTML = `<a href="${filepath}" target="_blank"><img class="modal-content-img" src="${filepath}" style="width: 100%"></a>`;
          }

          // When the user clicks on span (x), close the modal
          close_btn.onclick = function () {
            modal.style.display = "none";
          }

          // When the user clicks anywhere outside of the modal, close it
          window.onclick = function (event) {
            if (event.target == modal)
              modal.style.display = "none";
          }
        </script>
          </body>
        </html>
    """
