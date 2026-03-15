import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="water-bg rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute rounded-full border border-white/30 wave-animate"
                style={{ width: `${100 + i * 80}px`, height: `${100 + i * 80}px`, left: `${i * 20}%`, top: '50%', transform: 'translateY(-50%)', animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>
          <div className="relative z-10">
            <p className="text-cyan-300 font-semibold text-sm uppercase tracking-widest mb-3">Limited Time Offer</p>
            <h2 className="font-display text-4xl md:text-5xl mb-4">Get Pure Water <span className="text-cyan-400">Today</span></h2>
            <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">Free professional installation on all RO systems ordered this month. Use code <span className="text-cyan-300 font-bold">PUREWATER</span> for 15% off your first order.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-colors shadow-lg text-lg">
                Shop Now <ArrowRight size={20} />
              </Link>
              <a href="tel:0800282882" className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors text-lg">
                <Phone size={20} /> Call Us Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
