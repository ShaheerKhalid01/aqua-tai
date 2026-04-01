"use client";
import { useState, useEffect, useRef } from "react";
import { useProducts } from "@/context/ProductsContext";
import { uploadImage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useNotifications } from "@/components/Notifications";
import { useConfirmDialog } from "@/components/ConfirmDialog";

const CATEGORIES = ["Reverse Osmosis System","Cartridges & Accessories","Whole House Water Softener","Domestic Water Filter","Commercial Water Plants"];
const BADGES = ["","Best Seller","Popular","Premium","New","Top Rated"];
const emptyForm = { name:"", category:"", price:"", originalPrice:"", stock:"", badge:"", description:"", features:"", images:[] };

export default function AdminProducts() {
  const { products, loading, loadProducts, addProduct, editProduct, removeProduct } = useProducts();
  const { success: showSuccess, error: showError, warning: showWarning } = useNotifications();
  const { showConfirm } = useConfirmDialog();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const fileRef = useRef();

  useEffect(() => { 
    console.log("Products component mounted, loading fresh data...");
    loadProducts(); 
  }, []);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Debug: Show current products
  console.log("Current products in frontend:", products.map(p => ({ _id: p._id, name: p.name, stock: p.stock })));

  const forceRefresh = async () => {
    console.log("Force refreshing products data...");
    try {
      await loadProducts();
      console.log("Products reloaded:", products.length);
    } catch (err) {
      console.error("Force refresh failed:", err);
    }
  };

  const openAdd = () => { setForm(emptyForm); setEditId(null); setError(""); setShowModal(true); };
  const openEdit = p => {
    setForm({ name:p.name||"", category:p.category||"", price:p.price||"", originalPrice:p.originalPrice||"", stock:p.stock||"", badge:p.badge||"", description:p.description||"", features:Array.isArray(p.features)?p.features.join("\n"):"", images:p.images||[] });
    setEditId(p._id); setError(""); setShowModal(true);
  };

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f).then(r => r.url)));
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) { setError("Image upload failed: " + err.message); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.category || !form.price || !form.stock || !form.description)
      return setError("Name, category, price, stock and description are required.");
    
    // Debug logging
    console.log("=== SAVE PROCESS DEBUG ===");
    console.log("1. Form stock before save:", form.stock, "Type:", typeof form.stock);
    
    setSaving(true);
    try {
      const payload = { 
        ...form, 
        price: Number(form.price), 
        originalPrice: Number(form.originalPrice)||Number(form.price), 
        stock: parseInt(form.stock, 10) || 0, 
        features: form.features.split("\n").map(f=>f.trim()).filter(Boolean) 
      };
      
      console.log("2. Payload stock before API:", payload.stock, "Type:", typeof payload.stock);
      
      if (editId) {
        console.log("3. Calling editProduct with ID:", editId);
        const result = await editProduct(editId, payload);
        console.log("4. Edit result:", result);
        console.log("5. Product stock in result:", result?.stock);
      } else {
        console.log("3. Calling addProduct");
        const result = await addProduct(payload);
        console.log("4. Add result:", result);
        console.log("5. Product stock in result:", result?.stock);
      }
      
      console.log("6. Closing modal and reloading products...");
      setShowModal(false);
      
      // Force reload products to ensure we have latest data
      console.log("7. Force reloading products...");
      await loadProducts();
      console.log("8. Products reloaded, new count:", products.length);
    } catch (err) { 
      // If it's a 404 error, reload products and try to refresh the data
      if (err.message.includes("404") || err.message.includes("Not Found")) {
        console.log("Product not found - reloading products data...");
        await loadProducts();
        setError("Product data was stale. Please try again.");
      } else {
        console.log("Save error:", err);
        setError(err.message);
      }
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await removeProduct(id); } catch (err) { alert(err.message); }
  };

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };
  
  const handleSelectAll = () => {
    if (selectedProducts.size === filtered.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filtered.map(p => p._id)));
    }
  };
  
  const deleteSelectedProducts = async () => {
    if (selectedProducts.size === 0) {
      showWarning('No products selected');
      return;
    }
    
    const confirmed = await showConfirm(`Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    
    try {
      const deletePromises = Array.from(selectedProducts).map(productId =>
        removeProduct(productId)
      );
      
      await Promise.all(deletePromises);
      showSuccess(`Successfully deleted ${selectedProducts.size} product(s)`);
      setSelectedProducts(new Set());
      await loadProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      showError('Failed to delete some products. Please try again.');
    }
  };

  const selectStyle = { width:"100%", background:"#f8fafc", border:"2px solid #e2e8f0", borderRadius:8, padding:"10px 14px", color:"#1a1a2e", fontSize:14, outline:"none", marginTop:6, cursor:"pointer", appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230057a8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" };
  const inputStyle = { width:"100%", background:"#f8fafc", border:"2px solid #e2e8f0", borderRadius:8, padding:"10px 14px", color:"#1a1a2e", fontSize:14, outline:"none", marginTop:6, transition:"border 0.2s" };
  const labelStyle = { color:"#475569", fontSize:13, fontWeight:600, display:"block", marginTop:16 };

  return (
    <div style={{ padding:32 }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a2e", margin:0 }}>Products</h1>
          </div>
          <div style={{ display:"flex", gap:12, alignItems: "center" }}>
            {selectedProducts.size > 0 && (
              <>
                <span style={{ color:"#64748b", fontSize:14 }}>
                  {selectedProducts.size} selected
                </span>
                <button
                  onClick={deleteSelectedProducts}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#dc2626';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = '#ef4444';
                  }}
                >
                  Delete Selected
                </button>
              </>
            )}
            <button onClick={forceRefresh} style={{ background:"#f8fafc", color:"#64748b", border:"1px solid #e2e8f0", padding:"11px 22px", borderRadius:10, fontWeight:600, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
              🔄 Refresh
            </button>
            <button onClick={openAdd} style={{ background:"#0057a8", color:"#fff", border:"none", padding:"11px 22px", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
              ➕ Add Product
            </button>
          </div>
        </div>
        <p style={{ color:"#64748b", fontSize:14, margin:0 }}>{products.length} products in store</p>
      </div>

      {/* Search */}
      <div style={{ position:"relative", maxWidth:400, marginBottom:24 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>🔍</span>
        <input type="text" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft:40, marginTop:0 }}
          onFocus={e=>e.target.style.border="2px solid #0057a8"}
          onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
      </div>

      {/* Loading / Empty */}
      {loading && <div style={{ textAlign:"center", padding:"60px 0", color:"#94a3b8" }}>Loading products...</div>}
      {!loading && products.length === 0 && (
        <div style={{ textAlign:"center", padding:"80px 0", background:"#fff", borderRadius:16, border:"1px solid #e8f0fe" }}>
          <div style={{ fontSize:52, marginBottom:16 }}>📦</div>
          <p style={{ fontSize:18, fontWeight:700, color:"#1a1a2e", marginBottom:8 }}>No products yet</p>
          <p style={{ color:"#64748b", marginBottom:24 }}>Add your first product to start selling.</p>
          <button onClick={openAdd} style={{ background:"#0057a8", color:"#fff", border:"none", padding:"12px 28px", borderRadius:10, fontWeight:700, cursor:"pointer" }}>➕ Add First Product</button>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8f0fe", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                <th style={{ padding:"14px 16px", textAlign:"center", color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid #e8f0fe", width: "60px" }}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                {["Image","Product","Category","Price","Stock","Badge","Actions"].map(h => (
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid #e8f0fe" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i) => (
                <tr key={p._id} style={{ borderBottom:"1px solid #f1f5f9", transition:"background 0.1s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"12px 16px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(p._id)}
                      onChange={() => handleSelectProduct(p._id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width:52, height:52, objectFit:"cover", borderRadius:10, border:"1px solid #e8f0fe" }} />
                    ) : (
                      <div style={{ width:52, height:52, background:"#e8f4ff", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>💧</div>
                    )}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#1a1a2e" }}>{p.name}</div>
                    <div style={{ color:"#94a3b8", fontSize:11, marginTop:2 }}>{p.slug}</div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ background:"#eff6ff", color:"#0057a8", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>{p.category}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontWeight:800, color:"#0057a8", fontSize:15 }}>{formatPrice(p.price)}</div>
                    {p.originalPrice > p.price && <div style={{ color:"#94a3b8", fontSize:11, textDecoration:"line-through" }}>{formatPrice(p.originalPrice)}</div>}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ color: p.stock===0?"#dc2626":p.stock<10?"#d97706":"#16a34a", fontWeight:700, fontSize:14 }}>{p.stock}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    {p.badge && <span style={{ background:"#fffbeb", color:"#d97706", border:"1px solid #fde68a", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{p.badge}</span>}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>openEdit(p)} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#0057a8", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 }}>Edit</button>
                      <button onClick={()=>handleDelete(p._id,p.name)} style={{ background:"#fff5f5", border:"1px solid #fecaca", color:"#dc2626", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"24px 16px", overflowY:"auto" }}>
          <div style={{ background:"#fff", borderRadius:20, padding:36, width:"100%", maxWidth:580, marginTop:20, boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontWeight:900, fontSize:20, color:"#1a1a2e" }}>{editId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={()=>setShowModal(false)} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", color:"#64748b", width:36, height:36, borderRadius:8, fontSize:18, cursor:"pointer" }}>×</button>
            </div>

            {error && <div style={{ background:"#fff5f5", border:"1px solid #fecaca", color:"#dc2626", padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:16 }}>⚠ {error}</div>}

            {/* Images */}
            <div style={{ marginBottom:8 }}>
              <label style={{ ...labelStyle, marginTop:0 }}>Product Images</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:10 }}>
                {form.images.map((url,i) => (
                  <div key={i} style={{ position:"relative" }}>
                    <img src={url} alt="" style={{ width:80, height:80, objectFit:"cover", borderRadius:10, border:"2px solid #e8f0fe" }} />
                    <button onClick={()=>setForm(prev=>({...prev,images:prev.images.filter((_,j)=>j!==i)}))}
                      style={{ position:"absolute", top:-8, right:-8, width:22, height:22, background:"#dc2626", border:"none", borderRadius:"50%", color:"#fff", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                  </div>
                ))}
                <button onClick={()=>fileRef.current?.click()}
                  style={{ width:80, height:80, background:uploading?"#f1f5f9":"#f0f7ff", border:`2px dashed ${uploading?"#e2e8f0":"#bfdbfe"}`, borderRadius:10, color:"#0057a8", cursor:uploading?"not-allowed":"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, fontSize:11, fontWeight:600 }}>
                  {uploading?<><span style={{fontSize:20}}>⏳</span>Uploading</>:<><span style={{fontSize:24}}>+</span>Add Image</>}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:"none" }} />
            </div>

            <label style={labelStyle}>Product Name *</label>
            <input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. 7-Stage RO System"
              onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />

            <label style={labelStyle}>Category *</label>
            <select style={selectStyle} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              <option value="">Select category</option>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <div>
                <label style={labelStyle}>Price (PKR) *</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="12999"
                  onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
              </div>
              <div>
                <label style={labelStyle}>Original Price</label>
                <input style={inputStyle} type="number" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:e.target.value})} placeholder="16999"
                  onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
              </div>
              <div>
                <label style={labelStyle}>Stock *</label>
                <input 
                  style={inputStyle} 
                  type="number" 
                  min="0" 
                  step="1"
                  value={form.stock} 
                  onChange={e => setForm(prev => ({...prev, stock: e.target.value}))}
                  placeholder="25"
                  onFocus={e=>e.target.style.border="2px solid #0057a8"} 
                  onBlur={e=>e.target.style.border="2px solid #e2e8f0"} 
                />
              </div>
            </div>

            <label style={labelStyle}>Badge</label>
            <select style={selectStyle} value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>
              {BADGES.map(b=><option key={b} value={b}>{b||"None"}</option>)}
            </select>

            <label style={labelStyle}>Description *</label>
            <textarea style={{ ...inputStyle, height:80, resize:"vertical" }} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the product..."
              onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />

            <label style={labelStyle}>Features (one per line)</label>
            <textarea style={{ ...inputStyle, height:80, resize:"vertical" }} value={form.features} onChange={e=>setForm({...form,features:e.target.value})} placeholder={"7-Stage Filtration\n500 GPD Flow Rate\n2-Year Warranty"}
              onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />

            <div style={{ display:"flex", gap:12, marginTop:24 }}>
              <button onClick={handleSave} disabled={saving||uploading}
                style={{ flex:1, background:saving?"#93c5fd":"#0057a8", color:"#fff", border:"none", padding:"13px 0", borderRadius:10, fontWeight:700, fontSize:15, cursor:saving?"not-allowed":"pointer" }}>
                {saving?"Saving...":editId?"Save Changes":"Add Product"}
              </button>
              <button onClick={()=>setShowModal(false)}
                style={{ flex:1, background:"#f8fafc", border:"1px solid #e2e8f0", color:"#64748b", padding:"13px 0", borderRadius:10, cursor:"pointer", fontWeight:600 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}