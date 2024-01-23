# Generate PDFs from a Docusaurus 2.0 documentation site

This depends on 
[`docusaurus-prince-pdf`](https://github.com/signcl/docusaurus-prince-pdf) 
to crawl the Docusaurus doc pages and generate a list of URLs.  The list of 
URLs is then processed with `docusaurus-puppeteer-pdf.js` (which uses 
[Puppeteer](https://pptr.dev/)) to generate PDFs from each URL, and then 
finally `pdfjam` is used to combine all of the pages into a single PDF.

## Onetime setup

### Clone this repo

Clone this repo to your machine.

### Puppeteer

Add `puppeteer` by running this command in the repo directory
```bash
yarn add puppeteer
```

### Install Ghostscript

```bash
brew install ghostscript
```

### Install Prince

Note: Probably not needed, as the process described here only uses the docusaurus-prince-pdf package to generate the URL list, not to generate the PDF file. The process described here uses Chrome Puppeteer to generate the PDF files, and Ghostscript to generate a single PDF file.

See the [Prince](https://www.princexml.com/) site for the download. On macOS you would untar the archive and run `sudo ./install.sh`.
 
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

This takes the URLs.txt generated above and creates PDF files for each URL in the file.
```bash
node docusaurus-puppeteer-pdf.js
```

## Join the 600+ PDF files
Ghostscript:

```bash
 gs -sDEVICE=pdfwrite \
   -dCompatibilityLevel=1.5 \
   -dPDFSETTINGS=/screen \
   -dNOPAUSE \
   -dQUIET \
   -dBATCH \
   -dDetectDuplicateImages=true \
   -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true \
   -dColorImageResolution=175   -dGrayImageResolution=175   -dMonoImageResolution=175 \
   -dCompressFonts=true \
   -dSubsetFonts=true \
   -sOutputFile=joined-puppeteer-72DPI-images175DPI.pdf \
   0*.pdf
```

<details>
  <summary>Expand to see Ghostscript info</summary>

## Ghostscript info

https://gist.github.com/lkraider/f0888da30bc352f9d167dfa4f4fc8213

```
#!/bin/sh

# It seems it's very hard to set resample output quality with Ghostscript.
# So instead rely on `prepress` preset parameter to select a good /QFactor
# and override the options we don't want from there.

gs \
  -o resampled.pdf \
  -sDEVICE=pdfwrite \
  -dPDFSETTINGS=/prepress \
  `# font settings` \
  -dSubsetFonts=true \
  -dCompressFonts=true \
  `# color format` \
  -sProcessColorModel=DeviceRGB \
  -sColorConversionStrategy=sRGB \
  -sColorConversionStrategyForImages=sRGB \
  -dConvertCMYKImagesToRGB=true \
  `# image resample` \
  -dDetectDuplicateImages=true \
  -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true \
  -dColorImageResolution=150 -dGrayImageResolution=150 -dMonoImageResolution=150 \
  `# preset overrides` \
  -dDoThumbnails=false \
  -dCreateJobTicket=false \
  -dPreserveEPSInfo=false \
  -dPreserveOPIComments=false \
  -dPreserveOverprintSettings=false \
  -dUCRandBGInfo=/Remove \
  -f input.pdf

# Default settings for prepress profile:
# $ gs -v
# GPL Ghostscript 9.19 (2016-03-23)
# Copyright (C) 2016 Artifex Software, Inc.  All rights reserved.
# $ gs -q -dNODISPLAY -c ".distillersettings /prepress get {exch ==only ( ) print ===} forall quit" | sort
# /AutoRotatePages /None
# /CannotEmbedFontPolicy /Error
# /ColorACSImageDict << /ColorTransform 1 /QFactor 0.15 /Blend 1 /HSamples [1 1 1 1] /VSamples [1 1 1 1] >>
# /ColorConversionStrategy /LeaveColorUnchanged
# /ColorImageDownsampleType /Bicubic
# /ColorImageResolution 300
# /CompatibilityLevel 1.5
# /CreateJobTicket true
# /DoThumbnails true
# /EmbedAllFonts true
# /GrayACSImageDict << /ColorTransform 1 /QFactor 0.15 /Blend 1 /HSamples [1 1 1 1] /VSamples [1 1 1 1] >>
# /GrayImageDownsampleType /Bicubic
# /GrayImageResolution 300
# /MonoImageDownsampleType /Subsample
# /MonoImageResolution 1200
# /NeverEmbed []
# /PreserveEPSInfo true
# /PreserveOPIComments true
# /PreserveOverprintSettings true
# /UCRandBGInfo /Preserve
```

</details>
