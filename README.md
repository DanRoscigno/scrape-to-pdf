
## Install a sample Docusaurus site

> Note:
>
> I am using version 3.1.1 of Docusaurus as that matches what I run in production. To upgrade beyond 3.1.1 I would need to update some of the Docusaurus packages that I have swizzled, and I do not have the time to do that.

```bash
npx create-docusaurus@3.1.1 website classic
```

## Add `docusaurus-plugin-papersaurus-flexx`

> Note:
>
> I am using `docusaurus-plugin-papersaurus-flexx` instead of the old `docusaurus-plugin-papersaurus` as I am using Docusaurus v3. [Repo](https://www.npmjs.com/package/docusaurus-plugin-papersaurus-flexx)

```
cd website
yarn add docusaurus-plugin-papersaurus-flexx
```

## Configure

Add this to `docusaurus.config.js`

> Tip
> 
> I always add `plugins: []` just above `themeConfig: []`

```js
    plugins: [
    [
      'docusaurus-plugin-papersaurus-flexx',
      {
        keepDebugHtmls: false,
        sidebarNames: ['tutorialSidebar'],
        addDownloadButton: true,
        autoBuildPdfs: true,
        ignoreDocs: ['licenses'],
        author: 'Dan the Man'
      },
    ],
  ],
```

All of the options for the plugin are documented at [npmjs](https://www.npmjs.com/package/docusaurus-plugin-papersaurus-flexx)

> Note:
>
> The author, Alberto Carrillo, has not updated the documentation at the npm site, but his fork of the project has been updated for Docusaurus 3.4.

## Build

```bash
cd website
yarn build
```

## PDFs

```bash
find build -name "*pdf"
```

You will see a list of PDF files under `build/pdfs/`. There will be a PDF for each of the pages associated with the sidebar ID specified in the config (I specified the `tutorialSidebar`), and a PDF containing all of the pages. When using the sample Docusaurus site this will be `docusaurus.pdf`:

```bash
build/pdfs/docs/tutorial---basics-deploy-your-site.pdf
build/pdfs/docs/tutorial---basics-congratulations.pdf
build/pdfs/docs/tutorial---basics.pdf
build/pdfs/docs/tutorial---basics-create-a-document.pdf
build/pdfs/docs/intro.pdf
build/pdfs/docs/docusaurus.pdf
build/pdfs/docs/tutorial---extras-translate-your-site.pdf
build/pdfs/docs/tutorial---extras-manage-docs-versions.pdf
build/pdfs/docs/tutorial---basics-markdown-features.pdf
build/pdfs/docs/tutorial---extras.pdf
build/pdfs/docs/tutorial---basics-create-a-page.pdf
build/pdfs/docs/tutorial---basics-create-a-blog-post.pdf
```

## Sample

If you would like to see a sample PDF you can follow the steps above, or you can download the PDF file in this repo.

> Note:
>
> Download the file, as if you open it in a PDF viewer you will be able to navigate through the file using the table of contents at the front of the file. The PDF rendered from GitHub does not include the links.

[Download PDF](https://raw.githubusercontent.com/DanRoscigno/scrape-to-pdf/refs/heads/main/docusaurus.pdf)

## Adapt for your Docusaurus site

You should be able to add this plugin to any Docusaurus v3 site by performing the `yarn add` step and configuring the plugin in `docusaurus.config.js`. Thsi will result in PDFs being generated every time you build your documentation if you use the configuration provided in this README. See the options at [npmjs](https://www.npmjs.com/package/docusaurus-plugin-papersaurus-flexx) to customize the process and output.

### Control when a PDF is built

By setting `autoBuildPdfs` to `false` you can control when a PDF is built with an environment variable. After setting `autoBuildPdfs` to false, PDFs will only be built when you set the environment variable `BUILD_PDF` to true and run a Docusaurus build.

