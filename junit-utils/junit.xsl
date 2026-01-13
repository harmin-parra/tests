<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:str="http://exslt.org/strings"
  exclude-result-prefixes="str"
>

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

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

          /* Modal view */
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

          /* Modal content */
          .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 1200px;     /* cap width for large screens */
            max-height: 80vh;     /* prevent modal from exceeding viewport height */
            overflow: auto;       /* add scrollbars if content is too tall */
            box-sizing: border-box;
          }

          /* The close button */
          .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .close:hover,
          .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>JUnit Test Report</h1>

        <!-- Modal for stack trace -->
        <div id="modal" class="modal">
          <div class="modal-content">
              <span id="modal-close" class="close">&#215;</span>
              <div id="modal-content">
              </div>
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
      </body>
      <script>
        var modal = document.getElementById("modal");
        var modal_content = document.getElementById("modal-content");
        var modal_close = document.getElementById("modal-close");

        function open_modal(content) {
          modal.style.display = "block";
          modal_content.innerHTML = "<pre>" + content + "</pre>";
        }

        // When the user clicks on span (x), close the modal
        modal_close.onclick = function() {
          modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
      </script>
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
            <!--td>
              <xsl:if test="failure">
                <details>
                  <summary>🔍 Stack trace ....</summary>
                  <pre><xsl:value-of select="failure/text()"/></pre>
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

              <xsl:if test="
                not(failure)
                and not(error)
                and not(skipped)
                and not(system-out)
                and not(system-err)
                and not(properties/property[@name='testrail_attachment'])
                and not(properties/property[@name='skip'])"
              >
              </xsl:if>
            </td>
            -->
            <td>
              <!-- Adding stack trace -->
              <xsl:if test="failure">
                <xsl:variable name="failureText" select="string(failure)"/>
                🔍 <a href="javascript:void(0);" onclick="open_modal(this.nextElementSibling.textContent)">stack trace</a>
                <pre class="stacktrace-content" style="display:none;">
                  <xsl:value-of select="failure/text()"/>
                </pre>
              </xsl:if>
              <!-- Adding last screenshot -->
              <xsl:if test="properties/property[@name='testrail_attachment']">
                <xsl:variable name="screenshot" select="properties/property[@name='testrail_attachment']/@value"/>
                <xsl:if test="string($screenshot)">
                📎 <a href="{$screenshot}" target="_blank">screenshot</a>
                </xsl:if>
              </xsl:if>
              <!-- Adding issue links -->
              <xsl:if test="properties/property[@name='issues'] and failure">
                🐞
                <xsl:variable name="issues" select="properties/property[@name='issues']/@value"/> 
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
