"use client";

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Car, fetchCarByIdFromAPI } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';

// ── Inline Toast ───────────────────────────────────────────────────────────────
type ToastType = 'error' | 'success' | 'loading';
interface ToastMsg { message: string; type: ToastType; }

function Toast({ toast, onClose }: { toast: ToastMsg; onClose: () => void }) {
  useEffect(() => {
    if (toast.type !== 'loading') {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [toast, onClose]);

  const icons: Record<ToastType, string> = { error: 'error', success: 'check_circle', loading: 'progress_activity' };
  const colors: Record<ToastType, string> = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    loading: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-xl animate-in slide-in-from-top-4 duration-300 min-w-[280px] max-w-sm ${colors[toast.type]}`}>
      <span className={`material-symbols-outlined text-xl ${toast.type === 'loading' ? 'animate-spin' : ''}`} style={{ fontVariationSettings: '"FILL" 1' }}>{icons[toast.type]}</span>
      <p className="font-semibold text-sm flex-1">{toast.message}</p>
      {toast.type !== 'loading' && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100"><span className="material-symbols-outlined text-lg">close</span></button>
      )}
    </div>
  );
}

export default function PembayaranDynamic({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const carId = resolvedParams.id;
  const router = useRouter();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });
  const clearToast = () => setToast(null);

  useEffect(() => {
    fetchCarByIdFromAPI(carId).then(data => {
      if (data) {
        setCar(data);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [carId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withDriver, setWithDriver] = useState(false);
  const [duration, setDuration] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    notFound();
  }

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const confirmPayment = async () => {
    if (!customerName || !customerPhone || !startDate || !pickupLocation) {
      showToast('Mohon lengkapi Data Pemesan & Lokasi Pengambilan.', 'error');
      return;
    }

    showToast('Memproses pesanan Anda...', 'loading');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: carId,
          customer_name: customerName,
          customer_phone: customerPhone,
          start_date: startDate,
          duration_days: duration,
          with_driver: withDriver,
          pickup_location: pickupLocation,
          total_price: totalBiaya,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearToast();
        setIsModalOpen(false);
        // Redirect ke halaman sukses (bukan admin!)
        const bookingId = data?.data?.id || data?.id || 'BARU';
        router.push(
          `/booking-sukses?name=${encodeURIComponent(customerName)}&car=${encodeURIComponent(car?.name || '')}&total=${totalBiaya}&id=${bookingId}`
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData?.message || 'Terjadi kesalahan saat memproses pesanan.', 'error');
      }
    } catch (err) {
      showToast('Gagal terhubung ke server. Pastikan koneksi internet Anda.', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parent = e.target.closest('.border-dashed');
    if (parent) {
      const label = parent.querySelector('.font-label-md');
      if (label) {
        label.innerHTML = 'File Berhasil Diunggah';
        label.classList.add('text-on-tertiary-fixed-variant');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const parent = e.currentTarget as HTMLElement;
    parent.classList.remove('bg-primary/5', 'border-primary');
    const label = parent.querySelector('.font-label-md');
    if (label) {
      label.innerHTML = 'File Berhasil Diunggah';
      label.classList.add('text-on-tertiary-fixed-variant');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const parent = e.currentTarget as HTMLElement;
    parent.classList.add('bg-primary/5', 'border-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const parent = e.currentTarget as HTMLElement;
    parent.classList.remove('bg-primary/5', 'border-primary');
  };

  const asuransi = 150000;
  const carTotal = car.price * duration;
  const driverFeePerDay = 200000;
  const driverTotal = withDriver ? driverFeePerDay * duration : 0;
  
  let discountPercent = 0;
  if (duration === 3) discountPercent = 3;
  if (duration === 7) discountPercent = 7;
  
  const subTotal = carTotal + driverTotal;
  const discountAmount = (subTotal * discountPercent) / 100;
  const totalBiaya = subTotal - discountAmount + asuransi;

  return (
    <div className={`flex flex-col min-h-screen ${isModalOpen ? 'overflow-hidden' : ''}`}>
      {/* Toast Notification */}
      {toast && <Toast toast={toast} onClose={clearToast} />}

      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-base md:py-12 flex-1 w-full">
        {/* Header Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <nav className="flex gap-2 text-label-sm font-label-sm text-secondary mb-4">
                <span>Beranda</span>
                <span>/</span>
                <span>Katalog</span>
                <span>/</span>
                <span className="text-primary font-bold">{car.name}</span>
              </nav>
              <h1 className="font-headline-xl text-headline-xl text-primary uppercase">{car.name}</h1>
              <p className="font-body-lg text-body-lg text-secondary">{car.description}</p>
            </div>
            <div className="flex gap-2">
              {car.tags.map((tag, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${index === 0 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-primary'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Main Car Image */}
          <div className="h-[300px] md:h-[500px] mb-12 relative rounded-xl overflow-hidden shadow-sm group bg-[#F2F2F2] flex items-center justify-center p-8 border border-outline-variant">
            <img className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" src={car.imageUrl} alt={`${car.name} Main`} />
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant">
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">person</span>
              <span className="font-label-sm text-label-sm text-secondary">Kapasitas</span>
              <span className="font-label-md text-label-md text-primary">{car.seats} Penumpang</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">luggage</span>
              <span className="font-label-sm text-label-sm text-secondary">Bagasi</span>
              <span className="font-label-md text-label-md text-primary">{car.baggage} Koper Besar</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">settings_input_component</span>
              <span className="font-label-sm text-label-sm text-secondary">Transmisi</span>
              <span className="font-label-md text-label-md text-primary">{car.transmission}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">bolt</span>
              <span className="font-label-sm text-label-sm text-secondary">Bahan Bakar</span>
              <span className="font-label-md text-label-md text-primary">{car.fuel}</span>
            </div>
          </div>
        </section>

        {/* Booking & Checkout Content */}
        <div className="flex flex-col lg:flex-row gap-gutter relative">
          {/* Left Side: Form */}
          <div className="flex-1 space-y-12">
            {/* Section 1: Rent System */}
            <div className="bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="font-headline-md text-headline-md text-primary mb-6">Pilih Sistem Sewa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative cursor-pointer group">
                  <input checked={!withDriver} onChange={() => setWithDriver(false)} className="peer sr-only" name="system" type="radio" />
                  <div className={`p-6 border-2 rounded-xl transition-all ${!withDriver ? 'border-primary-container bg-primary/5' : 'border-outline-variant group-hover:border-primary'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-primary-container">key</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!withDriver ? 'border-primary-container bg-primary-container' : 'border-outline-variant'}`}>
                        {!withDriver && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <h3 className="font-label-md text-label-md text-primary">Lepas Kunci</h3>
                    <p className="text-label-sm text-label-sm text-secondary">Kebebasan berkendara penuh tanpa pengemudi.</p>
                  </div>
                </label>
                <label className="relative cursor-pointer group">
                  <input checked={withDriver} onChange={() => setWithDriver(true)} className="peer sr-only" name="system" type="radio" />
                  <div className={`p-6 border-2 rounded-xl transition-all ${withDriver ? 'border-primary-container bg-primary/5' : 'border-outline-variant group-hover:border-primary'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-primary-container">person_pin_circle</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${withDriver ? 'border-primary-container bg-primary-container' : 'border-outline-variant'}`}>
                        {withDriver && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <h3 className="font-label-md text-label-md text-primary">Dengan Supir</h3>
                    <p className="text-label-sm text-label-sm text-secondary">Layanan sopir profesional & berpengalaman.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 2: Date & Location */}
            <div className="bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="font-headline-md text-headline-md text-primary mb-6">Data Pemesan & Lokasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-wider">Nama Lengkap</label>
                  <input value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border border-outline-variant outline-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary" type="text" placeholder="Masukkan nama" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-wider">Nomor Telepon</label>
                  <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border border-outline-variant outline-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary" type="text" placeholder="Contoh: 0812345678" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-wider">Tanggal Ambil</label>
                  <input value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-outline-variant outline-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary" type="date" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-wider">Durasi Sewa</label>
                  <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full border border-outline-variant outline-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value={1}>1 Hari (24 Jam)</option>
                    <option value={3}>3 Hari</option>
                    <option value={7}>1 Minggu</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-wider">Lokasi Pengantaran / Penjemputan</label>
                  <textarea value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="w-full border border-outline-variant outline-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Contoh: Menara Astra, Karet Tengsin, Jakarta Pusat" rows={3}></textarea>
                </div>
              </div>
            </div>

            {/* Section 3: Document Upload */}
            <div className="bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="font-headline-md text-headline-md text-primary mb-6">Unggah Dokumen Identitas</h2>
              <p className="text-label-sm text-label-sm text-secondary mb-8">Format yang didukung: JPG, PNG, PDF (Maks. 5MB per file)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer" 
                  onClick={() => document.getElementById('ktp-upload')?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input className="hidden" id="ktp-upload" type="file" onChange={handleFileUpload} />
                  <span className="material-symbols-outlined text-4xl text-primary mb-3">badge</span>
                  <span className="font-label-md text-label-md text-primary">Upload KTP</span>
                  <span className="text-xs text-secondary mt-1">Drag and drop atau klik</span>
                </div>
                <div 
                  className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer" 
                  onClick={() => document.getElementById('sim-upload')?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input className="hidden" id="sim-upload" type="file" onChange={handleFileUpload} />
                  <span className="material-symbols-outlined text-4xl text-primary mb-3">card_membership</span>
                  <span className="font-label-md text-label-md text-primary">Upload SIM A</span>
                  <span className="text-xs text-secondary mt-1">Sesuai nama pemesan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Sticky Checkout Card */}
          <div className="lg:w-96">
            <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-[0px_12px_32px_rgba(0,45,98,0.12)] border border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-primary mb-6">Rincian Pembayaran</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-label-md text-secondary">Sewa {car.name} ({duration} Hari)</span>
                  <span className="text-label-md text-primary font-bold">Rp {carTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-label-md text-secondary">Layanan Sopir ({duration} Hari)</span>
                  <span className="text-label-md text-primary font-bold">Rp {driverTotal.toLocaleString('id-ID')}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-[#D32F2F]">Diskon {discountPercent}%</span>
                    <span className="text-label-md text-[#D32F2F] font-bold">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-label-md text-secondary">Asuransi Perjalanan</span>
                  <span className="text-label-md text-primary font-bold">Rp {asuransi.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between items-center">
                  <span className="font-label-md text-label-md text-primary">Total Biaya</span>
                  <span className="font-headline-md text-headline-md text-on-tertiary-fixed-variant">Rp {totalBiaya.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  className="w-full bg-primary text-white font-label-md text-label-md py-4 rounded-xl shadow-lg hover:bg-primary-container transition-all active:scale-95 cursor-pointer" 
                  onClick={toggleModal}
                >
                  Pilih Metode Pembayaran
                </button>
                <p className="text-[10px] text-center text-secondary">Dengan memesan, Anda menyetujui Syarat & Ketentuan kami.</p>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-outline-variant flex justify-center gap-6 grayscale opacity-60">
                <img alt="Visa" className="h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuoQuzPaYoYrUPDgpwd0gP8dJLB9dkCwJN5ZojejPZK4fv4-Pnb8RS--ak1sBjp_xxgc2DF1k4nb0PslwS4-okFqUQQg-mIkMDBwSUP0UqtdSrEK4WbAXMXP4jRsBkkZhjplXpjbBWtAZ1mT1C7FaUtnJ_-woMHQFgWg3sVSQLYQlwTAnA5HweG3XL9TBXabv92yn1ibQ8t8jFNNQixJ8kAYWKHTyOrzu5OFGvcWeQGoWjdepM9Q37F9g6j9t4tI2J0DEgRMRqmVuG" />
                <img alt="Mastercard" className="h-6 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC87TUwHIeIEiAPIu4gl3mhZexDXjaWDcRxjbJZgr1AScxnti9Pt7V1WWdKV2TiOtpdL9GfoKqBCvj67XJbaLACidZj1bgC2Y81TUT2et6v50iDSt5hMAukt5Z-DkuaACENvdLyI2hnWvuTWjg2UM8fUsYltZTOjKC_QwnZZQoXI7Nfa8W9S8e4OuvtAm9Yf7QMNQueyiVlo0XZJbKaNugXFMZIlXLMEjOxhSL4upiPh9e1jLzzlaGBy3lW0KQQIoFIozwN4JoOVAmD" />
                <img alt="BCA" className="h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkXJmSG5-XIBZ8ENqfVxgT6KZiLsH_zYKgOzuJWp_zhqaz1eHy3henVGL64_WKbdOFgO4kLrG8s-14dRE7mQfWgNZohQO0czGcuD-lxmaumBR5yi-5jFpaZeC4hpDqWeZS1qLEjMlgN9JzMK059RDGf0sDmVrwRwg_0dtrke9XPsjqvwknIprxJ9qUTZprcqgia2ZRnu4plLSyIkUwBnLNy2a-7LCpXUUVE3e3uBWchrFxD9RFefm-kKqvEjZIXRAPs7kUU9CFwvEd" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Gateway Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={toggleModal}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-headline-md text-headline-md text-primary">Pilih Metode Pembayaran</h3>
              <button className="text-secondary hover:text-primary cursor-pointer" onClick={toggleModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {/* Virtual Account */}
              <div className="mb-8">
                <h4 className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-4">Virtual Account</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <img alt="BCA" className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy2HvASKEKBCBPUwqoT2VfPMiHptwgRVrM5b0zBf6fjSpmQQAx466GsYBt11Z8ZZ9Nh3O7mmqOz_Gszma2rNogpPorfIwzbvs4PQOqBv2LqgxA45xrfzw2InIVbBeh3KmZTVtMizj5THzqk3EQ0bn6Pr7ErL7ZIpNkndziUTP7B45DiLF563ZoLek33ZgRQrzFsrHvcMMEpk-j9uo8bubd4zjMy9qr7369qAW2p2dlZp2EyG-juUfyJa_ZzSooEuZAisfL98Y9uTC4" />
                      <span className="font-label-md text-label-md text-primary">BCA Virtual Account</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <img alt="BNI" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnqgLUfncvKQl3GzTBV8KbhOZG-yVgkjyjVzWnHiIVCU3UXTw9NrOp5dTHYOljcZ0leIXhAdRyXsDkwvZ3s-08uAK09-FnQCtUOIsR0bLWVsgf7f5dvaGpeQc_tcrj4TNmqXRipc1gGjYgwkQjKKOb1o7TcHjwh2h3ECXPxWe9OhEle6dvo7UYDKSRTJh_lB_KMEq4a0DZwbXvyCDemhiPNtPicI0VfwL0g3JxucaL7RoOlp2sFEb2vlgOprwbeRISzOUx_2RjPokr" />
                      <span className="font-label-md text-label-md text-primary">BNI Virtual Account</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <img alt="Mandiri" className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh7rDzCCYnTE1OCrSrEH-n2DSKFUJc9j0fIJSidku9_l7U_2X4mvxGQMSrpo6Jk4HcX4Jyxf__GrN1Ln-WrfIU-tc8gBAXd9Z7kKFKrSZsiSqZdxzuixnowHevnOr3U6MkuCaGQ8gzw409uHtgn4fQyW3GpXpiWZImDZhjea4ofCzdet1RPTLGujRXgOJzh9jq2xOkvlBbQ_evSQKelP8CjGzzB0V2Y-K-1vW6uzqaI1tPz_VAnY3kiJWXEl-FJBRtS437nSDN8NYE" />
                      <span className="font-label-md text-label-md text-primary">Mandiri Virtual Account</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
                  </div>
                </div>
              </div>
              {/* E-Wallet */}
              <div className="mb-4">
                <h4 className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-4">E-Wallet</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <img alt="OVO" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOID1s4uK2SNXpnjwvYBgHOX4UGpOh2hifJny4SEz9os9ZB3jzsNvMYEp_GJBUylm6DfvivIeNXkI3XuYQKtCEO7tabRQm12nblt7hqG0UQKIdLmU05rBpovDCzWAUW4EjRLZiBFZ_1rsbZ2ZvcqZyXAknJd6dTDi1fYD7ipZOBooKCLOQ1dyAjsKPI3VBXNMRoy-TG8TJ7AKZsr8yo1yv40yIlh7C2a0GQkkFIt8GpnXSsRA7Aw1pniNqrdiXKn8K_m4E_zGnsZBN" />
                      <span className="font-label-md text-label-md text-primary">OVO</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <img alt="GoPay" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOfiRprLPtcqJf71DO02pAchwwDohb4W4fW-DxT5C6EzSvGNq_jerwk7dqVwKsl3nPX-_WvLbnaqJsCSIRSVxVN8tIOQkrH4SVq_c_FgCAMKtgOk4CS9ackKPQvs_uuO8mjRJz9L9MhxCNg4Shh0ZFmK2WWDADFUn6OFAx7pbcMpjSZi94edSs5gD2VPYYKy9O4sGWUmPzLdWlgf2cTKdR2lFwPJx-una2AGH2rZmeFyJMuxeYyXwu8j6iDLZqzem7F4Mf0XMSMRA-" />
                      <span className="font-label-md text-label-md text-primary">GoPay</span>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface border-t border-outline-variant">
              <button 
                className="w-full cursor-pointer bg-[#D32F2F] text-white font-label-md text-label-md py-4 rounded-xl shadow-lg active:scale-95 transition-all" 
                onClick={confirmPayment}
              >
                Konfirmasi Pemesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
