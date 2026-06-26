# Data Science Portfolio - GitHub Pages

Minimal, responsive portfolio site for Nicholas Brian Anya built with vanilla HTML, CSS, and JavaScript.

## Structure

Single-page site with in-page sections (Projects, Publications, Experience).

- `index.html` - The whole site (intro, photo, contacts, and all sections)
- `assets/css/styles.css` - Global styling
- `assets/js/main.js` - Renders the projects list and the last-updated date
- `assets/data/projects.json` - Project data source
- `NicholasBrianCV.pdf` - Downloadable CV linked from the page

## Add or Update Projects

Edit `assets/data/projects.json`. The single page renders each project's
`title`, `period`, and `outcome`, plus optional `tags`, `repoUrl`, and `demoUrl`.
Other fields (`problem`, `approach`, `stack`, `metric`) may be present and are
ignored by the minimal layout.

## Local Preview

From this folder:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Deploy to GitHub Pages

### Option A: User site (recommended)

1. Create repository named `<your-username>.github.io`.
2. Copy these files into the repository root.
3. Push to `main`.
4. In GitHub: `Settings -> Pages`, source should be `Deploy from a branch`, branch `main`, folder `/ (root)`.

### Option B: Project site

1. Create a normal repository (for example `ds-portfolio`).
2. Push this folder to `main`.
3. In GitHub: `Settings -> Pages`, set source to `main` and `/ (root)`.
4. Your URL becomes `https://<username>.github.io/<repo-name>/`.

## Notes

- `.nojekyll` is included to ensure static assets are served exactly as-is.
- Update `meta` descriptions and social image tags later when you finalize branding.
