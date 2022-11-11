# Generate PDFs from a Docusaurus 2.0 documentation site

This depends on [`docusaurus-prince-pdf`]() to crawl the Docusaurus doc pages
and generate a list of URLs.  The list of URLs is then processed with `docusaurus-puppeteer-pdf.js` to generate PDFs from each URL, and then finally `pdfjam` is used to combine all of the pages into a single PDF.

#### Generate a list of pages (URLs)
This command will crawl the docs and list the URLs in order:
```bash
npx docusaurus-prince-pdf --list-only -u http://localhost:3000/docs/en/home --file URLs.txt
```
<details>
  <summary>Expand to see URLs.txt sample</summary>

This is the file format, although the real output is about 655 lines
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


#### scrape.js

This takes the URLs.txt generated above and creates PDF files for each URL in the file.
```bash
node scrape.js
```

#### Join the 600+ PDF files:
```bash
pdfjam --outfile joined-puppeteer.pdf 0*pdf
```
