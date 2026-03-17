"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";

const stats = [
  { value: "1000+", label: "Happy Customers" },
  { value: "99.9%", label: "Purity Rate" },
  { value: "10+ Yrs", label: "In Business" },
  { value: "24/7", label: "Support" },
];

const CATEGORIES = [
  {
    name: "Reverse Osmosis System",
    icon: "🔬",
    desc: "Advanced multi-stage RO systems for pure, mineral-balanced drinking water.",
    color: "#00b4ff",
    bg: "rgba(0,180,255,0.08)",
    border: "rgba(0,180,255,0.25)",
  },
  {
    name: "Cartridges & Accessories",
    icon: "🔧",
    desc: "Replacement filters, membranes and accessories for all filter brands.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    name: "Whole House Water Softener",
    icon: "🏠",
    desc: "Whole-home softening systems that protect pipes and appliances.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    name: "Domestic Water Filter",
    icon: "🚰",
    desc: "Compact countertop and under-sink filters for everyday home use.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    name: "Commercial Water Plants",
    icon: "🏭",
    desc: "Large-scale industrial filtration plants for businesses and communities.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
];

export default function Home() {
  const { products, loadProducts } = useProducts();

  useEffect(() => { loadProducts(); }, []);

  const featured = products.slice(0, 3);

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #040d1a 0%, #0a2540 50%, #0d3060 100%)", minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)", top: "50%", right: -200, transform: "translateY(-50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,204,0.08) 0%, transparent 70%)", bottom: -100, left: -100, pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-4 w-full" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#00b4ff", marginBottom: 24, letterSpacing: 1 }}>
              🌊 Rahim Yar Khan's #1 Water Filter Brand
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, fontFamily: "Georgia, serif", lineHeight: 1.15, marginBottom: 20 }}>
              Drink Water<br />
              <span style={{ background: "linear-gradient(135deg, #00b4ff, #60efff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Perfectly Pure</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.8, marginBottom: 32, maxWidth: 480 }}>
              Rahim Yar Khan's trusted water filtration specialists. RO systems, domestic filters, commercial plants — installed and serviced by our expert team.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/shop" style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16, display: "inline-block", textDecoration: "none" }}>
                Shop Now →
              </Link>
              <button onClick={scrollToFeatures} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 32px", borderRadius: 12, fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
                Learn More
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 320, height: 320 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,255,0.15) 0%, transparent 70%)" }} />
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(0,180,255,0.1), rgba(0,102,204,0.1))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,180,255,0.2)", overflow: "hidden" }}>
                <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 220, height: 220, objectFit: "contain" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", padding: "40px 0" }}>
        <div className="max-w-7xl mx-auto px-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {stats.map((s) => (
            <div key={s.value} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "Georgia, serif" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "80px 0", background: "#040d1a" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: "#00b4ff", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Browse By Category</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, fontFamily: "Georgia, serif" }}>Our Product Categories</h2>
            <p style={{ color: "#64748b", fontSize: 15, marginTop: 12 }}>Find the perfect water solution for your home or business</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{ background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: 18, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${cat.bg}`; e.currentTarget.style.border = `1px solid ${cat.color}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.border = `1px solid ${cat.border}`; }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{cat.icon}</div>
                  <div style={{ color: cat.color, fontWeight: 800, fontSize: 15, marginBottom: 10, lineHeight: 1.3 }}>{cat.name}</div>
                  <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{cat.desc}</div>
                  <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 6, color: cat.color, fontSize: 13, fontWeight: 600 }}>
                    Browse <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 0", background: "linear-gradient(135deg, #040d1a, #0a1830)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "#00b4ff", fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Why Choose Us</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, fontFamily: "Georgia, serif" }}>The AQUA R.O Filter Difference</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { icon: "🔧", title: "Free Installation", desc: "Our expert technicians come to your home and install your system at no extra charge." },
              { icon: "📞", title: "Complaint Support", desc: "Call us on 0304-2604217 or 068-2098583 for any complaints or after-sale support." },
              { icon: "🔄", title: "Easy Returns", desc: "Hassle-free return and replacement policy on all our water filter products." },
            ].map((f) => (
              <div key={f.title} style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "80px 0", background: "#040d1a" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "#00b4ff", fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Top Picks</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, fontFamily: "Georgia, serif" }}>Featured Products</h2>
            </div>
            <Link href="/shop" style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 600 }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {featured.length > 0
              ? featured.map((p) => <ProductCard key={p._id} product={p} />)
              : <p style={{ color: "#64748b", fontSize: 15 }}>No products yet. Add some from the admin panel.</p>}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #0a2540, #0d3060)", padding: "80px 0", borderTop: "1px solid rgba(0,180,255,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 44, fontWeight: 900, fontFamily: "Georgia, serif", marginBottom: 16 }}>Ready for Pure Water?</h2>
          <p style={{ color: "#94a3b8", fontSize: 18, marginBottom: 12 }}>Join 1000+ satisfied customers across Rahim Yar Khan who trust AQUA R.O Filter.</p>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>📍 Jamia Tul Farooq Road, Old Adda Khanpur, Rahim Yar Khan &nbsp;|&nbsp; 📞 0304-2604217</p>
          <Link href="/shop" style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "16px 48px", borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 18, display: "inline-block" }}>
            Shop All Filters
          </Link>
        </div>
      </section>
    </div>
  );
}