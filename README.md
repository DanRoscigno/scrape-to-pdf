npx create-docusaurus@3.1.1 website classic

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

