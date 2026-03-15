import { Shield, Zap, Award, Headphones, Truck, RefreshCw } from "lucide-react";

const features = [
  { icon: Shield, title: "99.9% Purification", desc: "Removes bacteria, viruses, heavy metals, and 1000+ contaminants certified by NSF international standards.", color: "from-blue-500 to-cyan-500" },
  { icon: Zap, title: "Smart Technology", desc: "WiFi-enabled systems with real-time monitoring, automatic alerts, and smartphone app control.", color: "from-cyan-500 to-teal-500" },
  { icon: Award, title: "Certified Quality", desc: "All products carry NSF/ANSI 58, ISO 9001, and WHO certification for guaranteed quality.", color: "from-teal-500 to-green-500" },
  { icon: Truck, title: "Free Delivery", desc: "Free nationwide delivery on orders above Rs. 2,000. Express delivery available in major cities.", color: "from-indigo-500 to-blue-500" },
  { icon: Headphones, title: "Expert Support", desc: "Free installation support, 24/7 customer care, and trained technicians across Pakistan.", color: "from-purple-500 to-indigo-500" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free return policy. If you're not satisfied, we'll replace or refund — no questions asked.", color: "from-rose-500 to-pink-500" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-cyan-600 font-semibold text-sm uppercase tracking-widest mb-2">Why AquaTai</p>
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">The AquaTai <span className="text-cyan-500">Difference</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We don't just sell filters — we deliver a complete pure water experience backed by technology, certification, and exceptional service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 bg-gradient-to-r from-[#0a1628] to-[#0d4f8c] rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50,000+", label: "Happy Customers" },
            { value: "8+", label: "Years Experience" },
            { value: "200+", label: "Cities Covered" },
            { value: "4.8★", label: "Average Rating" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
              <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
