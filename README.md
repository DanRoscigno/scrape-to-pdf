# Generate PDFs from a Docusaurus 2.0 documentation site

This depends on 
[`docusaurus-prince-pdf`](https://github.com/signcl/docusaurus-prince-pdf) 
to crawl the Docusaurus doc pages and generate a list of URLs.  The list of 
URLs is then processed with `docusaurus-puppeteer-pdf.js` (which uses 
[Puppeteer](https://pptr.dev/)) to generate PDFs from each URL, and then 
finally `pdfjam` is used to combine all of the pages into a single PDF.

#### Build your Docusaurus site and serve it
It seems to be necessary to run `yarn serve` rather than `yarn start` to have `docusaurus-prince-pdf` crawl the pages.  I expect that there is a CSS class difference between development and production modes of Docusaurus.

#### Generate a list of pages (URLs)
This command will crawl the docs and list the URLs in order:
```bash
npx docusaurus-prince-pdf --list-only -u http://localhost:3000/docs/en/home --file URLs.txt
```
<details>
  <summary>Expand to see URLs.txt sample</summary>

This is the file format, although the real output for the ClickHouse English docs site is about 655 lines:
```bash
http://localhost:3000/docs/en/quick-start
http://localhost:3000/docs/en/getting-started/example-datasets/
http://localhost:3000/docs/en/tutorial
http://localhost:3000/docs/en/getting-started/example-datasets/uk-price-paid
http://localhost:3000/docs/en/getting-started/example-datasets/nyc-taxi
http://localhost:3000/docs/en/getting-started/example-datasets/cell-towers
http://localhost:3000/docs/en/getting-started/example-datasets/amplab-benchmark
http://localhost:3000/docs/en/getting-started/example-datasets/brown-benchmark
http://localhost:3000/docs/en/getting-started/example-datasets/criteo
http://localhost:3000/docs/en/getting-started/example-datasets/github-events
```

</details>


#### docusaurus-puppeteer-pdf.js

This takes the URLs.txt generated above and creates PDF files for each URL in the file.
```bash
node docusaurus-puppeteer-pdf.js
```

#### Join the 600+ PDF files
```bash
pdfjam --outfile joined-puppeteer.pdf 0*pdf
```

Note: `pdfjam` can be replaced with whatever you have that concatenates PDF files
several references suggest `ghostscript`.  I will try with this command:
```bash
gs -sDEVICE=pdfwrite \
   -dCompatibilityLevel=1.5 \
   -dPDFSETTINGS=/default \
   -dNOPAUSE \
   -dQUIET \
   -dBATCH \
   -dDetectDuplicateImages \
   -dCompressFonts=true \
   -r150 \
   -sOutputFile=joined-puppeteer.pdf \
   0*.pdf
```

Things to try:
- `-dPDFSETTINGS=/prepress` this is said to improve output
- `-dPrinted=false` this is said to generate links that work within the PDF

