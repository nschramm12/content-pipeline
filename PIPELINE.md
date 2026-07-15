# Content Pipeline

**Owner:** Sterling  
**Status:** Active (Jul 14, 2026)  
**Stack:** HTML+CSS → Playwright (chromium-headless-shell) on DO droplet  
**Output:** 1080x1080 PNG (2x retina: 2160x2160 base)

---

## Pipeline Overview

Three-step workflow:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. PLAN & WRITE                                                │
│     Sterling writes the copy and design direction               │
│     based on context (product launch, event, testimonial, etc.) │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. RENDER BACKGROUND                                           │
│     JPEG/PNG background image (optional future step)            │
│     Can be generated or static. Currently: pure HTML+CSS        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. COMPOSE & PLACE CONTENT                                     │
│     Sterling writes HTML+CSS template                           │
│     Playwright renders it to 1080x1080 PNG                      │
│     Done. No hand-editing needed.                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Rendering Engine

| Component | Choice | Why |
|-----------|--------|-----|
| Browser | Playwright 1.61.1 + chromium-headless-shell | Full CSS support (Grid, Flexbox, fonts, gradients, backdrop-filter). 262MB on disk. |
| Launcher | Bun 1.3.14 | Ships with DO droplet. |
| Args | `--single-process --disable-gpu --no-zygote --disable-extensions --disable-logging --no-sandbox` | Cuts memory overhead by ~30%. Each render exits cleanly — no lingering processes. |
| Output | PNG, 1080x1080, deviceScaleFactor=2 | Retina-ready. ~200-300KB per render. |

**Excluded:**
- Lightpanda — no screenshot/rendering capability (true headless browser, DOM only).
- Recraft — tested, backgrounds were fine but entire pipeline is HTML+CSS native now. No external AI generation.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#050510` | Deep background |
| `--bg-card` | `rgba(255,255,255,0.03)` | Card overlay |
| `--accent` | `#5BB450` | Primary green (CTA, highlights) |
| `--accent-subtle` | `rgba(91,180,80,0.15)` | Badge, hover states |
| `--accent-border` | `rgba(91,180,80,0.25)` | Outline accents |
| `--text-primary` | `#FFFFFF` | Headlines |
| `--text-secondary` | `rgba(255,255,255,0.6)` | Body copy |
| `--text-muted` | `rgba(255,255,255,0.4)` | Labels, social proof |
| `--border` | `rgba(255,255,255,0.08)` | Card borders |
| `--border-light` | `rgba(255,255,255,0.06)` | Feature card borders |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headline | Inter (Google Fonts) | 64-72px | 800 |
| Subhead | Inter | 22-24px | 400 |
| Feature title | Inter | 18px | 600 |
| Feature desc | Inter | 14px | 400 |
| Badge | Inter | 15px | 600 |
| CTA | Inter | 20px | 700 |
| Price | Inter | 40px | 800 |
| Body | Inter | 16px | 400 |

### Layout

- Canvas: 1080x1080px
- Card: 920px wide, centered, border-radius 48px
- Padding: 64px inside card
- Feature grid: 2 or 3 columns, 16-20px gap
- Elements are `content-out` — spacing adapts to what's inside, not a rigid grid.

---

## Template Library

### Instagram Posts

| Template | File | Status | Variables |
|----------|------|--------|-----------|
| Product Launch | `templates/instagram/product-launch.html` | Draft | badge, headline, subtext, features (3), cta, price, price_label, social_proof |

### Flyers

| Template | File | Status | Variables |
|----------|------|--------|-----------|
| Event Flyer | `templates/flyers/event-flyer.html` | Draft | badge, headline, date, venue, details (3), cta |

---

## How to Create a New Post

1. **Define the content.** Copy, CTA, features, social proof. Sterling writes this.
2. **Choose or create a template.** Pick from the library or write a new HTML+CSS file.
3. **Render.**

```bash
# Render locally via the workspace wrapper
node scripts/render.js templates/instagram/product-launch.html output/post.png

# Render on droplet (canonical path)
ssh root@64.227.85.42 "cat templates/product-launch.html | /root/scripts/render.sh product-launch.png"
```

