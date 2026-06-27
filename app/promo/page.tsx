"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Promo {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  minTransaction: string;
  validUntil: string;
  terms: string[];
  color: string;
}

const promos: Promo[] = [
  {
    id: '1',
    title: 'Diskon Pengguna Baru',
    code: 'AMARBARU',
    discount: '20%',
    description: 'Nikmati potongan harga 20% untuk penyewaan pertama Anda bersama Amar Rental.',
    minTransaction: 'Rp 1.000.000',
    validUntil: '31 Des 2026',
    terms: ['Khusus pengguna baru (pemesanan pertama)', 'Maksimal diskon Rp 200.000', 'Berlaku untuk semua jenis mobil'],
    color: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    id: '2',
    title: 'Spesial Akhir Pekan',
    code: 'WEEKENDSERU',
    discount: 'Rp 150rb',
    description: 'Liburan akhir pekan makin hemat dengan potongan harga langsung senilai Rp 150.000.',
    minTransaction: 'Sewa Minimal 2 Hari',
    validUntil: 'Setiap Hari Minggu',
    terms: ['Hanya berlaku untuk pengambilan hari Jumat, Sabtu, atau Minggu', 'Berlaku untuk mobil MPV (Avanza, Innova, dll) dan SUV (Fortuner, Pajero)'],
    color: 'bg-gradient-to-br from-green-500 to-green-700'
  },
  {
    id: '3',
    title: 'Libur Panjang / Mudik',
    code: 'LONGHOLIDAY',
    discount: '10%',
    description: 'Sewa mobil lebih lama, bayar lebih murah. Dapatkan diskon 10% untuk sewa jangka panjang.',
    minTransaction: 'Sewa Minimal 4 Hari',
    validUntil: 'Berlaku Sepanjang Tahun',
    terms: ['Maksimal diskon Rp 500.000', 'Tidak dapat digabungkan dengan promo lain', 'Berlaku untuk mobil Premium (Alphard, BMW, Civic)'],
    color: 'bg-gradient-to-br from-purple-500 to-purple-700'
  },
  {
    id: '4',
    title: 'Cashback Transfer Bank',
    code: 'HEMATBCA',
    discount: 'Rp 50rb',
    description: 'Dapatkan cashback instan jika Anda melakukan pembayaran full di muka menggunakan transfer BCA/Mandiri.',
    minTransaction: 'Tanpa Minimal Sewa',
    validUntil: 'Bulan Ini',
    terms: ['Metode pembayaran menggunakan Transfer Bank', 'Cashback diberikan langsung sebagai potongan harga akhir'],
    color: 'bg-gradient-to-br from-orange-500 to-orange-700'
  }
];

export default function PromoPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest">
      <Navbar />
      
      <main className="max-w-container-max mx-auto px-margin-desktop py-12 flex-1 w-full">
        <div className="mb-12 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-bold mb-4">
            <span className="material-symbols-outlined align-middle mr-2 text-xl">loyalty</span>
            Promo Amar Rental
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Promo & Diskon Spesial</h1>
          <p className="text-secondary font-body-lg max-w-2xl mx-auto">
            Gunakan kode kupon di bawah ini saat melakukan pemesanan via WhatsApp atau beritahu admin kami untuk mendapatkan harga spesial.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {promos.map(promo => (
            <div key={promo.id} className="flex flex-col sm:flex-row bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant overflow-hidden hover:shadow-[0_8px_30px_rgb(0,45,98,0.15)] transition-all duration-300 transform hover:-translate-y-1">
              
              {/* Left Side: Discount Tag */}
              <div className={`${promo.color} text-white flex flex-col justify-center items-center p-8 sm:w-2/5 relative border-b sm:border-b-0 sm:border-r-4 border-dashed border-white/50`}>
                {/* Mobile Cutouts */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-surface-container-lowest rounded-full sm:hidden"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-surface-container-lowest rounded-full sm:hidden"></div>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface-container-lowest rounded-full sm:hidden"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-surface-container-lowest rounded-full sm:hidden"></div>
                
                {/* Desktop Cutouts */}
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-surface-container-lowest rounded-full hidden sm:block"></div>
                <div className="absolute -bottom-5 -right-5 w-10 h-10 bg-surface-container-lowest rounded-full hidden sm:block"></div>
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface-container-lowest rounded-full hidden sm:block"></div>
                
                <span className="font-label-md uppercase tracking-widest mb-2 opacity-90">Diskon</span>
                <span className="font-headline-lg text-4xl sm:text-5xl font-black text-center drop-shadow-md">{promo.discount}</span>
              </div>
              
              {/* Right Side: Details & Code */}
              <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col relative">
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface-container-lowest rounded-full hidden sm:block"></div>

                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-headline-md text-primary font-extrabold text-xl">{promo.title}</h3>
                </div>
                
                <div className="inline-flex w-fit bg-surface-container-highest px-3 py-1 rounded-md text-xs font-bold text-secondary mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">event</span>
                  s.d {promo.validUntil}
                </div>

                <p className="text-secondary text-sm mb-6 leading-relaxed">{promo.description}</p>
                
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 flex justify-between items-center">
                  <div>
                    <span className="block text-xs text-blue-600/70 font-semibold mb-1 uppercase tracking-wider">Kode Kupon</span>
                    <span className="font-mono font-black text-xl text-blue-700 tracking-widest">{promo.code}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(promo.id, promo.code)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${copiedId === promo.id ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20'}`}
                  >
                    {copiedId === promo.id ? (
                      <><span className="material-symbols-outlined text-sm">check</span> Tersalin</>
                    ) : (
                      <><span className="material-symbols-outlined text-sm">content_copy</span> Salin</>
                    )}
                  </button>
                </div>

                <div className="mt-auto pt-4 border-t border-outline-variant/50">
                  <p className="font-label-sm font-extrabold text-primary mb-3">Syarat & Ketentuan:</p>
                  <ul className="list-disc pl-5 text-xs text-secondary space-y-2">
                    <li><span className="font-semibold text-primary">Minimal Transaksi:</span> {promo.minTransaction}</li>
                    {promo.terms.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
