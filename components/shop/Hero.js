import Link from "next/link";
import { ArrowRight, Shield, Award, Truck, Droplets, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="water-bg min-h-[92vh] flex items-center relative overflow-hidden">
      {/* Animated bubbles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-400/20 wave-animate"
          style={{
            width: `${40 + i * 30}px`,
            height: `${40 + i * 30}px`,
            left: `${5 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            opacity: 0.3,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-sm mb-6">
            <Shield size={14} />
            <span>99.9% Contaminant Removal Guaranteed</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
            Pure Water<br />
            <span className="text-cyan-400">For Every</span><br />
            Home
          </h1>

          <p className="text-blue-100 text-lg mb-8 max-w-md leading-relaxed">
            Premium water filtration systems engineered for Pakistan's water conditions. From compact countertop filters to whole-house solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-7 py-3.5 rounded-xl font-bold hover:bg-cyan-50 transition-colors shadow-lg hover:shadow-xl">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="/shop?category=Reverse+Osmosis" className="inline-flex items-center justify-center gap-2 bg-cyan-500/20 border border-cyan-400/40 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-cyan-500/30 transition-colors">
              View RO Systems
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Truck, text: "Free Delivery" },
              { icon: Award, text: "NSF Certified" },
              { icon: CheckCircle, text: "2yr Warranty" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-cyan-200 text-sm">
                <Icon size={16} className="text-cyan-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Stats cards */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          {[
            { value: "50K+", label: "Happy Customers", icon: "😊" },
            { value: "99.9%", label: "Purity Rate", icon: "💧" },
            { value: "15+", label: "Product Range", icon: "🏆" },
            { value: "5 Yrs", label: "Warranty", icon: "🛡️" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-white text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-cyan-300">{stat.value}</div>
              <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
            </div>
          ))}

          {/* Big center card */}
          <div className="col-span-2 glass rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <Droplets size={28} className="text-cyan-300" />
            </div>
            <div className="text-white">
              <p className="font-bold text-lg">Smart Water Technology</p>
              <p className="text-blue-200 text-sm">AI-powered monitoring · Real-time TDS tracking · App control</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
