# FeaTok project page

Website for **FeaTok: Feature-Loss Tokenization for Image Generation**.

## Local preview

Run `python3 -m http.server 8000` from this folder, then open http://localhost:8000.
No build step or package installation is required.

## Publishing

GitHub Pages serves the root of the `main` branch. `.nojekyll` keeps the site as static files.

Edit `index.html` for page content, `styles.css` for styling, and `samples.js` for gallery content.
The paper button links to https://arxiv.org/abs/2610.22060. The `assets/` directory contains vector figures and generated samples.

Figure containers use transparent backgrounds. When re-exporting the teaser SVG, keep its canvas and plot backgrounds transparent and match label backgrounds to the page color (`#faf9f5`).
