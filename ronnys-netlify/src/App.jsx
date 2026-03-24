import { useState, useRef, useEffect } from "react";

const RUST = "#C4622D", CREAM = "#FAF7F2", WARM = "#F5EFE3", BORDER = "#E8DDD0";
const DARK = "#2A1F14", MID = "#7A6650", RL = "#F5EAE1", GN = "#2D8B55", GNL = "#E8F5EE";
const DFEE = 3.0;

const locations = [
  { id: "avlabari", name: "Avlabari", address: "Ketevan Dedofali Ave 12", areas: ["Avlabari", "Old Tbilisi", "Isani", "Sololaki", "Ortachala"] },
  { id: "vake", name: "Vake", address: "Ilia Chavchavadze Ave 7", areas: ["Vake", "Vera", "Mtatsminda", "Bagebi"] },
  { id: "saburtalo", name: "Saburtalo", address: "Vazha-Pshavela Ave 3", areas: ["Saburtalo", "Delisi", "Nutsubidze"] },
  { id: "dighomi", name: "Dighomi", address: "Mirian Mepe St 67", areas: ["Dighomi", "Didube", "Nadzaladevi"] },
  { id: "gldani", name: "Gldani", address: "Tsageris 5a", areas: ["Gldani", "Mukhiani", "Zahesi"] },
];
const allAreas = locations.flatMap((l) => l.areas);
const findLoc = (area) => locations.find((l) => l.areas.includes(area));

const extras = [
  { cat: "Dessert", emoji: "🍪", items: [{ name: "Chocolate Chip Cookies", price: 3.9, desc: "Ronny's famous cookies, baked fresh every day" }] },
  { cat: "Sauces", emoji: "🫙", items: [{ name: "Ranch Sauce", price: 1.8, desc: "America's favorite creamy dip" }, { name: "Marinara Sauce", price: 1.8, desc: "" }, { name: "Spicy Sauce", price: 1.8, desc: "" }, { name: "Icing", price: 1.8, desc: "For Sweet Cinnamon Sticks" }] },
  { cat: "Drinks", emoji: "🥤", items: [
    { name: "Ronnys Cola", price: 3.5, desc: "Classic and refreshing" },
    { name: "Cherry Cola", price: 3.5, desc: "Ronny's famous classic" },
    { name: "Lime Cola", price: 3.5, desc: "Crisp citrus, clean, refreshing" },
    { name: "Vanilla Cola", price: 3.5, desc: "Soft creamy cola" },
    { name: "Orange Cola", price: 3.5, desc: "Sweet and tangy citrus" },
    { name: "Root Beer", price: 3.8, desc: "Sweet, creamy, perfect for floats" },
    { name: "IPA by Black Lion", price: 9.5, desc: "Indian Pale Ale, locally brewed" },
    { name: "APA by Black Lion", price: 9.5, desc: "American Pale Ale, locally brewed" },
    { name: "Black Lion Black", price: 9.5, desc: "Locally brewed" },
    { name: "Black Lion Helles", price: 6.7, desc: "" },
    { name: "Kayaki", price: 6.7, desc: "" },
  ]},
];

// ─── Super Sticks builder config (from real site) ───
const sticksProduct = {
  name: "Super Sticks",
  basePrice: 4.2,
  desc: "Fresh made breadsticks, crispy on the outside, soft on the inside. Add Ronny's sauce. Try adding Mozzarella!",
  img: "https://images.unsplash.com/photo-1619531040576-f9416740661b?w=300&h=300&fit=crop",
  toppings: [
    { n: "Mozzarella", p: 2.8, type: "paid" },
    { n: "Garlic", p: 0, type: "seasoning" },
    { n: "Red Chilli Flakes", p: 0, type: "seasoning" },
    { n: "Cinnamon Sugar", p: 0, type: "seasoning" },
    { n: "Salt", p: 0, type: "seasoning", default: true },
  ],
};

const IMG1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/480px-Eq_it-na_pizza-margherita_sep2005_sml.jpg";
const IMG2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/480px-Pizza-3007395.jpg";

