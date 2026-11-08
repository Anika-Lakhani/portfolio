# Anika Lakhani — now streaming

A personal portfolio styled like a streaming service. Plain HTML/CSS/JS, no build step, hosted on GitHub Pages.

## Editing content

Everything lives in [`data/projects.js`](data/projects.js):

- **Rows** (the genre shelves on the homepage) are listed in `rows`.
- **Projects** are entries in `projects`. Each one can have a demo `video`, a real `image` thumbnail, a `link` for the Watch Now button, the five metadata fields, and a list of `episodes`.
- Drop images and videos into `assets/` and reference them like `"assets/my-demo.mp4"`.

The About page copy is in `renderAbout()` in [`js/app.js`](js/app.js).

## Running locally

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123.

## Pages

| URL | What |
| --- | --- |
| `/` | Intro ident, then the homepage |
| `/#/title/<id>` | A project's listing |
| `/#/about` | About me |

The intro plays once per browser session; it waits for a click because browsers block sound until the visitor interacts with the page.
