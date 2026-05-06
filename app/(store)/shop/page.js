"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";

const MAX_PRICE = 150000;

const CATEGORY_ICONS = {
  "Reverse Osmosis System": "",
  "Domestic Water Filter": "",
  "Commercial RO System": "",
  "UV Water Purifier": "",
  "Water Softener": "",
  "Accessories and Parts": "",
};

function FilterTag({ label, onRemove }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,87,168,0.08)", border: "1px solid rgba(0,87,168,0.2)", color: "#0057a8", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", color: "#0057a8", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
    </span>
  );
}

function ListCard({ product }) {
  const { dispatch } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch({ type: "ADD_ITEM", payload: { id: product._id, name: product.name, price: product.price, slug: product.slug, image: product.images?.[0] } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  return (
    <div onClick={() => router.push(`/product/${product.slug}`)}
      style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, padding: 16, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "border 0.2s", flexWrap: "wrap" }}
      className="list-card-inner">
      <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#e8f4ff,#cce5ff)", borderRadius: 12, flexShrink: 0, overflow: "hidden" }}>
        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>💧</div>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#0057a8", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{product.category}</div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#1a1a2e" }}>{product.name}</div>
        <div style={{ color: "#64748b", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.description?.slice(0, 90)}…</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }} className="list-card-right">
        <div style={{ color: "#0057a8", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{formatPrice(product.price)}</div>
        <button onClick={handleAdd} style={{ background: added ? "#10b981" : "#0057a8", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ── Filter Sidebar Content (reused in both sidebar and overlay) ──
function FilterContent({ categories, activeCategory, setActiveCategory, products, priceRange, setPriceRange, onlyInStock, setOnlyInStock, hasActiveFilters, resetFilters }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#0057a8" }}>Filters</span>
        {hasActiveFilters && <button onClick={resetFilters} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Reset All</button>}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Category</div>
        {categories.map(cat => {
          const count = cat === "All" ? products.length : products.filter(p => p.category === cat).length;
          const active = activeCategory === cat;
          const icon = CATEGORY_ICONS[cat] || "💧";
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 8, marginBottom: 3, background: active ? "rgba(0,87,168,0.08)" : "transparent", border: active ? "1px solid rgba(0,87,168,0.25)" : "1px solid transparent", color: active ? "#0057a8" : "#64748b", fontWeight: active ? 700 : 400, fontSize: 13, cursor: "pointer" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{cat === "All" ? "🌊" : icon}</span>
                <span>{cat}</span>
              </span>
              <span style={{ background: active ? "rgba(0,87,168,0.12)" : "#f1f5f9", color: active ? "#0057a8" : "#64748b", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Price Range</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
          <span style={{ color: "#64748b" }}>{formatPrice(priceRange[0])}</span>
          <span style={{ color: "#64748b" }}>{formatPrice(priceRange[1])}</span>
        </div>
        <input type="range" min={0} max={MAX_PRICE} step={500} value={priceRange[0]} onChange={e => setPriceRange([Math.min(+e.target.value, priceRange[1] - 500), priceRange[1]])} style={{ width: "100%", accentColor: "#0057a8", marginBottom: 6, cursor: "pointer" }} />
        <input type="range" min={0} max={MAX_PRICE} step={500} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0] + 500)])} style={{ width: "100%", accentColor: "#0057a8", cursor: "pointer" }} />
      </div>

      {/* In Stock */}
      <div>
        <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Availability</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setOnlyInStock(!onlyInStock)}>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: onlyInStock ? "#0057a8" : "#e2e8f0", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: onlyInStock ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
          </div>
          <span style={{ color: onlyInStock ? "#1a1a2e" : "#64748b", fontSize: 13, fontWeight: onlyInStock ? 600 : 400 }}>In Stock Only</span>
        </div>
      </div>
    </>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, loading, loadProducts } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  // Read category from URL query param (from homepage category cards)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(decodeURIComponent(cat));
  }, [searchParams]);

  // Prevent body scroll when filter overlay is open
  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchStock = onlyInStock ? p.stock > 0 : true;
      return matchCat && matchSearch && matchPrice && matchStock;
    });

    // Apply sorting
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [products, activeCategory, search, priceRange, onlyInStock, sortBy]);

  const resetFilters = () => { setActiveCategory("All"); setSortBy("default"); setSearch(""); setPriceRange([0, MAX_PRICE]); setOnlyInStock(false); };
  const hasActiveFilters = activeCategory !== "All" || sortBy !== "default" || search !== "" || priceRange[0] > 0 || priceRange[1] < MAX_PRICE || onlyInStock;

  const filterProps = { categories, activeCategory, setActiveCategory, products, priceRange, setPriceRange, onlyInStock, setOnlyInStock, hasActiveFilters, resetFilters };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #003d7a, #0057a8)", padding: "28px 0 22px", borderBottom: "1px solid #e8f0fe" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Our Collection</div>
          <h1 className="shop-header" style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, marginBottom: 10, color: "#fff" }}>
            {activeCategory === "All" ? "All Water Filters" : activeCategory}
          </h1>
          {activeCategory !== "All" && (
            <button onClick={() => setActiveCategory("All")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer" }}>
              ← All Categories
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>
        {/* Top Bar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>🔍</span>
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", background: "#fff", border: "1px solid #e8f0fe", borderRadius: 10, padding: "10px 16px 10px 40px", color: "#1a1a2e", fontSize: 14, outline: "none" }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>×</button>}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 10, padding: "10px 16px", color: "#1a1a2e", fontSize: 14, cursor: "pointer", outline: "none" }}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Best Rated</option>
          </select>
          <div style={{ display: "flex", gap: 4, background: "#f7f9fc", border: "1px solid #e8f0fe", borderRadius: 8, padding: 3 }}>
            <button onClick={() => setGridView(true)} style={{ width: 34, height: 34, borderRadius: 6, background: gridView ? "#0057a8" : "transparent", border: "none", color: gridView ? "#fff" : "#64748b", cursor: "pointer", fontSize: 16 }}>⊞</button>
            <button onClick={() => setGridView(false)} style={{ width: 34, height: 34, borderRadius: 6, background: !gridView ? "#0057a8" : "transparent", border: "none", color: !gridView ? "#fff" : "#64748b", cursor: "pointer", fontSize: 16 }}>☰</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="shop-layout">
          {/* Sidebar (hidden on mobile by CSS, shown via overlay) */}
          <aside className="shop-sidebar">
            <div style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 16, padding: 20 }}>
              <FilterContent {...filterProps} />
            </div>
          </aside>

          {/* Products */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                {loading ? "Loading..." : <><span style={{ color: "#0057a8", fontWeight: 700 }}>{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""} found</>}
              </p>
              {hasActiveFilters && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {activeCategory !== "All" && <FilterTag label={activeCategory} onRemove={() => setActiveCategory("All")} />}
                  {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && <FilterTag label={`${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`} onRemove={() => setPriceRange([0, MAX_PRICE])} />}
                  {onlyInStock && <FilterTag label="In Stock" onRemove={() => setOnlyInStock(false)} />}
                  {search && <FilterTag label={`"${search}"`} onRemove={() => setSearch("")} />}
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                <p>Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 18, marginBottom: 10 }}>No products found.</p>
                {products.length === 0
                  ? <p style={{ fontSize: 14 }}>No products have been added yet.</p>
                  : <button onClick={resetFilters} style={{ background: "#0057a8", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>Clear Filters</button>}
              </div>
            ) : gridView ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="products-grid">
                {filtered.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filtered.map(p => <ListCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter FAB */}
      <button className="filter-fab" onClick={() => setFilterOpen(true)}>
        🔍 Filters {hasActiveFilters && <span style={{ background: "#fff", color: "#0057a8", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>!</span>}
      </button>

      {/* Mobile Filter Overlay */}
      {filterOpen && (
        <div className="filter-overlay open" onClick={() => setFilterOpen(false)}>
          <div className="filter-overlay-panel" onClick={e => e.stopPropagation()}>
            <div className="filter-overlay-header">
              <span style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>Filters</span>
              <button onClick={() => setFilterOpen(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <FilterContent {...filterProps} />
            <button onClick={() => setFilterOpen(false)} style={{ width: "100%", background: "#0057a8", color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 20 }}>
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}