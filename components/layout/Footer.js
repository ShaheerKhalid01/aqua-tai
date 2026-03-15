import Link from "next/link";
import { Droplets, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Droplets size={22} className="text-white" />
              </div>
              <span className="font-display text-2xl">Aqua<span className="text-cyan-400">Tai</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Pakistan's leading water filter brand. We provide certified, tested filtration systems for homes, offices, and industries.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["About Us", "#"],
                ["Installation Guide", "#"],
                ["Warranty Policy", "#"],
                ["Contact Us", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Categories</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {["Reverse Osmosis", "Ultrafiltration", "Alkaline Systems", "Under-Sink Filters", "Whole House", "Countertop Filters", "Replacement Filters"].map(cat => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat}`} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">0800-AQUATAI</p>
                  <p>Mon–Sat, 9am–6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">support@aquatai.pk</p>
                  <p>24/7 Email Support</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">Head Office</p>
                  <p>Lahore, Punjab, Pakistan</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-500/30">
              <p className="text-xs text-cyan-300 font-semibold mb-1">🏆 Certified Quality</p>
              <p className="text-xs text-gray-400">NSF, ISO 9001, WHO Standards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© 2024 AquaTai. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
