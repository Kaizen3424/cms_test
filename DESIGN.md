---
version: alpha
name: Wise-design-analysis
description: An inspired interpretation of Wise's design language — a global money-transfer brand whose surface combines an unusually heavy near-black display sans (weight 900 at 64–126 px) with a vivid lime-green brand accent, sage-tinted surface neutrals, and rounded white cards on a pale green-tinted canvas; the whole system reads more like a Scandinavian fintech magazine than a bank.

colors:
  primary: "#9fe870"
  on-primary: "#0e0f0c"
  primary-active: "#cdffad"
  primary-neutral: "#c5edab"
  primary-pale: "#e2f6d5"
  ink: "#0e0f0c"
  ink-deep: "#163300"
  body: "#454745"
  mute: "#656765"
  canvas: "#ffffff"
  canvas-soft: "#e8ebe6"
  # Role tokens — theme-invariant. `solid` + `on-solid` are the always-dark
  # band pair (footer, dark cards, CTA bands); `scrim` is the translucent
  # overlay behind modals and drag UI. See "Dark Mode" below.
  solid: "#0e0f0c"
  on-solid: "#e8ebe6"
  scrim: "#0b0d0a"
  positive: "#2ead4b"
  positive-strong: "#22833c"
  positive-deep: "#054d28"
  warning: "#ffd11a"
  warning-deep: "#b86700"
  warning-content: "#4a3b1c"
  negative: "#d03238"
  negative-deep: "#a72027"
  negative-darkest: "#a7000d"
  negative-bg: "#320707"
  accent-orange: "#ffc091"
  accent-cyan: "#38c8ff"
  gold: "#f59e0b"

typography:
  display-mega:
    fontFamily: Wise Sans, Inter, system-ui, -apple-system, sans-serif
    fontSize: 126px
    fontWeight: 900
    lineHeight: 107.1px
  display-xxl:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 96px
    fontWeight: 900
    lineHeight: 81.6px
  display-xl:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 64px
    fontWeight: 900
    lineHeight: 54.4px
  display-lg:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 47px
    fontWeight: 400
    lineHeight: 70.5px
    letterSpacing: -0.108px
  display-md:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 40px
    fontWeight: 900
    lineHeight: 34px
  display-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 38.4px
    letterSpacing: -0.96px
  display-xs:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 31.2px
    letterSpacing: -0.48px
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 30px
  body-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  button-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.md} {spacing.xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-secondary:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.xl}"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-sage:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-green:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-feature-dark:
    backgroundColor: "{colors.solid}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  hero-band:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  hero-band-dark:
    backgroundColor: "{colors.solid}"
    textColor: "{colors.primary}"
    typography: "{typography.display-mega}"
    padding: "{spacing.3xl} {spacing.xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.3xl} {spacing.xl}"
  currency-converter-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  badge-positive:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.positive-deep}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  badge-negative:
    backgroundColor: "{colors.negative-bg}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  footer:
    backgroundColor: "{colors.solid}"
    textColor: "{colors.on-solid}"
    typography: "{typography.body-sm}"
    padding: "{spacing.3xl} {spacing.xl}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.mute}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode)."
    backgroundColor: "{colors.solid}"
    textColor: "{colors.on-solid}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-cart-drawer:
    description: "Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart)."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    item-divider: "{colors.canvas-soft}"
  ex-app-shell-row:
    description: "Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  ex-data-table-cell:
    description: "Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.md} {spacing.lg}"
    rowBorder: "{colors.canvas-soft}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as feature-card with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — feature-card shape + medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.lg}"
    typography: "{typography.body-sm}"

---


## Overview

Wise — the global money-transfer brand — wears its identity in a single signature pairing: a vivid lime-green `{colors.primary}` (`#9fe870`) used as the CTA pill and brand accent, set against a pale sage-tinted canvas `{colors.canvas-soft}` (`#e8ebe6`) that runs across the hero band, and a near-black ink `{colors.ink}` (`#0e0f0c`) with a hint of warmth from the brand's underlying olive cast. The brand reads more like a calm Scandinavian magazine than a bank — generous whitespace, large rounded cards, and an unusually heavy display sans set at weight 900 carrying every hero headline.

Display typography is the second decisive voice. The proprietary `Wise Sans` family carries hero displays at weight 900 in scales from 64 px up to 126 px on the largest hero. The brand pairs Wise Sans 900 with Inter at weight 600 for sub-displays — the contrast between the chunky proprietary face and Inter's neutrality creates a particular hierarchy: Wise Sans for the brand moment, Inter for everything else.

