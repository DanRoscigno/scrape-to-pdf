# PDF

## Deploy Docusaurus v3
```
npx create-docusaurus@3.1.1 website classic
```

## Add the PDF plugin

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
