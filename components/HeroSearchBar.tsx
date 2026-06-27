"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSearchBar() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const router = useRouter();

  // Minimum date: today
  const today = new Date().toISOString().slice(0, 16);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    // If end date is set and before new start date, clear it
    if (endDate && val && endDate <= val) {
      setEndDate('');
      setDateError('Tanggal selesai disesuaikan.');
      setTimeout(() => setDateError(''), 2500);
    } else {
      setDateError('');
    }
  };

  const handleEndDateChange = (val: string) => {
    if (startDate && val <= startDate) {
      setDateError('Tanggal selesai harus lebih dari tanggal mulai!');
      return;
    }
    setDateError('');
    setEndDate(val);
  };

  const handleWhatsappClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    let message = "Halo Amar Rental, saya mau Cek Unit Mobil.";

    if (location || startDate || endDate) {
      const locText = location ? location : "Jakarta";
      const formatOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      };

      const startText = startDate ? new Date(startDate).toLocaleString('id-ID', formatOptions) : "hari ini";
      const endText = endDate ? new Date(endDate).toLocaleString('id-ID', formatOptions) : "selesai";

      message = `Halo Amar Rental, saya ingin bertanya ketersediaan unit untuk lokasi ${locText} pada tanggal ${startText} sampai ${endText}. Apakah tersedia?`;
    }

    const url = `https://wa.me/6287868036735?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-container-max px-margin-desktop z-20 pb-0 overflow-visible">
      <div className="glass-card-strong rounded-t-2xl shadow-[0px_20px_50px_rgba(0,0,0,0.2)] p-8 flex flex-col lg:flex-row gap-8 items-stretch lg:items-center overflow-visible border-b-0">
        {/* Location */}
        <div className="flex-1 flex flex-col gap-3 px-4 border-b lg:border-b-0 lg:border-r border-outline-variant pb-6 lg:pb-0 focus-within:bg-primary/5 transition-colors rounded-xl">
          <label className="font-bold text-label-md text-primary uppercase tracking-wider">Lokasi Penjemputan</label>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
            <input
              className="bg-transparent outline-none border-none focus:ring-0 w-full font-headline-md text-headline-md p-0 placeholder:text-secondary/50"
              placeholder="Ketik lokasi..."
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="flex-1 flex flex-col gap-3 px-4 border-b lg:border-b-0 lg:border-r border-outline-variant pb-6 lg:pb-0 focus-within:bg-primary/5 transition-colors rounded-xl">
          <label className="font-bold text-label-md text-primary uppercase tracking-wider">Tanggal Mulai</label>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">calendar_today</span>
            <input
              className="bg-transparent outline-none border-none focus:ring-0 w-full font-headline-md text-headline-md p-0"
              type="datetime-local"
              min={today}
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex-1 flex flex-col gap-3 px-4 border-b lg:border-b-0 lg:border-r border-outline-variant pb-6 lg:pb-0 focus-within:bg-primary/5 transition-colors rounded-xl">
          <label className="font-bold text-label-md text-primary uppercase tracking-wider">Tanggal Selesai</label>
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined text-3xl ${dateError ? 'text-red-500' : 'text-primary'}`}>event_busy</span>
            <input
              className={`bg-transparent outline-none border-none focus:ring-0 w-full font-headline-md text-headline-md p-0 ${dateError ? 'text-red-500' : ''}`}
              type="datetime-local"
              min={startDate || today}
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
          </div>
          {dateError && (
            <p className="text-xs text-red-500 font-semibold -mt-1">{dateError}</p>
          )}
        </div>

        {/* CTA */}
        <div className="w-full lg:w-auto px-2">
          <a
            href="#"
            onClick={handleWhatsappClick}
            className="bg-[#25D366] text-white font-headline-md text-headline-md px-8 py-5 rounded-xl shadow-xl hover:brightness-105 active:scale-95 transition-all w-full flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-3xl">whatsapp</span>
            Cek Unit
          </a>
        </div>
      </div>
    </div>
  );
}
