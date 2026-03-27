"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";

// ── Data ──────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Reverse Osmosis System",      icon: "🔬", img: null, desc: "Multi-stage RO systems for crystal-clear drinking water at home." },
  { name: "Cartridges & Accessories",    icon: "🔧", img: null, desc: "Replacement filters, membranes & spare parts for all brands." },
  { name: "Whole House Water Softener",  icon: "🏠", img: null, desc: "Full-home softening systems to protect pipes & appliances." },
  { name: "Domestic Water Filter",       icon: "🚰", img: null, desc: "Compact under-sink & countertop filters for daily home use." },
  { name: "Commercial Water Plants",     icon: "🏭", img: null, desc: "Industrial-grade plants for offices, factories & communities." },
];

const TRUST = [
  { icon: "✅", title: "Genuine Products",    desc: "100% authentic, tested water filtration equipment." },
  { icon: "🔧", title: "Free Installation",   desc: "Our technicians install at your doorstep, free of charge." },
  { icon: "📞", title: "After-Sale Support",  desc: "Call 0304-2604217 anytime for help & complaints." },
  { icon: "🚚", title: "Fast Delivery",       desc: "Delivered across Rahim Yar Khan & all of Pakistan." },
];

const STATS = [
  { value: "1000+", label: "Happy Customers" },
  { value: "10+",   label: "Years Experience" },
  { value: "5",     label: "Product Categories" },
  { value: "24/7",  label: "Customer Support" },
];