Cards are universally pill-rounded — `{rounded.xl}` 24 px is the brand's signature card radius. Buttons take the same 24 px pill-rectangle shape. The brand never uses sharp corners on UI elements; the visual softness is part of the friendly fintech voice.

**Key Characteristics:**
- A single lime-green CTA accent `{colors.primary}` (`#9fe870`) — the brand's universal primary action color. No second accent.
- Two-face display typography — Wise Sans (proprietary, weight 900, hero scale) + Inter (weight 600, sub-display scale). The contrast is the brand's typographic story.
- `{rounded.xl}` 24 px is the canonical card and button radius. Generous, friendly.
- Sage-tinted canvas `{colors.canvas-soft}` (`#e8ebe6`) is the brand's hero surface; white `{colors.canvas}` is reserved for cards within the sage band.
- A full semantic palette: positive green family, warning yellow family, negative red family — each documented with content / hover / active variants for in-product use.
- **Theme-aware tokens**: Light / Dark / System via one `data-theme` attribute. Dark bands (footer, dark cards, CTA bands) stay dark through the `{colors.solid}` / `{colors.on-solid}` role pair. See [Dark Mode](#dark-mode).
- Currency-converter card on the hero — the brand's signature interactive component, hosting from/to amount inputs.

## Colors

### Brand & Accent
- **Wise Green** (`{colors.primary}` — `#9fe870`): The brand's universal CTA color. Every primary button, every "Send money" pill, the brand's logo accent.
- **Wise Green Hover** (`{colors.primary-active}` — `#cdffad`): The lighter green for active state.
- **Wise Green Neutral** (`{colors.primary-neutral}` — `#c5edab`): A mid-saturation green used as a neutral active fill.
- **Wise Green Pale** (`{colors.primary-pale}` — `#e2f6d5`): The lightest green for soft surface tints / badge backgrounds.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Pure white for card interiors.
- **Canvas Soft** (`{colors.canvas-soft}` — `#e8ebe6`): The sage-tinted page background. Defining mood of the brand.

### Role tokens (theme-invariant)
Three tokens exist so a surface can stay dark regardless of the active theme — they are the stable reference for the brand's dark bands and overlays, and they never flip.
- **Solid** (`{colors.solid}` — `#0e0f0c` light / `#060906` dark): The always-dark band fill. Used by the footer, dark feature cards, CTA bands, icon chips, the batch action bar and the drag overlay's inner panel. Replaces the earlier (incorrect) use of `{colors.ink}` as a fill — `ink` is a *text* token and flips to near-white in dark mode.
- **On Solid** (`{colors.on-solid}` — `#e8ebe6`): Text, icons and hairline borders on top of `{colors.solid}`. Opacity ramps (`/85`, `/80`, `/70`, `/60`, `/15`) build the text hierarchy on dark bands.
- **Scrim** (`{colors.scrim}` — `#0b0d0a`): Near-black translucent overlay behind modals, the preview lightbox and drag-over targets. Used at `50`–`90%` opacity.

### Text
- **Ink** (`{colors.ink}` — `#0e0f0c`): Near-black with a hint of olive warmth — the brand's default text and headings color.
- **Ink Deep** (`{colors.ink-deep}` — `#163300`): A deep forest-green ink used on positive-state surfaces.
- **Body** (`{colors.body}` — `#454745`): Secondary body text.
- **Mute** (`{colors.mute}` — `#656765`): Lowest-priority text — captions, placeholder, fine print.

### Semantic
- **Positive** (`{colors.positive}` — `#2ead4b`): Success indicator.
- **Positive Strong** (`{colors.positive-strong}` — `#22833c`): Higher-emphasis success text and icons; the accessible green for text-size use on light surfaces.
- **Positive Deep** (`{colors.positive-deep}` — `#054d28`): Pressed positive state.
- **Warning** (`{colors.warning}` — `#ffd11a`): Caution indicator.
- **Warning Deep** (`{colors.warning-deep}` — `#b86700`): Pressed warning.
- **Warning Content** (`{colors.warning-content}` — `#4a3b1c`): Text on warning surfaces.
- **Negative** (`{colors.negative}` — `#d03238`): Destructive / error red.
- **Negative Deep** (`{colors.negative-deep}` — `#a72027`): Pressed destructive.
- **Negative Darkest** (`{colors.negative-darkest}` — `#a7000d`): Highest-emphasis destructive text.
- **Negative Bg** (`{colors.negative-bg}` — `#320707`): Dark maroon for destructive callout backgrounds.

### Brand Accent — Tertiary
- **Accent Orange** (`{colors.accent-orange}` — `#ffc091`): Bright peach used inside illustrative content / pricing cards.
- **Accent Cyan** (`{colors.accent-cyan}` — `#38c8ff`): Bright sky-blue used as a tertiary illustration accent.
- **Gold** (`{colors.gold}` — `#f59e0b` light / `#fbbf24` dark): Warm amber reserved for warning-adjacent highlights where `{colors.warning}` yellow is too loud. Darkened in light mode and brightened in dark mode to hold contrast.

## Typography

### Font Family
Two faces ladder the system:
1. **Wise Sans** — proprietary geometric sans with an unusually heavy weight 900 used for all hero displays. The face is the brand's typographic signature. Always at weight 900, never lighter on the marketing surface.
2. **Inter** — used for sub-displays (weight 600), all body, and form labels. Loaded with `font-feature-settings: "calt"` for contextual alternates.

### Hierarchy

Display sizes are **fluid**: each is a `clamp(min → max)` that scales with the viewport, with a size-specific line height (ratio) and negative letter spacing. Body sizes stay fixed to hold a stable measure.

| Token | Size (fluid) | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | `clamp(52px → 126px)` | 900 | 0.9 | -0.03em | Hero stencil at maximum scale. |
| `{typography.display-xxl}` | `clamp(44px → 96px)` | 900 | 0.9 | -0.03em | Sub-hero scale. |
| `{typography.display-xl}` | `clamp(40px → 64px)` | 900 | 0.92 | -0.028em | Standard hero headline. |
| `{typography.display-lg}` | `clamp(32px → 47px)` | 400 | 1.05 | -0.02em | Lighter sub-display. |
| `{typography.display-md}` | `clamp(34px → 40px)` | 900 | 0.95 | -0.022em | Section / card headlines. |
| `{typography.display-sm}` | `clamp(28px → 32px)` | 600 | 1.16 | -0.024em | Inter-rendered section headings. |
| `{typography.display-xs}` | `clamp(21px → 24px)` | 600 | 1.25 | -0.016em | Sub-section displays. |
| `{typography.body-lg}` | 20px | 400 | 30px | 0 | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Default body. |
| `{typography.body-md-strong}` | 16px | 600 | 24px | 0 | Bold inline body. |
| `{typography.body-sm}` | 14px | 400 | 20px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 600 | 20px | 0 | Bold caption / nav-link. |
| `{typography.caption}` | 12px | 400 | 16px | 0 | Fine print. |
| `{typography.button-md}` | 16px | 600 | 24px | 0 | Button label. |

### Principles
- **Weight 900 for hero, weight 600 for everything else.** The brand's display ceiling is full-black weight; everything below is semibold.
- **Wise Sans for the brand voice, Inter for utility.** Strict role separation.
- **Fluid display, fixed body.** Displays scale via `clamp()` and tighten tracking as they grow (optical typography); body and caption sizes stay fixed so paragraphs keep a stable measure.

### Note on Font Substitutes
Wise Sans is proprietary. Open-source substitutes:
- **Display** — *Inter* at weight 900 or *Manrope* at weight 800 / 900 captures the geometric heaviness. *Geist* weight 800 is a passable second choice.
- **Sub-display + body** — *Inter* is the brand's actual second face.

## Layout

### Spacing System
- **Base unit**: 4 px.
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 24 px · `{spacing.2xl}` 32 px · `{spacing.3xl}` 48 px.
- **Section padding**: bands use `{spacing.3xl}` 48 px top/bottom on desktop.
- **Card interior**: cards at `{spacing.xl}` 24 px.

### Grid & Container
- Marketing container centres at ~1200 px.
- Hero: split layout (headline left, currency-converter card right) at desktop; stacked at mobile.
- Feature grids: 2-up / 3-up at desktop.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hero stacks; converter card full-width below headline; grids 1-up. |
| Tablet | 768–1023px | Grids 2-up. |
| Desktop | ≥ 1024px | Hero split; full grids. |

#### Touch Targets
Buttons render ~48 px tall (12 vertical padding + 24 line). WCAG AAA at all widths.

#### Image Behavior
Photography is sparse; the brand prefers illustrative SVGs and product mockups inside cards. Country flag thumbnails appear inside currency rows.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default. |
| Level 1 — Hairline on Dark | 1 px solid `{colors.ink}` border, or `{colors.on-solid}` at low opacity on `{colors.solid}` bands. | Tertiary outline buttons, form inputs, dividers. |
| Level 2 — Soft Card | Implicit Level 0 white card sitting on sage canvas — the surface contrast IS the elevation. | Cards on the sage hero band. |

The brand uses surface contrast (`{colors.canvas-soft}` background vs `{colors.canvas}` cards) as the primary elevation cue.

### Shadow Scale (theme-aware)

Shadows are layered (an ambient pass plus a tighter key pass) and deepen in dark mode, where they read weaker against dark surfaces. Tailwind's built-in `shadow-*` inlines its value at build time and so can't be re-themed at runtime; these tokens are referenced at use time through the `elev-*` utilities.

| Token / Utility | Treatment | Use |
|---|---|---|
| `{shadow.e1}` / `elev-1` | 1 px ambient + 1 px key, near-flat. | Hover lift on CTAs, small raised chips. |
| `{shadow.e2}` / `elev-2` | 10 px ambient + 2 px key. | Popovers, dropdowns, floating toolbars. |
| `{shadow.e3}` / `elev-3` | 32 px ambient + 12 px key, deepest. | Modals and sheets above the `scrim`. |

### Hairline

`{colors.hairline}` is the theme-aware 1 px separator — translucent ink in light mode, translucent near-white in dark. Use it for dividers and container outlines instead of `{colors.ink}` at full strength. Under `prefers-contrast: more` it strengthens to 42% ink (48% in dark) and focuses ring width grows to 3 px.

## Motion & Materials

Motion is functional, not decorative. The system follows a "respond instantly, settle on springs" model: short durations on interaction, eased entrances, and full respect for the user's reduced-motion preference.

### Motion Tokens

| Group | Token | Value | Use |
|---|---|---|---|
| Duration | `{motion.duration-fast}` | 120ms | Presses, colour and transform on interaction. |
| Duration | `{motion.duration-base}` | 200ms | Default UI transitions, theme cross-fade. |
| Duration | `{motion.duration-slow}` | 320ms | Larger surfaces, `<details>` expand, toasts. |
| Easing | `{motion.ease-standard}` | `cubic-bezier(0.2, 0, 0, 1)` | Critically-damped workhorse. |
| Easing | `{motion.ease-out-expo}` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances that decelerate into place. |
| Easing | `{motion.ease-spring}` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Momentum / drag moments; a touch of overshoot. |

### Entrance Animations

| Utility | Definition | Use |
|---|---|---|
| `animate-fade-in` | 240ms `standard` | Generic fade of a surface. |
| `animate-menu-in` | 200ms `out-expo` | Popovers and menus (slides down 6 px). |
| `animate-scale-in` | 180ms `out-expo` | Compact reveals from 0.96 scale. |
| `animate-rise-in` | 420ms `out-expo` | Content rising 14 px into place. |
| `animate-pop-in` | 420ms `spring` | Celebratory / badge pop from 0.55 scale. |
| `animate-toast-in` | 320ms `out-expo` | Toast entry. |
| `animate-bar-in` | 340ms `spring` | Batch / action bars sliding in. |

### Reduced Motion

- A global `@media (prefers-reduced-motion: reduce)` rule clamps animation and transition durations to `0.01ms` and stops `scroll-behavior: smooth`.
- Scroll reveals are wrapped in `@media (prefers-reduced-motion: no-preference)`, so content is **visible by default** and can never get stuck hidden if the observer never runs.
- The `<details>` expand transition is disabled under reduced motion (native instant toggle).

### Material Surfaces

A floating functional layer keeps content legible beneath it via a translucent fill + backdrop blur and saturation. Both frost to an opaque `{colors.canvas}` under `prefers-reduced-transparency` and `prefers-contrast`.

| Utility | Fill | Backdrop | Use |
|---|---|---|---|
| `material` | 78% `{colors.canvas}` | `blur(20px) saturate(180%)` | Chips, popovers, small floating chrome. |
| `material-thick` | 88% `{colors.canvas}` | `blur(28px) saturate(180%)` | Nav bar, sheets, larger panels. |

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.sm}` | 8px | Inline pills, small badges. |
| `{rounded.md}` | 12px | Form inputs, smaller chrome. |
| `{rounded.lg}` | 16px | Mid-size cards. |
| `{rounded.xl}` | 24px | The brand's canonical button + card radius. |
| `{rounded.pill}` | 9999px | Status pills and full-radius accents. |
| `{rounded.full}` | 9999px | Circular icon containers. |

## Components

### Buttons

**`button-primary`** — the lime-green CTA pill.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button-md}`, padding `{spacing.md} {spacing.xl}`, shape `{rounded.xl}` 24 px.

