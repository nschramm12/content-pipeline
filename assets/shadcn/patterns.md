# shadcn/ui Card Design Patterns

**Source:** [shadcn/ui Card Component](https://ui.shadcn.com/docs/components/base/card)  
**Extracted:** Jul 14, 2026  
**License:** MIT

## Card Structure

```
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

## Key patterns we can use

### 1. Sectioned layout with header/content/footer

shadcn cards separate content into three zones: header (title + description + optional action), content (main body), footer (actions). Our templates already do this implicitly — we should formalize it.

### 2. `--card-spacing` CSS variable

shadcn uses a CSS variable for card padding that can be overridden per-instance. Rather than hardcoding 64px everywhere, we could use `--card-padding` for consistency.

### 3. Small size variant

A smaller card with tighter spacing. Good for simpler posts where the content doesn't need as much breathing room.

### 4. Edge-to-edge content via negative margins

Content that spans the full card width (like images) uses negative margins to break out of the padding — `-mx-(--card-spacing)`. Good pattern for hero images or full-bleed backgrounds.

## Layout hierarchy (from examples)

- Title: large, bold, short
- Description: smaller, muted, one line
- Action: secondary — not the primary CTA
- Footer: where CTAs live

## What to adopt

- [ ] `--card-padding` CSS variable for consistent spacing
- [ ] CardHeader/CardContent/CardFooter as semantic comments in HTML templates
- [ ] Small variant for compact posts
