"use client";
import { useState, useEffect, useRef } from "react";
import { useProducts } from "@/context/ProductsContext";
import { uploadImage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = [
  "Reverse Osmosis System",
  "Cartridges & Accessories",
  "Whole House Water Softener",
  "Domestic Water Filter",
  "Commercial Water Plants",
];
const BADGES = ["", "Best Seller", "Popular", "Premium", "New", "Top Rated"];

const emptyForm = {
  name: "", category: "", price: "", originalPrice: "", stock: "",
  badge: "", description: "", features: "", images: [],
};

export default function AdminProducts() {
  const { products, loading, loadProducts, addProduct, editProduct, removeProduct } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef();

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name || "",
      category: p.category || "",
      price: p.price || "",
      originalPrice: p.originalPrice || "",
      stock: p.stock || "",
      badge: p.badge || "",
      description: p.description || "",
      features: Array.isArray(p.features) ? p.features.join("\n") : "",
      images: p.images || [],
    });
    setEditId(p._id);
    setError("");
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f).then(r => r.url)));
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError("Image upload failed: " + err.message);
    } finally { setUploading(false); }
  };

  const removeImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.category || !form.price || !form.stock || !form.description)
      return setError("Name, category, price, stock and description are required.");

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        stock: Number(form.stock),
        features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
      };

      if (editId) {
        await editProduct(editId, payload);
      } else {
        await addProduct(payload);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await removeProduct(id); } catch (err) { alert(err.message); }
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6 };
  const labelStyle = { color: "#94a3b8", fontSize: 13, display: "block", marginTop: 14 };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, fontFamily: "Georgia, serif" }}>Products</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>{products.length} products in store</p>
        </div>
        <button onClick={openAdd}
          style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + Add Product
        </button>
      </div>

      {/* Search */}
      <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: "100%", maxWidth: 400, marginBottom: 24, marginTop: 0 }} />

      {/* Loading */}
      {loading && <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>Loading products...</p>}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No products yet.</p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Add your first product to start selling.</p>
          <button onClick={openAdd} style={{ background: "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
            + Add First Product
          </button>
        </div>
      )}

      {/* Products Table */}
      {filtered.length > 0 && (
        <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,180,255,0.15)" }}>
                {["Image", "Product", "Category", "Price", "Stock", "Badge", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#00b4ff", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(0,180,255,0.2)" }} />
                    ) : (
                      <div style={{ width: 52, height: 52, background: "rgba(0,180,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💧</div>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                    <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{p.slug}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 13 }}>{p.category}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#00b4ff", fontWeight: 700, fontSize: 14 }}>{formatPrice(p.price)}</div>
                    {p.originalPrice > p.price && <div style={{ color: "#64748b", fontSize: 11, textDecoration: "line-through" }}>{formatPrice(p.originalPrice)}</div>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: p.stock < 10 ? "#ef4444" : p.stock < 20 ? "#f59e0b" : "#10b981", fontWeight: 600, fontSize: 14 }}>{p.stock}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.badge && <span style={{ background: "rgba(0,180,255,0.15)", color: "#00b4ff", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{p.badge}</span>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)}
                        style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.25)", color: "#00b4ff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)}
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
          <div style={{ background: "#0d2545", border: "1px solid rgba(0,180,255,0.25)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 600, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800, fontSize: 20 }}>{editId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: "pointer" }}>×</button>
            </div>

            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

            {/* Image Upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ ...labelStyle, marginTop: 0 }}>Product Images</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                {form.images.map((url, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(0,180,255,0.3)" }} />
                    <button onClick={() => removeImage(i)}
                      style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, background: "#ef4444", border: "none", borderRadius: "50%", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()}
                  style={{ width: 80, height: 80, background: uploading ? "rgba(0,180,255,0.05)" : "rgba(0,180,255,0.08)", border: "2px dashed rgba(0,180,255,0.3)", borderRadius: 8, color: "#00b4ff", cursor: uploading ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11 }}>
                  {uploading ? <><span style={{ fontSize: 20 }}>⏳</span>Uploading</> : <><span style={{ fontSize: 24 }}>+</span>Add Image</>}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
            </div>

            {/* Name */}
            <label style={labelStyle}>Product Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. AquaTai Pro 7-Stage Filter" />

            {/* Category */}
            <label style={labelStyle}>Category *</label>
            <select
              style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300b4ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}>
              <option value="" style={{ background: "#0d2545", color: "#fff" }}>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#0d2545", color: "#fff" }}>{c}</option>)}
            </select>

            {/* Price row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Price (PKR) *</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="12999" />
              </div>
              <div>
                <label style={labelStyle}>Original Price</label>
                <input style={inputStyle} type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} placeholder="16999" />
              </div>
              <div>
                <label style={labelStyle}>Stock *</label>
                <input style={inputStyle} type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="25" />
              </div>
            </div>

            {/* Badge */}
            <label style={labelStyle}>Badge</label>
            <select
              style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300b4ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}
              value={form.badge}
              onChange={e => setForm({...form, badge: e.target.value})}>
              {BADGES.map(b => <option key={b} value={b} style={{ background: "#0d2545", color: "#fff" }}>{b || "None"}</option>)}
            </select>

            {/* Description */}
            <label style={labelStyle}>Description *</label>
            <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the product..." />

            {/* Features */}
            <label style={labelStyle}>Features (one per line)</label>
            <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }} value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder={"7-Stage Filtration\n500 GPD Flow Rate\n2-Year Warranty"} />

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving || uploading}
                style={{ flex: 1, background: saving ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "13px 0", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Product"}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "13px 0", borderRadius: 10, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}