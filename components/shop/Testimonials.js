import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Ahmed Raza", city: "Lahore", rating: 5, text: "Installed the AquaTai Pro RO 6 months ago. Water quality is exceptional. The TDS reduced from 580 to just 12. My family's health has visibly improved!", product: "AquaTai Pro RO System" },
  { name: "Fatima Khan", city: "Islamabad", rating: 5, text: "The UF system is perfect for our office. No electricity needed, minerals preserved, and the water tastes naturally fresh. Installation was done in 30 minutes!", product: "AquaTai UF Ultrafiltration" },
  { name: "Dr. Usman Ali", city: "Karachi", rating: 5, text: "As a doctor, I'm particular about water quality. AquaTai's Smart WiFi RO gives me real-time data on my phone. The whole house system is outstanding.", product: "AquaTai Smart WiFi RO" },
  { name: "Ayesha Malik", city: "Faisalabad", rating: 4, text: "The countertop filter was so easy to install. No plumber needed! Clean water instantly. Highly recommend for renters who can't modify their plumbing.", product: "AquaTai Countertop Filter" },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-cyan-600 font-semibold text-sm uppercase tracking-widest mb-2">Customer Reviews</p>
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">What Our <span className="text-cyan-500">Customers Say</span></h2>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />)}
            <span className="text-gray-600 font-medium ml-2">4.8 / 5 from 1,200+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative">
              <Quote size={32} className="text-cyan-100 absolute top-4 right-4" />
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.city}</p>
                <p className="text-xs text-cyan-600 mt-1 font-medium">{t.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
