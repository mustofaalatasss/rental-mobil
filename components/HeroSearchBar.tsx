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
    <div className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop z-20 overflow-visible relative lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2">
      <div className="glass-card-strong rounded-2xl lg:rounded-b-none lg:rounded-t-2xl shadow-[0px_20px_50px_rgba(0,0,0,0.2)] p-4 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8 items-stretch lg:items-center overflow-visible border-b lg:border-b-0 border-outline-variant">
        {/* Location */}
        <div className="flex-1 flex flex-col gap-1.5 lg:gap-3 px-2 lg:px-4 border-b lg:border-b-0 lg:border-r border-outline-variant pb-4 lg:pb-0 focus-within:bg-primary/5 transition-colors rounded-xl">
          <label className="font-bold text-xs lg:text-label-md text-primary uppercase tracking-wider">Lokasi Penjemputan</label>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">location_on</span>
            <input
              className="bg-transparent outline-none border-none focus:ring-0 w-full text-base lg:font-headline-md lg:text-headline-md p-0 placeholder:text-secondary/50"
              placeholder="Ketik lokasi..."
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="flex-1 flex flex-col gap-1.5 lg:gap-3 px-2 lg:px-4 border-b lg:border-b-0 lg:border-r border-outline-variant pb-4 lg:pb-0 focus-within:bg-primary/5 transition-colors rounded-xl">
          <label className="font-bold text-xs lg:text-label-md text-primary uppercase tracking-wider">Tanggal Mulai</label>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">calendar_today</span>
            <input
              className="bg-transparent outline-none border-none focus:ring-0 w-full text-base lg:font-headline-md lg:text-headline-md p-0"
              type="datetime-local"
              min={today}
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex-1 flex flex-col gap-1.5 lg:gap-3 px-2 lg:px-4 border-b lg:border-b-0 lg:border-r border-outline-variant pb-4 lg:pb-0 focus-within:bg-primary/5 transition-colors rounded-xl">
          <label className="font-bold text-xs lg:text-label-md text-primary uppercase tracking-wider">Tanggal Selesai</label>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className={`material-symbols-outlined text-2xl lg:text-3xl ${dateError ? 'text-red-500' : 'text-primary'}`}>event_busy</span>
            <input
              className={`bg-transparent outline-none border-none focus:ring-0 w-full text-base lg:font-headline-md lg:text-headline-md p-0 ${dateError ? 'text-red-500' : ''}`}
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
        <div className="w-full lg:w-auto px-1 lg:px-2">
          <a
            href="#"
            onClick={handleWhatsappClick}
            className="bg-[#25D366] text-white font-bold text-base lg:font-headline-md lg:text-headline-md px-6 py-4 lg:px-8 lg:py-5 rounded-xl shadow-xl hover:brightness-105 active:scale-95 transition-all w-full flex items-center justify-center gap-2 lg:gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Cek Unit
          </a>
        </div>
      </div>
    </div>
  );
}
