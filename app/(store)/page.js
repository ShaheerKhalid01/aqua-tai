"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";

// Category icons & accent colors for visual variety
const CATEGORY_STYLE = {
  "Reverse Osmosis System": { icon: "💧", accent: "#0057a8", bg: "#eff6ff" },
  "Domestic Water Filter": { icon: "🚰", accent: "#047857", bg: "#f0fdf4" },
  "Commercial RO System": { icon: "🏭", accent: "#7c3aed", bg: "#faf5ff" },
  "UV Water Purifier": { icon: "🔬", accent: "#0e7490", bg: "#ecfeff" },
  "Water Softener": { icon: "🌊", accent: "#b45309", bg: "#fffbeb" },
  "Accessories and Parts": { icon: "🔧", accent: "#be123c", bg: "#fff1f2" },
  "Whole House Water Softener": { icon: "🏠", accent: "#059669", bg: "#f0fdf4" },
  "Cartridges & Accessories": { icon: "⚙️", accent: "#6366f1", bg: "#eef2ff" },
  "Commercial Water Plants": { icon: "🏗️", accent: "#9333ea", bg: "#faf5ff" },
};

// ── Hero Slides ───────────────────────────────────────────────
const SLIDES = [
  {
    tag: "Best Quality",
    headline: "PURE WATER -\nHEALTHY LIFE",
    sub: "Advanced Reverse Osmosis Systems — Installed Free at Your Doorstep",
    cta: "Shop RO Systems",
    cat: "Reverse Osmosis System",
    bg: "linear-gradient(120deg,#003d7a 0%,#0057a8 50%,#0070cc 100%)",
    icon: "/1.png",
  },
  {
    tag: "Free Installation",
    headline: "Whole House\nWater Softeners",
    sub: "Protect Your Pipes & Appliances with Premium Softening Systems",
    cta: "View Softeners",
    cat: "Water Softener",
    bg: "linear-gradient(120deg,#065f46 0%,#047857 50%,#059669 100%)",
    icon: "/2.png",
  },
  {
    tag: "Commercial Grade",
    headline: "Water Plants for\nBusiness & Industry",
    sub: "Large-Scale RO Plants from 500 LPH to 10,000 LPH — Custom Built",
    cta: "Explore Plants",
    cat: "Commercial RO System",
    bg: "linear-gradient(120deg,#4c1d95 0%,#6d28d9 50%,#7c3aed 100%)",
    icon: "/3.png",
  },
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
    <div className="hero-slider" style={{ position: "relative", height: 600, overflow: "hidden" }}>
      {/* Background image */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, transition: "opacity 0.5s" }}>
        <img src={s.icon} alt={s.headline} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        {/* Dark overlay for text readability */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
      </div>

      {/* Text content overlay */}
      <div className="hero-content" style={{ position: "relative", zIndex: 1, width: "100%", padding: "0 24px", height: "100%", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 600, opacity: animating ? 0 : 1, transform: animating ? "translateX(-20px)" : "translateX(0)", transition: "all 0.3s" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 30, padding: "5px 16px", fontSize: 11, color: "#fff", marginBottom: 16, fontWeight: 600, letterSpacing: 1 }}>
            ⭐ {s.tag}
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,54px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 14, whiteSpace: "pre-line", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
            {s.headline}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(13px,2.5vw,16px)", lineHeight: 1.6, marginBottom: 24, maxWidth: 500, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>{s.sub}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={`/shop?category=${encodeURIComponent(s.cat)}`}
              style={{ background: "#fff", color: "#0057a8", padding: "11px 24px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              {s.cta} →
            </Link>
            <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", padding: "11px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

        {/* Navigation controls */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Arrows (hidden on small mobile via CSS class) */}
          <button className="hero-arrows" onClick={() => { go((idx - 1 + SLIDES.length) % SLIDES.length); }}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "auto", zIndex: 10 }}>‹</button>
          <button className="hero-arrows" onClick={() => { go((idx + 1) % SLIDES.length); }}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "auto", zIndex: 10 }}>›</button>

          {/* Dots */}
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, pointerEvents: "auto", zIndex: 10 }}>
            {SLIDES.map((_, i) => (
              <div key={i} onClick={() => { go(i); }}
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

  // Group products by category (only categories that have products)
  const productsByCategory = useMemo(() => {
    const grouped = {};
    products.forEach(p => {
      if (!p.category) return;
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return Object.entries(grouped); // [[categoryName, products[]], ...]
  }, [products]);

  return (
    <div style={{ background: "#f7f9fc", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1a1a2e" }}>

      {/* Hero Slider */}
      <HeroSlider />

      {/* ── Features Bar ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e8f0fe", padding: "28px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px 20px" }} className="features-bar">
            {[
              { icon: "💧", title: "AQUA RO System", desc: "Pure & Safe Water" },
              { icon: "🚚", title: "Fast Delivery", desc: "All Over Pakistan" },
              { icon: "🎧", title: "Customer Support", desc: "24/7 Service" },
              { icon: "🏷️", title: "Heavy Discount", desc: "Up to 30% Off" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: "36px 0", background: "#fff", borderTop: "1px solid #e8f0fe" }} className="featured-section">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Handpicked</p>
              <h2 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#1a1a2e" }}>Featured Products</h2>
            </div>
            <Link href="/shop" style={{ background: "#0057a8", color: "#fff", padding: "10px 22px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
              View All →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8", background: "#f7f9fc", borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                <img src="/2.jpeg" alt="Products" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 16 }} />
              </div>
              <p style={{ fontSize: 15 }}>Products will appear here once added from admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Category Sections — one per category ── */}
      {productsByCategory.map(([categoryName, categoryProducts], idx) => {
        const style = CATEGORY_STYLE[categoryName] || { icon: "📦", accent: "#0057a8", bg: "#eff6ff" };
        const displayProducts = categoryProducts.slice(0, 4); // Show up to 4 per category
        const hasMore = categoryProducts.length > 4;

        return (
          <section
            key={categoryName}
            style={{
              padding: "36px 0",
              background: idx % 2 === 0 ? "#f7f9fc" : "#fff",
              borderTop: "1px solid #e8f0fe",
            }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
              {/* Category Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, background: style.bg, borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, border: `1px solid ${style.bg}`, flexShrink: 0,
                  }}>
                    {style.icon}
                  </div>
                  <div>
                    <p style={{ color: style.accent, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                      {categoryProducts.length} Product{categoryProducts.length !== 1 ? "s" : ""}
                    </p>
                    <h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#1a1a2e", lineHeight: 1.2 }}>
                      {categoryName}
                    </h2>
                  </div>
                </div>
                <Link
                  href={`/shop?category=${encodeURIComponent(categoryName)}`}
                  style={{
                    background: style.bg, color: style.accent, border: `1px solid ${style.accent}20`,
                    padding: "8px 18px", borderRadius: 8, textDecoration: "none",
                    fontWeight: 700, fontSize: 13, transition: "all 0.2s",
                  }}
                >
                  View All {categoryName} →
                </Link>
              </div>

              {/* Products Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="products-grid">
                {displayProducts.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Show more indicator if > 4 products */}
              {hasMore && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(categoryName)}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#fff", border: "1px solid #e8f0fe",
                      color: style.accent, padding: "10px 24px", borderRadius: 10,
                      textDecoration: "none", fontWeight: 700, fontSize: 13,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    View all {categoryProducts.length} products in {categoryName} →
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* ── Simple Promo Banner ── */}
      <section style={{ background: "#0057a8", padding: "28px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 900, color: "#fff", marginBottom: 8 }}>Get Free Installation on Every Order</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 18 }}>Serving Rahim Yar Khan and all over Pakistan</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" style={{ background: "#fff", color: "#0057a8", padding: "11px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Shop Now →
            </Link>
            <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", padding: "11px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── High Quality Material Section ── */}
      <section style={{ padding: "40px 0", background: "#fff", borderTop: "1px solid #e8f0fe" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Our Commitment</p>
            <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>High Quality Material</h2>
            <p style={{ color: "#64748b", fontSize: 14, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Every AQUA R.O Filter product is built with premium food-grade materials, tested for durability and certified safe for drinking water use.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }} className="features-grid">
            {[
              { icon: "🏅", title: "Food Grade Materials", desc: "All components are made from certified food-safe, BPA-free materials that meet international drinking water standards.", color: "#0057a8", bg: "#eff6ff" },
              { icon: "⚗️", title: "Advanced Filtration", desc: "Multi-stage filtration technology removes 99.9% of contaminants including bacteria, heavy metals, chlorine and TDS.", color: "#047857", bg: "#f0fdf4" },
              { icon: "🔬", title: "Lab Tested & Certified", desc: "Every filter is tested in our quality lab before dispatch to ensure consistent performance and purity standards.", color: "#7c3aed", bg: "#faf5ff" },
              { icon: "⚡", title: "Long Filter Life", desc: "Our cartridges and membranes are engineered for extended lifespan, reducing replacement frequency and cost.", color: "#b45309", bg: "#fffbeb" },
              { icon: "🌊", title: "High Flow Rate", desc: "Optimized water flow systems ensure you get fresh, filtered water quickly without pressure drops.", color: "#0e7490", bg: "#ecfeff" },
              { icon: "🛡️", title: "2-Year Warranty", desc: "All our RO systems come with a 2-year manufacturer warranty and lifetime after-sale service support.", color: "#be123c", bg: "#fff1f2" },
            ].map(f => (
              <div key={f.title} style={{ background: f.bg, borderRadius: 14, padding: "22px 20px", border: `1px solid ${f.bg}`, transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ color: f.color, fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: "36px 0", background: "#f7f9fc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "1fr", gap: 28, alignItems: "center" }} className="about-grid">
          <div>
            <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>About Us</p>
            <h2 style={{ fontSize: "clamp(26px,4vw,34px)", fontWeight: 900, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.25 }}>Rahim Yar Khan&apos;s Most Trusted Water Filter Specialists</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>
              AQUA R.O Filter has served homes and businesses in Rahim Yar Khan for over 10 years. We provide genuine, tested RO systems, domestic filters, water softeners, and large-scale commercial plants — with free professional installation.
            </p>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
              📍 Jamia Tul Farooq Road, OPP. Abbasi PSO Pump, Old Adda Khanpur, Rahim Yar Khan
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="tel:03042604217" style={{ background: "#0057a8", color: "#fff", padding: "11px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>📞 0304-2604217</a>
              <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
                style={{ background: "#25D366", color: "#fff", padding: "11px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>💬 WhatsApp</a>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }} className="stats-grid">
            {[
              { num: "1000+", label: "Happy Customers", icon: "😊" },
              { num: "10+",   label: "Years Experience", icon: "🏆" },
              { num: "5",     label: "Product Categories", icon: "📦" },
              { num: "Free",  label: "Installation", icon: "🔧" },
            ].map(s => (
              <div key={s.num} style={{ background: "#fff", borderRadius: 14, padding: "22px 16px", textAlign: "center", border: "1px solid #e8f0fe", boxShadow: "0 2px 12px rgba(0,87,168,0.05)" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, color: "#0057a8", marginBottom: 4 }}>{s.num}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section style={{ background: "linear-gradient(135deg,#003d7a,#0057a8,#0070cc)", padding: "36px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "1fr", alignItems: "center", gap: 20, textAlign: "center" }} className="cta-grid">
          <div>
            <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 900, color: "#fff", marginBottom: 8 }}>Ready for Pure, Clean Water?</h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>Order online or call us — free installation included with every purchase.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0, justifyContent: "center" }}>
            <Link href="/shop" style={{ background: "#fff", color: "#0057a8", padding: "13px 28px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              Shop Now →
            </Link>
            <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
              style={{ background: "#25D366", color: "#fff", padding: "13px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              💬 Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}