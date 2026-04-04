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
    icon: "/1.jpeg",
  },
  {
    tag: "Free Installation",
    headline: "Whole House\nWater Softeners",
    sub: "Protect Your Pipes & Appliances with Premium Softening Systems",
    cta: "View Softeners",
    cat: "Water Softener",
    bg: "linear-gradient(120deg,#065f46 0%,#047857 50%,#059669 100%)",
    icon: "/2.jpeg",
  },
  {
    tag: "Commercial Grade",
    headline: "Water Plants for\nBusiness & Industry",
    sub: "Large-Scale RO Plants from 500 LPH to 10,000 LPH — Custom Built",
    cta: "Explore Plants",
    cat: "Commercial RO System",
    bg: "linear-gradient(120deg,#4c1d95 0%,#6d28d9 50%,#7c3aed 100%)",
    icon: "/3.jpeg",
  },
];

// ── Categories ────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Reverse Osmosis System",     icon: "/1.jpeg", color: "#0057a8", light: "#dbeafe" },
  { name: "Domestic Water Filter",         icon: "/2.jpeg", color: "#047857", light: "#d1fae5" },
  { name: "Commercial RO System",          icon: "/3.jpeg", color: "#7c3aed", light: "#ede9fe" },
  { name: "UV Water Purifier",            icon: "/4.jpeg", color: "#b45309", light: "#fef3c7" },
  { name: "Water Softener",              icon: "/5.jpeg", color: "#be123c", light: "#ffe4e6" },
  { name: "Accessories and Parts",        icon: "/2.jpeg", color: "#64748b", light: "#f1f5f9" },
];

