# Build with Nate — Content Pipeline

An automated image generation pipeline for Instagram posts, flyers, and social graphics. Sterling designs the templates from scratch using HTML+CSS, and Playwright renders them at 1080x1080 PNG. No AI slop, no broken layouts.

## Architecture

```
User Input → Template Variables → HTML+CSS Template → Playwright/Chromium → PNG
               (Sterling writes)   (Sterling designs)  (DO droplet)       (output)
```

## Quick Start

```bash
# Render a template to PNG
./scripts/render.js path/to/template.html path/to/output.png

# Or pipe HTML directly
cat templates/instagram/product-sales.html | ./scripts/render.js > output.png
```

## Directory Structure

```
content-pipeline/
├── PIPELINE.md              # Core doc — the full pipeline
├── README.md                # This file
├── templates/               # HTML+CSS templates (Sterling designs)
│   ├── instagram/           # 1080x1080 square posts
│   └── flyers/              # Event flyers
├── scripts/                 # Render and utility scripts
│   └── render.js            # Playwright rendering wrapper
├── style-guide/             # Brand tokens, typography, colors
│   ├── tokens.json          # CSS custom properties as JSON
│   └── README.md            # Design system reference
├── output/                  # Rendered PNGs
└── .github/
    └── workflows/           # CI/CD actions (future)
```