**`button-secondary`** — the sage-tinted secondary.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, same typography / padding / shape.

**`button-tertiary`** — the white outline tertiary.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, same typography / padding / shape.

**`button-icon-circular`** — the circular icon button.
- Background `{colors.canvas}`, ink icon, shape `{rounded.full}`.

### Cards & Containers

**`card-content`** — the default white card.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`. No border, sits on sage canvas.

**`card-feature-sage`** — the sage-tinted feature card.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`.

**`card-feature-green`** — the soft-green feature card.
- Background `{colors.primary-pale}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.xl}`.

**`card-feature-dark`** — the polarity-flipped dark card with green text.
- Background `{colors.solid}`, text `{colors.primary}` (Wise green!), padding `{spacing.xl}`, shape `{rounded.xl}`. Used for promotional moments. Stays dark in both themes.

**`currency-converter-card`** — the brand's signature interactive widget.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, padding `{spacing.xl}`, shape `{rounded.xl}`. Hosts from/to amount inputs + currency selectors.

### Inputs & Forms

**`text-input`** — the canonical text input.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.ink}` border, body in `{typography.body-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.md}`.

### Navigation

**`nav-bar`** — the sticky top nav.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.xl}`.

**`nav-link`** — link items inside nav.
- Text `{colors.ink}`, set in `{typography.body-sm-strong}`.