// ── Features ──────────────────────────────────────────────────
const FEATURES = [
  { icon: "/1.jpeg", title: "Free Delivery",      desc: "We deliver across Rahim Yar Khan & all of Pakistan." },
  { icon: "/2.jpeg", title: "Free Installation",  desc: "Expert technicians install your system at no cost." },
  { icon: "/3.jpeg", title: "Genuine Products",   desc: "100% authentic, tested water filtration equipment." },
  { icon: "/4.jpeg", title: "24/7 Support",       desc: "Call 0304-2604217 for after-sale support anytime." },
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
              <img src={s.icon} alt={s.headline} style={{ width: 220, height: 220, objectFit: "cover", borderRadius: 20 }} />
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
              <div style={{ width: 56, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={f.icon} alt={f.title} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
              </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,87,168,0.07)", border: "2px solid transparent", transition: "all 0.3s", textAlign: "center", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${cat.color}`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,87,168,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,87,168,0.07)"; }}>
                  {/* Image/icon area */}
                  <div style={{ background: cat.light, height: 140, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={cat.icon} alt={cat.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12 }} />
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
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                <img src="/2.jpeg" alt="Products" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 16 }} />
              </div>
              <p style={{ fontSize: 16 }}>Products will appear here once added from admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Domestic Water Filter Banner ── */}
      <section style={{ padding: "60px 0", background: "#f7f9fc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,87,168,0.12)" }}>
            {/* Left — image */}
            <div style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", minHeight: 340, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <img src="/2.jpeg" alt="Domestic Water Filter" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 20, opacity: 0.8 }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, background: "#0057a8", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Domestic Range</div>
            </div>
            {/* Right — content */}
            <div style={{ background: "#0057a8", padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>For Your Home</div>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginBottom: 16, lineHeight: 1.25 }}>Domestic Water Filters</h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Clean, safe drinking water for your family with our range of domestic water filters. Compact, easy to install, and highly effective at removing contaminants.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={`/shop?category=${encodeURIComponent("Domestic Water Filter")}`}
                  style={{ background: "#fff", color: "#0057a8", padding: "12px 26px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                  Shop Now →
                </Link>
                <Link href="/shop"
                  style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter & Accessories Banner ── */}
      <section style={{ padding: "0 0 60px", background: "#f7f9fc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(4,120,87,0.12)" }}>
            {/* Left — content */}
            <div style={{ background: "#047857", padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ color: "#6ee7b7", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Spare Parts & More</div>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginBottom: 16, lineHeight: 1.25 }}>Filter Cartridges & Accessories</h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Keep your water filter performing at its best with genuine replacement cartridges, membranes, fittings and accessories for all major brands.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={`/shop?category=${encodeURIComponent("Cartridges & Accessories")}`}
                  style={{ background: "#fff", color: "#047857", padding: "12px 26px", borderRadius: 8, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                  Shop Now →
                </Link>
                <Link href="/shop"
                  style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", padding: "12px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  View All
                </Link>
              </div>
            </div>
            {/* Right — image */}
            <div style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", minHeight: 340, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <img src="/2.jpeg" alt="Accessories" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 20, opacity: 0.8 }} />
              <div style={{ position: "absolute", bottom: 20, right: 20, background: "#047857", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Accessories Range</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Width Promo Banner ── */}
      <section style={{ background: "linear-gradient(120deg, #0f172a 0%, #0057a8 50%, #0284c7 100%)", padding: "56px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -80, top: "50%", transform: "translateY(-50%)", fontSize: 200, opacity: 0.06, pointerEvents: "none" }}>
        <img src="/2.jpeg" alt="Tools" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 20 }} />
      </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ color: "#7dd3fc", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Limited Time Offer</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
              Get Pure Water<br />
              <span style={{ color: "#7dd3fc" }}>Delivered to Your Door</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
              Order any RO system today and get <strong style={{ color: "#fff" }}>free installation</strong> by our certified technicians. Serving Rahim Yar Khan and surrounding areas.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/shop" style={{ background: "#fff", color: "#0057a8", padding: "13px 30px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
                Order Now →
              </Link>
              <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
                style={{ background: "#25D366", color: "#fff", padding: "13px 24px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                💬 WhatsApp Order
              </a>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "32px 36px", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🚚</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Free Delivery</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Across Pakistan</div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: 20, paddingTop: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>🔧</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Free Installation</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>By Expert Technicians</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── High Quality Material Section ── */}
      <section style={{ padding: "72px 0", background: "#fff", borderTop: "1px solid #e8f0fe" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Our Commitment</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>High Quality Material</h2>
            <p style={{ color: "#64748b", fontSize: 15, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Every AQUA R.O Filter product is built with premium food-grade materials, tested for durability and certified safe for drinking water use.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "🏅", title: "Food Grade Materials", desc: "All components are made from certified food-safe, BPA-free materials that meet international drinking water standards.", color: "#0057a8", bg: "#eff6ff" },
              { icon: "⚗️", title: "Advanced Filtration", desc: "Multi-stage filtration technology removes 99.9% of contaminants including bacteria, heavy metals, chlorine and TDS.", color: "#047857", bg: "#f0fdf4" },
              { icon: "🔬", title: "Lab Tested & Certified", desc: "Every filter is tested in our quality lab before dispatch to ensure consistent performance and purity standards.", color: "#7c3aed", bg: "#faf5ff" },
              { icon: "⚡", title: "Long Filter Life", desc: "Our cartridges and membranes are engineered for extended lifespan, reducing replacement frequency and cost.", color: "#b45309", bg: "#fffbeb" },
              { icon: "🌊", title: "High Flow Rate", desc: "Optimized water flow systems ensure you get fresh, filtered water quickly without pressure drops.", color: "#0e7490", bg: "#ecfeff" },
              { icon: "🛡️", title: "2-Year Warranty", desc: "All our RO systems come with a 2-year manufacturer warranty and lifetime after-sale service support.", color: "#be123c", bg: "#fff1f2" },
            ].map(f => (
              <div key={f.title} style={{ background: f.bg, borderRadius: 16, padding: "28px 24px", border: `1px solid ${f.bg}`, transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ color: f.color, fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
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