---

## Refresh vs New Design

| Situation | Action |
|-----------|--------|
| Same content, new audience | Use existing template, swap copy and colors |
| Same format, new product | Use existing template, swap variables |
| New format entirely | Design new template from scratch |
| Seasonal/reskin | Update CSS variables, keep layout |

Sterling designs all templates. Nate reviews and directs.

---

## Rendering Script

Located at `scripts/render.js` in this project and `/root/scripts/` on the droplet.

```js
const { chromium } = require('playwright');
// chromium-headless-shell, single-process mode
// 18 memory optimization flags
// deviceScaleFactor: 2 for retina output
```

Optimized Chromium flags:
- `--disable-gpu` — no GPU compositing (server has no GPU)
- `--disable-dev-shm-usage` — uses /tmp instead of /dev/shm
- `--single-process` — runs everything in one process (less memory)
- `--no-zygote` — no child process pre-forking
- `--disable-extensions` — no extension overhead
- `--disable-background-networking` — no background connections

---

## Resource Limits (DO Droplet)

| Resource | Limit | Headroom |
|----------|-------|----------|
| RAM | 2GB | ~1.0GB available after render |
| Disk | 48GB | 28GB free (42% used) |
| Swap | 1GB | ~990MB used (high but stable) |
| Render concurrency | 1 | Cannot run 2+ simultaneous renders |

---

---

## Asset Library

### unDraw Illustrations (MIT)

**Location:** `assets/undraw/curated/` — 7 curated SVG illustrations  
**Full set:** [mkhairi/undraw](https://github.com/mkhairi/undraw) on GitHub (698 total)

Curated for business/marketing use: maker_launch, growth, team, launch, celebration, marketing, target.

**Usage:** Inline SVG directly into HTML templates. Set fill color via CSS to match brand palette.

### Heroicons (MIT)

**Location:** `assets/heroicons/curated/` — 17 curated 24px outline icons  
**Full set:** [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons) v2.2 (1,288 icons)

Curated: bolt, sparkles, chart-bar, rocket-launch, light-bulb, cog-6-tooth, currency-dollar, star, heart, check-badge, arrow-trending-up, clock, calendar, users, globe-alt, shield-check, arrow-right.

Replace emoji icons in feature cards with Heroicons for a professional, consistent look. To add more, copy from [heroicons.com](https://heroicons.com).

### shadcn/ui Card Patterns (MIT)

**Location:** `assets/shadcn/patterns.md`  
**Source:** [shadcn/ui Card](https://ui.shadcn.com/docs/components/base/card)

Key patterns adopted:
- Card header/content/footer semantic structure
- `--card-padding` CSS variable for consistent spacing
- Small variant for compact posts
- Edge-to-edge content via negative margins

### Creative Tim Patterns (MIT)

**Location:** `assets/creative-tim/patterns.md`  
**Source:** [Creative Tim Tailwind Components](https://www.creative-tim.com/twcomponents/component/social-media-post)

Key patterns adopted:
- Dense information hierarchy for social-optimized layouts
- Icon-only action items for compact UI

---

## How to Use Assets in Templates

### Heroicons in feature cards

```html
<div class="feature">
  <svg class="icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
  <h3>Cloud Sync</h3>
  <p>Your data, everywhere you need it.</p>
</div>
```

### unDraw illustrations as hero backgrounds

```html
<div class="hero-graphic">
  <!-- Inline SVG from assets/undraw/undraw_maker_launch.svg -->
  <svg><!-- ... --></svg>
</div>
```

---

## Roadmap

- [x] Asset library — unDraw, Heroicons, shadcn/ui patterns, Creative Tim patterns
- [ ] Design system token JSON (shared between templates)
- [ ] Variable injection via Node.js (template + data → filled HTML)
- [ ] Batch rendering (multiple posts from one template + data file)
- [ ] GitHub repo actions (render on push)
- [ ] Style guide gallery page
- [ ] Canva template import pipeline