**`footer`** — the dark footer band.
- Background `{colors.solid}`, text `{colors.on-solid}`, padding `{spacing.3xl} {spacing.xl}`. Body in `{typography.body-sm}`. Stays dark in both themes.

### Signature Components

**`hero-band`** — the sage-canvas hero band.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.xl}`. Headline in `{typography.display-mega}` (Wise Sans weight 900).

**`hero-band-dark`** — the polarity-flipped dark hero.
- Background `{colors.solid}`, text `{colors.primary}` (Wise green headline on near-black!), same padding / scale. Stays dark in both themes.

**`content-band`** — the white content band that follows hero.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.3xl} {spacing.xl}`. Section headline in `{typography.display-md}`.

**`badge-positive`** — the positive status pill.
- Background `{colors.primary-pale}`, text `{colors.positive-deep}`, body in `{typography.body-sm-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill}`.

**`badge-negative`** — the negative status pill.
- Background `{colors.negative-bg}`, text white, body in `{typography.body-sm-strong}`, padding `{spacing.xs} {spacing.md}`, shape `{rounded.pill}`.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Dark Mode

The site ships a first-class dark theme, not an inverted duplicate. Every colour is a Tailwind v4 `@theme` token in `src/styles/global.css`, so a theme swap is one set of variable overrides — no component-level colour branches.