// ─── Topping prices vary by size: ps = [20cm, 30cm, 45cm] ───
const toppingLib = [
  { n: "Mozzarella", ps: [2.1, 4.8, 8.1], g: "Cheeses", i: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=80&h=80&fit=crop" },
  { n: "Smoked Cheese", ps: [2.1, 4.8, 8.1], g: "Cheeses", i: "https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=80&h=80&fit=crop" },
  { n: "Blue Cheese", ps: [2.1, 4.8, 8.1], g: "Cheeses", i: "https://images.unsplash.com/photo-1634913962536-64dca4b2d4e5?w=80&h=80&fit=crop" },
  { n: "Aged Hard Cheese", ps: [2.1, 4.8, 8.1], g: "Cheeses", i: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=80&h=80&fit=crop" },
  { n: "Pepperoni", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=80&h=80&fit=crop" },
  { n: "Salami", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1625246674717-c6e6b4b0f511?w=80&h=80&fit=crop" },
  { n: "Smoked Ham", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=80&h=80&fit=crop" },
  { n: "Italian Sausage", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop" },
  { n: "Grilled Chicken", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=80&h=80&fit=crop" },
  { n: "BBQ Chicken", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=80&h=80&fit=crop" },
  { n: "Anchovies", ps: [1.8, 3.8, 6.1], g: "Proteins", i: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=80&h=80&fit=crop" },
  { n: "Pineapple", ps: [1.8, 3.8, 6.1], g: "Fruits & Extras", i: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=80&h=80&fit=crop" },
  { n: "Green Olives", ps: [1.8, 3.8, 6.1], g: "Fruits & Extras", i: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=80&h=80&fit=crop" },
  { n: "Mushrooms", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop" },
  { n: "Roasted Mushrooms", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop" },
  { n: "Fresh Mushrooms", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop" },
  { n: "Sweet Pepper", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1607197109166-ed4d2c8bdae4?w=80&h=80&fit=crop" },
  { n: "Black Olives", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1605197584547-d3e2a7b83e26?w=80&h=80&fit=crop" },
  { n: "Fresh Tomatoes", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&h=80&fit=crop" },
  { n: "Onions", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1508747703725-719777637510?w=80&h=80&fit=crop" },
  { n: "Roasted Garlic", ps: [1.4, 3.1, 4.9], g: "Vegetables", i: "https://images.unsplash.com/photo-1609078575132-2a4c02ec5b4d?w=80&h=80&fit=crop" },
  { n: "Fresh Hot Peppers", ps: [1.4, 3.1, 4.9], g: "Heat", i: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop" },
  { n: "Jalapeno Peppers", ps: [1.4, 3.1, 4.9], g: "Heat", i: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&h=80&fit=crop" },
  { n: "Red Chilli Flakes", ps: [0, 0, 0], g: "Free Add-ons", i: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=80&h=80&fit=crop" },
  { n: "Italian Seasoning", ps: [0, 0, 0], g: "Free Add-ons", i: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=80&h=80&fit=crop" },
];
const findTop = (n) => toppingLib.find((t) => t.n === n);
const topGroups = {};
toppingLib.forEach((t) => { if (!topGroups[t.g]) topGroups[t.g] = []; topGroups[t.g].push(t); });
// si = size index (0=S, 1=M, 2=XL) — topCost now needs the selected size
const topCost = (tq, si = 1) => Object.entries(tq || {}).reduce((s, [n, q]) => { const t = findTop(n); return s + (t ? t.ps[si] * q : 0); }, 0);

// Classic Cheese prices are the base — a standard pizza with all toppings removed = Classic Cheese
const classicBase = [9.5, 20.7, 39.8]; // S, M, XL

// Removal cost for standard pizzas: proportional to surcharge over Classic Cheese
// Removing ALL non-Mozzarella toppings brings price to exactly Classic Cheese
const stdRemovalCost = (pizza, si, removed) => {
  if (pizza.tier !== "standard") return 0;
  const removableIngs = pizza.ings.filter((ig) => ig !== "Mozzarella");
  if (removableIngs.length === 0) return 0;
  const surcharge = pizza.sizes[si].p - classicBase[si];
  const removedCount = removableIngs.filter((ig) => removed[ig]).length;
  return surcharge * (removedCount / removableIngs.length);
};

// ─── All 13 Ronny's pizzas — prices from Menu Map ───
// tier: "house" = 4+ toppings, bundled price, no reduction on removal
// tier: "standard" = priced same as custom, price reduces when removing toppings
const pizzas = [
  { id: 1, name: "Papa Ronny", tier: "standard", badge: "Most ordered", tagline: "The classic that started it all. Simple, honest, and always right.", img: IMG2, sizes: [{ l: "20cm", p: 11.3 }, { l: "30cm", p: 24.5 }, { l: "45cm", p: 45.9 }], ings: ["Pepperoni", "Mozzarella"] },
  { id: 2, name: "Driftin'", tier: "standard", badge: null, tagline: "Extra mozzarella, smoked ham, mushrooms. Comfort in every bite.", img: IMG1, sizes: [{ l: "20cm", p: 14.8 }, { l: "30cm", p: 32.4 }, { l: "45cm", p: 58.9 }], ings: ["Mozzarella", "Smoked Ham", "Mushrooms"] },
  { id: 3, name: "Hot Rod", tier: "standard", badge: null, tagline: "For those who aren't afraid of the heat.", img: IMG2, sizes: [{ l: "20cm", p: 12.7 }, { l: "30cm", p: 27.6 }, { l: "45cm", p: 50.8 }], ings: ["Mozzarella", "Pepperoni", "Fresh Tomatoes", "Red Chilli Flakes"] },
  { id: 4, name: "Smokin'", tier: "standard", badge: null, tagline: "Smoked cheese, grilled chicken, fresh tomato. Unforgettable.", img: IMG1, sizes: [{ l: "20cm", p: 14.8 }, { l: "30cm", p: 32.4 }, { l: "45cm", p: 58.9 }], ings: ["Mozzarella", "Smoked Cheese", "Grilled Chicken", "Fresh Tomatoes"] },
  { id: 5, name: "Cruiser", tier: "standard", badge: null, tagline: "Pepperoni, mushrooms, olives. The easy rider.", img: IMG1, sizes: [{ l: "20cm", p: 14.1 }, { l: "30cm", p: 30.7 }, { l: "45cm", p: 55.7 }], ings: ["Mozzarella", "Pepperoni", "Mushrooms", "Black Olives"] },
  { id: 6, name: "Wild West", tier: "standard", badge: "Staff pick", tagline: "BBQ chicken and roasted garlic. Boldly different.", img: IMG2, sizes: [{ l: "20cm", p: 12.7 }, { l: "30cm", p: 27.6 }, { l: "45cm", p: 50.8 }], ings: ["Mozzarella", "BBQ Chicken", "Roasted Garlic"] },
  { id: 7, name: "Hula", tier: "standard", badge: null, tagline: "Ham and sweet pineapple. The tropical one.", img: IMG1, sizes: [{ l: "20cm", p: 13.1 }, { l: "30cm", p: 28.3 }, { l: "45cm", p: 52.0 }], ings: ["Mozzarella", "Smoked Ham", "Pineapple"] },
  { id: 8, name: "Supreme", tier: "house", badge: null, tagline: "Everything on it. Because you deserve everything.", img: IMG1, sizes: [{ l: "20cm", p: 15.6 }, { l: "30cm", p: 35.1 }, { l: "45cm", p: 59.9 }], ings: ["Mozzarella", "Pepperoni", "Smoked Ham", "Italian Sausage", "Onions", "Sweet Pepper", "Mushrooms", "Black Olives"] },
  { id: 9, name: "4x4", tier: "house", badge: null, tagline: "Four meats, four reasons to order. The meat lovers' dream.", img: IMG1, sizes: [{ l: "20cm", p: 15.1 }, { l: "30cm", p: 34.7 }, { l: "45cm", p: 59.3 }], ings: ["Mozzarella", "Pepperoni", "Italian Sausage", "Smoked Ham", "Salami"] },
  { id: 10, name: "Cheesy Veggie", tier: "house", badge: "Vegetarian", tagline: "Loaded with mushrooms, peppers, olives, and Italian seasoning.", img: IMG1, sizes: [{ l: "20cm", p: 14.2 }, { l: "30cm", p: 30.9 }, { l: "45cm", p: 56.2 }], ings: ["Mozzarella", "Mushrooms", "Sweet Pepper", "Onions", "Black Olives", "Italian Seasoning"] },
  { id: 11, name: "Vegan", tier: "house", badge: "Vegan", tagline: "No cheese, no compromise. Plant-powered. Comes with Ranch side.", img: IMG2, sizes: [{ l: "20cm", p: 14.4 }, { l: "30cm", p: 31.1 }, { l: "45cm", p: 57.1 }], ings: ["Roasted Mushrooms", "Fresh Mushrooms", "Fresh Tomatoes", "Sweet Pepper", "Onions", "Black Olives", "Italian Seasoning"] },
  { id: 12, name: "Cheese Lovers", tier: "house", badge: null, tagline: "Four cheeses melted together. Simple. Perfect.", img: IMG2, sizes: [{ l: "20cm", p: 15.8 }, { l: "30cm", p: 35.9 }, { l: "45cm", p: 61.5 }], ings: ["Blue Cheese", "Aged Hard Cheese", "Smoked Cheese", "Mozzarella"] },
  { id: 13, name: "Classic Cheese", tier: "house", badge: null, tagline: "Just mozzarella and marinara. The purest form.", img: IMG1, sizes: [{ l: "20cm", p: 9.5 }, { l: "30cm", p: 20.7 }, { l: "45cm", p: 39.8 }], ings: ["Mozzarella"] },
];

const Lbl = ({ children }) => <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".07em", color: MID, marginBottom: 7 }}>{children}</p>;
const Pill = ({ label, active, onClick }) => <button onClick={onClick} style={{ padding: "10px 16px", borderRadius: 20, border: active ? `1.5px solid ${RUST}` : `1.5px solid ${BORDER}`, background: active ? RL : "#fff", color: active ? RUST : MID, fontWeight: active ? 600 : 400, cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{label}</button>;

// ─── Visual topping grid: flat, scannable, Sweetgreen-inspired ───
// Role-based display groups for the grid
const displayGroups = [
  { label: "🧀 Cheese", filter: (t) => t.g === "Cheeses" },
  { label: "🥩 Meats", filter: (t) => t.g === "Proteins" },
  { label: "🥬 Veggies & More", filter: (t) => t.g === "Vegetables" || t.g === "Fruits & Extras" },
  { label: "🌶️ Heat", filter: (t) => t.g === "Heat" },
  { label: "✨ Free", filter: (t) => t.g === "Free Add-ons" },
];

function ToppingGrid({ tqty, setOneTQ, si = 1 }) {
  const active = Object.entries(tqty).filter(([, q]) => q > 0);
  return (
    <div>
      {active.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>{active.map(([n, q]) => <span key={n} onClick={() => setOneTQ(n, 0)} style={{ fontSize: 12, background: RL, color: RUST, borderRadius: 12, padding: "4px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 500 }}>{q === 2 ? `2x ${n}` : n} <span style={{ opacity: 0.5 }}>×</span></span>)}</div>}
      {displayGroups.map(({ label, filter }) => {
        const items = toppingLib.filter(filter);
        if (items.length === 0) return null;
        return (
          <div key={label}>
            <p style={{ fontSize: 12, fontWeight: 600, color: MID, margin: "12px 0 6px", letterSpacing: ".03em" }}>{label}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {items.map((t) => {
                const q = tqty[t.n] || 0;
                const price = t.ps[si];
                const isFree = price === 0;
                const cycle = () => setOneTQ(t.n, (q + 1) % 3);
                return (
                  <div key={t.n} onClick={cycle} style={{ position: "relative", borderRadius: 10, border: q > 0 ? `2px solid ${RUST}` : `1px solid ${BORDER}`, background: q > 0 ? RL : "#fff", cursor: "pointer", overflow: "hidden", transition: "all .12s" }}>
                    <div style={{ width: "100%", height: 56, background: WARM, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={t.i} alt={t.n} style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover" }} />
                    </div>
                    {q > 0 && <div style={{ position: "absolute", top: 4, right: 4, background: RUST, color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>{q === 2 ? "2x" : "✓"}</div>}
                    <div style={{ padding: "5px 6px 7px", textAlign: "center" }}>
                      <p style={{ fontSize: 11, fontWeight: q > 0 ? 600 : 500, color: q > 0 ? RUST : DARK, lineHeight: 1.2, marginBottom: 2 }}>{t.n}</p>
                      <p style={{ fontSize: 11, color: isFree ? GN : MID, fontWeight: isFree ? 600 : 400 }}>{isFree ? "FREE" : `${price.toFixed(2)} ₾`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IngTags({ ings, removed, setRemoved }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
      {ings.map((ig) => {
        const s = removed[ig];
        return <span key={ig} onClick={() => setRemoved({ ...removed, [ig]: !s })} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: s ? MID : DARK, background: s ? WARM : "#fff", border: `1px solid ${s ? MID : BORDER}`, borderRadius: 16, padding: "6px 12px", cursor: "pointer", textDecoration: s ? "line-through" : "none", opacity: s ? 0.75 : 1, transition: "all .15s" }}>{ig} <span style={{ fontSize: 14, opacity: 0.5 }}>{s ? "↺" : "×"}</span></span>;
      })}
    </div>
  );
}

// ─── Regular Builder ───
function Builder({ pizza, editItem, onClose, onSave }) {
  const e = editItem;
  const [si, setSi] = useState(e?.si ?? 1);
  const [crust, setCrust] = useState(e?.crust ?? "Original");
  const [sauce, setSauce] = useState(e?.sauce ?? "Original");
  const [removed, setRemoved] = useState(e?.removed ?? {});
  const [tqty, setTqty] = useState(e?.tqty ?? {});
  const [qty, setQty] = useState(e?.qty ?? 1);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const isEdit = !!e;
  const setOneTQ = (n, v) => setTqty({ ...tqty, [n]: v });
  const base = pizza.sizes[si].p;
  const rmCost = stdRemovalCost(pizza, si, removed);
  const unit = base - rmCost + topCost(tqty, si);
  const total = unit * qty;
  const isHouse = pizza.tier === "house";
  useEffect(() => { const el = ref.current; if (!el) return; const h = () => setScrolled(el.scrollTop > 100); el.addEventListener("scroll", h); return () => el.removeEventListener("scroll", h); }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(42,31,20,.6)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1 }} />
      <div style={{ background: CREAM, borderRadius: "20px 20px 0 0", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER }} /></div>
        {scrolled && <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, background: CREAM }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><img src={pizza.img} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} /><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 500, color: DARK }}>{pizza.name}</span>{isEdit && <span style={{ fontSize: 11, background: WARM, color: MID, borderRadius: 6, padding: "2px 6px" }}>Editing</span>}</div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: RUST, fontWeight: 500 }}>{unit.toFixed(2)} ₾</span></div>}
        <div ref={ref} style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", flexShrink: 0, border: `2px dashed ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}><img src={pizza.img} alt="" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover" }} /></div>
              <div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: DARK }}>{pizza.name}</p>{isEdit && <span style={{ fontSize: 11, background: WARM, color: MID, borderRadius: 6, padding: "2px 6px" }}>Editing</span>}</div><p style={{ fontSize: 13, color: MID, marginTop: 3 }}>{pizza.tagline}</p></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: RUST, fontWeight: 500 }}>{unit.toFixed(2)} ₾</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {isHouse && <span style={{ fontSize: 11, color: "#fff", background: "#6B5CE7", borderRadius: 6, padding: "2px 6px", fontWeight: 600 }}>House Special</span>}
                <span style={{ fontSize: 12, color: MID, background: WARM, borderRadius: 6, padding: "3px 8px" }}>{pizza.sizes[si].l}</span>
              </div>
            </div>
            <Lbl>{isHouse ? "Included · no price reduction when removed" : "Included · price adjusts when removed"}</Lbl>
            <IngTags ings={pizza.ings} removed={removed} setRemoved={setRemoved} />
            <Lbl>Size</Lbl><div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>{pizza.sizes.map((s, i) => <Pill key={i} label={s.l} active={si === i} onClick={() => setSi(i)} />)}</div>
            <Lbl>Crust</Lbl><div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{["Original", "Thin"].map((c) => <Pill key={c} label={c} active={crust === c} onClick={() => setCrust(c)} />)}</div>
            <Lbl>Sauce</Lbl><div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>{["Original", "Less", "Extra", "None"].map((s) => <Pill key={s} label={s} active={sauce === s} onClick={() => setSauce(s)} />)}</div>
            <Lbl>Add toppings · tap once to add, twice for 2x</Lbl>
            <ToppingGrid tqty={tqty} setOneTQ={setOneTQ} si={si} />
          </div>
        </div>
        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "4px 8px" }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: WARM, cursor: "pointer", fontSize: 15, color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontSize: 15, fontWeight: 600, minWidth: 18, textAlign: "center", color: DARK }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: WARM, cursor: "pointer", fontSize: 15, color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <button onClick={() => onSave({ pizza, si, crust, sauce, removed, tqty, qty, total, unit })} style={{ flex: 1, padding: "13px 20px", borderRadius: 24, border: "none", background: RUST, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isEdit ? "Update cart" : "Add to cart"} <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, borderLeft: "1px solid rgba(255,255,255,.3)", paddingLeft: 8 }}>{total.toFixed(2)} ₾</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Half & Half Builder ───
function HalfBuilder({ editItem, onClose, onSave }) {
  const e = editItem;
  const isEdit = !!e;
  const [step, setStep] = useState(isEdit ? "customize" : "pickA");
  const [sideA, setSideA] = useState(e?.sideA ?? null);
  const [sideB, setSideB] = useState(e?.sideB ?? null);
  const [si, setSi] = useState(e?.si != null ? Math.max(0, e.si - 1) : 0); // map old index: 0→20cm removed, so shift down
  const [crust, setCrust] = useState(e?.crust ?? "Original");
  const [sauce, setSauce] = useState(e?.sauce ?? "Original");
  const [tab, setTab] = useState("A");
  const [qty, setQty] = useState(e?.qty ?? 1);
  const [rmA, setRmA] = useState(e?.rmA ?? {});
  const [rmB, setRmB] = useState(e?.rmB ?? {});
  const [tqA, setTqA] = useState(e?.tqA ?? {});
  const [tqB, setTqB] = useState(e?.tqB ?? {});
  const setOneTqA = (n, v) => setTqA({ ...tqA, [n]: v });
  const setOneTqB = (n, v) => setTqB({ ...tqB, [n]: v });
  const allSizes = sideA?.sizes || pizzas[0].sizes;
  const sizes = allSizes.filter((s) => s.l !== "20cm"); // Half & Half: Medium and XL only
  const currentSize = sizes[si] || sizes[0];
  // Map filtered si back to original 3-size index for topping prices
  const origSi = currentSize.l === "30cm" ? 1 : 2;
  const baseP = sideA && sideB ? Math.max(
    sideA.sizes.find((s) => s.l === currentSize.l)?.p || 0,
    sideB.sizes.find((s) => s.l === currentSize.l)?.p || 0
  ) : 0;
  const unit = baseP + topCost(tqA, origSi) + topCost(tqB, origSi);
  const total = unit * qty;
  const pick = (p) => { if (step === "pickA") { setSideA(p); setStep("pickB"); } else { setSideB(p); setStep("customize"); } };

  if (step === "pickA" || step === "pickB") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(42,31,20,.6)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div onClick={onClose} style={{ flex: 1 }} />
        <div style={{ background: CREAM, borderRadius: "20px 20px 0 0", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER }} /></div>
          <div style={{ padding: "12px 20px 8px", borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: DARK, marginBottom: 4 }}>Build a Half & Half</p>
            <p style={{ fontSize: 14, color: MID }}>{step === "pickA" ? "Step 1 — Choose A side" : "Step 2 — Choose B side"}</p>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}><div style={{ flex: 1, height: 4, borderRadius: 2, background: RUST }} /><div style={{ flex: 1, height: 4, borderRadius: 2, background: step === "pickB" ? RUST : BORDER }} /><div style={{ flex: 1, height: 4, borderRadius: 2, background: BORDER }} /></div>
            {sideA && step === "pickB" && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, background: RL, borderRadius: 10, padding: "8px 12px" }}><img src={sideA.img} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} /><span style={{ fontSize: 13, color: RUST, fontWeight: 500 }}>A: {sideA.name}</span><button onClick={() => { setSideA(null); setStep("pickA"); }} style={{ marginLeft: "auto", background: "none", border: "none", color: RUST, cursor: "pointer", fontSize: 12 }}>Change</button></div>}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{pizzas.map((p) => <button key={p.id} onClick={() => pick(p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}><img src={p.img} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} /><div><p style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{p.name}</p><p style={{ fontSize: 12, color: MID }}>{p.ings.slice(0, 3).join(", ")}</p></div></button>)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(42,31,20,.6)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1 }} />
      <div style={{ background: CREAM, borderRadius: "20px 20px 0 0", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER }} /></div>
        <div style={{ padding: "8px 20px 12px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}><div style={{ flex: 1, height: 4, borderRadius: 2, background: RUST }} /><div style={{ flex: 1, height: 4, borderRadius: 2, background: RUST }} /><div style={{ flex: 1, height: 4, borderRadius: 2, background: RUST }} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 500, color: DARK }}>Customize Half & Half</p>
            {isEdit && <span style={{ fontSize: 11, background: WARM, color: MID, borderRadius: 6, padding: "2px 6px" }}>Editing</span>}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {[{ k: "A", pz: sideA }, { k: "B", pz: sideB }].map(({ k, pz }) => <div key={k} onClick={() => setTab(k)} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: tab === k ? RL : "#fff", border: tab === k ? `1.5px solid ${RUST}` : `1.5px solid ${BORDER}`, cursor: "pointer" }}><img src={pz.img} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} /><div><p style={{ fontSize: 11, color: RUST, fontWeight: 600, textTransform: "uppercase" }}>{k} side</p><p style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{pz.name}</p></div></div>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 12px" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: RUST, fontWeight: 500 }}>{unit.toFixed(2)} ₾</span>
            <span style={{ fontSize: 12, color: MID, background: WARM, borderRadius: 6, padding: "3px 8px" }}>{sizes[si].l}</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 20px" }}>
          <Lbl>Size</Lbl><div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>{sizes.map((s, i) => <Pill key={i} label={s.l} active={si === i} onClick={() => setSi(i)} />)}</div>
          <Lbl>Crust</Lbl><div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{["Original", "Thin"].map((c) => <Pill key={c} label={c} active={crust === c} onClick={() => setCrust(c)} />)}</div>
          <Lbl>Sauce</Lbl><div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>{["Original", "Less", "Extra", "None"].map((s) => <Pill key={s} label={s} active={sauce === s} onClick={() => setSauce(s)} />)}</div>
          <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
          <p style={{ fontSize: 14, fontWeight: 500, color: DARK, marginBottom: 10 }}>Customizing {tab === "A" ? sideA.name : sideB.name} ({tab} side)</p>
          <Lbl>Included · tap to cross out / restore</Lbl>
          {tab === "A" ? <IngTags ings={sideA.ings} removed={rmA} setRemoved={setRmA} /> : <IngTags ings={sideB.ings} removed={rmB} setRemoved={setRmB} />}
          <Lbl>Add toppings · tap once to add, twice for 2x</Lbl>
          {tab === "A" ? <ToppingGrid tqty={tqA} setOneTQ={setOneTqA} si={origSi} /> : <ToppingGrid tqty={tqB} setOneTQ={setOneTqB} si={origSi} />}
        </div>
        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "4px 8px" }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: WARM, cursor: "pointer", fontSize: 15, color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontSize: 15, fontWeight: 600, minWidth: 18, textAlign: "center", color: DARK }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: WARM, cursor: "pointer", fontSize: 15, color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <button onClick={() => onSave({ isHalf: true, sideA, sideB, si, crust, sauce, rmA, rmB, tqA, tqB, qty, unit, total, pizza: { name: `${sideA.name} / ${sideB.name}`, img: sideA.img, sizes, ings: [] } })} style={{ flex: 1, padding: "13px 20px", borderRadius: 24, border: "none", background: RUST, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isEdit ? "Update cart" : "Add to cart"} <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, borderLeft: "1px solid rgba(255,255,255,.3)", paddingLeft: 8 }}>{total.toFixed(2)} ₾</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Super Sticks Builder ───
// sticksToppings stores numbers: Mozzarella 0-3, seasonings 0=off, 1=normal, 2=extra
const sticksSeasonLabel = (name, level) => {
  if (level === 0) return null;
  if (name === "Red Chilli Flakes") return level === 1 ? "Spicy" : "Extra Spicy";
  return level === 2 ? `Extra ${name}` : name;
};

function SticksBuilder({ editItem, onClose, onSave }) {
  const e = editItem;
  const isEdit = !!e;
  const [toppings, setToppings] = useState(() => {
    if (e?.sticksToppings) return { ...e.sticksToppings };
    const def = {};
    sticksProduct.toppings.forEach((t) => { def[t.n] = t.default ? 1 : 0; });
    return def;
  });
  const [qty, setQty] = useState(e?.qty ?? 1);

  const setOne = (name, val) => setToppings({ ...toppings, [name]: val });
  const cycleSeasoning = (name) => setOne(name, ((toppings[name] || 0) + 1) % 3);

  const mozzQty = toppings["Mozzarella"] || 0;
  const extraCost = mozzQty * 2.8;
  const unit = sticksProduct.basePrice + extraCost;
  const total = unit * qty;

  // Build active items for tag display
  const activeTags = [];
  sticksProduct.toppings.forEach((t) => {
    const v = toppings[t.n] || 0;
    if (v === 0) return;
    if (t.type === "paid") activeTags.push({ n: t.n, label: `${v}x ${t.n}`, clear: () => setOne(t.n, 0) });
    else activeTags.push({ n: t.n, label: sticksSeasonLabel(t.n, v), clear: () => setOne(t.n, 0) });
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(42,31,20,.6)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1 }} />
      <div style={{ background: CREAM, borderRadius: "20px 20px 0 0", maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER }} /></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
          {/* Hero image */}
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 12px" }}>
            <div style={{ width: 150, height: 150, borderRadius: "50%", border: `3px dashed ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
              <img src={sticksProduct.img} alt="Super Sticks" style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover" }} />
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: DARK }}>{sticksProduct.name}</p>
            {isEdit && <span style={{ fontSize: 11, background: WARM, color: MID, borderRadius: 6, padding: "2px 6px" }}>Editing</span>}
            {activeTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginTop: 8 }}>
                {activeTags.map((t) => (
                  <span key={t.n} onClick={t.clear} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: RUST, background: RL, border: `1px solid ${RUST}`, borderRadius: 16, padding: "4px 10px", cursor: "pointer" }}>
                    {t.label} <span style={{ opacity: 0.6, fontSize: 13 }}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: RUST, fontWeight: 500 }}>{unit.toFixed(2)} ₾</span>
            {extraCost > 0 && <span style={{ fontSize: 12, color: MID, background: WARM, borderRadius: 6, padding: "3px 8px" }}>{mozzQty}x Mozz +{extraCost.toFixed(2)}</span>}
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: MID, lineHeight: 1.6, marginBottom: 16 }}>{sticksProduct.desc}</p>

          {/* Mozzarella — tap cycles: off → 1x → 2x → 3x → off */}
          <Lbl>Add topping · tap again for more</Lbl>
          {(() => {
            const mozzLabel = mozzQty === 0 ? "Mozzarella" : mozzQty === 1 ? "Mozzarella" : `${mozzQty}x Mozzarella`;
            const mozzHint = mozzQty === 0 ? null : mozzQty < 3 ? "tap for more" : "tap to remove";
            return (
              <div onClick={() => setOne("Mozzarella", (mozzQty + 1) % 4)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: mozzQty > 0 ? (mozzQty >= 3 ? "#FBE8DA" : RL) : "#fff", border: mozzQty > 0 ? `1px solid ${RUST}` : `1px solid ${BORDER}`, marginBottom: 12, cursor: "pointer", transition: "all .12s" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: mozzQty > 0 ? RUST : DARK, fontWeight: mozzQty > 0 ? 600 : 400 }}>{mozzLabel}</p>
                  <p style={{ fontSize: 12, color: mozzQty > 0 ? RUST : MID }}>+2.80 ₾ each</p>
                  {mozzHint && <p style={{ fontSize: 12, color: MID, fontStyle: "italic" }}>{mozzHint}</p>}
                </div>
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: mozzQty >= i ? RUST : "transparent", border: `2px solid ${mozzQty >= i ? RUST : BORDER}`, transition: "all .15s" }} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Seasonings — tap cycles: off → normal → extra → off */}
          <Lbl>Seasonings · tap again for extra</Lbl>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sticksProduct.toppings.filter((t) => t.type === "seasoning").map((t) => {
              const v = toppings[t.n] || 0;
              const on = v > 0;
              const label = v === 0 ? t.n : sticksSeasonLabel(t.n, v);
              const levelHint = v === 1 ? "tap for extra" : v === 2 ? "tap to remove" : null;
              return (
                <div key={t.n} onClick={() => cycleSeasoning(t.n)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: on ? (v === 2 ? "#FBE8DA" : RL) : "#fff", border: on ? `1px solid ${RUST}` : "1px solid transparent", cursor: "pointer", transition: "all .12s" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: on ? RUST : DARK, fontWeight: on ? 600 : 400 }}>{label}</p>
                    {levelHint && <p style={{ fontSize: 12, color: MID, fontStyle: "italic" }}>{levelHint}</p>}
                  </div>
                  {/* Level dots: ○ = off, ● = normal, ●● = extra */}
                  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: v >= 1 ? RUST : "transparent", border: `2px solid ${v >= 1 ? RUST : BORDER}`, transition: "all .15s" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: v >= 2 ? RUST : "transparent", border: `2px solid ${v >= 2 ? RUST : BORDER}`, transition: "all .15s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${BORDER}`, background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "4px 8px" }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: WARM, cursor: "pointer", fontSize: 15, color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontSize: 15, fontWeight: 600, minWidth: 18, textAlign: "center", color: DARK }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: WARM, cursor: "pointer", fontSize: 15, color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <button onClick={() => onSave({ isSticks: true, name: sticksProduct.name, sticksToppings: toppings, basePrice: sticksProduct.basePrice, unit, qty, total, emoji: "🧀" })} style={{ flex: 1, padding: "13px 20px", borderRadius: 24, border: "none", background: RUST, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isEdit ? "Update cart" : "Add to cart"} <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, borderLeft: "1px solid rgba(255,255,255,.3)", paddingLeft: 8 }}>{total.toFixed(2)} ₾</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Item ───
function CartItem({ item, idx, onEdit, onRemove }) {
  const rm = item.removed ? Object.entries(item.removed).filter(([, v]) => v).map(([k]) => k) : [];
  const ext = item.tqty ? Object.entries(item.tqty).filter(([, q]) => q > 0) : [];
  const simple = item.isSimple;
  const sticks = item.isSticks;
  const sticksLabels = sticks && item.sticksToppings ? Object.entries(item.sticksToppings).filter(([, v]) => v > 0).map(([k, v]) => {
    const td = sticksProduct.toppings.find((t) => t.n === k);
    if (td?.type === "paid") return `${v}x ${k}`;
    return sticksSeasonLabel(k, v);
  }).filter(Boolean) : [];
  return (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 12 }}>
      {!simple && !sticks && <img src={item.pizza.img} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />}
      {(simple || sticks) && <div style={{ width: 42, height: 42, borderRadius: 10, background: WARM, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{item.emoji || "📦"}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: DARK }}>{item.qty > 1 ? `${item.qty}× ` : ""}{item.name || item.pizza?.name}</p><button onClick={() => onRemove(idx)} style={{ background: "none", border: "none", color: BORDER, cursor: "pointer", fontSize: 16 }}>×</button></div>
        {!simple && !sticks && (() => {
          const vars = [];
          if (item.crust === "Thin") vars.push("Thin Crust");
          if (item.sauce === "Less") vars.push("Less Sauce");
          if (item.sauce === "Extra") vars.push("Extra Sauce");
          if (item.sauce === "None") vars.push("No Sauce");
          rm.forEach((r) => vars.push(`No ${r}`));
          return <>
            <p style={{ fontSize: 13, color: MID, marginTop: 2 }}>{item.pizza.sizes[item.si].l}{vars.length === 0 ? " · Original" : ""}</p>
            {vars.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>{vars.map((v) => <span key={v} style={{ fontSize: 12, color: "#C44", background: "#FFF0EE", borderRadius: 8, padding: "3px 9px", fontWeight: 600 }}>{v}</span>)}</div>}
          </>;
        })()}
        {sticks && sticksLabels.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>{sticksLabels.map((lbl) => <span key={lbl} style={{ fontSize: 13, color: RUST, background: RL, borderRadius: 8, padding: "3px 9px", fontWeight: 500 }}>{lbl}</span>)}</div>}
        {item.isHalf && (() => {
          const hVars = [];
          if (item.crust === "Thin") hVars.push("Thin Crust");
          if (item.sauce === "Less") hVars.push("Less Sauce");
          if (item.sauce === "Extra") hVars.push("Extra Sauce");
          if (item.sauce === "None") hVars.push("No Sauce");
          return <>
            <p style={{ fontSize: 13, color: MID, marginTop: 2 }}>{item.pizza.sizes[item.si].l}{hVars.length === 0 ? " · Original" : ""}</p>
            {hVars.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>{hVars.map((v) => <span key={v} style={{ fontSize: 12, color: "#C44", background: "#FFF0EE", borderRadius: 8, padding: "3px 9px", fontWeight: 600 }}>{v}</span>)}</div>}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {[{ l: "A", pz: item.sideA, rm: item.rmA, tq: item.tqA }, { l: "B", pz: item.sideB, rm: item.rmB, tq: item.tqB }].map(({ l, pz, rm: r, tq }) => <div key={l} style={{ flex: 1, background: WARM, borderRadius: 8, padding: "6px 8px" }}><p style={{ fontSize: 12, color: RUST, fontWeight: 600, textTransform: "uppercase" }}>{l}: {pz.name}</p>{pz.ings.filter((ig) => r[ig]).map((ig) => <p key={ig} style={{ fontSize: 12, color: "#C44", fontWeight: 600 }}>No {ig}</p>)}{Object.entries(tq || {}).filter(([, q]) => q > 0).map(([n, q]) => <p key={n} style={{ fontSize: 12, color: RUST, fontWeight: 500 }}>{q === 2 ? `2x ${n}` : `+ ${n}`}</p>)}</div>)}
            </div>
          </>;
        })()}
        {!simple && !sticks && !item.isHalf && ext.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>{ext.map(([n, q]) => <span key={n} style={{ fontSize: 13, color: RUST, background: RL, borderRadius: 8, padding: "3px 9px", fontWeight: 500 }}>{q === 2 ? `2x ${n}` : `+ ${n}`}</span>)}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          {(!simple) ? <button onClick={() => onEdit(idx)} style={{ fontSize: 13, color: RUST, fontWeight: 500, background: "none", border: `1px solid ${RUST}`, borderRadius: 16, padding: "4px 12px", cursor: "pointer" }}>Edit</button> : <span />}
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: RUST, fontWeight: 500 }}>{((item.unit || item.price) * item.qty).toFixed(2)} ₾</span>
        </div>
      </div>
    </div>
  );
}

function PizzaCard({ pizza, onClick }) {
  const bc = pizza.badge === "Most ordered" ? GN : pizza.badge === "Staff pick" ? "#6B5CE7" : pizza.badge === "Vegan" ? GN : pizza.badge === "Vegetarian" ? GN : null;
  return <div onClick={onClick} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: `1px solid ${BORDER}` }}><div style={{ background: WARM, height: 110, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><img src={pizza.img} alt={pizza.name} style={{ width: 85, height: 85, borderRadius: "50%", objectFit: "cover" }} />{pizza.badge && <span style={{ position: "absolute", top: 6, left: 6, background: bc, color: "#fff", fontSize: 11, fontWeight: 600, borderRadius: 10, padding: "2px 8px" }}>{pizza.badge}</span>}</div><div style={{ padding: "8px 12px 12px" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 500, color: DARK, marginBottom: 2 }}>{pizza.name}</p><p style={{ fontSize: 12, color: MID, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4 }}>{pizza.tagline}</p><p style={{ fontSize: 14, color: RUST, fontWeight: 600 }}>From {pizza.sizes[0].p.toFixed(2)} ₾</p></div></div>;
}

// ─── Address Gate ───
function AddressGate({ onConfirm }) {
  const [q, setQ] = useState(""); const [focused, setFocused] = useState(false); const [picked, setPicked] = useState(null); const [showAll, setShowAll] = useState(false);
  const matches = q.trim().length > 0 ? allAreas.filter((a) => a.toLowerCase().includes(q.toLowerCase())) : [];
  const pickArea = (area) => { setQ(area); setPicked({ area, loc: findLoc(area) }); setFocused(false); };
  return (
    <div style={{ minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, background: RUST, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600 }}>R</span></div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 500, color: DARK }}>Ronny's</span></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px 60px", maxWidth: 440, margin: "0 auto", width: "100%" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 500, color: DARK, lineHeight: 1.25, marginBottom: 6 }}>Pizza that makes<br />life better.</p>
        <p style={{ fontSize: 14, color: MID, lineHeight: 1.6, marginBottom: 24 }}>Free delivery from 5 locations across Tbilisi.<br />Enter your area to find your nearest Ronny's.</p>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 14, border: focused ? `2px solid ${RUST}` : `2px solid ${BORDER}`, background: "#fff" }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <input type="text" placeholder="Type your area — e.g. Vake, Saburtalo..." value={q} onChange={(e) => { setQ(e.target.value); setPicked(null); }} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)} style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "'DM Sans',sans-serif", color: DARK, background: "transparent" }} />
            {q && <button onClick={() => { setQ(""); setPicked(null); }} style={{ background: "none", border: "none", color: MID, fontSize: 18, cursor: "pointer" }}>×</button>}
          </div>
          {focused && matches.length > 0 && !picked && <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(42,31,20,.12)", zIndex: 10 }}>{matches.slice(0, 5).map((a) => { const loc = findLoc(a); return <button key={a} onMouseDown={() => pickArea(a)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "none", borderBottom: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}><div><p style={{ fontSize: 14, color: DARK, fontWeight: 500 }}>{a}</p><p style={{ fontSize: 13, color: MID }}>Nearest: Ronny's {loc.name}</p></div><span style={{ fontSize: 13, color: GN, fontWeight: 500 }}>~30 min</span></button>; })}</div>}
        </div>
        {picked && <div style={{ background: GNL, border: `1.5px solid ${GN}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><div style={{ width: 20, height: 20, borderRadius: "50%", background: GN, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span></div><p style={{ fontSize: 14, fontWeight: 600, color: GN }}>We deliver to {picked.area}!</p></div><div style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: `1px solid ${BORDER}` }}><p style={{ fontSize: 13, fontWeight: 500, color: DARK }}>Your nearest Ronny's</p><p style={{ fontSize: 13, color: MID, marginTop: 2 }}>{picked.loc.name} — {picked.loc.address}</p><p style={{ fontSize: 12, color: GN, marginTop: 2 }}>Estimated delivery: ~30–40 min</p></div></div>}
        {picked && <button onClick={() => onConfirm(picked)} style={{ width: "100%", padding: 16, borderRadius: 24, border: "none", background: RUST, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>See the menu</button>}
        <button onClick={() => setShowAll(!showAll)} style={{ background: "none", border: "none", color: RUST, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: "8px 0", display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>{showAll ? "Hide locations" : "Or choose a location directly"} <span style={{ display: "inline-block", transition: "transform .2s", transform: showAll ? "rotate(180deg)" : "rotate(0)" }}>⌄</span></button>
        {showAll && <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>{locations.map((loc) => <button key={loc.id} onClick={() => { setPicked({ area: loc.areas[0], loc }); setQ(loc.areas[0]); setShowAll(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: WARM, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: RUST }}>R</span></div><div style={{ flex: 1 }}><p style={{ fontSize: 14, fontWeight: 500, color: DARK }}>Ronny's {loc.name}</p><p style={{ fontSize: 12, color: MID }}>{loc.address}</p></div><span style={{ fontSize: 13, color: GN, fontWeight: 500 }}>~30 min</span></button>)}</div>}
        <div style={{ marginTop: 32, textAlign: "center" }}><p style={{ fontSize: 12, color: MID }}>Tbilisi's first American pizza since 2009</p><p style={{ fontSize: 12, color: MID }}>032 2 472 472 · 5 locations · 11:00–23:00</p></div>
      </div>
    </div>
  );
}

// ─── Confirmation with tracker ───
function Confirm({ loc, cart, onNew }) {
  const [step, setStep] = useState(0);
  useEffect(() => { const a = setTimeout(() => setStep(1), 3000); const b = setTimeout(() => setStep(2), 7000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  const pn = cart.find(c => !c.isSimple)?.pizza?.name || "pizza";
  const steps = [{ l: "Order received", d: `Ronny's ${loc?.name} got it!`, t: "Now" }, { l: "Preparing", d: `Your ${pn} is being made`, t: "~5 min" }, { l: "In the oven", d: "Baking to perfection", t: "~15 min" }, { l: "On the way", d: "Giorgi is bringing it to you", t: "~25 min" }];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: CREAM, overflowY: "auto" }}><div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}><div style={{ width: 64, height: 64, borderRadius: "50%", background: GNL, border: `2px solid ${GN}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>✓</div><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 500, color: DARK, marginBottom: 6 }}>Order confirmed!</p><p style={{ fontSize: 14, color: MID }}>From Ronny's {loc?.name}</p></div>
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 18px", marginBottom: 24 }}><Lbl>Order progress</Lbl>{steps.map((s, i) => { const reached = i <= step; return (<div key={i} style={{ display: "flex", gap: 12 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}><div style={{ width: 18, height: 18, borderRadius: "50%", background: reached ? RUST : WARM, border: `2px solid ${reached ? RUST : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .4s" }}>{reached && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}</div>{i < 3 && <div style={{ width: 2, height: 32, margin: "2px 0", background: i < step ? RUST : BORDER, borderRadius: 1, transition: "background .4s" }} />}</div><div style={{ paddingBottom: i < 3 ? 12 : 0, flex: 1 }}><p style={{ fontSize: 14, fontWeight: i === step ? 600 : 400, color: reached ? DARK : MID }}>{s.l}</p><p style={{ fontSize: 12, color: reached ? MID : BORDER }}>{s.d}</p></div><span style={{ fontSize: 12, color: MID, paddingTop: 2 }}>{s.t}</span></div>); })}</div>
      <div style={{ background: WARM, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}><Lbl>SMS updates you'll receive</Lbl>{[`Ronny's got it! Your ${pn} is next up.`, "Your pizza just went in the oven. ~15 min to go!", "On its way! Giorgi is bringing it to you."].map((msg, i) => <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "8px 12px", marginBottom: i < 2 ? 6 : 0, border: `1px solid ${BORDER}` }}><p style={{ fontSize: 12, color: DARK, lineHeight: 1.5 }}>{msg}</p></div>)}</div>
      <div style={{ background: RL, border: `1px solid ${RUST}`, borderRadius: 14, padding: "16px 18px", marginBottom: 24, textAlign: "center" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: RUST, marginBottom: 4 }}>Save as your Ronny's order?</p><p style={{ fontSize: 12, color: MID, marginBottom: 12 }}>Reorder in one tap next time</p><button style={{ padding: "10px 24px", borderRadius: 20, border: "none", background: RUST, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save as "My order"</button></div>
      <button onClick={onNew} style={{ width: "100%", padding: 14, borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff", color: MID, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Start a new order</button>
    </div></div>
  );
}

// ─── Main App ───
export default function App() {
  const [stage, setStage] = useState("address");
  const [loc, setLoc] = useState(null);
  const [userArea, setUserArea] = useState("");
  const [cart, setCart] = useState([]);
  const [builderPizza, setBuilderPizza] = useState(null);
  const [halfBuilder, setHalfBuilder] = useState(false);
  const [sticksBuilder, setSticksBuilder] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [payMethod, setPayMethod] = useState("card");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderType, setOrderType] = useState("delivery");
  const [lastOrder, setLastOrder] = useState(() => {
    try { const saved = localStorage.getItem("ronnys_last_order"); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });

  const canPlaceOrder = phone.replace(/\D/g, "").length >= 9 && (orderType === "pickup" || address.trim().length > 0);
  const deliveryFee = orderType === "pickup" ? 0 : DFEE;
  const tryPlaceOrder = () => {
    if (orderType === "delivery" && !address.trim()) { setCheckoutError("Please enter your delivery address"); return; }
    if (phone.replace(/\D/g, "").length < 9) { setCheckoutError("Please enter a valid phone number"); return; }
    setCheckoutError(null);
    try {
      const orderSummary = { cart: cart.map((c) => ({ name: c.name || c.pizza?.name, isSimple: c.isSimple, isSticks: c.isSticks, isHalf: c.isHalf })), total, phone, date: new Date().toISOString() };
      localStorage.setItem("ronnys_last_order", JSON.stringify({ items: cart, summary: orderSummary }));
      setLastOrder({ items: cart, summary: orderSummary });
    } catch {}
    setStage("confirm");
  };

  const reorder = () => {
    if (lastOrder?.items) { setCart(lastOrder.items); setToast("Last order loaded"); setTimeout(() => setToast(null), 2500); setStage("cart"); }
  };

  const total = cart.reduce((s, i) => s + (i.unit || i.price || 0) * i.qty, 0);
  const itemCt = cart.reduce((s, i) => s + i.qty, 0);
  const fonts = <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />;

  const openEdit = (idx) => {
    const item = cart[idx];
    if (item.isSimple) return;
    setEditIdx(idx);
    if (item.isSticks) { setSticksBuilder(true); setBuilderPizza(null); setHalfBuilder(false); }
    else if (item.isHalf) { setHalfBuilder(true); setBuilderPizza(null); setSticksBuilder(false); }
    else { setBuilderPizza(item.pizza); setHalfBuilder(false); setSticksBuilder(false); }
    setStage("menu");
  };

  const handleSave = (item) => {
    if (editIdx !== null) { const next = [...cart]; next[editIdx] = item; setCart(next); setToast("Updated"); }
    else { setCart([...cart, item]); setToast((item.pizza?.name || item.name) + " added"); }
    setBuilderPizza(null); setHalfBuilder(false); setSticksBuilder(false); setEditIdx(null);
    setTimeout(() => setToast(null), 2500);
  };

  const addSimple = (item, emoji) => {
    const idx = cart.findIndex((c) => c.isSimple && c.name === item.name);
    if (idx >= 0) {
      const next = [...cart];
      next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
      setCart(next);
    } else {
      setCart([...cart, { isSimple: true, name: item.name, price: item.price, unit: item.price, qty: 1, emoji }]);
    }
    setToast(item.name + " added"); setTimeout(() => setToast(null), 2500);
  };

  // ─── Address Gate ───
  if (stage === "address") return <div style={{ fontFamily: "'DM Sans',sans-serif", maxWidth: 480, margin: "0 auto" }}>{fonts}<AddressGate onConfirm={({ area, loc: l }) => { setLoc(l); setUserArea(area); setStage("menu"); }} /></div>;

  // ─── Confirmation ───
  if (stage === "confirm") return <div style={{ fontFamily: "'DM Sans',sans-serif", maxWidth: 480, margin: "0 auto" }}>{fonts}<Confirm loc={loc} cart={cart} onNew={() => { setCart([]); setStage("menu"); }} /></div>;

  // ─── Checkout ───
  if (stage === "checkout") return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", maxWidth: 480, margin: "0 auto" }}>{fonts}
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: CREAM, overflowY: "auto" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => setStage("cart")} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", fontSize: 18, color: MID, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 500, color: DARK }}>Checkout</p>
          </div>
          <Lbl>Order type</Lbl>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[{ id: "delivery", l: "🛵 Delivery" }, { id: "pickup", l: "🏪 Pickup" }].map((t) => (
              <button key={t.id} onClick={() => setOrderType(t.id)} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: orderType === t.id ? `1.5px solid ${RUST}` : `1px solid ${BORDER}`, background: orderType === t.id ? RL : "#fff", color: orderType === t.id ? RUST : DARK, fontWeight: orderType === t.id ? 600 : 400, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{t.l}</button>
            ))}
          </div>
          {orderType === "delivery" ? <>
            <Lbl>Delivery address *</Lbl>
            <input type="text" placeholder="Street, building, apartment" value={address} onChange={(e) => { setAddress(e.target.value); setCheckoutError(null); }} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${!address.trim() && checkoutError ? "#C44" : BORDER}`, background: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: DARK, outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
            <p style={{ fontSize: 12, color: MID, marginBottom: 16 }}>Delivering from Ronny's {loc?.name} · {loc?.address}</p>
          </> : <div style={{ background: GNL, border: `1px solid ${GN}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: DARK }}>Pick up from Ronny's {loc?.name}</p>
            <p style={{ fontSize: 13, color: MID }}>{loc?.address} · Ready in ~20 min</p>
          </div>}
          <Lbl>Phone number * (required for order updates)</Lbl>
          <input type="tel" placeholder="+995 5XX XXX XXX" value={phone} onChange={(e) => { setPhone(e.target.value); setCheckoutError(null); }} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${phone.replace(/\D/g, "").length < 9 && checkoutError ? "#C44" : BORDER}`, background: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: DARK, outline: "none", boxSizing: "border-box", marginBottom: 4 }} />
          <p style={{ fontSize: 12, color: MID, marginBottom: 16 }}>We'll send order updates via SMS</p>
          <Lbl>Payment</Lbl>
          {[{ id: "card", l: "💳 Card", d: "Visa / Mastercard" }, { id: "tbc", l: "📱 TBC Pay", d: "" }, { id: "bog", l: "📱 BOG Pay", d: "" }, { id: "cash", l: "💵 Cash", d: "Pay on delivery" }].map((pm) => (
            <button key={pm.id} onClick={() => setPayMethod(pm.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, border: payMethod === pm.id ? `1.5px solid ${RUST}` : `1px solid ${BORDER}`, background: payMethod === pm.id ? RL : "#fff", marginBottom: 6, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}>
              <div><p style={{ fontSize: 14, color: payMethod === pm.id ? RUST : DARK, fontWeight: payMethod === pm.id ? 600 : 400 }}>{pm.l}</p>{pm.d && <p style={{ fontSize: 12, color: MID }}>{pm.d}</p>}</div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: payMethod === pm.id ? `5px solid ${RUST}` : `1.5px solid ${BORDER}`, background: "#fff" }} />
            </button>
          ))}
          <div style={{ marginTop: 16 }}><Lbl>Special instructions</Lbl><textarea placeholder="Ring doorbell, allergies..." rows={2} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: DARK, outline: "none", boxSizing: "border-box", resize: "vertical" }} /></div>
          {checkoutError && <p style={{ color: "#C44", fontSize: 13, fontWeight: 500, marginTop: 12, padding: "8px 12px", background: "#FFF0EE", borderRadius: 8 }}>{checkoutError}</p>}
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "14px 20px", background: "#fff", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={tryPlaceOrder} style={{ width: "100%", maxWidth: 480, padding: "15px 24px", borderRadius: 24, border: "none", background: RUST, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "block", margin: "0 auto" }}>Place order — {(total + deliveryFee).toFixed(2)} ₾</button>
        </div>
      </div>
    </div>
  );

  // ─── Cart ───
  if (stage === "cart") return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", maxWidth: 480, margin: "0 auto" }}>{fonts}
      <div style={{ background: CREAM, minHeight: "100vh" }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 500, color: DARK }}>Your order</p>
          <button onClick={() => setStage("menu")} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", fontSize: 16, color: MID, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "0 20px 120px" }}>
          {cart.length === 0 && <div style={{ padding: "40px 0", textAlign: "center" }}><p style={{ fontSize: 14, color: MID }}>Your cart is empty</p><button onClick={() => setStage("menu")} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 20, border: "none", background: RUST, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Browse menu</button></div>}
          {cart.map((item, idx) => <CartItem key={idx} item={item} idx={idx} onEdit={openEdit} onRemove={(i) => setCart(cart.filter((_, j) => j !== i))} />)}
          {cart.length > 0 && <>
            <div style={{ padding: "10px 0", display: "flex", justifyContent: "space-between", fontSize: 13, color: MID }}><span>{orderType === "pickup" ? "Pickup" : "Delivery"}</span><span>{deliveryFee.toFixed(2)} ₾</span></div>
            <div style={{ padding: "10px 0", display: "flex", justifyContent: "space-between", borderTop: `1px solid ${BORDER}` }}><span style={{ fontWeight: 500, color: DARK }}>Total</span><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: RUST, fontWeight: 500 }}>{(total + deliveryFee).toFixed(2)} ₾</span></div>
          </>}
        </div>
        {cart.length > 0 && <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "14px 20px", background: "#fff", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10 }}>
          <button onClick={() => setStage("menu")} style={{ padding: "12px 16px", borderRadius: 22, border: `1px solid ${BORDER}`, background: "#fff", color: MID, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>+ Add more</button>
          <button onClick={() => setStage("checkout")} style={{ flex: 1, padding: "12px 20px", borderRadius: 22, border: "none", background: RUST, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Checkout — {(total + deliveryFee).toFixed(2)} ₾</button>
        </div>}
      </div>
    </div>
  );

  // ─── Menu ───
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fff", minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>{fonts}
      <header style={{ borderBottom: `1px solid ${BORDER}`, background: "#fff", position: "sticky", top: 0, zIndex: 100 }}><div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, background: RUST, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600 }}>R</span></div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 500, color: DARK, flex: 1 }}>Ronny's</span><span style={{ fontSize: 12, color: GN, fontWeight: 500 }}>Open 11–23</span></div></header>
      <div style={{ background: WARM, borderBottom: `1px solid ${BORDER}`, padding: "9px 16px", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 13 }}>📍</span><p style={{ fontSize: 13, color: DARK, flex: 1 }}><span style={{ fontWeight: 500 }}>{userArea}</span><span style={{ color: MID }}> · Ronny's {loc?.name} · ~35 min</span></p><button onClick={() => setStage("address")} style={{ fontSize: 12, color: RUST, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Change</button></div>

      <main style={{ padding: "16px 16px 100px" }}>
        {/* Reorder banner — shows when returning customer has a last order */}
        {lastOrder && <div style={{ background: RL, border: `1.5px solid ${RUST}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 500, color: RUST, marginBottom: 3 }}>Welcome back</p>
            <p style={{ fontSize: 13, color: MID }}>Your last order · {lastOrder.summary?.cart?.map((c) => c.name).join(", ")}</p>
          </div>
          <button onClick={reorder} style={{ padding: "10px 18px", borderRadius: 20, border: "none", background: RUST, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Reorder</button>
        </div>}
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: DARK, marginBottom: 4 }}>Our pizzas</p>
        <p style={{ fontSize: 13, color: MID, marginBottom: 14 }}>Tap to customize · made fresh at Ronny's {loc?.name}</p>
        {/* Half & Half */}
        <div onClick={() => { setHalfBuilder(true); setEditIdx(null); }} style={{ background: RL, border: `1.5px solid ${RUST}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", border: `2px dashed ${RUST}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>½</div>
          <div><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: RUST }}>Build a Half & Half</p><p style={{ fontSize: 12, color: MID }}>Pick any 2 pizzas, customize each side</p></div>
        </div>
        {/* Pizza grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{pizzas.map((p) => <PizzaCard key={p.id} pizza={p} onClick={() => { setBuilderPizza(p); setEditIdx(null); }} />)}</div>

        {/* Extras: Sticks, then Dessert, Sauces, Drinks */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: DARK, marginBottom: 10 }}>Sticks</p>
          <div onClick={() => { setSticksBuilder(true); setEditIdx(null); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${RUST}`, background: RL, cursor: "pointer", marginBottom: 6 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", border: `2px dashed ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src={sticksProduct.img} alt="Super Sticks" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 500, color: RUST }}>{sticksProduct.name}</p>
              <p style={{ fontSize: 12, color: MID }}>Customize with toppings & seasonings</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 14, color: RUST, fontWeight: 600 }}>From {sticksProduct.basePrice.toFixed(2)} ₾</p>
            </div>
          </div>
          <div onClick={() => addSimple({ name: "Sweet Cinnamon Sticks", price: 4.2, desc: "Sprinkled with cinnamon and sugar, fresh and golden brown" }, "🍯")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer" }}>
            <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 500, color: DARK }}>Sweet Cinnamon Sticks</p><p style={{ fontSize: 13, color: MID }}>Crusty outside, soft inside. Fresh, hot, golden brown.</p></div>
            <span style={{ fontSize: 15, color: RUST, fontWeight: 600, whiteSpace: "nowrap" }}>4.20 ₾</span>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: RUST, flexShrink: 0 }}>+</div>
          </div>
        </div>
        {extras.map((cat) => (
          <div key={cat.cat} style={{ marginTop: 28 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: DARK, marginBottom: 10 }}>{cat.cat}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cat.items.map((item) => (
                <div key={item.name} onClick={() => addSimple(item, cat.emoji)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer" }}>
                  <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 500, color: DARK }}>{item.name}</p>{item.desc && <p style={{ fontSize: 13, color: MID }}>{item.desc}</p>}</div>
                  <span style={{ fontSize: 15, color: RUST, fontWeight: 600, whiteSpace: "nowrap" }}>{item.price.toFixed(2)} ₾</span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: RUST, flexShrink: 0 }}>+</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* SEO Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: DARK, marginBottom: 8 }}>Pizza delivery across Tbilisi</p>
          <p style={{ fontSize: 13, color: MID, lineHeight: 1.7, marginBottom: 12 }}>Ronny's has been making life better since 2009. Free delivery from 5 locations across Tbilisi. Call 032 2 472 472 or order right here.</p>
          {locations.map((l) => <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: MID, padding: "4px 0", borderBottom: `1px solid ${BORDER}` }}><span style={{ fontWeight: 500, color: DARK }}>Ronny's {l.name}</span><span>{l.address}</span></div>)}
          <p style={{ fontSize: 12, color: MID, marginTop: 10 }}>032 2 472 472 · Open 11:00–23:00 daily</p>
        </div>
      </main>

      {/* Floating cart bar */}
      {cart.length > 0 && <div onClick={() => setStage("cart")} style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: RUST, padding: "0 16px", zIndex: 900, boxShadow: "0 -4px 24px rgba(42,31,20,.18)", cursor: "pointer" }}><div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ background: "rgba(255,255,255,.2)", borderRadius: 16, padding: "3px 10px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{itemCt}</span><span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>View order</span></div><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#fff", fontWeight: 500 }}>{total.toFixed(2)} ₾</span></div></div>}
      {toast && <div style={{ position: "fixed", bottom: cart.length > 0 ? 70 : 20, left: "50%", transform: "translateX(-50%)", background: DARK, color: "#fff", borderRadius: 14, padding: "12px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 32px rgba(42,31,20,.25)", zIndex: 1100 }}><span style={{ color: GN, fontSize: 16 }}>✓</span>{toast}</div>}
      {builderPizza && <Builder pizza={builderPizza} editItem={editIdx !== null ? cart[editIdx] : null} onClose={() => { setBuilderPizza(null); setEditIdx(null); }} onSave={handleSave} />}
      {halfBuilder && <HalfBuilder editItem={editIdx !== null ? cart[editIdx] : null} onClose={() => { setHalfBuilder(false); setEditIdx(null); }} onSave={handleSave} />}
      {sticksBuilder && <SticksBuilder editItem={editIdx !== null ? cart[editIdx] : null} onClose={() => { setSticksBuilder(false); setEditIdx(null); }} onSave={handleSave} />}
    </div>
  );
}
