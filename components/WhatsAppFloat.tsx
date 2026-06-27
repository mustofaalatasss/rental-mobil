"use client";

import React, { useState } from 'react';

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div
        className={`transition-all duration-300 ${showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
      >
        <div className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-xl shadow-lg border border-outline-variant whitespace-nowrap">
          💬 Chat Kami Sekarang!
          <div className="absolute right-3 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
        </div>
      </div>

      {/* Button */}
      <a
        href="https://wa.me/6287868036735?text=Halo%20Amar%20Rental%2C%20saya%20ingin%20bertanya%20seputar%20sewa%20mobil."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping [animation-delay:0.5s]" />
        <span className="material-symbols-outlined text-white text-3xl relative z-10">
          whatsapp
        </span>
      </a>
    </div>
  );
}
