<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:str="http://exslt.org/strings"
  exclude-result-prefixes="str"
>

  <xsl:output method="html" indent="yes" encoding="UTF-8" doctype-system="about:legacy-compat"/>

  <!-- Match the document root -->
  <xsl:template match="/">
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
        </style>
      </head>
      <body>
        <h1>JUnit Test Report</h1>

        <div id="modal" class="modal">
          <div id="modal-box" class="modal-box">
            <span id="close-btn" class="close-btn">×</span>  <!-- &#215; -->
            <div id="modal-content"></div>
          </div>
        </div>

        <!-- Handle both <testsuites> root or single <testsuite> root -->
        <xsl:choose>
          <xsl:when test="testsuites">
            <xsl:apply-templates select="testsuites"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:apply-templates select="testsuite"/>
          </xsl:otherwise>
        </xsl:choose>
        <script type="text/javascript">
        <![CDATA[
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
        ]]>
        </script>
      </body>
    </html>
  </xsl:template>

  <!-- If the root is <testsuites> -->
  <xsl:template match="testsuites">
    <div class="summary">
      <strong>Suites:</strong> <xsl:value-of select="count(testsuite)"/> |
      <strong>Total tests:</strong> <xsl:value-of select="sum(testsuite/@tests)"/> |
      <strong>Failures:</strong> <xsl:value-of select="sum(testsuite/@failures)"/> |
      <strong>Errors:</strong> <xsl:value-of select="sum(testsuite/@errors)"/> |
      <strong>Skipped:</strong> <xsl:value-of select="sum(testsuite/@skipped | testsuite/@disabled)"/>
    </div>

    <xsl:for-each select="testsuite">
      <xsl:apply-templates select="."/>
    </xsl:for-each>
  </xsl:template>

  <!-- For each <testsuite> -->
  <xsl:template match="testsuite">
    <h2>
      <xsl:value-of select="@name"/>
      <span class="small">
        — Tests: <xsl:value-of select="@tests"/>,
        Failures: <xsl:value-of select="@failures"/>,
        Errors: <xsl:value-of select="@errors"/>,
        Skipped: <xsl:value-of select="@skipped | @disabled"/>,
        Time: <xsl:value-of select="@time"/>s
      </span>
    </h2>

    <table>
      <thead>
        <tr>
          <!--th>File</th-->
          <th>Test</th>
          <th>Status</th>
          <th>Time</th>
          <th>Details</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="testcase">
          <tr>
            <!--td><xsl:value-of select="@classname"/></td-->
            <td><xsl:value-of select="@name"/></td>
            <td>
              <xsl:choose>
                <xsl:when test="failure"><span class="failed">❌ Failed</span></xsl:when>
                <xsl:when test="error"><span class="error">🔥 Error</span></xsl:when>
                <xsl:when test="skipped"><span class="skipped">🔷 Skipped</span></xsl:when>
                <xsl:otherwise><span class="passed">✅ Passed</span></xsl:otherwise>
              </xsl:choose>
            </td>
            <td><xsl:value-of select="format-number(number(@time), '0.0')"/></td> <!-- select="round(number(@time))" -->
            <!--
            <td>
              <xsl:if test="failure">
                <details>
                  <summary>🔍 Stack trace ....</summary>
                  <pre><xsl:value-of select="string(failure)"/></pre>
                </details>
              </xsl:if>

              <xsl:if test="error">
                <details>
                  <summary>🔍 Message ....</summary>
                  <pre><xsl:value-of select="error"/></pre>
                </details>
              </xsl:if>

              <xsl:variable name="skipMessage" select="properties/property[@name='skip']/@value"/>
              <xsl:if test="skipped and properties/property[@name='skip']">
                <details>
                  <summary>🔍 Message ....</summary>
                  <pre><xsl:value-of select="$skipMessage"/></pre>
                </details>
              </xsl:if>

              <xsl:variable name="screenshot" select="properties/property[@name='testrail_attachment']/@value"/>
              <xsl:if test="string($screenshot)">
                📎 <a href="{$screenshot}" target="_blank">screenshot</a>
              </xsl:if>

              <xsl:if test="system-out">
                <details>
                  <summary>📜 Standard Output</summary>
                  <pre><xsl:value-of select="system-out"/></pre>
                </details>
              </xsl:if>

              <xsl:if test="system-err">
                <details>
                  <summary>🛑 Error Output</summary>
                  <pre><xsl:value-of select="system-err"/></pre>
                </details>
              </xsl:if>
            </td>
            -->
            <td>
              <!-- Stack trace -->
              <xsl:if test="failure">
                <xsl:variable name="failureMessage" select="string(failure)"/>
                <xsl:if test="$failureMessage">
                  <a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a>
                  <pre style="display:none;">
                    <xsl:value-of select="$failureMessage"/>
                  </pre>
                </xsl:if>
              </xsl:if>
              <!-- Skip message -->
              <xsl:if test="skipped">
                <xsl:variable name="skipMessage" select="string(properties/property[@name='skip']/@value)"/>
                <xsl:if test="$skipMessage">
                  <a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a>
                  <pre style="display:none;">
                    <xsl:value-of select="$skipMessage"/>
                  </pre>
                </xsl:if>
              </xsl:if>
              <!-- Last screenshot -->
              <xsl:variable name="screenshot" select="string(properties/property[@name='testrail_attachment']/@value)"/>
              <xsl:if test="$screenshot">
                <a href="javascript:void(0);">
                  <xsl:attribute name="onclick">
                    <xsl:text>
                      open_modal_img('</xsl:text><xsl:value-of select="$screenshot"/><xsl:text>')
                    </xsl:text>
                  </xsl:attribute>
                  📎
                </a>
              </xsl:if>
              <!-- Standard output -->
              <xsl:if test="system-out">
                <a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">📜</a>
                <pre style="display:none;"><xsl:value-of select="string(system-out)"/></pre>
              </xsl:if>
              <!-- Error output -->
              <xsl:if test="system-err">
                <a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🛑</a>
                <pre style="display:none;"><xsl:value-of select="string(system-err)"/></pre>
              </xsl:if>
            </td>
            <td>
              <!-- Issue -->
              <xsl:variable name="issues" select="properties/property[@name='issues']/@value"/>
              <xsl:if test="$issues and failure">
                🐞
                <xsl:for-each select="str:tokenize($issues, ',')">
                  <xsl:variable name="key" select="normalize-space(.)"/>
                  <a href="https://naxosdionysos.atlassian.net/browse/{$key}" target="_blank">
                    <xsl:value-of select="$key"/>
                  </a>
                  <!-- add space after each link except the last -->
                  <xsl:if test="position() != last()">
                    <xsl:text> </xsl:text>
                  </xsl:if>
                </xsl:for-each>
              </xsl:if>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
