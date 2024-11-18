'use strict';
require('dotenv').config()
const fs = require('node:fs');
const readline = require('node:readline');
const puppeteer = require('puppeteer');
const scrollToBottom = require('scroll-to-bottomjs');
const PDFDocument = require('pdfkit');
//const fs = require('fs');

function coverPage() {
    // Create a document
    const doc = new PDFDocument({size: 'A4'});

    doc.pipe(fs.createWriteStream('0000.pdf'));
    
    doc.image(process.env.COVER_IMAGE, {
            fit: [200, 200],
            align: 'center',
            valign: 'center'
          });

    doc
        .fontSize(25)
        .fillColor("black")
          // position text over 70 and down 150
        .text(process.env.COVER_TITLE, 70, 300)
        .fontSize(11)
        .text(process.env.COPYRIGHT, 70, 650);
    
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
