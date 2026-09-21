# engportfolio

Portfolio site for Sachi, deployed with GitHub Pages.

## How to edit

Open https://sachithakurenv.github.io/engportfolio/edit.html for the visual editor (there is no public Edit button). Make changes, click **Preview changes**, then **Download content.json**. To publish, someone with repository write access can click **Publish on GitHub**, upload the downloaded file to the `gh-pages` branch, and commit it. Without access, send the file to the repository owner. The editor covers basic text and project titles/summaries; other fields can be changed in `dist/content.json` on GitHub. Also copy published changes to `main/dist/content.json` so a future full deployment does not overwrite them.

After committing to `gh-pages`, GitHub Pages redeploys automatically. The live site updates in about a minute:

https://sachithakurenv.github.io/engportfolio/

## What not to edit

Leave `dist/index.html` and `dist/app.js` alone unless you want to change the design or behavior. Assets and attached PDFs are stored in `dist/assets` so they stay independent of Wix.

## Small easter eggs

Click the Illinois logo three times for watershed mode. Type `ILLINI` on the page for a short Illinois highlight.
