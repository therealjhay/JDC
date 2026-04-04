# UI/UX Overhaul Prompt — Dropshipping Watch Store (Web + Mobile)

> **Scope:** Complete visual and interaction redesign of a dropshipping watch store with WhatsApp ordering. This prompt covers the customer-facing storefront and the admin dashboard. Build mobile-first. Every decision serves conversion.

---

## 1. Design Identity

### Brand Direction
This is a **premium-but-accessible** watch store — not a grey-market dumper, not a luxury boutique. Think: confident, editorial, tactile. Customers trust you because the design earns it.

**Aesthetic target:** Dark luxury meets street-ready. Think deep charcoal or near-black backgrounds, warm gold or champagne accents, crisp white product photography. Typography should feel like a watch magazine, not a SaaS dashboard.

**What to avoid:**
- Generic e-commerce layouts (white backgrounds, blue links, grey cards)
- Purple gradients, Inter/Roboto fonts, rounded-corner-everything
- Any design that could belong to 10 other stores

### Typography
- **Display / headings:** A high-contrast serif (e.g., Playfair Display, Cormorant Garamond, or DM Serif Display) for hero text and product names
- **Body / UI:** A clean geometric or humanist sans (e.g., DM Sans, Syne, or Outfit) — never Arial/Inter
- **Accent / labels:** Uppercase tracked sans for tags, badges, and category labels

### Color System (CSS Variables)
```css
--color-bg:         #0f0f0f;   /* near-black canvas */
--color-surface:    #1a1a1a;   /* card and panel backgrounds */
--color-border:     #2e2e2e;   /* subtle separators */
--color-accent:     #c9a96e;   /* warm gold — primary CTA */
--color-accent-dim: #8a6e42;   /* hover/pressed state */
--color-text-hi:    #f5f5f0;   /* primary text */
--color-text-mid:   #a0998e;   /* secondary/meta text */
--color-text-lo:    #5a5248;   /* placeholders, disabled */
--color-whatsapp:   #25D366;   /* WhatsApp green — never alter */
--color-danger:     #e05c5c;   /* out-of-stock, errors */
```

Override these for a light mode if needed, but dark is the primary experience.

---

## 2. Layout System

### Grid
- **Mobile:** Single column, 16px gutters, full-bleed images
- **Tablet:** 2-column product grid, 24px gutters
- **Desktop:** 3–4 column product grid, sidebar filters (240px), 32px gutters

