# Style Guide

## Brand Colors

The primary palette is dark with a green accent:

- **Deep background** `#050510` — the base canvas
- **Green accent** `#5BB450` — CTAs, highlights, badges
- **White** text on dark backgrounds
- Subtle glassmorphism (backdrop-filter blur, low-opacity borders)

## Typography

All text uses **Inter** loaded from Google Fonts. No custom fonts needed for the initial templates — Inter covers weight 400 through 800.

Headlines are large (68px), bold (800), with tight letter-spacing (-0.03em). Body copy is 14-22px at weight 400.

## Layout

Cards are 920px wide with 64px padding inside a 1080x1080 canvas. Feature grids are 2-3 columns with 16px gaps. All cards have 48px border-radius and subtle glassmorphism (backdrop-filter: blur(24px)).

## Component Library

| Component | Description |
|-----------|-------------|
| Badge | Pill tag, small text, accent color |
| Feature Card | Rounded box with icon, title, description |
| Divider | Thin gradient line separating sections |
| CTA Section | Price + social proof + action button |
| Avatars | Stacked small circles with initials |

## Adding New Templates

1. Create a new `.html` file in the appropriate `templates/` subdirectory
2. Use `{{variable}}` placeholders for dynamic content
3. Follow the spacing and color tokens from `tokens.json`
4. Test render with `scripts/render.js`
