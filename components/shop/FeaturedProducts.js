import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-cyan-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Products</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900">Featured <span className="text-cyan-500">Filters</span></h2>
            <p className="text-gray-500 mt-3 max-w-md">Hand-picked best sellers trusted by 50,000+ Pakistani families.</p>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-cyan-600 transition-colors">
            View All Products <ArrowRight size={18} />
          </Link>
        </div>

        {/* Category pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {["All", "Reverse Osmosis", "Ultrafiltration", "Alkaline", "Under-Sink", "Whole House"].map(cat => (
            <Link key={cat} href={cat === "All" ? "/shop" : `/shop?category=${cat}`} className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${cat === "All" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"}`}>
              {cat}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