### Mechanism

- **Switch**: a single `<html data-theme="light|dark">` attribute. `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` wires Tailwind's `dark:` variant to that attribute.
- **Control**: a three-state `ThemeToggle` in the nav — **Light / Dark / System** — persisted to `localStorage['theme']`.
- **Resolution**: an inline `is:inline` script in `src/layouts/Layout.astro` runs before paint, reads `localStorage` + `prefers-color-scheme`, and writes `dataset.theme`, `style.colorScheme` and the `<meta name="theme-color">` content. No flash of the wrong theme (FOUC).
- **System follow**: when the stored value is `system`, a `matchMedia('(prefers-color-scheme: dark)')` listener re-resolves live.
- **Single-sourcing**: utilities compile to `var(--color-*)`; only the `@theme` token block is overridden under `[data-theme="dark"]`.

### Token Overrides

Light values are the canonical palette above. Dark values:

| Token | Light | Dark | Notes |
|---|---|---|---|
| `{colors.canvas-soft}` | `#e8ebe6` | `#0d120c` | Page background — deep olive-black. |
| `{colors.canvas}` | `#ffffff` | `#1a2018` | Card / raised surface. |
| `{colors.ink}` | `#0e0f0c` | `#f2f5ee` | Primary text — flips to near-white. |
| `{colors.ink-deep}` | `#163300` | `#c9f7ad` | Ink on positive surfaces brightens. |
| `{colors.body}` | `#454745` | `#b9c0b2` | Secondary text. |
| `{colors.mute}` | `#656765` | `#949c8c` | Tertiary text. |
| `{colors.primary}` | `#9fe870` | `#9fe870` | Constant — the lime accent. |
| `{colors.primary-active}` | `#cdffad` | `#bff59a` | |
| `{colors.primary-neutral}` | `#c5edab` | `#7fb768` | |
| `{colors.primary-pale}` | `#e2f6d5` | `#21331b` | Soft green surface darkens. |
| `{colors.on-primary}` | `#0e0f0c` | `#0e0f0c` | Constant ink on lime. |
| `{colors.positive}` | `#2ead4b` | `#5fd67a` | Brightened for dark. |
| `{colors.positive-strong}` | `#22833c` | `#8ce89a` | |
| `{colors.positive-deep}` | `#054d28` | `#b7f0c0` | |
| `{colors.warning-deep}` | `#b86700` | `#e0a24a` | |
| `{colors.warning-content}` | `#4a3b1c` | `#f2d9a8` | |
| `{colors.negative}` | `#d03238` | `#ff6b70` | |
| `{colors.negative-deep}` | `#a72027` | `#ff8a8e` | |
| `{colors.negative-darkest}` | `#a7000d` | `#ff9a9d` | |
| `{colors.gold}` | `#f59e0b` | `#fbbf24` | |
| `{colors.solid}` | `#0e0f0c` | `#060906` | Dark bands stay dark. |
| `{colors.on-solid}` | `#e8ebe6` | `#e8ebe6` | Constant. |
| `{colors.scrim}` | `#0b0d0a` | `#0b0d0a` | Constant. |

