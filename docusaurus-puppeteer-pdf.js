'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const puppeteer = require('puppeteer');
var i = 0;

async function requestPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  });
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.pdf({
    // i is the counter, so an example filename would be 0342.pdf
    path: (String(i).padStart(4, '0')).concat('.', 'pdf'), 
    //format: 'A4',
    width: '1200', height: '1800',
    margin: {
      top: '80px',
      bottom: '60px'
    },
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
