"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Droplets, Search, Phone, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/store";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0d4f8c] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-2 text-cyan-300">
            <Phone size={13} />
            0800-AQUATAI (Free Helpline)
          </span>
          <span className="text-cyan-100 hidden md:block">🚚 Free delivery on orders over Rs. 2,000</span>
          <span className="text-cyan-300 text-xs">100% Genuine Products</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Droplets size={22} className="text-white" />
            </div>
            <div>
              <span className="font-display text-2xl text-[#0a1628]">Aqua<span className="text-cyan-500">Tai</span></span>
              <p className="text-[10px] text-gray-400 -mt-1 tracking-widest uppercase">Pure Water, Pure Life</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search water filters, RO systems..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-sm transition-all"
              />
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors">Shop</Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors flex items-center gap-1">
                Categories <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                {["Reverse Osmosis", "Ultrafiltration", "Alkaline", "Under-Sink", "Whole House", "Countertop", "Replacement Filters"].map(cat => (
                  <Link key={cat} href={`/shop?category=${cat}`} className="block px-3 py-2 text-sm text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Cart & Admin */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hidden md:block text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5 rounded-lg hover:shadow-lg transition-all">
              Admin Panel
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-cyan-50 rounded-xl transition-colors">
              <ShoppingCart size={22} className="text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/shop" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/cart" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Cart ({count})</Link>
            <Link href="/admin" className="block text-sm font-semibold text-cyan-600 py-2" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          </div>
        )}
      </nav>
    </>
  );
}
