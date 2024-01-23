# Generate PDFs from a Docusaurus v2 or v3 documentation site

This depends on 
[`docusaurus-prince-pdf`](https://github.com/signcl/docusaurus-prince-pdf) 
to crawl the Docusaurus doc pages and generate a list of URLs.  The list of 
URLs is then processed with `docusaurus-puppeteer-pdf.js` (which uses 
[Puppeteer](https://pptr.dev/)) to generate PDFs from each URL, and then 
finally `pdfcombine` is used to combine all of the pages into a single PDF.

## Onetime setup

### Clone this repo

Clone this repo to your machine.

### Puppeteer

Add `puppeteer` by running this command in the repo directory
```bash
yarn add puppeteer
```

### pdfcombine

```bash
pip3 install pdfcombine
```

### Install Ghostscript

```bash
brew install ghostscript
```

## Build your Docusaurus site and serve it
It seems to be necessary to run `yarn serve` rather than `yarn start` to have `docusaurus-prince-pdf` crawl the pages.  I expect that there is a CSS class difference between development and production modes of Docusaurus.

## Generate a list of pages (URLs)
This command will crawl the docs and list the URLs in order:
```bash
npx docusaurus-prince-pdf --list-only -u http://localhost:3000/docs/cover_pages/developers/ --file URLs.txt
```
<details>
  <summary>Expand to see URLs.txt sample</summary>

This is the file format, using the StarRocks developer docs as an example:
```bash
http://localhost:3000/docs/developers/build-starrocks/Build_in_docker/
http://localhost:3000/docs/developers/build-starrocks/build_starrocks_on_ubuntu/
http://localhost:3000/docs/developers/build-starrocks/handbook/
http://localhost:3000/docs/developers/code-style-guides/protobuf-guides/
http://localhost:3000/docs/developers/code-style-guides/restful-api-standard/
http://localhost:3000/docs/developers/code-style-guides/thrift-guides/
http://localhost:3000/docs/developers/debuginfo/
http://localhost:3000/docs/developers/development-environment/IDEA/
http://localhost:3000/docs/developers/development-environment/ide-setup/
http://localhost:3000/docs/developers/trace-tools/Trace/%
```

</details>


## docusaurus-puppeteer-pdf.js

This takes the URLs.txt generated above and:
1. creates PDF files for each URL in the file
2. creates the file `combine.yaml` which contains the titles of the pages and filenames. This is the input to the next step/

```bash
node docusaurus-puppeteer-pdf.js
```

## Join the individual PDF files

```
pdfcombine -y combine.yaml
```

