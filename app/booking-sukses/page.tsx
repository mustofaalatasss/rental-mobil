"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BookingSuksesContent() {
  const searchParams = useSearchParams();
  const customerName = searchParams.get('name') || 'Pelanggan';
  const carName = searchParams.get('car') || 'Mobil';
  const totalPrice = searchParams.get('total') || '0';
  const bookingId = searchParams.get('id') || '-';

  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const waMessage = encodeURIComponent(
    `Halo Amar Rental! Saya ${customerName} baru saja melakukan pemesanan ${carName} dengan ID #${bookingId}. Mohon konfirmasi pesanan saya. Terima kasih!`
  );

  const formattedTotal = Number(totalPrice).toLocaleString('id-ID');

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-margin-mobile md:px-margin-desktop">
        <div
          className={`w-full max-w-lg text-center transition-all duration-700 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Success Icon */}
          <div className="relative mx-auto w-32 h-32 mb-10">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
            <div className="absolute inset-2 rounded-full bg-green-200 opacity-50" />
            {/* Icon circle */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-[0_8px_30px_rgba(34,197,94,0.4)] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                check_circle
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-headline-lg text-headline-lg text-primary mb-3">
            Pesanan Berhasil! 🎉
          </h1>
          <p className="text-secondary font-body-lg mb-10 leading-relaxed">
            Terima kasih, <span className="font-bold text-primary">{customerName}</span>! Pesanan Anda telah kami terima dan sedang diproses.
          </p>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-outline-variant p-8 mb-8 text-left space-y-4">
            <h2 className="font-headline-md text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>receipt_long</span>
              Ringkasan Pesanan
            </h2>

            <div className="flex justify-between items-center py-3 border-b border-outline-variant/40">
              <span className="text-secondary font-body-md">ID Pesanan</span>
              <span className="font-bold text-primary font-mono">#{bookingId}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/40">
              <span className="text-secondary font-body-md">Nama Pemesan</span>
              <span className="font-bold text-primary">{customerName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/40">
              <span className="text-secondary font-body-md">Mobil</span>
              <span className="font-bold text-primary">{carName}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-secondary font-body-md">Total Pembayaran</span>
              <span className="font-headline-md text-on-tertiary-fixed-variant">Rp {formattedTotal}</span>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex gap-3 items-start text-left">
            <span className="material-symbols-outlined text-blue-500 text-xl mt-0.5 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>info</span>
            <p className="text-sm text-blue-700 leading-relaxed">
              Tim kami akan segera menghubungi Anda dalam <strong>1×24 jam</strong> untuk konfirmasi jadwal dan instruksi pembayaran. Silakan hubungi WhatsApp kami jika ada pertanyaan.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`https://wa.me/6287868036735?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">whatsapp</span>
              Konfirmasi via WA
            </a>
            <Link
              href="/"
              className="flex-1 bg-white border-2 border-primary text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary hover:text-white active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">home</span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingSuksesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookingSuksesContent />
    </Suspense>
  );
}
