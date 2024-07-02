# Generate PDFs from a Docusaurus v2 or v3 documentation site

Node.js code to:
1. Generate the ordered list of URLs from documentation built with Docusaurus. This is done using code from [`docusaurus-prince-pdf`](https://github.com/signcl/docusaurus-prince-pdf)
2. Open each page with [`puppeteer`](https://pptr.dev/) and save the content (without nav or the footer) as a PDF file
3. Combine the individual PDF files using [Ghostscript](https://www.ghostscript.com/) and [`pdfcombine`](https://github.com/tdegeus/pdfcombine.git).

## Onetime setup

### Clone this repo

Clone this repo to your machine.

### Puppeteer

Add `puppeteer` and other dependencies by running this command in the repo directory
```bash
yarn install
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
npx docusaurus-prince-pdf --list-only -u http://localhost:3000/zh/docs/2.5/introduction/StarRocks_intro/ --file URLs.txt
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
2. creates the file `combine.yaml` which contains the titles of the pages and filenames. This is the input to the next step.

```bash
node docusaurus-puppeteer-pdf.js
```

> Note:
>
> If you have any square brackets (`[`, `]`) in your titles `pdfcombine` will return an error in the next command. After the previous command finishes, edit the file `combine.yaml` and replace or remove the square brackets.

## Join the individual PDF files

```
pdfcombine -y combine.yaml --title="StarRocks 2.5" -o StarRocks_2.5.pdf
```

> Note:
>
> You may see this message during the `pdfcombine` step:
>
> `GPL Ghostscript 10.03.1: Missing glyph CID=93, glyph=005d in the font IAAAAA+Menlo-Regular . The output PDF may fail with some viewers.`
>
> I have not had any complaints about the missing glyph from readers of the documents produced with this.

## Customizing the docs site for PDF

Some things do not make sense to have in the PDF, like the Feedback form at the bottom of the page. Removing the Feedback form from the PDF can be done with CSS. This snippet is added to the Docusaurus CSS file `src/css/custom.css`:

```css
/* When we generate PDF files we do not need to show the feedback widget. */
@media print {
    .feedback_Ak7m {
        display: none;
    }
}
```
