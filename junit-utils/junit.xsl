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
    </html>
  </xsl:template>

  <!-- If the root is <testsuites> -->
  <xsl:template match="testsuites">
    <xsl:variable name="time" select="number(@time)"/>
    <xsl:variable name="minutes" select="floor($time div 60)"/>
    <xsl:variable name="seconds" select="$time mod 60"/>

    <div class="summary">
      <strong>Suites: </strong> <xsl:value-of select="count(testsuite)"/> |
      <strong>Total tests: </strong> <xsl:value-of select="@tests"/> |
      <strong>Failures: </strong> <xsl:value-of select="@failures"/> |
      <strong>Errors: </strong> <xsl:value-of select="@errors"/> |
      <strong>Skipped: </strong> <xsl:value-of select="@skipped"/> |
      <strong>Total time: </strong>
        <xsl:if test="$minutes &gt; 0">
          <xsl:value-of select="$minutes"/><xsl:text> m </xsl:text>
        </xsl:if>
        <xsl:value-of select="format-number($seconds, '0.00')"/><xsl:text> s</xsl:text>
    </div>

    <xsl:for-each select="testsuite">
      <xsl:apply-templates select="."/>
    </xsl:for-each>
  </xsl:template>

  <!-- For each <testsuite> -->
  <xsl:template match="testsuite">
    <h2>
      <xsl:variable name="time" select="number(@time)"/>
      <xsl:variable name="minutes" select="floor($time div 60)"/>
      <xsl:variable name="seconds" select="$time mod 60"/>

      <xsl:value-of select="@name"/>
      <xsl:text>&#160;&#160;</xsl:text>
      <span class="small">
        Tests: <xsl:value-of select="@tests"/>,
        Failures: <xsl:value-of select="@failures"/>,
        Errors: <xsl:value-of select="@errors"/>,
        Skipped: <xsl:value-of select="@skipped"/>,
        Time:
        <xsl:if test="$minutes &gt; 0">
          <xsl:value-of select="$minutes"/><xsl:text> m </xsl:text>
        </xsl:if>
        <xsl:value-of select="format-number($seconds, '0.00')"/><xsl:text> s</xsl:text>
        <!-- <xsl:value-of select="concat($minutes, ' m ', format-number($seconds, '0.00'), ' s')"/> -->
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
                <xsl:when test="failure"><span class="text_failed">❌ Failed</span></xsl:when>
                <xsl:when test="error"><span class="text_error">🔥 Error</span></xsl:when>
                <xsl:when test="skipped"><span class="text_skipped">🔷 Skipped</span></xsl:when>
                <xsl:otherwise><span class="text_passed">✅ Passed</span></xsl:otherwise>
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
                  <!-- a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a -->
                  <!-- a href="" onclick="event.preventDefault(); open_modal_pre(this.nextElementSibling.textContent)">🔍</a -->
                  <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>
                  <pre style="display:none;">
                    <xsl:value-of select="$failureMessage"/>
                  </pre>
                </xsl:if>
              </xsl:if>
              <!-- Skip message -->
              <xsl:if test="skipped">
                <xsl:variable name="skipMessage" select="string(properties/property[@name='skip']/@value)"/>
                <xsl:if test="$skipMessage">
                  <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>
                  <pre style="display:none;">
                    <xsl:value-of select="$skipMessage"/>
                  </pre>
                </xsl:if>
              </xsl:if>
              <!-- Last screenshot -->
              <xsl:variable name="screenshot" select="string(properties/property[@name='testrail_attachment']/@value)"/>
              <xsl:if test="$screenshot">
                <button class="link-button">
                  <xsl:attribute name="onclick">
                    <xsl:text>
                      open_modal_img('</xsl:text><xsl:value-of select="$screenshot"/><xsl:text>')
                    </xsl:text>
                  </xsl:attribute>
                  📎
                </button>
              </xsl:if>
              <!-- Standard output -->
              <xsl:if test="system-out">
                <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">📜</button>
                <pre style="display:none;"><xsl:value-of select="string(system-out)"/></pre>
              </xsl:if>
              <!-- Error output -->
              <xsl:if test="system-err">
                <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🛑</button>
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
    <br/>
  </xsl:template>
</xsl:stylesheet>