### Spacing Scale
Use an 8px base unit: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`. Nothing off-grid.

### Border Radius
- Cards: `8px`
- Buttons: `6px` (not pill-shaped — this is a watch store, not a fintech app)
- Images: `4px`
- Modals / sheets: `16px` top corners only on mobile

---

## 3. Component Library

Define and reuse these components consistently across all pages.

### 3.1 Product Card
```
┌────────────────────────┐
│  [Product Image]       │  ← 4:3 ratio, lazy-loaded, object-fit: cover
│  ─────────────────     │
│  BRAND NAME            │  ← uppercase, tracked, --color-text-mid, 11px
│  Product Name          │  ← serif font, --color-text-hi, 16px
│  ₦85,000               │  ← bold, --color-accent, 18px
│  ● In Stock            │  ← green dot + label OR "Out of Stock" red
│  [Order on WhatsApp]   │  ← full-width, --color-whatsapp bg, 14px
└────────────────────────┘
```
**Hover state (desktop):** Subtle card lift (`transform: translateY(-4px)`), image zoom to 105%, WhatsApp button slides up from bottom of card.

**Tap state (mobile):** Immediate visual feedback — card dims to 85% opacity for 120ms.

### 3.2 Primary Button
```
Background: --color-accent
Text: --color-bg (dark)
Height: 48px (mobile), 44px (desktop)
Font: uppercase, tracked, 13px, semibold
```

### 3.3 WhatsApp Button
```
Background: --color-whatsapp (#25D366)
Icon: WhatsApp SVG logo (left-aligned)
Text: "Order on WhatsApp" or "Chat with Us"
Height: 52px on mobile (thumb tap target)
Border-radius: 6px
```
Never reduce this button's size. It is the primary revenue action.

### 3.4 Filter Pill
```
Inactive: border 1px --color-border, bg transparent, text --color-text-mid
Active:   bg --color-accent, text --color-bg, border none
```

### 3.5 Badge / Tag
```
IN STOCK:     small green dot + "In Stock" — --color-text-mid
OUT OF STOCK: red badge, grey out card, disable CTA
NEW:          --color-accent bg, "NEW" uppercase label on card corner
```

### 3.6 Bottom Sheet (Mobile)
Used for: filter panel, variant selection, image gallery expand. Slides up from bottom, 90% screen height max, drag handle at top, backdrop blur behind.

---

## 4. Page-by-Page Redesign Spec

### 4.1 Home Page

**Above the fold (Hero)**

Full-bleed background: either a cinematic watch macro photo or a dark gradient with a subtle watch outline. Do not use a generic slider carousel.

```
┌─────────────────────────────────────┐
│  [LOGO]              [☰] [Search]   │  ← mobile header, 56px tall
├─────────────────────────────────────┤
│                                     │
│   Premium Watches                   │  ← display serif, 40px, --color-text-hi
│   Delivered Fast                    │
│                                     │
│   Original watches · Nationwide     │  ← 16px, --color-text-mid
│   delivery · Cash on delivery       │
│                                     │
│   [Browse Watches]  [WhatsApp Us]   │  ← primary + ghost button
│                                     │
└─────────────────────────────────────┘
```

**Section: Featured Products**
- Header: "Featured Watches" — left-aligned, no center-aligning headings
- Horizontal scroll row on mobile (snap scrolling, show 1.3 cards to signal more)
- 2-column grid on tablet, 4-column on desktop
- Max 8 cards in this section

**Section: Shop by Category**
- Horizontal scroll pills on mobile: `Casio · Seiko · Fossil · Rolex Homage · Smartwatches`
- 3-column icon grid on desktop
- Tapping a category goes directly to filtered Products page

**Section: Trust Bar**
One horizontal row, no icons unless custom-designed. Four items:
1. Nationwide Delivery
2. Original Products
3. WhatsApp Support
4. Easy Returns

Style: thin top/bottom borders, items separated by vertical dividers, text only, 14px, --color-text-mid.

**No footer on mobile home.** Footer exists only on desktop and inner pages.

---

### 4.2 Products / Catalog Page

**Mobile layout:**
```
┌─────────────────────────────────┐
│ [← Back]   Watches    [Filter▼] │
│ [Search bar                   ] │
│ 48 results   Sort: Newest ▼     │
├─────────────────────────────────┤
│ [Card]  [Card]                  │
│ [Card]  [Card]                  │
│ ...                             │
└─────────────────────────────────┘
```

**Desktop layout:**
```
┌──────────┬──────────────────────────────┐
│ FILTERS  │  [Search]     Sort: Newest ▼ │
│ ──────── │  48 results                  │
│ Brand    │  ┌──────┐┌──────┐┌──────┐   │
│ ☐ Casio  │  │ Card ││ Card ││ Card │   │
│ ☐ Seiko  │  └──────┘└──────┘└──────┘   │
│ Price    │  ...                         │
│ ₦0—500k  │                             │
│ Category │                             │
│ Gender   │                             │
│ Color    │                             │
│ In Stock │                             │
└──────────┴──────────────────────────────┘
```

**Filter behavior:**
- Filters apply instantly (no "Apply" button needed — debounced 300ms)
- Active filter count shown on mobile filter button: `Filter (3)`
- Filter panel on mobile = bottom sheet (see Component 3.6)
- "Clear all" link appears when any filter is active

**Pagination:** Infinite scroll with a "Load more" sentinel. Load 20 products per page. Show a skeleton loader (animated shimmer) while fetching — never a spinner overlay.

---

### 4.3 Product Detail Page

This page must close the sale. Every element exists to reduce hesitation.

**Mobile layout (top to bottom):**

1. **Image Gallery** — full-width, swipeable, aspect ratio 1:1. Dot indicators below. Tap to open fullscreen. Images ordered: Front → Side → Back → On-wrist.

2. **Product Header block:**
   ```
   CASIO                         ← brand, uppercase, 11px, --color-text-mid
   G-Shock GA-2100               ← product name, serif 24px, --color-text-hi
   ₦85,000                       ← price, bold 28px, --color-accent
   ● In Stock (12 left)          ← stock status
   ★★★★☆  (24 reviews)          ← optional, if reviews exist
   ```

3. **Variant Selector:**
   - Color: visual swatches (16px circles, gold border on selected)
   - Strap: pill buttons ("Rubber" / "Steel" / "Leather")
   - Size: pill buttons if applicable
   - When variant changes: price, stock, and hero image all update with a 150ms crossfade

4. **Quantity Selector:**
   ```
   [ − ]  1  [ + ]
   ```
   Min 1, max = stock count. Inline, no modal.

5. **Primary CTA:**
   ```
   [  WhatsApp Logo  Order on WhatsApp  ]   ← full width, 56px, --color-whatsapp
   ```

6. **Secondary action:**
   ```
   [  ♡ Save for later  ]   ← ghost button, --color-border
   ```

7. **Product Description** — collapsible on mobile ("Read more"), always expanded on desktop.

8. **Specifications table** (if available):
   | Movement | Quartz |
   | Material | Resin Case |
   | Water Resistance | 200m |
   | Warranty | 1 Year |

9. **Related Products** — horizontal scroll row, same card component as catalog.

**Sticky footer (mobile only):**
```
┌─────────────────────────────────────┐
│ ₦85,000   [Order on WhatsApp  →]   │  ← 64px tall, always visible
└─────────────────────────────────────┘
```
This sticky footer appears after the user scrolls past the main CTA. It disappears when the main CTA is in view. Price updates when variants change.

**Desktop:** No sticky footer. The CTA block on the right column is sticky (`position: sticky; top: 24px`).

---

### 4.4 WhatsApp Order Flow

**Triggered by:** Any "Order on WhatsApp" button.

**Message auto-generated — format:**
```
Hello! I'd like to order:

🕐 *Product:* Casio G-Shock GA-2100
🎨 *Color:* Black
⌚ *Strap:* Rubber
💰 *Price:* ₦85,000
🔢 *Quantity:* 1

Please confirm availability. Thank you!
```

**Implementation:**
```
https://wa.me/[PHONE_NUMBER]?text=[URL_ENCODED_MESSAGE]
```

Open in new tab on desktop. On mobile, open WhatsApp directly (`window.location.href`).

**No intermediate modal, no confirmation screen.** Direct redirect. Speed is conversion.

---

### 4.5 Search Experience

**Search bar:** Full-width on mobile. Center-width (480px max) on desktop.

**Behavior:**
- Debounce 250ms after keystroke
- Show inline dropdown suggestions: up to 5 products + 3 brand matches
- Suggestion rows: thumbnail (32px) + product name + price
- Press Enter or tap result → navigate

**Results page:** Identical layout to Products page, with heading: `Results for "casio"` — 14px, --color-text-mid, result count beside it.

**Empty state:**
```
No results for "xyz"
Try: Casio · G-Shock · Seiko
[Browse All Watches]
```

---

### 4.6 Admin Dashboard

The admin is one person managing hundreds of SKUs. Design for **speed and scanability**, not beauty. Light mode is appropriate here (high-contrast, information-dense).

**Color shift for admin:** White background (#ffffff), dark text (#111), accent stays --color-accent. Remove all dark theme variables.

**Dashboard Home:**
```
┌────────────────────────────────────────────────────┐
│ 📦 Total Products: 342   🎨 Variants: 1,204        │
│ 📋 Orders Today: 8       ⚠ Low Stock: 14           │
├────────────────────────────────────────────────────┤
│ RECENT ORDERS                        [View All →]  │
│ ──────────────────────────────────────────────────  │
│ Tunde A.  · Casio GA-2100  · Pending  · 2h ago     │
│ Amaka O.  · Seiko SRPD51   · Shipped  · 5h ago     │
│ ...                                                 │
├────────────────────────────────────────────────────┤
│ LOW STOCK ALERTS                     [Manage →]    │
│ G-Shock DW-5600 (Black) — 2 left                   │
│ Seiko 5 SNKL23 — 1 left                            │
└────────────────────────────────────────────────────┘
```

**Products Management:**
- Search bar at top
- Table view (not card grid): Name | Brand | Variants | Stock | Price | Actions
- Inline status toggles (Active / Draft)
- Row actions: Edit · Variants · Images · Delete
- "Add Product" button: top-right, primary style

**Add / Edit Product Form:**
- Single-column on mobile, two-column on desktop
- Fields: Name · Brand · Category · Description · Base Price
- Autosave draft every 30s
- Save button: always visible (sticky footer on mobile)

**Variant Management:**
- Accessed from product row → "Variants"
- Table: Color · Strap · Size · SKU · Price · Stock · Actions
- Inline editable cells for Price and Stock (click to edit, Enter to save)
- "Add Variant" opens a slide-over panel, not a page navigation

**Image Management:**
- Grid of existing images with delete (×) overlay on hover/long-press
- Drag-and-drop reorder
- Upload: dropzone + file picker, multiple files allowed, max 5MB per image
- Image order: Front first (marked with a ★)

**Orders Management:**
- Filterable by status: All · Pending · Confirmed · Shipped · Delivered · Cancelled
- Each row: Customer · Phone · Product · Status dropdown · Date
- Status dropdown is inline — no modal needed for status changes
- "Contact" button opens WhatsApp with customer's number pre-filled

---

## 5. Motion & Interaction Principles

**Rule:** Motion should communicate state change, not decorate.

| Trigger | Animation | Duration |
|---|---|---|
| Page load | Staggered fade-in of cards (50ms delay each) | 300ms |
| Card hover | translateY(-4px) + shadow grow | 200ms ease-out |
| Variant change | Image crossfade | 150ms |
| Filter apply | Products grid fade/reflow | 200ms |
| Bottom sheet open | Slide up from bottom | 280ms cubic-bezier(0.32, 0.72, 0, 1) |
| WhatsApp button tap | Scale to 0.96 → release | 120ms |
| Skeleton loader | Shimmer sweep (CSS keyframes) | 1.4s loop |

No parallax. No auto-playing anything. No attention-seeking animations on idle state.

---

## 6. Performance Requirements

- **LCP (Largest Contentful Paint):** < 2.5s on mobile 4G
- **Images:** WebP format, lazy-loaded (all below fold), explicit `width` and `height` to prevent layout shift
- **Product grid:** Virtualize if count > 100 (only render visible rows)
- **Fonts:** Load via `font-display: swap`, subset to Latin + ₦ symbol
- **Bundle:** Code-split admin dashboard from storefront — no admin JS on customer pages

---

## 7. Error & Edge State Design

| State | UI Behavior |
|---|---|
| Out of stock | Card greyed (60% opacity), badge "Out of Stock", CTA disabled and labelled "Currently Unavailable" |
| Image load fail | Placeholder: dark grey box with watch icon centered |
| Network error | Toast notification bottom of screen: "Connection issue — please retry" with retry button |
| Upload fail (admin) | Inline error below dropzone, specific message (size / format / network) |
| Empty catalog | Friendly empty state with search suggestion and WhatsApp CTA |
| Search no results | Suggested categories + browse all link |

---

## 8. Accessibility Baseline

- All interactive elements: minimum 44×44px tap target
- Color contrast: minimum 4.5:1 for body text, 3:1 for large text
- Focus states: visible outline on all keyboard-focusable elements (2px solid --color-accent)
- Images: descriptive `alt` text required
- Form labels: always visible (no placeholder-as-label)
- WhatsApp links: `aria-label="Order [Product Name] on WhatsApp"`

---

## 9. Mobile Navigation — Final Spec

**Bottom tab bar (customer-facing, always visible):**
```
┌──────┬──────┬──────┬──────┬──────┐
│  🏠  │  🔍  │  ≡   │  📋  │  💬  │
│ Home │Search│ Cat. │Orders│  WA  │
└──────┴──────┴──────┴──────┴──────┘
```
Height: 60px + safe-area-inset-bottom. Active tab: --color-accent icon + label. Inactive: --color-text-lo.

**Top bar (mobile):**
- Left: Logo (text or wordmark SVG, max 120px wide)
- Right: Search icon + Menu icon (hamburger opens full-screen overlay nav as fallback)
- Height: 56px, bg --color-surface, bottom border 1px --color-border

---

## 10. Implementation Priority (MVP Order)

Build in this sequence. Do not skip ahead.

1. **Design tokens + component library** (buttons, cards, typography, colors)
2. **Home page** — hero, featured products, trust bar
3. **Products page** — grid + filters
4. **Product Detail page** — gallery, variants, sticky WhatsApp CTA
5. **WhatsApp redirect logic** — auto-message generation
6. **Search** — bar + results page
7. **Admin: Products + Variants + Images**
8. **Admin: Orders management**
9. **Admin: Dashboard home**
10. **Performance pass** — lazy loading, image optimization, code splitting

---

## 11. What This Is Not

To maintain coherence, explicitly avoid:
- Checkout/cart flow (WhatsApp is the checkout)
- User accounts / login for customers
- Reviews system (can add later)
- Live chat widget (WhatsApp is the chat)
- Animations that run on scroll (performance risk on low-end phones)
- Any design pattern copied from Shopify, WooCommerce, or AliExpress

---

*End of overhaul prompt. Every screen, component, and interaction above should be treated as a design contract — implement it precisely, then iterate based on real user behavior.*
