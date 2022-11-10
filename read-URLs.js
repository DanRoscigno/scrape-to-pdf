'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const puppeteer = require('puppeteer');
var i = 0;

async function requestPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  // page.pdf() is currently supported only in headless mode.
  // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
  await page.pdf({
    path: `${i}.pdf`,
    format: 'letter',
  });
  i++;

  await browser.close();
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('URLs.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
    await requestPage(line).then(resp => {
    console.log(`Done with ${line}`);
  }).catch(err => {
    console.log(err);
  });
  }
}

processLineByLine();
