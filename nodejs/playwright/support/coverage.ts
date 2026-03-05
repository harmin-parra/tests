import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import v8toIstanbul from 'v8-to-istanbul';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { COVERAGE_RAW_FOLDER, COVERAGE_REPORT_FOLDER } from './shared-variables';


async function generate() {
  if (!fs.existsSync(COVERAGE_RAW_FOLDER)) {
    console.warn('No coverage data found');
    return;
  }
  await processJSCoverage(COVERAGE_RAW_FOLDER);
  await processCSSCoverage(COVERAGE_RAW_FOLDER);
  console.log('✅ Coverage generation complete!');
  console.log('JS report: coverage/js/index.html');
  console.log('CSS report: coverage/css/index.html');
}


export async function processJSCoverage(coverageDir: string) {
  const coverageMap = createCoverageMap({});
  const jsFiles = fs.readdirSync(coverageDir).filter(f => f.startsWith('js-'));
  if (!jsFiles.length) {
    console.warn('No JS coverage files found.');
    return;
  }

  const allowedHost = 'localhost';
  // const allowedHosts = ['localhost'];

  // temp directory for inline scripts
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v8-coverage-'));

  for (const file of jsFiles) {
    const raw = JSON.parse(
      fs.readFileSync(path.join(coverageDir, file), 'utf-8')
    );

    for (const script of raw) {
      try {
        if (!script.functions || script.functions.length === 0 || !script.url) continue;

        // Skip third-party scripts
        const parsedUrl = new URL(script.url);
        if (parsedUrl.hostname !== allowedHost) continue;
        // if (!allowedHosts.includes(parsedUrl.hostname)) continue;

        let sourceFilePath: string | null = null;

        // --------------------------------
        // Case 1 — JS file exists locally
        // --------------------------------
        const filePath = parsedUrl.pathname.startsWith('/')
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.pathname;

        const absolutePath = path.join(process.cwd(), filePath);

        if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
          sourceFilePath = absolutePath;
        }

        // -------------------------
        // Case 2 - JS only exits remotely, fallback to inline source
        // -------------------------
        if (!sourceFilePath && script.source) {
          const tempFile = path.join(tmpDir, `${script.scriptId}.js`);
          fs.writeFileSync(tempFile, script.source, 'utf-8');
          sourceFilePath = tempFile;
        }

        if (!sourceFilePath) continue;

        const converter = v8toIstanbul(sourceFilePath);
        await converter.load();
        converter.applyCoverage(script.functions);

        coverageMap.merge(converter.toIstanbul());
      } catch (err) {
        console.warn(
          `Skipped JS coverage for ${script.url}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
  }

  const outputDir = path.join(COVERAGE_REPORT_FOLDER, 'js');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const context = createContext({ dir: outputDir, coverageMap });

  reports.create('html').execute(context);
  reports.create('text-summary').execute(context);

  console.log(`✅ JS coverage report generated at: ${outputDir}/index.html`);

  fs.rmSync(tmpDir, { recursive: true, force: true });
}


export async function processCSSCoverage(coverageDir: string) {
  const cssFiles = fs.readdirSync(coverageDir).filter(f => f.startsWith('css-'));
  if (!cssFiles.length) {
    console.warn('No CSS coverage files found.');
    return;
  }

  const allowedHost = 'localhost';
  // const allowedHosts = ['localhost'];

  const cssOutputDir = path.join(COVERAGE_REPORT_FOLDER, 'css');

  if (!fs.existsSync(cssOutputDir))
    fs.mkdirSync(cssOutputDir, { recursive: true });

  const resultsMap: Record<string, { used: number; total: number }> = {};

  for (const file of cssFiles) {
    const raw = JSON.parse(
      fs.readFileSync(path.join(coverageDir, file), 'utf-8')
    );

    for (const stylesheet of raw) {
      try {
        if (!stylesheet.url) continue;

        const parsedUrl = new URL(stylesheet.url);

        // Skip third-party CSS
        if (parsedUrl.hostname !== allowedHost) continue;
        // if (!allowedHosts.includes(parsedUrl.hostname)) continue;

        const filePath = parsedUrl.pathname.startsWith('/')
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.pathname;

        const absolutePath = path.join(process.cwd(), filePath);

        let totalBytes = 0;

        // --------------------------------
        // Case 1 — CSS file exists locally
        // --------------------------------
        if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
          const content = fs.readFileSync(absolutePath, 'utf-8');
          totalBytes = content.length;
        }
        // --------------------------------
        // Case 2 — CSS only exists remotely
        // --------------------------------
        else {
          if (!stylesheet.text) continue;
          totalBytes = stylesheet.text.length;
        }

        // Compute used bytes
        const usedBytes = stylesheet.ranges.reduce(
          (sum: number, r: { start: number; end: number }) =>
            sum + (r.end - r.start),
          0
        );

        if (!resultsMap[filePath]) {
          resultsMap[filePath] = {
            used: 0,
            total: totalBytes
          };
        }

        resultsMap[filePath].used += usedBytes;

        // Prevent impossible values
        if (resultsMap[filePath].used > resultsMap[filePath].total) {
          resultsMap[filePath].used = resultsMap[filePath].total;
        }
      } catch (err) {
        console.warn(
          `Skipped CSS coverage for ${stylesheet.url}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
  }

  const results = Object.entries(resultsMap).map(([file, data]) => ({
    file,
    used: data.used,
    total: data.total,
    percent: data.total
      ? ((data.used / data.total) * 100).toFixed(2)
      : '0.00'
  }));

  generateCSSHtmlReport(results, cssOutputDir);

  console.log(
    `✅ CSS coverage report generated at: ${path.join(cssOutputDir, 'index.html')}`
  );
}


function generateCSSHtmlReport(
  results: { file: string; used: number; total: number; percent: string }[],
  outputDir: string
) {
  const rows = results
    .map(
      r => `
      <tr>
        <td>${r.file}</td>
        <td>${r.percent}%</td>
        <td>${r.used}</td>
        <td>${r.total}</td>
      </tr>`
    )
    .join('');

  const html = `
  <html>
    <head>
      <title>CSS Coverage Report</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f5f5f5; text-align: left; }
        tr:hover { background: #fafafa; }
      </style>
    </head>
    <body>
      <h1>CSS Coverage Report</h1>
      <table>
        <tr>
          <th>File</th>
          <th>Coverage %</th>
          <th>Used Bytes</th>
          <th>Total Bytes</th>
        </tr>
        ${rows}
      </table>
    </body>
  </html>
  `;

  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

// Run the generator if this script is executed directly
// CommonJS entry point
if (require.main === module) {
  generate().catch(err => console.error(err));
}

/*
// ESM entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch(err => console.error(err));
}
*/
