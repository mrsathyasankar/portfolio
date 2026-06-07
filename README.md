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

### Option A — GitHub Actions (this repo's default)

A workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
deploys to Cloudflare Pages on every push to `main` (PRs get preview deploys).
One-time setup — repo → **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` — token with **Cloudflare Pages: Edit** permission
  (Cloudflare → My Profile → API Tokens → Create Token)
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare dashboard → right sidebar → Account ID

Until those secrets exist the workflow stays green and just skips the deploy
(so the repo never shows a red run). After the first deploy, go to the Pages
project → **Custom domains → Add `sathyasankar.dev`**.

### Option B — Cloudflare native Git integration (zero-config)

No secrets, no YAML. Cloudflare dashboard → **Workers & Pages → Create → Pages →
Connect to Git** → select the repo. Build settings:
- Framework preset: **None** · Build command: *(empty)* · Output directory: **`/`**

Then **Custom domains → Add `sathyasankar.dev`**. If you choose this,
delete `.github/workflows/deploy.yml`.

### Option C — Direct upload (one-off)
Pages → Create → **Upload assets** → drag this folder in. Fine for a quick test;
A or B are better for ongoing edits.

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
