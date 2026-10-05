#!/usr/bin/env node
/**
 * Rendered MathJax & LaTeX Integrity Audit
 * Uses Playwright to render all HTML pages in Chromium, waiting for MathJax to typeset,
 * expanding interactive practice panels, checking for <mjx-merror> elements, and scanning
 * for broken LaTeX escape patterns in visible page text.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let safeUrl = req.url.split('?')[0];
    safeUrl = decodeURIComponent(safeUrl);
    let filePath = path.join(ROOT, safeUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function findHtmlFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.venv' || entry.name === '.render_tmp') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(path.relative(ROOT, fullPath));
    }
  }
  return results.sort();
}

async function runRenderCheck() {
  const server = createStaticServer();

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[render-check] Local server running on http://localhost:${port}`);

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`[render-check] Found ${htmlFiles.length} HTML files to test.\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const summary = [];
  const allDetailedErrors = [];
  let totalErrors = 0;
  let totalGarbled = 0;

  try {
    for (const file of htmlFiles) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.route('**/*goatcounter*', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
      await page.route('**/*zgo.at*', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
      const url = `http://localhost:${port}/${file}`;

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      } catch (err) {
        console.error(`[render-check] Error loading ${file}: ${err.message}`);
        summary.push({ page: file, formulas: 0, errors: 1, garbled: 0 });
        allDetailedErrors.push({ file, heading: 'Navigation', msg: err.message, tex: '' });
        totalErrors += 1;
        await page.close();
        continue;
      }

      // Check if MathJax is used on this page
      const hasMathJax = await page.evaluate(() => {
        return !!(document.querySelector('script[src*="mathjax"]') || window.MathJax);
      });

      if (hasMathJax) {
        try {
          await page.waitForFunction(
            () => window.MathJax && window.MathJax.startup && window.MathJax.startup.promise,
            { timeout: 60000 }
          );
          await page.evaluate(() => window.MathJax.startup.promise);
        } catch (err) {
          console.warn(`[render-check] MathJax startup timeout on ${file}`);
        }

        // Expand all practice hints and solution panels
        await page.evaluate(() => {
          document.querySelectorAll('.practice-btn.hint, .practice-btn.reveal, [data-practice] button').forEach((btn) => {
            try { btn.click(); } catch (e) {}
          });
          document.querySelectorAll('.practice-hint, .practice-solution').forEach((el) => {
            el.removeAttribute('hidden');
          });
        });

        // Trigger typeset for all elements (handles data-lazy-math via window.__typesetAll if present)
        await page.evaluate(async () => {
          if (typeof window.__typesetAll === 'function') {
            await window.__typesetAll();
          } else if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            await window.MathJax.typesetPromise();
          }
        });
      }

      // Audit formulas, errors, and visible text garble
      const pageReport = await page.evaluate(() => {
        const mathList = window.MathJax?.startup?.document?.math ? [...window.MathJax.startup.document.math] : [];
        const merrors = document.querySelectorAll('mjx-merror');
        const errorDetails = [];

        for (const item of mathList) {
          const root = item.typesetRoot;
          const errEl = root ? (root.matches && root.matches('mjx-merror') ? root : root.querySelector?.('mjx-merror')) : null;
          if (errEl) {
            // Find nearest section heading
            let heading = 'Top of page';
            let curr = root;
            while (curr && curr !== document.body) {
              let prev = curr.previousElementSibling;
              while (prev) {
                if (/^H[1-6]$/i.test(prev.tagName)) {
                  heading = prev.textContent.trim();
                  break;
                }
                const subH = prev.querySelectorAll('h1, h2, h3, h4, h5, h6');
                if (subH.length > 0) {
                  heading = subH[subH.length - 1].textContent.trim();
                  break;
                }
                prev = prev.previousElementSibling;
              }
              if (heading !== 'Top of page') break;
              curr = curr.parentElement;
              if (curr && curr !== document.body) {
                const parentH = curr.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > header h1, :scope > header h2');
                if (parentH) {
                  heading = parentH.textContent.trim();
                  break;
                }
              }
            }

            errorDetails.push({
              heading,
              msg: errEl.getAttribute('data-mjx-error') || errEl.getAttribute('title') || errEl.textContent.trim(),
              tex: item.math || ''
            });
          }
        }

        // If merror elements exist that weren't in mathList
        if (merrors.length > errorDetails.length) {
          merrors.forEach((m) => {
            const alreadyLogged = errorDetails.some((d) => d.msg === (m.getAttribute('data-mjx-error') || m.textContent.trim()));
            if (!alreadyLogged) {
              errorDetails.push({
                heading: 'Unknown section',
                msg: m.getAttribute('data-mjx-error') || m.textContent.trim(),
                tex: ''
              });
            }
          });
        }

        // Scan visible text for LaTeX garble patterns outside code/pre/script/style
        const clone = document.body.cloneNode(true);
        clone.querySelectorAll('script, style, pre, code').forEach((el) => el.remove());
        const visibleText = clone.innerText || '';
        const garblePattern = /\babla\b|\brac\{|\bight[)\]]|\begin\{|Math input error/g;
        const matches = visibleText.match(garblePattern) || [];

        return {
          formulas: mathList.length,
          errors: Math.max(merrors.length, errorDetails.length),
          errorDetails,
          garbled: matches.length,
          garbledMatches: matches
        };
      });

      if (pageReport.errorDetails.length > 0) {
        pageReport.errorDetails.forEach((ed) => {
          allDetailedErrors.push({ file, ...ed });
        });
      }

      summary.push({
        page: file,
        formulas: pageReport.formulas,
        errors: pageReport.errors,
        garbled: pageReport.garbled
      });

      totalErrors += pageReport.errors;
      totalGarbled += pageReport.garbled;

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  // Print results table
  console.log('='.repeat(70));
  console.log('RENDERED MATHJAX & LATEX AUDIT RESULTS');
  console.log('='.repeat(70));
  console.table(summary);

  if (allDetailedErrors.length > 0) {
    console.log('\n❌ DETAILED ERRORS FOUND:');
    allDetailedErrors.forEach((e, idx) => {
      console.log(`\n[${idx + 1}] File: ${e.file}`);
      console.log(`    Heading: ${e.heading}`);
      console.log(`    Error:   ${e.msg}`);
      if (e.tex) console.log(`    TeX:     ${e.tex}`);
    });
  }

  if (totalErrors > 0 || totalGarbled > 0) {
    console.error(`\nFAILED: Found ${totalErrors} MathJax error(s) and ${totalGarbled} garbled pattern(s).`);
    process.exit(1);
  } else {
    console.log(`\n✅ SUCCESS: All ${htmlFiles.length} pages passed with 0 MathJax errors and 0 garbled strings!`);
    process.exit(0);
  }
}

runRenderCheck().catch((err) => {
  console.error('Fatal render check error:', err);
  process.exit(1);
});
