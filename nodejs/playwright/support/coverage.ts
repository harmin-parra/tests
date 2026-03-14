import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import v8toIstanbul from 'v8-to-istanbul';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { COVERAGE_RESULTS_FOLDER, COVERAGE_REPORT_FOLDER } from './shared-variables';


const hostname = 'localhost';


async function generate() {
  if (!fs.existsSync(COVERAGE_RESULTS_FOLDER)) {
    console.warn('No coverage data found');
    return;
  }
  recreateFolder(COVERAGE_REPORT_FOLDER);
  await processJSCoverage(COVERAGE_RESULTS_FOLDER, false);
  await processCSSCoverage(COVERAGE_RESULTS_FOLDER);
  console.log('✅ Coverage generation complete!');
}


function recreateFolder(folder: string): void {
  try {
    fs.rmSync(folder, { recursive: true, force: true });
    fs.mkdirSync(folder, { recursive: true });
  } catch (err) {
    console.error("Error recreating folder: " + folder + '\n', err);
  }
}


type CSSResult = {
  file: string;
  used: number;
  total: number;
  percent: string;
  ranges?: { start: number; end: number }[];
  content?: string;
  link?: string;
};


type CSSRange = { start: number; end: number };


function sanitizePath(filepath: string, extension?: string) {
  let result = filepath.replace(/\(([^)]+)\)/g, (_, inner) => {
    const sanitized = inner.replace(/:/g, '_').replace(/\//g, '-');
    return `(${sanitized})`;
  }).replace(/^\/+/, '');   // remove leading /
  if (extension != null && !result.endsWith('.' + extension))
    result = path.join(result, 'inline.' + extension);
  return result;
}


