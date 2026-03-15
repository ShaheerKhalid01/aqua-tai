"use client";
import { Bell, Search, User } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-[#0d1b2e] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input placeholder="Search orders, products..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-none">Admin</p>
            <p className="text-gray-500 text-xs">admin@aquatai.pk</p>
          </div>
        </div>
      </div>
    </header>
  );
}
