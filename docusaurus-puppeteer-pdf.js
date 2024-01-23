'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const puppeteer = require('puppeteer');
var i = 0;

/* YAML file looks like:
files:
    - file: 1.pdf
      title: First file
    - file: 2.pdf
      title: Second file
openleft: True
title: Binder
author: Tom de Geus
output: binder.pdf
*/

async function requestPage(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    // `headless: true` (default) enables old Headless;
    // `headless: 'new'` enables new Headless;
    // `headless: false` enables "headful" mode.
    });
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
  /* write to yaml file:

  */
  const pageTitle = await page.title();
  const pageDetails = '    - file: ' + (String(i).padStart(4, '0')).concat('.', 'pdf') + '\n      title: ' + pageTitle + '\n';

  fs.appendFile('./combine.yaml', pageDetails, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Title is ${pageTitle}`);
      console.log(`Filename is ` + (String(i).padStart(4, '0')).concat('.', 'pdf'));
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
    console.log(`Line from file: ${line}`);
    await requestPage(line).then(resp => {
    console.log(`Done with ${line}`);
  }).catch(err => {
    console.log(err);
  });
  }
}

const yamlHeader = 'files:\n';
const yamlFooter = 'openleft: True\ntitle: Binder\nauthor: Tom de Geus\noutput: binder.pdf';

fs.writeFile('./combine.yaml', yamlHeader, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
processLineByLine();
/*fs.appendFile('./combine.yaml', yamlFooter, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});*/
