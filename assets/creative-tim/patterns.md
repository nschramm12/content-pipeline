# Creative Tim Social Media Patterns

**Source:** [Creative Tim Tailwind Components](https://www.creative-tim.com/twcomponents/component/social-media-post)  
**Extracted:** Jul 14, 2026

## Design approach

Creative Tim's social media post component uses:

- **Avatar + username** at top (profile context)
- **Image** as main visual
- **Action bar** (like, comment, share) below image
- **Caption** with text + hashtags

For our use case (marketing posts, not social UI clones), the relevant patterns are:

## Patterns to adopt

### 1. Dense information hierarchy
Social media posts need to communicate fast. Creative Tim components use:
- 14-16px body text (not 22px like our subtext!)
- Compact vertical spacing (8-12px between elements)
- Clear visual separation between user-generated content and branded content

### 2. Action buttons as icon-only
Like/comment/share use icons without labels — saves space and feels native. We could apply this to our feature cards (icon-only instead of icon + label in tight spaces).

## What not to adopt

These are social UI components (app clones), not marketing templates. The layout patterns don't directly translate to high-conversion Instagram posts.
