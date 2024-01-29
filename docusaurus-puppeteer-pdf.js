'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const puppeteer = require('puppeteer');
const scrollToBottom = require('scroll-to-bottomjs');
var i = 0;

async function requestPage(url) {
  const browser = await puppeteer.launch({ headless: 'new', });
  const fileName = (String(i).padStart(4, '0')).concat('.', 'pdf');
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded', });
  await page.evaluate(scrollToBottom);

  await page.pdf({
    path: fileName,
    format: 'A4',
    margin: {
      top: '60px',
      bottom: '60px',
      left: '60px',
      right: '60px',
    },
  });

  // Get the details to write the YAML file
  // We need title and filename
  const pageTitle = await page.title();
  const pageDetails = '    - file: ' + fileName  + '\n      title: ' + pageTitle + '\n';

  fs.appendFile('./combine.yaml', pageDetails, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Title is ${pageTitle}`);
      console.log(`Filename is ` + fileName );
      // file written successfully
    }
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
    console.log(`URL: ${line}`);
    await requestPage(line).then(resp => {
    console.log(`done.\n`);
  }).catch(err => {
    console.log(err);
  });
  }
}

const yamlHeader = 'files:\n';

fs.writeFile('./combine.yaml', yamlHeader, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
processLineByLine();