// ── Ticker ────────────────────────────────────────────────────
function Ticker() {
  const items = ["Free Installation on All Products", "Cash on Delivery Available", "Call: 0304-2604217", "Serving All Across Pakistan", "Genuine Water Filter Products"];
  return (
    <div style={{ background: "#0057a8", overflow: "hidden", padding: "8px 0" }}>
      <div style={{ display: "flex", animation: "ticker 30s linear infinite", whiteSpace: "nowrap" }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} style={{ color: "#fff", fontSize: 13, fontWeight: 500, padding: "0 40px" }}>
            ⭐ {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

// ── Category Card ─────────────────────────────────────────────
function CategoryCard({ cat }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: "none" }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: hov ? "0 12px 40px rgba(0,87,168,0.18)" : "0 2px 16px rgba(0,0,0,0.07)", border: `2px solid ${hov ? "#0057a8" : "transparent"}`, transition: "all 0.3s", cursor: "pointer" }}>
        {/* Image area */}
        <div style={{ background: "linear-gradient(135deg, #e8f4ff 0%, #cce5ff 100%)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <span style={{ fontSize: 64, transition: "transform 0.3s", transform: hov ? "scale(1.15)" : "scale(1)" }}>{cat.icon}</span>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(transparent, rgba(0,87,168,0.08))" }} />
        </div>
        {/* Text */}
        <div style={{ padding: "18px 20px 20px" }}>
          <h3 style={{ color: "#0057a8", fontWeight: 800, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>{cat.name}</h3>
          <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{cat.desc}</p>
          <span style={{ color: hov ? "#fff" : "#0057a8", background: hov ? "#0057a8" : "rgba(0,87,168,0.08)", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, transition: "all 0.3s" }}>
            Browse →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Home() {
  const { products, loadProducts } = useProducts();
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % CATEGORIES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div style={{ background: "#f5f8ff", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1a1a2e" }}>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, #0057a8 0%, #003d7a 60%, #001f4d 100%)", padding: "70px 0 80px", position: "relative", overflow: "hidden" }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", top: -150, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", bottom: -80, left: 60, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, padding: "6px 18px", fontSize: 13, color: "#7dd3fc", marginBottom: 24, fontWeight: 600 }}>
              🇵🇰 Trusted in Pakistan Since 2010
            </div>
            <h1 style={{ fontSize: "clamp(32px,4vw,58px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 20, letterSpacing: -0.5 }}>
              Pure Water for<br />
              <span style={{ color: "#7dd3fc" }}>Every Home &</span><br />
              <span style={{ color: "#38bdf8" }}>Business</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
              AQUA R.O Filter — Rahim Yar Khan's most trusted water filtration specialists. RO systems, domestic filters, softeners & commercial plants with free installation.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/shop" style={{ background: "#38bdf8", color: "#001f4d", padding: "14px 36px", borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none", display: "inline-block", boxShadow: "0 4px 20px rgba(56,189,248,0.4)" }}>
                Shop Now →
              </Link>
              <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
                style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.3)", color: "#fff", padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-block" }}>
                💬 WhatsApp Us
              </a>
            </div>
            {/* quick contact */}
            <div style={{ marginTop: 36, display: "flex", gap: 24, flexWrap: "wrap" }}>
              <a href="tel:03042604217" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                📞 0304-2604217
              </a>
              <a href="tel:0682098583" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                ☎️ 068-2098583
              </a>
            </div>
          </div>

          {/* Hero right — animated category showcase */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: 40, textAlign: "center", width: "100%", maxWidth: 340 }}>
              <div style={{ fontSize: 90, marginBottom: 20, transition: "all 0.5s" }}>{CATEGORIES[heroIdx].icon}</div>
              <div style={{ color: "#7dd3fc", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{CATEGORIES[heroIdx].name}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>{CATEGORIES[heroIdx].desc}</div>
              {/* dots */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
                {CATEGORIES.map((_, i) => (
                  <div key={i} onClick={() => setHeroIdx(i)}
                    style={{ width: i === heroIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === heroIdx ? "#38bdf8" : "rgba(255,255,255,0.3)", transition: "all 0.3s", cursor: "pointer" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "#0057a8", padding: "28px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.15)", paddingRight: 20 }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: "72px 0", background: "#f5f8ff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ color: "#0057a8", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>What We Offer</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>Shop By Category</h2>
            <p style={{ color: "#64748b", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Find the right water filtration solution for your home or business</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {CATEGORIES.map(cat => <CategoryCard key={cat.name} cat={cat} />)}
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section style={{ background: "#fff", padding: "64px 0", borderTop: "1px solid #e8f0fe", borderBottom: "1px solid #e8f0fe" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: "#0057a8", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Why Choose Us</div>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1a1a2e" }}>The AQUA R.O Filter Promise</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 24 }}>
            {TRUST.map(t => (
              <div key={t.title} style={{ background: "#f5f8ff", borderRadius: 16, padding: "28px 24px", textAlign: "center", border: "1px solid #e8f0fe" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{t.icon}</div>
                <h3 style={{ color: "#0057a8", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{t.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: "72px 0", background: "#f5f8ff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "#0057a8", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Top Picks</div>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1a1a2e" }}>Featured Products</h2>
            </div>
            <Link href="/shop" style={{ background: "#0057a8", color: "#fff", padding: "11px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              View All Products →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 24 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ fontSize: 16 }}>Products will appear here once added from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── About strip ── */}
      <section style={{ background: "#fff", padding: "64px 0", borderTop: "1px solid #e8f0fe" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ color: "#0057a8", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1a1a2e", marginBottom: 16, lineHeight: 1.25 }}>Rahim Yar Khan's Most Trusted Water Filter Company</h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
              AQUA R.O Filter has been providing clean, pure water solutions to homes and businesses in Rahim Yar Khan for over 10 years. We specialize in RO systems, domestic filters, whole-house softeners, and large-scale commercial water plants.
            </p>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
              📍 Jamia Tul Farooq Road, OPP. Abbasi PSO Pump, Old Adda Khanpur, Rahim Yar Khan
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="tel:03042604217" style={{ background: "#0057a8", color: "#fff", padding: "11px 22px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>📞 Call Us</a>
              <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
                style={{ background: "#25D366", color: "#fff", padding: "11px 22px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>💬 WhatsApp</a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { num: "1000+", txt: "Satisfied Customers" },
              { num: "10+",   txt: "Years in Business" },
              { num: "5",     txt: "Product Categories" },
              { num: "Free",  txt: "Installation Service" },
            ].map(i => (
              <div key={i.num} style={{ background: "#f5f8ff", borderRadius: 14, padding: 24, textAlign: "center", border: "1px solid #e8f0fe" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#0057a8", marginBottom: 6 }}>{i.num}</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>{i.txt}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: "linear-gradient(135deg, #0057a8, #003d7a)", padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: "#fff", marginBottom: 14 }}>Ready for Pure, Clean Water?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, marginBottom: 10 }}>Contact us today for a free consultation and quote.</p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 36 }}>
            📍 Old Adda Khanpur, Rahim Yar Khan &nbsp;|&nbsp; ✉️ aquarowaterfilter@gmail.com
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/shop" style={{ background: "#38bdf8", color: "#001f4d", padding: "14px 36px", borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none" }}>
              Shop All Products
            </Link>
            <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              💬 WhatsApp Order
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}