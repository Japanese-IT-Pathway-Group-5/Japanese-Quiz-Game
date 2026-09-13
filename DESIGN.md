# Design System & Styling Guide

This project follows a **Tsukimi (Moon Viewing / Golden Moon & Celestial Night)** Japanese aesthetic inspired by **Kin-paku (Gold leaf calligraphy)**, **Urushi lacquer red accents**, and **Midnight celestial starfields**, paired with modern responsive UX.

---

## 1. Typography & Fonts

We use dedicated font stacks loaded in `src/app.html`:

| Role                            | Font Family                                           | CSS Variable           | Utility Class    |
| :------------------------------ | :---------------------------------------------------- | :--------------------- | :--------------- |
| **Japanese Brush Calligraphy**  | _Yuji Boku_, _Kaisei Tokumin_, _Zen Old Mincho_       | `var(--font-brush)`    | `.font-brush`    |
| **Japanese Body & Headings**    | _Kaisei Tokumin_, _Zen Old Mincho_, _Shippori Mincho_ | `var(--font-japanese)` | `.font-japanese` |
| **Display Titles (Western)**    | _Cinzel_, _Kaisei Tokumin_, Georgia, serif            | `var(--font-display)`  | `.font-display`  |
| **English / Latin Serif**       | _Lora_, Georgia, serif                                | `var(--font-serif)`    | `.font-serif`    |
| **Monospace / Counters / Tags** | _IBM Plex Mono_, monospace                            | `var(--font-mono)`     | `.font-mono`     |

---

## 2. Color Palette & Themes

All colors are controlled via CSS custom properties in [`src/app.css`](file:///src/app.css) and automatically adapt to light and dark themes.

### Tokens Reference

| Variable             | Light Theme (Daylight Parchment) | Dark Theme (Celestial Midnight) | Purpose                             |
| :------------------- | :------------------------------- | :------------------------------ | :---------------------------------- |
| `--theme-background` | `#F7F3E8` (Warm Parchment)       | `#080C14` (Celestial Midnight)  | Page background & starry sky        |
| `--theme-paper`      | `#EDE7D5` (Elevated Silk Sheet)  | `#111726` (Midnight Surface)    | Secondary surfaces / nested cards   |
| `--theme-card`       | `#FFFFFF`                        | `#141B2D` (Deep Night Card)     | Elevated container cards            |
| `--theme-ink`        | `#0F1422` (Deep Celestial Ink)   | `#F7F3E8` (Luminous Lunar Mist) | High-contrast text & borders        |
| `--theme-primary`    | `#D62229` (Urushi Lacquer Red)   | `#E5222B` (Vibrant Crimson)     | Primary CTA actions & branding      |
| `--theme-secondary`  | `#C9971A` (Antique Gold)         | `#FFC72C` (Golden Arches Gold)  | Secondary buttons & badges          |
| `--theme-gold`       | `#D4AF37`                        | `#FFDF79` (Luminous Moon Gold)  | Gold calligraphy & special badges   |
| `--theme-success`    | `#15803D` (Forest Green)         | `#22C55E` (Emerald Green)       | Correct answers & positive feedback |
| `--theme-error`      | `#D62229` (Vermilion)            | `#EF4444` (Ruby)                | Errors & wrong answers              |
| `--theme-text-main`  | `#0F1422`                        | `#F7F3E8`                       | Primary body text                   |
| `--theme-text-muted` | `#5C6273`                        | `#9AA2B6`                       | Captions, hints & subtitles         |
| `--theme-border`     | `rgba(15, 20, 34, 0.15)`         | `rgba(229, 184, 66, 0.2)`       | Standard card & component borders   |

---

## 3. Reusable UI Components (`$lib/components/ui`)

Import standard components directly into your Svelte routes:

```svelte
<script lang="ts">
	import { Button, Card, Badge, ThemeToggle } from '$lib/components/ui';
</script>
```

### `<Button>`

Supports `primary`, `secondary`, `outline`, `ghost` variants and link mode (`href`):

```svelte
<!-- Action Button -->
<Button type="submit" variant="primary" size="lg" fullWidth>Submit Answer</Button>

<!-- Link Button -->
<Button href="/leaderboard" variant="outline" size="md">View Rankings</Button>
```

### `<Card>`

Provides consistent shadows, borders, and responsive padding:

```svelte
<!-- Default elevated card -->
<Card variant="default">
	<h2>Card Title</h2>
</Card>

<!-- Paper textured nested card -->
<Card variant="paper">
	<p>Highlighted note or score block</p>
</Card>
```

### `<Badge>`

Supports Japanese Hanko stamp-style badges:

```svelte
<Badge variant="stamp">LEVEL N4</Badge>
<Badge variant="gold">SCORE: 100</Badge>
<Badge variant="blue">CREDITS</Badge>
<Badge variant="green">CORRECT</Badge>
```

---

## 4. Special CSS Utilities

- **`.paper-grain`**: Adds subtle traditional paper texture across backgrounds.
- **`.border-double-ink`**: Traditional Japanese double-line divider rule.
- **`.custom-scrollbar`**: Sleek sumi-ink styled scrollbars.
- **`.page-shell`**: Responsive centered container with proper mobile viewport padding.

---

## 5. Mobile & Accessibility Guidelines

1. **No horizontal scrollbars**: Use `width: min(100%, <max-width>)` for cards and content.
2. **Touch-friendly targets**: All interactive buttons and options should be at least `44px` in height.
3. **Contrast**: Always pair `var(--theme-text-main)` or `var(--theme-text-muted)` on `var(--theme-card)` or `var(--theme-background)`.