Untouched, identical in both themes: `{colors.warning}` `#ffd11a`, `{colors.negative-bg}` `#320707`, `{colors.accent-orange}` `#ffc091`, `{colors.accent-cyan}` `#38c8ff`.

### Decisions

- **Dark bands stay dark.** The footer, dark feature cards, CTA bands and icon chips keep their near-black `{colors.solid}` fill in both themes; only `{colors.solid}` deepens slightly (`#0e0f0c` → `#060906`) so they separate from the dark page (`{colors.canvas-soft}` `#0d120c`) instead of inverting to light.
- **`ink` is text-only.** The original system overloaded `{colors.ink}` as both a text colour and a dark-band fill. In dark mode those conflict — text must go light, bands must stay dark — which is why `{colors.solid}` / `{colors.on-solid}` / `{colors.scrim}` were introduced.
- **PDF page rasters are untouched.** Thumbnails and previews render the user's actual document and are never theme-tinted.
- **Contrast measured.** Every dark pair above clears WCAG AA: body and heading text ≥ 4.5:1, large display text ≥ 3:1.

### Adding a colour

Add it once to the `@theme` block and, if it flips, once to the `[data-theme="dark"]` block. Never branch colours inside components — use a token (or a role token) so both themes stay in sync.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` Wise green for every primary CTA. The lime-green pill IS the brand's conversion signature.
- Set hero headlines in `{typography.display-mega}` / `{typography.display-xl}` Wise Sans weight 900. Never lighter.
- Use `{rounded.xl}` 24 px for buttons and cards. The generous radius is the brand's friendliness signature.
- Cycle page surfaces in `{colors.canvas-soft}` sage canvas → `{colors.canvas}` white cards. Surface contrast carries elevation.
- Use the full semantic palette (positive / warning / negative) for in-product status — never repurpose Wise green as success indicator since it IS the brand CTA.
- Use `{colors.solid}` for anything that must stay dark (footer, dark cards, overlays' inner panel) and `{colors.scrim}` for translucent overlays — both are theme-invariant.

### Don't
- Don't introduce a second brand accent. Wise green is the sole identity colour.
- Don't render the hero in weight 700 or lighter. The brand's display weight is 900.
- Don't render CTAs as sharp rectangles. The 24 px pill geometry is non-negotiable.
- Don't pair the green CTA with a green background. The brand always sits Wise green on neutral surfaces (sage / white / ink).
- Don't replace Wise Sans with a generic geometric sans for hero typography — the proprietary face IS the brand's voice.
- Don't use `{colors.ink}` as a fill for dark bands or overlays — it flips to near-white in dark mode. Use `{colors.solid}` for dark surfaces and `{colors.scrim}` for overlays.
- Don't hard-code hex values in components. Every colour goes through a token so the dark override stays the single source of truth.
