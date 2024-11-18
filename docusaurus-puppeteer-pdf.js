'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const puppeteer = require('puppeteer');
const scrollToBottom = require('scroll-to-bottomjs');
const PDFDocument = require('pdfkit');
//const fs = require('fs');

async function coverPage() {
    // Create a document
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream('0000.pdf'));

    doc
        .save()
        // position logo over 70 and down 30
        .translate(70, 30)
        .path('M16.17 27.33C12.17 24.06 7.81 20.45 5.48 18.52L3.85 17.18C2.72 16.25 1.85 14.6 3.75 13.47C4.58 13 18.78 4.83 24 1.8C24.9101 1.26745 25.9455 0.986755 27 0.986755C28.0545 0.986755 29.0899 1.26745 30 1.8L40 7.59C40.1808 7.69315 40.3312 7.8423 40.4357 8.02232C40.5403 8.20234 40.5954 8.40682 40.5954 8.615C40.5954 8.82319 40.5403 9.02767 40.4357 9.20769C40.3312 9.38771 40.1808 9.53686 40 9.64L16.52 23.11C16.1583 23.317 15.8525 23.6089 15.6287 23.9604C15.4049 24.312 15.27 24.7127 15.2356 25.128C15.2011 25.5433 15.2682 25.9607 15.431 26.3443C15.5938 26.7279 15.8474 27.0662 16.17 27.33Z')
        .fillAndStroke("#FABF00", "#FABF00")
        //.fillColor("#FABFOO")
        .path('M22 36.88L12.48 51.45C12.1476 51.9565 11.6338 52.3165 11.0443 52.4559C10.4547 52.5954 9.83413 52.5038 9.31 52.2L3 48.55C2.09463 48.0273 1.34153 47.2772 0.815324 46.3738C0.289116 45.4705 0.00805933 44.4454 0 43.4L0 19.08C0.000384234 18.1553 0.216647 17.2435 0.63157 16.4171C1.04649 15.5907 1.64862 14.8726 2.39 14.32C0.69 15.63 1.39 17.1 2.49 18.04L21.57 33.75C22.0121 34.1288 22.3 34.6566 22.3793 35.2334C22.4585 35.8102 22.3236 36.396 22 36.88Z')
        .fillAndStroke("#338393", "#338393")
        .path('M37.83 35.11L48.52 43.92L50.15 45.26C51.28 46.2 52.15 47.85 50.25 48.98C49.42 49.47 35.25 57.62 29.98 60.65C29.0739 61.1674 28.0484 61.4395 27.005 61.4395C25.9616 61.4395 24.9362 61.1674 24.03 60.65L14 54.86C13.8194 54.7555 13.6694 54.6053 13.5651 54.4245C13.4609 54.2437 13.406 54.0387 13.406 53.83C13.406 53.6213 13.4609 53.4163 13.5651 53.2355C13.6694 53.0547 13.8194 52.9045 14 52.8L37.48 39.34C37.8417 39.1318 38.1475 38.8389 38.3712 38.4865C38.5948 38.1341 38.7296 37.7327 38.7641 37.3168C38.7985 36.9008 38.7315 36.4827 38.5688 36.0984C38.4061 35.714 38.1526 35.3749 37.83 35.11Z')
        .fillAndStroke("#338393", "#338393")
        .path('M32 25.57L41.52 11C41.8524 10.4935 42.3662 10.1336 42.9557 9.99407C43.5453 9.85458 44.1659 9.94617 44.69 10.25L51 13.9C51.9094 14.418 52.6658 15.1671 53.1927 16.0715C53.7195 16.9759 53.998 18.0034 54 19.05V43.37C53.9996 44.2947 53.7833 45.2065 53.3684 46.0329C52.9535 46.8593 52.3514 47.5774 51.61 48.13C53.31 46.82 52.61 45.35 51.51 44.41L32.43 28.69C31.9886 28.3129 31.701 27.7869 31.6218 27.2118C31.5425 26.6367 31.6771 26.0525 32 25.57Z')
        .fillAndStroke("#338393", "#338393")

    doc
        .fontSize(25)
        .fillColor("black")
        // position text over 0 and down 40 (relative to image)
        .text('StarRocks version 3.3', 0, 90);


    // Finalize PDF file
    doc.end();

    const pageDetails = `    - file: 0000.pdf\n      title: StarRocks\n`;
    fs.appendFile('./combine.yaml', pageDetails, err => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Coverpage`);
            console.log(`Filename is 0000.pdf`);
            // file written successfully
        }
    });
}

// cover page is 0.pdf, so start `i` at 1
var i = 1;

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
    const cleanedTitle = pageTitle.replaceAll('\[', '').replaceAll('\]', '').replaceAll(':', '').replaceAll(' | StarRocks', '')
  const pageDetails = `    - file: ${fileName}\n      title: ${cleanedTitle}\n`;

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
coverPage();
processLineByLine();
