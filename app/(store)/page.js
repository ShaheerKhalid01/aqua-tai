"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";

// ── Hero Slides ───────────────────────────────────────────────
const SLIDES = [
  {
    tag: "Best Quality",
    headline: "Pure Water for\nYour Family",
    sub: "Advanced Reverse Osmosis Systems — Installed Free at Your Doorstep",
    cta: "Shop RO Systems",
    cat: "Reverse Osmosis System",
    bg: "linear-gradient(120deg,#003d7a 0%,#0057a8 50%,#0070cc 100%)",
    icon: "🔬",
  },
  {
    tag: "Free Installation",
    headline: "Whole House\nWater Softeners",
    sub: "Protect Your Pipes & Appliances with Premium Softening Systems",
    cta: "View Softeners",
    cat: "Whole House Water Softener",
    bg: "linear-gradient(120deg,#065f46 0%,#047857 50%,#059669 100%)",
    icon: "🏠",
  },
  {
    tag: "Commercial Grade",
    headline: "Water Plants for\nBusiness & Industry",
    sub: "Large-Scale RO Plants from 500 LPH to 10,000 LPH — Custom Built",
    cta: "Explore Plants",
    cat: "Commercial Water Plants",
    bg: "linear-gradient(120deg,#4c1d95 0%,#6d28d9 50%,#7c3aed 100%)",
    icon: "🏭",
  },
];

// ── Categories ────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Reverse Osmosis System",     icon: "🔬", color: "#0057a8", light: "#dbeafe" },
  { name: "Cartridges & Accessories",   icon: "🔧", color: "#047857", light: "#d1fae5" },
  { name: "Whole House Water Softener", icon: "🏠", color: "#7c3aed", light: "#ede9fe" },
  { name: "Domestic Water Filter",      icon: "🚰", color: "#b45309", light: "#fef3c7" },
  { name: "Commercial Water Plants",    icon: "🏭", color: "#be123c", light: "#ffe4e6" },
];

// ── Features ──────────────────────────────────────────────────
const FEATURES = [
  { icon: "🚚", title: "Free Delivery",      desc: "We deliver across Rahim Yar Khan & all of Pakistan." },
  { icon: "🔧", title: "Free Installation",  desc: "Expert technicians install your system at no cost." },
  { icon: "✅", title: "Genuine Products",   desc: "100% authentic, tested water filtration equipment." },
  { icon: "📞", title: "24/7 Support",       desc: "Call 0304-2604217 for after-sale support anytime." },
];

// ── Hero Slider ───────────────────────────────────────────────
function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setIdx(next); setAnimating(false); }, 300);
  };

  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [idx]);

  const s = SLIDES[idx];

  return (
    <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: s.bg, transition: "background 0.5s" }}>
        {/* decorative shapes */}
        <div style={{ position: "absolute", right: -60, top: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 80, bottom: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 40 }}>
          <div style={{ opacity: animating ? 0 : 1, transform: animating ? "translateX(-20px)" : "translateX(0)", transition: "all 0.3s" }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 30, padding: "5px 16px", fontSize: 12, color: "#fff", marginBottom: 20, fontWeight: 600, letterSpacing: 1 }}>
              ⭐ {s.tag}
            </div>
            <h1 style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 18, whiteSpace: "pre-line" }}>
              {s.headline}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>{s.sub}</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href={`/shop?category=${encodeURIComponent(s.cat)}`}
                style={{ background: "#fff", color: s.bg.includes("003d7a") ? "#0057a8" : s.bg.includes("065f46") ? "#047857" : "#7c3aed", padding: "13px 32px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                {s.cta} →
              </Link>
              <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
                style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", padding: "13px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 160, opacity: animating ? 0 : 0.9, transform: animating ? "scale(0.8)" : "scale(1)", transition: "all 0.4s", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}>
              {s.icon}
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button onClick={() => go((idx - 1 + SLIDES.length) % SLIDES.length)}
          style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 44, height: 44, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <button onClick={() => go((idx + 1) % SLIDES.length)}
          style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 44, height: 44, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>

        {/* Dots */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => go(i)}
              style={{ width: i === idx ? 28 : 10, height: 10, borderRadius: 5, background: i === idx ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function Home() {
  const { products, loadProducts } = useProducts();
  useEffect(() => { loadProducts(); }, []);
  const featured = products.slice(0, 4);

  return (
    <div style={{ background: "#f7f9fc", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1a1a2e" }}>

      {/* Hero Slider */}
      <HeroSlider />

      {/* ── Features bar ── */}
      <section style={{ background: "#0057a8", padding: "0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{ padding: "22px 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{f.title}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: "64px 0", background: "#f7f9fc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Explore Our Range</p>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1a1a2e" }}>Shop By Category</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,87,168,0.07)", border: "2px solid transparent", transition: "all 0.3s", textAlign: "center", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${cat.color}`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,87,168,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,87,168,0.07)"; }}>
                  {/* Image/icon area */}
                  <div style={{ background: cat.light, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
                    {cat.icon}
                  </div>
                  {/* Label */}
                  <div style={{ padding: "14px 12px" }}>
                    <div style={{ color: cat.color, fontWeight: 800, fontSize: 13, lineHeight: 1.3 }}>{cat.name}</div>
                    <div style={{ color: cat.color, fontSize: 12, marginTop: 6, fontWeight: 600, opacity: 0.7 }}>View Products →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: "64px 0", background: "#fff", borderTop: "1px solid #e8f0fe" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <div>
              <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Handpicked</p>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: "#1a1a2e" }}>Featured Products</h2>
            </div>
            <Link href="/shop" style={{ background: "#0057a8", color: "#fff", padding: "11px 26px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              View All →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: 22 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", background: "#f7f9fc", borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ fontSize: 16 }}>Products will appear here once added from admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: "64px 0", background: "#f7f9fc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>About Us</p>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#1a1a2e", marginBottom: 18, lineHeight: 1.25 }}>Rahim Yar Khan's Most Trusted Water Filter Specialists</h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              AQUA R.O Filter has served homes and businesses in Rahim Yar Khan for over 10 years. We provide genuine, tested RO systems, domestic filters, water softeners, and large-scale commercial plants — with free professional installation.
            </p>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
              📍 Jamia Tul Farooq Road, OPP. Abbasi PSO Pump, Old Adda Khanpur, Rahim Yar Khan
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="tel:03042604217" style={{ background: "#0057a8", color: "#fff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>📞 0304-2604217</a>
              <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
                style={{ background: "#25D366", color: "#fff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>💬 WhatsApp</a>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { num: "1000+", label: "Happy Customers", icon: "😊" },
              { num: "10+",   label: "Years Experience", icon: "🏆" },
              { num: "5",     label: "Product Categories", icon: "📦" },
              { num: "Free",  label: "Installation", icon: "🔧" },
            ].map(s => (
              <div key={s.num} style={{ background: "#fff", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "1px solid #e8f0fe", boxShadow: "0 2px 12px rgba(0,87,168,0.05)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#0057a8", marginBottom: 6 }}>{s.num}</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section style={{ background: "linear-gradient(135deg,#003d7a,#0057a8,#0070cc)", padding: "56px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginBottom: 10 }}>Ready for Pure, Clean Water?</h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>Order online or call us — free installation included with every purchase.</p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", flexShrink: 0 }}>
            <Link href="/shop" style={{ background: "#fff", color: "#0057a8", padding: "14px 32px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              Shop Now →
            </Link>
            <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              💬 Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}