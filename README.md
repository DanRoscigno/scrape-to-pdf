# Generate PDFs of Docusaurus docs

## Clone this repo

Clone this repo to your machine.

## Choose the branch that you want a PDF for

When you launch the PDF conversion environment, it will use the active branch. So, if you want a PDF for version x:

```bash
git switch branch-x
```

## Launch the conversion environment

The conversion process uses Docker Compose. Launch the environment by running the following command from the `scrape-to-pdf/PDF/` directory.

The `--wait-timeout 400` will give the services 400 seconds to get to a healthy state. This is to allow both Docusaurus and Gotenberg to become ready to handle requests. On my machine it takes about 60 seconds for Docusaurus to build the docs and start serving them.

```bash
cd scrape-to-pdf/PDF/
docker compose up --detach --wait --wait-timeout 400 --build
```

> Tip
>
> All of the `docker compose` commands must be run from the `scrape-to-pdf/PDF/` directory.

## Get the URL of the "home" page

### Check to see if Docusaurus is serving the pages

From the `PDF` directory check the logs of the `docusaurus311` service:

```bash
docker compose logs -f docusaurus311
```

When Docusaurus is ready you will see this line at the end of the log output:

```bash
docusaurus311-1  | [SUCCESS] Serving "build" directory at: http://0.0.0.0:3000/
```

Stop watching the logs with CTRL-c

### Find the initial URL

First open the docs by launching a browser to the URL at the end of the log output, which should be [http://0.0.0.0:3000/](http://0.0.0.0:3000/).

If you are not on the **Tutorial Intro** page click the `Tutorial` link in the header.

Copy the URL of the starting page of the documentation that you would like to generate a PDF for.

> The URL you will use is probably `http://0.0.0.0:3000/docs/intro/`

Save the URL.

## Open a shell in the PDF build environment

Launch a shell from the `scrape-to-pdf/PDF/` directory:

```bash
docker compose exec -ti docusaurus311 bash
```

## Crawl the docs and generate the PDFs

Run the commands:

```bash
yarn install
node generatePdf.js http://localhost:3000/docs/intro
```

## Join the individual PDF files

> Tip
>
> Change the `myDocs.pdf` in the command below to the correct version.

```bash
cd ../PDFoutput
pdftk myDocsCover.pdf 00*pdf output myDocs.pdf
```

## Finished file

The individual PDF files and the combined file will be on your local machine in `scrape-to-pdf/PDFoutput/`

> Please:
>
> In your PDF viewer open the **Table of Contents** (on a mac using Apple Preview, use the **View** menu) and verify that the table of contents matches what you expect.

## Shutdown

When you are done:
- Exit the shell in the container
- Run `docker compose down`

## Advanced details

### Check the status

> Tip
>
> If you do not have `jq` installed just run `docker compose ps`. The ouput using `jq` is easier to read, but you can get by with the more basic command.

```bash
docker compose ps --format json | jq '{Service: .Service, State: .State, Status: .Status}'
```

Expected output:

```bash
{
  "Service": "docusaurus311",
  "State": "running",
  "Status": "Up 14 minutes"
}
{
  "Service": "gotenbergAPI",
  "State": "running",
  "Status": "Up 2 hours (healthy)"
}
```

### Customizing the docs site for PDF

Gotenberg generates the PDF files without the side navigation, header, and footer as these components are not displayed when the `media` is set to `print`. In our docs it does not make sense to have the edit URLs or breadcrumbs show. These are filtered out using CSS by adding `display: none` to the classes of these objects when `@media print`.

Removing the edit URLs and breadcrumbs from the PDF can be done with CSS. This snippet is added to the Docusaurus CSS file `website/src/css/custom.css`:

```css
/* When we generate PDF files we do not need to show the edit this page link or the breadcrumbs. */
@media print {
    .theme-doc-footer-edit-meta-row {
        display: none;
    };
    .breadcrumbs {
        display: none;
    };
}
```

## Links

Node.js code to:
1. Generate the ordered list of URLs from the documentation. This is done using code from `docusaurus-prince-pdf`.
2. Convert each page to a PDF file with Gotenberg.
3. Combine the individual PDF files using Ghostscript and `pdftk-java`.


- [`docusaurus-prince-pdf`](https://github.com/signcl/docusaurus-prince-pdf)
- [`Gotenberg`](https://pptr.dev/)
- [`pdftk-java`](https://gitlab.com/pdftk-java/pdftk)
- [Ghostscript](https://www.ghostscript.com/)
