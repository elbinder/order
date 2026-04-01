[README.md](https://github.com/user-attachments/files/26201988/README.md)
# Ronny's Pizza — Online Ordering Prototype v10

**"Makes life better"** — Tbilisi's first American pizza since 2009.

This is the interactive prototype for Ronny's Pizza's direct-to-customer ordering experience. It's designed to replace Wolt dependency with a zero-friction web experience that customers can use from any device, no app download required.

🔗 **Live preview:** (https://pizzamvp.netlify.app/)

---

## What This Is

A mobile-first ordering prototype built in React covering the full customer journey:

1. **Address gate** — Enter your area, find your nearest Ronny's
2. **Menu** — 13 pizzas with badges, taglines, and real pricing
3. **Pizza builder** — Visual topping grid, size-dependent pricing, tap-to-cycle toppings
4. **Half & Half builder** — Pick two pizzas, customize each side (Medium + XL only)
5. **Super Sticks builder** — Mozzarella (up to 3x) + seasoning customizer
6. **Cart** — Aggregated items, kitchen-clear ticket with red variation pills
7. **Checkout** — Delivery/pickup toggle, phone validation, Georgian payment methods
8. **Order confirmation** — Step-by-step tracker with SMS preview
9. **Reorder** — Last order saved to localStorage, one-tap reorder on return

## Menu & Pricing

All 13 pizzas with correct S/M/XL pricing from the Ronny's Menu Map:

| Pizza | Tier | Small (20cm) | Medium (30cm) | XL (45cm) |
|-------|------|-------------|---------------|-----------|
| Classic Cheese | House | 9.50 ₾ | 20.70 ₾ | 39.80 ₾ |
| Papa Ronny | Standard | 11.30 ₾ | 24.50 ₾ | 45.90 ₾ |
| Hot Rod | Standard | 12.70 ₾ | 27.60 ₾ | 50.80 ₾ |
| Wild West | Standard | 12.70 ₾ | 27.60 ₾ | 50.80 ₾ |
| Hula | Standard | 13.10 ₾ | 28.30 ₾ | 52.00 ₾ |
| Cruiser | Standard | 14.10 ₾ | 30.70 ₾ | 55.70 ₾ |
| Cheesy Veggie | House | 14.20 ₾ | 30.90 ₾ | 56.20 ₾ |
| Vegan | House | 14.40 ₾ | 31.10 ₾ | 57.10 ₾ |
| Smokin' | Standard | 14.80 ₾ | 32.40 ₾ | 58.90 ₾ |
| Driftin' | Standard | 14.80 ₾ | 32.40 ₾ | 58.90 ₾ |
| 4x4 | House | 15.10 ₾ | 34.70 ₾ | 59.30 ₾ |
| Supreme | House | 15.60 ₾ | 35.10 ₾ | 59.90 ₾ |
| Cheese Lovers | House | 15.80 ₾ | 35.90 ₾ | 61.50 ₾ |

### Pricing Tiers

- **House Specials** (4+ toppings): Bundled discount price. Removing a topping does NOT reduce the price.
- **Standard Pizzas** (≤3 toppings): Priced same as a custom build. Removing a topping reduces the price proportionally — removing all non-Mozzarella toppings brings the price down to Classic Cheese.

### Topping Prices (size-dependent)

| Category | Small | Medium | XL |
|----------|-------|--------|-----|
| Cheeses (Mozzarella, Smoked, Blue, Aged Hard) | 2.10 ₾ | 4.80 ₾ | 8.10 ₾ |
| Meats & Premium (Pepperoni, Ham, Chicken, etc.) | 1.80 ₾ | 3.80 ₾ | 6.10 ₾ |
| Vegetables (Mushrooms, Peppers, Olives, etc.) | 1.40 ₾ | 3.10 ₾ | 4.90 ₾ |
| Red Chilli Flakes, Italian Seasoning | FREE | FREE | FREE |

---

## Design Principles

Built on competitive research from Domino's, Sweetgreen, &pizza, and Wolt/Glovo:

- **Sweetgreen-inspired topping grid** — Flat visual thumbnail grid, no hidden accordions. Every topping visible, tap to add.
- **Domino's systems** — Order tracker, reorder flow, smart defaults.
- **&pizza courage** — Pizza names with personality (Hot Rod, Driftin', Wild West), taglines that make you feel something.
- **Wolt baseline** — Bottom-sheet builder, floating cart bar, guest checkout, delivery/pickup toggle.

## Tech Stack

- **React 18** — Single-file component (App.jsx)
- **Vite** — Build tool, ~60KB gzipped output
- **No external UI libraries** — All styles are inline, no CSS framework dependency
- **localStorage** — Reorder persistence (no backend required for prototype)
- **Fonts** — Playfair Display (headings) + DM Sans (body) via Google Fonts

---

## Deployment

### Netlify (recommended)

#### Option A: Drag & drop (instant)
1. Run `npm run build`
2. Drag the `dist/` folder onto [app.netlify.com](https://app.netlify.com)

#### Option B: Git integration (auto-deploy on push)
1. Push this repo to GitHub
2. In Netlify → "New site from Git" → connect the repo
3. Build settings (auto-detected from `netlify.toml`):
   - **Base directory:** `ronnys-netlify` (if repo root contains the folder)
   - **Build command:** `npm run build`
   - **Publish directory:** `ronnys-netlify/dist`

### Local development
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Project Structure

```
├── index.html          ← SEO meta, Open Graph, structured data (Restaurant schema)
├── netlify.toml        ← Build config, SPA routing, security + cache headers
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx        ← React entry point
│   └── App.jsx         ← Complete ordering prototype (~800 lines)
└── public/
    ├── favicon.svg     ← Ronny's "R" mark
    └── robots.txt
```

## What's Next (Production Roadmap)

This prototype proves the UX. Production requires:

1. **Photography** — Real pizza and topping photos to replace Unsplash/Wikipedia placeholders
2. **Real address input** — Google Places Autocomplete instead of neighborhood picker
3. **Backend + payments** — TBC e-Commerce / BOG iPay integration, order database, kitchen admin panel
4. **SMS notifications** — Three-message order tracking via Georgian SMS gateway
5. **Next.js migration** — Server-rendered pages for SEO (individual pizza pages, neighborhood landing pages)
6. **Georgian language** — i18n with EN/KA toggle
7. **PWA layer** — Home screen install, push notifications, offline menu

See `ronnys-roadmap-v8-forward.md` and `ronnys-v9-audit.md` in the project knowledge for full details.

---

## Locations

| Location | Address |
|----------|---------|
| Avlabari | Ketevan Dedofali Ave 12 |
| Vake | Ilia Chavchavadze Ave 7 |
| Saburtalo | Vazha-Pshavela Ave 3 |
| Dighomi | Mirian Mepe St 67 |
| Gldani | Tsageris 5a |

**Phone:** 032 2 472 472  
**Hours:** 11:00–23:00 daily (Sunday from 13:00)  
**Web:** [ronnyspizza.com](https://ronnyspizza.com)

---

*Ronny's Pizza — Making life better since 2009.*