async function processJSCoverage(
  coverageDir: string,
  useSourceMaps = false,
  allowedHost = hostname
) {
  const coverageMap = createCoverageMap({});
  const jsFiles = fs.readdirSync(coverageDir).filter(f => f.startsWith('js-'));
  if (!jsFiles.length) return console.warn('No JS coverage files found.');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'js-coverage-'));

  for (const file of jsFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(coverageDir, file), 'utf-8'));

    for (const script of raw) {
      try {
        if (
          !script.functions?.length ||
          !script.url ||
          !script.source ||
          typeof script.source !== 'string'
        ) continue;
        // Filter scripts by host
        let parsedUrl: URL | null = null;
        try {
          parsedUrl = new URL(script.url);
          if (parsedUrl.hostname !== allowedHost) continue;
          if (!parsedUrl.pathname || parsedUrl.pathname === '/') continue;
        } catch {
          continue; // skip invalid URLs
        }

        // Remove css source maps
        script.source = script.source.replace(/\/\/# sourceMappingURL=.*\.css\.map$/gm, '');
        // Remove sourceMappingURL if skipping maps
        if (!useSourceMaps)
          script.source = script.source.replace(/\/\/# sourceMappingURL=.*$/gm, '');

        // Determine source file path
        let relativePath = path.join(parsedUrl.pathname.slice(1)) || 'inline.js';
        // Sanitize filename
        relativePath = sanitizePath(relativePath, 'js');

        const baseFolder = path.join(tmpDir, 'src', path.dirname(relativePath));
        fs.mkdirSync(baseFolder, { recursive: true });
        const sourceFilePath = path.join(baseFolder, path.basename(relativePath));

        // Save file if it doesn't exist
        if (!fs.existsSync(sourceFilePath))
          fs.writeFileSync(sourceFilePath, script.source, 'utf-8');

        const downloadedSources = new Set<string>();
        if (useSourceMaps) {
          try {
            const mapUrl = script.url + '.map';
            const resp = await fetch(mapUrl);
            if (!resp.ok) throw new Error(`Failed to fetch ${mapUrl}`);

            const mapText = await resp.text();
            const map = JSON.parse(mapText);

            const mapPath = sourceFilePath + '.map';
            fs.writeFileSync(mapPath, mapText, 'utf-8');

            if (map.sources) {
              for (const src of map.sources) {
                try {
                  // Normalize webpack paths
                  const cleanSrc = src
                    .replace(/^webpack:\/\//, '')
                    .replace(/^\.\//, '')
                    .replace(/^\/+/, '');

                    const srcUrl = new URL(cleanSrc, script.url).href;

                  // Prevent downloading the same source multiple times
                  if (downloadedSources.has(srcUrl))
                    continue;
                  downloadedSources.add(srcUrl);

                  const srcResp = await fetch(srcUrl);
                  if (!srcResp.ok) {
                    console.warn(`Could not fetch source ${srcUrl}`);
                    continue;
                  }

                  const content = await srcResp.text();

                  const localPath = path.join(path.dirname(sourceFilePath), cleanSrc);
                  fs.mkdirSync(path.dirname(localPath), { recursive: true });

                  if (!fs.existsSync(localPath)) {
                    fs.writeFileSync(localPath, content, 'utf-8');
                  }

                } catch (err) {
                  console.warn(
                    `Failed to fetch source ${src}: ${
                      err instanceof Error ? err.message : String(err)
                    }`
                  );
                }
              }
            }

          } catch (err) {
            console.warn(
              `Failed to fetch map for ${script.url}: ${
                err instanceof Error ? err.message : String(err)
              }`
            );
          }
        }

        // Load coverage
        const converter = v8toIstanbul(sourceFilePath);
        try {
          await converter.load();
        } catch (err) {
          if (!useSourceMaps) {
            console.warn(`Ignored map error for ${script.url} because useSourceMaps=false`);
          } else {
            throw err;
          }
        }
        converter.applyCoverage(script.functions);
        coverageMap.merge(converter.toIstanbul());

      } catch (err) {
        console.warn(`Skipped JS coverage for ${script.url}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // Generate reports
  const outputDir = path.join(COVERAGE_REPORT_FOLDER, 'js');
  fs.mkdirSync(outputDir, { recursive: true });
  const context = createContext({ dir: outputDir, coverageMap });
  reports.create('html').execute(context);
  reports.create('text-summary').execute(context);

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(`✅ JS coverage report generated at: ${outputDir}/index.html`);
}


async function processCSSCoverage(
  coverageDir: string,
  fetchRemote = true,
  allowedHost = hostname
) {
  const cssFiles = fs.readdirSync(coverageDir).filter(f => f.startsWith('css-'));
  if (!cssFiles.length) return console.warn('No CSS coverage files found.');

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-coverage-'));

  const resultsMap: Record<string, {
    used: number;
    total: number;
    ranges: { start: number; end: number }[];
    content: string;
  }> = {};

  for (const file of cssFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(coverageDir, file), 'utf-8'));

    for (const stylesheet of raw) {
      try {
        if (!stylesheet.url && !stylesheet.text) continue;

        let parsedUrl: URL | null = null;
        try {
          parsedUrl = new URL(stylesheet.url);
          if (parsedUrl.hostname !== allowedHost) continue;
        } catch {
          parsedUrl = null;
        }

        // Determine base path
        let relativePath = parsedUrl ? parsedUrl.pathname.slice(1) : 'inline.css';
        relativePath = sanitizePath(relativePath, 'css');

        let content = stylesheet.text || '';

        // Fetch CSS if missing
        if (!content && fetchRemote && parsedUrl) {
          try {
            const resp = await fetch(stylesheet.url);
            if (!resp.ok) {
              console.warn(`Skipped CSS coverage for ${stylesheet.url}: failed to fetch`);
              continue;
            }
            content = await resp.text();
          } catch (err) {
            console.warn(`Skipped CSS coverage for ${stylesheet.url}: ${err}`);
            continue;
          }
        }

        if (!content) continue;

        if (!stylesheet.ranges || !stylesheet.ranges.length)
          stylesheet.ranges = [{ start: 0, end: content.length }];

        const sourceFilePath = path.join(tmpDir, relativePath);
        fs.mkdirSync(path.dirname(sourceFilePath), { recursive: true });
        // Save file if it doesn't exist
        if (!fs.existsSync(sourceFilePath))
          fs.writeFileSync(sourceFilePath, content, 'utf-8');

        // Init result
        if (!resultsMap[relativePath]) {
          resultsMap[relativePath] = {
            used: 0,
            total: content.length,
            ranges: [],
            content: content
          };
        }

        // Add new ranges
        resultsMap[relativePath].ranges.push(...stylesheet.ranges);
        // Merge ranges
        resultsMap[relativePath].ranges = mergeRanges(resultsMap[relativePath].ranges);
        // Recalculate used bytes
        resultsMap[relativePath].used = resultsMap[relativePath].ranges.reduce(
          (sum, r) => sum + (r.end - r.start),
          0
        );
      } catch (err) {
        console.warn(
          `Skipped CSS coverage for ${stylesheet.url || 'inline'}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    }
  }

  const results: CSSResult[] = Object.entries(resultsMap).map(([file, data]) => ({
    file,
    used: data.used,
    total: data.total,
    percent: data.total
      ? ((data.used / data.total) * 100).toFixed(2)
      : '0.00',
    ranges: data.ranges,
    content: data.content
  }));

  generateCSSHtmlPages(results, path.join(COVERAGE_REPORT_FOLDER, 'css'));

  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(
    `✅ CSS coverage report generated at: ${path.join(
      COVERAGE_REPORT_FOLDER,
      'css',
      'index.html'
    )}`
  );
}


/**
 * Merge overlapping or adjacent ranges
 */
function mergeRanges(ranges: CSSRange[]): CSSRange[] {
  if (!ranges || !ranges.length) return [];

  // Sort by start position
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: CSSRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    if (current.start <= last.end) {
      // overlapping or adjacent → merge
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}


function generateCSSHtmlPages(
  results: CSSResult[],
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
    const pageHtml = `
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
    `;
    fs.writeFileSync(htmlPath, pageHtml, 'utf-8');

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
if (require.main === module) {
  generate().catch(err => console.error(err));
}

/*
// ESM entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch(err => console.error(err));
}
*/
