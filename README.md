# Sathya Sankar — Portfolio

A fast, static, single-page developer portfolio. **No build step** — plain
HTML/CSS/JS — so it deploys to Cloudflare Pages instantly and scores high on
Lighthouse out of the box.

Design generated with Claude Design, then implemented and personalized.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page markup + per-project case-study data (`window.__PROJECTS__`) |
| `styles.css` | Design tokens (colors, type, spacing) + base styles |
| `components.css` | Nav, hero, agent-fleet motif, cards, modal, sections |
| `app.js` | Theme toggle, scroll reveals, live agent motif, project modals (vanilla JS) |
| `favicon.svg` | Brand-mark favicon |
| `robots.txt`, `sitemap.xml` | SEO |

## Run locally

It's static, so any static server works:

```bash
cd portfolio
python3 -m http.server 5173
# open http://localhost:5173
```

(Or just open `index.html` in a browser — note `file://` is fine for a quick
look, but use a server to mirror production.)

## Deploy & CI/CD

Pick **one** of these (don't run both — you'd deploy twice).

### Option A — Cloudflare native Git integration (recommended)

Zero secrets, zero YAML, and it's still CI/CD off GitHub: every push to `main`
auto-deploys, and every PR gets a preview URL.

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `mrsathyasankar/portfolio`. Build settings:
   - Framework preset: **None** · Build command: *(empty)* · Output directory: **`/`**
3. Deploy, then **Custom domains → Add `sathyasankar.dev`** (DNS + SSL auto-wire).

### Option B — GitHub Actions (optional)

A ready workflow lives on disk at `.github/workflows/deploy.yml` but is **not
committed yet** — the GitHub CLI token used to create this repo lacks the
`workflow` scope, so it's listed in `.gitignore` for now. To enable it:

```bash
gh auth refresh -h github.com -s workflow   # grant the scope (opens browser)
# then remove the ".github/" line from .gitignore and:
git add .github && git commit -m "Add Pages deploy workflow" && git push
```

It deploys on push and skips gracefully until you add two repo secrets
(`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). Use this **instead of** Option
A, not alongside it.

### Option C — Direct upload (one-off)
Pages → Create → **Upload assets** → drag this folder in. Fine for a quick test;
A is better for ongoing edits.

## Status / before you go live

Already wired in:

- [x] **LinkedIn** — `linkedin.com/in/mrsathyasankar`
- [x] **YouTube** — `youtube.com/@SathyaSankar`
- [x] **GitHub** — `github.com/mrsathyasankar`
- [x] **Email address** — `contact@sathyasankar.dev` (contact button + JSON-LD)

Still to do:

- [ ] **Email routing** — set up **Cloudflare Email Routing** so
      `contact@sathyasankar.dev` → your Gmail (dashboard → your domain → Email →
      Email Routing; ~2 min). The address won't receive mail until this is done.
- [ ] **Résumé** — no CV yet. Both "Résumé" CTAs currently point to GitHub
      (hero) and LinkedIn (contact). When the CV is ready, drop `resume.pdf` in
      this folder and switch those two links back to it (search the HTML for
      "Résumé coming soon").
- [ ] **OG image** — add a 1200×630 `og.png` for rich link previews
      (`og:image` already points at `/og.png`).
- [ ] **Headshot** *(optional)* — replace the `[ headshot / brand image ]`
      placeholder in the About section.
- [ ] **Kashvar links** — repo is private; the modal/links say "coming soon".
      Update when public.

## Editing content

- **Project case studies** live in `window.__PROJECTS__` at the bottom of
  `index.html` — edit text, impact bullets, stack chips, and links there; the
  cards/modals render from that object.
- **Copy and sections** are plain HTML in `index.html`.
- **Colors/type/spacing** are CSS variables at the top of `styles.css`
  (`:root` for dark, `[data-theme="light"]` for light).
