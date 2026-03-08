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

  // temp directory for inline/remote scripts
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v8-coverage-js-'));

  for (const file of jsFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(coverageDir, file), 'utf-8'));

    for (const script of raw) {
      try {
        if (!script.functions || script.functions.length === 0) continue;
        if (!script.url) continue;

        // Filter third-party scripts
        let parsedUrl: URL | null = null;
        try {
          parsedUrl = new URL(script.url);
          if (parsedUrl.hostname !== allowedHost) continue;
          // if (!allowedHosts.includes(parsedUrl.hostname)) continue;
        } catch {
          // skip invalid URLs
          continue;
        }

        let sourceFilePath: string | null = null;

        // Try local source file
        const filePath = parsedUrl.pathname.startsWith('/')
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.pathname;

        const absolutePath = path.join(process.cwd(), filePath);

        if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
          sourceFilePath = absolutePath;
        }

        // Fallback to inline source
        else if (script.source) {
          const tempFilePath = path.join(tmpDir, filePath);
          const tempDir = path.dirname(tempFilePath);
          fs.mkdirSync(tempDir, { recursive: true });
          fs.writeFileSync(tempFilePath, script.source, 'utf-8');
          sourceFilePath = tempFilePath;
        } else continue;

        const converter = v8toIstanbul(sourceFilePath);
        await converter.load();
        converter.applyCoverage(script.functions);

        coverageMap.merge(converter.toIstanbul());
      } catch (err) {
        console.warn(`Skipped JS coverage for ${script.url}: ${err instanceof Error ? err.message : String(err)}`);
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

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-coverage-'));

  // Type-safe results array including optional 'link'
  const resultsMap: Record<string, { used: number; total: number; ranges: { start: number; end: number }[]; content: string }> = {};

  // Collect coverage from all files
  for (const file of cssFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(coverageDir, file), 'utf-8'));

    for (const stylesheet of raw) {
      try {
        if (!stylesheet.url) continue;

        // Filter third-party scripts
        let parsedUrl: URL | null = null;
        try {
          parsedUrl = new URL(stylesheet.url);
          if (parsedUrl.hostname !== allowedHost) continue;
          // if (!allowedHosts.includes(parsedUrl.hostname)) continue;
        } catch {
          // skip invalid URLs
          continue;
        }

        const filePath = parsedUrl.pathname.startsWith('/')
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.pathname;

        const absolutePath = path.join(process.cwd(), filePath);

        let content = '';
        let totalBytes = 0;

        // Try local source file
        if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
          content = fs.readFileSync(absolutePath, 'utf-8');
          totalBytes = content.length;
        } 
        // Fallback to inline source
        else if (stylesheet.text) {
          const tempFilePath = path.join(tmpDir, filePath);
          const tempDir = path.dirname(tempFilePath);
          fs.mkdirSync(tempDir, { recursive: true });
          fs.writeFileSync(tempFilePath, stylesheet.text, 'utf-8');
          content = stylesheet.text;
          totalBytes = content.length;
        } else continue;

        const usedBytes = stylesheet.ranges.reduce((sum: number, r: { start: number; end: number }) => sum + (r.end - r.start), 0);

        if (!resultsMap[filePath]) {
          resultsMap[filePath] = { used: 0, total: totalBytes, ranges: [], content };
        }

        resultsMap[filePath].used += usedBytes;
        resultsMap[filePath].ranges.push(...stylesheet.ranges);

        if (resultsMap[filePath].used > resultsMap[filePath].total) {
          resultsMap[filePath].used = resultsMap[filePath].total;
        }

      } catch (err) {
        console.warn(`Skipped CSS coverage for ${stylesheet.url}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  const outputDir = path.join(COVERAGE_REPORT_FOLDER, 'css');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Convert map to array with type-safe link property
  const results: {
    file: string;
    used: number;
    total: number;
    percent: string;
    ranges?: { start: number; end: number }[];
    content?: string;
    link?: string;
  }[] = Object.entries(resultsMap).map(([file, data]) => ({
    file,
    used: data.used,
    total: data.total,
    percent: data.total ? ((data.used / data.total) * 100).toFixed(2) : '0.00',
    ranges: data.ranges,
    content: data.content,
  }));

  // Generate main index and per-file HTML pages
  generateCSSHtmlPages(results, outputDir);
  console.log(`✅ CSS coverage report generated at: ${path.join(outputDir, 'index.html')}`);

  fs.rmSync(tmpDir, { recursive: true, force: true });
}


/**
 * Generate index.html + per-file HTML pages
 */
function generateCSSHtmlPages(
  results: {
    file: string;
    used: number;
    total: number;
    percent: string;
    ranges?: { start: number; end: number }[];
    content?: string;
    link?: string;
  }[],
  outputDir: string
) {
  results.forEach((r) => {
    if (!r.content) return;

    const lines = r.content.split(/\r?\n/);
    let cursor = 0;

    const gutterWidth = String(lines.length).length;

    // Inline spans, no block → removes extra blank lines
    const highlighted = lines.map((line, idx) => {
      const lineNumber = idx + 1;
      const lineLength = line.length + 1;
      const used = (r.ranges?.length ? r.ranges : [{ start: 0, end: r.content!.length }]).some(range =>
        cursor < range.end && cursor + lineLength > range.start
      );
      cursor += lineLength;

      const lineNumStr = String(lineNumber).padStart(gutterWidth, ' ');
      return `<span style="color:#888; user-select:none;">${lineNumStr} | </span>` +
             `<span style="${used ? 'background:#c8f7c5;' : ''}">${line}</span>\n`;
    }).join('');

    const htmlPath = path.join(outputDir, r.file + '.html');
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });

    // Correct relative path to index.html
    const relativeIndex = path.relative(path.dirname(htmlPath), path.join(outputDir, 'index.html'));

    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, `
      <html>
        <head>
          <title>${r.file} - CSS Coverage</title>
          <style>
            body { font-family: monospace; padding:20px; background:#f8f8f8; }
            pre { white-space: pre; margin:0; }
            a { text-decoration:none; color:#0366d6; }
            a:hover { text-decoration:underline; }
          </style>
        </head>
        <body>
          <h1>CSS Coverage: ${r.file}</h1>
          <p><a href=${relativeIndex}>Back to index</a></p>
          <pre>${highlighted}</pre>
        </body>
      </html>
    `, 'utf-8');

    r.link = r.file + '.html';
  });

  // Index generation remains the same
  const totalUsed = results.reduce((sum, r) => sum + r.used, 0);
  const totalBytes = results.reduce((sum, r) => sum + r.total, 0);
  const totalPercent = totalBytes ? ((totalUsed / totalBytes) * 100).toFixed(2) : '0.00';

  const tableRows = results.map(r => `
    <tr>
      <td><a href="${r.link}">${r.file}</a></td>
      <td>${r.percent}%</td>
      <td>${r.used}</td>
      <td>${r.total}</td>
    </tr>
  `).join('');

  const indexHtml = `
    <html>
      <head>
        <title>CSS Coverage Report</title>
        <style>
          body { font-family: Arial; padding:20px; }
          table { border-collapse: collapse; width:100%; margin-bottom:20px; }
          th, td { border:1px solid #ddd; padding:8px; }
          th { background:#f5f5f5; text-align:left; }
          tr:hover { background:#fafafa; }
          a { text-decoration:none; color:#0366d6; }
          a:hover { text-decoration:underline; }
        </style>
      </head>
      <body>
        <h1>CSS Coverage Report</h1>
        <h2>Summary: ${totalPercent}% (${totalUsed} / ${totalBytes} bytes)</h2>
        <table>
          <tr>
            <th>File</th>
            <th>Coverage %</th>
            <th>Used Bytes</th>
            <th>Total Bytes</th>
          </tr>
          ${tableRows}
        </table>
      </body>
    </html>
  `;

  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml, 'utf-8');
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
