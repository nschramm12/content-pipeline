#!/usr/bin/env node
// render-template.js — Render HTML+CSS to 1080x1080 PNG via Playwright
// Usage: cat template.html | node render-template.js > output.png
// Or:     node render-template.js template.html output.png

const { chromium } = require('playwright');
const fs = require('fs');

const args = process.argv.slice(2);
let inputHtml, outputPath;

if (args.length >= 2) {
  inputHtml = fs.readFileSync(args[0], 'utf-8');
  outputPath = args[1];
} else if (args.length === 1) {
  inputHtml = fs.readFileSync(args[0], 'utf-8');
  outputPath = '/dev/stdout';
} else {
  inputHtml = fs.readFileSync('/dev/stdin', 'utf-8');
  outputPath = '/dev/stdout';
}

(async () => {
  const browser = await chromium.launch({
    channel: 'chromium-headless-shell',
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      '--disable-extensions',
      '--disable-logging',
      '--log-level=3',
      '--silent-debugger',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--mute-audio',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-field-trial-config',
      '--disable-breakpad',
      '--disable-crash-reporter',
      '--disable-features=TranslateUI,BlinkGenPropertyTrees'
    ]
  });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 2
  });
  await page.setContent(inputHtml, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: outputPath, fullPage: false, type: 'png' });
  await browser.close();
  const stats = fs.statSync(outputPath);
  console.error('Rendered:', (stats.size / 1024).toFixed(1) + 'KB');
})();
