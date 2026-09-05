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
        <script src="brand.js" defer="defer"></script>
        <script src="script.js" defer="defer"></script>
      </head>
      <body>
        <div id="modal" class="modal">
          <div id="modal-box" class="modal-box">
            <span id="close-btn" class="close-btn">×</span>  <!-- &#215; -->
            <div id="modal-content"></div>
          </div>
        </div>

        <h1 id="title">JUnit Test Report</h1>

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
    <xsl:variable name="hours" select="floor($time div 3600)"/>
    <xsl:variable name="minutes" select="floor(($time mod 3600) div 60)"/>
    <xsl:variable name="seconds" select="$time mod 60"/>

    <div class="summary">
      <strong>Suites: </strong> <xsl:value-of select="count(testsuite)"/> |
      <strong>Total tests: </strong> <xsl:value-of select="@tests"/> |
      <strong>Failures: </strong> <xsl:value-of select="@failures"/> |
      <strong>Errors: </strong> <xsl:value-of select="@errors"/> |
      <strong>Skipped: </strong> <xsl:value-of select="@skipped"/> |
      <strong>Total time: </strong>
        <xsl:if test="$hours &gt; 0">
          <xsl:value-of select="$hours"/><xsl:text> h </xsl:text>
        </xsl:if>
        <xsl:if test="$minutes &gt; 0 or $hours &gt; 0">
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
          <th>Author</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="testcase">
          <tr>
            <!-- Test spec file path -->
            <!--td><xsl:value-of select="@classname"/></td-->
            <!-- Test name -->
            <td><xsl:value-of select="@name"/></td>
            <td>
              <xsl:choose>
                <xsl:when test="failure"><span class="text_failed">❌ Failed</span></xsl:when>
                <xsl:when test="error"><span class="text_error">🔥 Error</span></xsl:when>
                <xsl:when test="skipped"><span class="text_skipped">🔷 Skipped</span></xsl:when>
                <xsl:otherwise><span class="text_passed">✅ Passed</span></xsl:otherwise>
              </xsl:choose>
            </td>
            <!-- Execution time -->
            <td>
              <xsl:choose>
                <xsl:when test="@time and number(@time) = number(@time)">
                  <xsl:value-of select="format-number(number(@time), '0.0')"/> <!-- select="round(number(@time))" -->
                </xsl:when>
                <xsl:otherwise>0</xsl:otherwise>
              </xsl:choose>
            </td>
            <!-- Details -->
            <td>
              <!-- Stack trace -->
              <xsl:if test="failure">
                <xsl:variable name="failureMessage" select="string(failure)"/>
                <xsl:if test="$failureMessage">
                  <!-- a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a -->
                  <!-- a href="" onclick="event.preventDefault(); open_modal_pre(this.nextElementSibling.textContent)">🔍</a -->
                  <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>
                  <pre style="display:none;"><xsl:value-of select="$failureMessage"/></pre>
                </xsl:if>
              </xsl:if>
              <!-- Error message -->
              <xsl:if test="error">
                <xsl:variable name="errorMessage" select="string(error)"/>
                <xsl:if test="$errorMessage">
                  <!-- a href="javascript:void(0);" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</a -->
                  <!-- a href="" onclick="event.preventDefault(); open_modal_pre(this.nextElementSibling.textContent)">🔍</a -->
                  <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>
                  <pre style="display:none;"><xsl:value-of select="$errorMessage"/></pre>
                </xsl:if>
              </xsl:if>
              <!-- Skip message -->
              <xsl:if test="skipped">
                <xsl:variable name="skipMessage" select="string(properties/property[@name='skip']/@value)"/>
                <xsl:if test="$skipMessage">
                  <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">🔍</button>
                  <pre style="display:none;"><xsl:value-of select="$skipMessage"/></pre>
                </xsl:if>
              </xsl:if>
              <!-- Screenshot -->
              <xsl:variable name="screenshot" select="string(properties/property[@name='image']/@value)"/>
              <xsl:if test="$screenshot">
                <button class="link-button" onclick="open_modal_img('{$screenshot}')">📎</button>
              </xsl:if>
              <!-- Video -->
              <xsl:variable name="video" select="string(properties/property[@name='video']/@value)"/>
              <xsl:if test="$video">
                <button class="link-button" onclick="open_modal_video('{$video}')">▶️</button> <!--🎬-->
              </xsl:if>
              <!-- PDF -->
              <xsl:variable name="pdf" select="string(properties/property[@name='pdf']/@value)"/>
              <xsl:if test="$pdf">
                <button class="link-button"><a href="{$pdf}" target="_blank">📄</a></button>
              </xsl:if>
              <!-- Standard output -->
              <xsl:if test="system-out">
                <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">📙</button>
                <pre style="display:none;"><xsl:value-of select="string(system-out)"/></pre>
              </xsl:if>
              <!-- Standard error -->
              <xsl:if test="system-err">
                <button class="link-button" onclick="open_modal_pre(this.nextElementSibling.textContent)">📕</button>
                <pre style="display:none;"><xsl:value-of select="string(system-err)"/></pre>
              </xsl:if>
            </td>
            <!-- Issues -->
            <!-- Issues in modal using js -->
            <td>
              <xsl:variable name="issues" select="properties/property[@name='issues']/@value"/>
              <xsl:if test="$issues and (failure or error)">
                <button class="link-button" onclick="open_modal_issues('{$issues}')">🐞</button>
              </xsl:if>
            </td>
            <!-- Issues in modal using xsl -->
            <!--td>
              <xsl:variable name="issues" select="properties/property[@name='issues']/@value"/>
              <xsl:if test="$issues and (failure or error)">
                <button class="link-button" onclick="open_modal_html(this.nextElementSibling.innerHTML)">🐞</button>
                <div style="display:none;">
                  <h4>Issues</h4>
                  <xsl:for-each select="str:tokenize($issues, ',')">
                    <xsl:variable name="key" select="normalize-space(.)"/>
                    <a href="https://naxosdionysos.atlassian.net/browse/{$key}" style="color: blue;" target="_blank">
                      <xsl:value-of select="$key"/>
                    </a>
                    <br/>
                  </xsl:for-each>
                </div>                
              </xsl:if>
            </td-->
            <!-- Issues in tooltip -->
            <!--td>
              <xsl:variable name="issues" select="properties/property[@name='issues']/@value"/>
              <xsl:if test="$issues and (failure or error)">
                <div class="tooltip">
                  🐞
                  <span class="tooltip-text">
                    <xsl:for-each select="str:tokenize($issues, ',')">
                      <xsl:variable name="key" select="normalize-space(.)"/>
                      <a href="https://naxosdionysos.atlassian.net/browse/{$key}" target="_blank">
                        <xsl:value-of select="$key"/>
                      </a>
                      <br/>
                    </xsl:for-each>
                  </span>
                </div>
              </xsl:if>
            </td-->
            <!-- Issues inside table cell -->
            <!--td>
              <xsl:variable name="issues" select="properties/property[@name='issues']/@value"/>
              <xsl:if test="$issues and (failure or error)">
                🐞
                <xsl:for-each select="str:tokenize($issues, ',')">
                  <xsl:variable name="key" select="normalize-space(.)"/>
                  <a href="https://naxosdionysos.atlassian.net/browse/{$key}" target="_blank">
                    <xsl:value-of select="$key"/>
                  </a>
                  < add space after each link except the last >
                  <xsl:if test="position() != last()">
                    <xsl:text> </xsl:text>
                  </xsl:if>
                </xsl:for-each>
              </xsl:if>
            </td-->
            <!-- Author -->
            <td>
              <xsl:variable name="author" select="properties/property[@name='author']/@value"/>
              <xsl:if test="$author">
                <xsl:value-of select="$author"/>
              </xsl:if>
            </td>
            <!-- Trend -->
            <!-- Trend from file inputs in modal -->
            <td>
              <xsl:variable name="history_folder" select="string(properties/property[@name='history_folder']/@value)"/>
              <xsl:if test="$history_folder">
                <xsl:variable name="trend" select="document(concat($history_folder, '/trend'))/trend.xml"/>
                <xsl:if test="$trend and number($trend) = number($trend)">
                  <button class="link-button" onclick="open_modal_bars('{$trend}', '{$history_folder}/history.json')">
                    <xsl:value-of select="$trend"/> %
                  </button>
                </xsl:if>
              </xsl:if>
            </td>
            <!-- Trend from history annotation inside table cell -->
            <!--td>
              <xsl:variable name="passed"  select="count(properties/property[@name='history' and @value='passed'])"/>
              <xsl:variable name="failed"  select="count(properties/property[@name='history' and @value='failed'])"/>
              <xsl:variable name="skipped" select="count(properties/property[@name='history' and @value='skipped'])"/>
              <xsl:variable name="other"   select="count(properties/property[@name='history' and @value='other'])"/>
              <xsl:variable name="total" select="$passed + $failed + $skipped + $other"/>
              <div class="history">
                <xsl:choose>
                  <xsl:when test="$total &gt; 0">
                    <xsl:value-of select="round(100 * $passed div $total)"/>
                  </xsl:when>
                  <xsl:otherwise>0</xsl:otherwise>
                </xsl:choose> %
                <xsl:for-each select="properties/property[@name='history']">
                  <xsl:choose>
                    <xsl:when test="@value = 'passed'">
                      <div class="history_line history_green"></div>
                    </xsl:when>
                    <xsl:when test="@value = 'failed'">
                      <div class="history_line history_red"></div>
                    </xsl:when>
                    <xsl:when test="@value = 'skipped'">
                      <div class="history_line history_blue"></div>
                    </xsl:when>
                    <xsl:when test="@value = 'other'">
                      <div class="history_line history_gray"></div>
                    </xsl:when>
                  </xsl:choose>
                </xsl:for-each>
              </div>
            </td-->
            <!-- Trend from trend & history annotations inside table cell -->
            <!--td>
              <xsl:variable name="case_id" select="string(properties/property[@name='case_id']/@value)"/>
              <xsl:variable name="history_folder" select="string(properties/property[@name='history_folder']/@value)"/>
              <xsl:variable name="results" select="properties/property[@name='history_results']/@value"/>
              <xsl:variable name="trend" select="properties/property[@name='history_trend']/@value"/>
              <div class="history">
                <xsl:choose>
                  <xsl:when test="number($trend) = number($trend)">
                    <xsl:value-of select="round($trend)"/>
                  </xsl:when>
                  <xsl:otherwise>0</xsl:otherwise>
                </xsl:choose> %
                <xsl:for-each select="str:tokenize($results, ',')">
                  <xsl:variable name="result" select="normalize-space(.)"/>
                  <xsl:choose>
                    <xsl:when test="$result = 'passed'">
                      <div class="history_line history_green"></div>
                    </xsl:when>
                    <xsl:when test="$result = 'failed'">
                      <div class="history_line history_red"></div>
                    </xsl:when>
                    <xsl:when test="$result = 'skipped'">
                      <div class="history_line history_blue"></div>
                    </xsl:when>
                    <xsl:when test="$result = 'other'">
                      <div class="history_line history_gray"></div>
                    </xsl:when>
                  </xsl:choose>
                </xsl:for-each>
              </div>
            </td-->
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
    <br/>
  </xsl:template>
</xsl:stylesheet>

