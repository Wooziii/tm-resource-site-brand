# tm-resource-site-brand

Static site for the Tencent Cloud Architect Alliance resource portal.

## Local preview

Run a static server from the project root:

```powershell
py -3 -m http.server 4174
```

Then open `http://127.0.0.1:4174/index.html`.

## Deploy

This repository includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.
After pushing to GitHub, enable Pages for the repository and the workflow will publish the site automatically.

