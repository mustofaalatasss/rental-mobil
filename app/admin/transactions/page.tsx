"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminTransactions() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDriver, setFilterDriver] = useState<string>('all');
  const [filterDeadline, setFilterDeadline] = useState<string>('all');

  const fetchData = async (status: string, driver: string, deadline: string) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    const searchParams = new URLSearchParams();
    if (status !== 'all') searchParams.append('status', status);
    if (driver !== 'all') searchParams.append('driver', driver);
    if (deadline !== 'all') searchParams.append('deadline', deadline);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const qs = searchParams.toString();
    const url = qs ? `${apiUrl}/api/bookings?${qs}` : `${apiUrl}/api/bookings`;

    const bookingsRes = await fetch(url, { headers });
    if (bookingsRes.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
      return;
    }
    const bookingsData = await bookingsRes.json();
    // Handle berbagai format response: array langsung, {data:[]}, {bookings:[]}
    if (Array.isArray(bookingsData)) {
      setBookings(bookingsData);
    } else if (Array.isArray(bookingsData?.data)) {
      setBookings(bookingsData.data);
    } else if (Array.isArray(bookingsData?.bookings)) {
      setBookings(bookingsData.bookings);
    } else {
      setBookings([]);
    }
  };

  const handleUpdateBookingStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    await fetch(`${apiUrl}/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchData(filterStatus, filterDriver, filterDeadline);
  };

  // Initialize filters from query string once
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('status')) setFilterStatus(searchParams.get('status') as string);
    if (searchParams.get('driver')) setFilterDriver(searchParams.get('driver') as string);
    if (searchParams.get('deadline')) setFilterDeadline(searchParams.get('deadline') as string);
  }, []);

  // Fetch data whenever filters change
  useEffect(() => {
    fetchData(filterStatus, filterDriver, filterDeadline);
  }, [filterStatus, filterDriver, filterDeadline]);

  return (
    <div className="bg-surface text-on-background font-body-md min-h-screen">
      {/* Dashboard Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-primary dark:bg-primary-container shadow-xl flex flex-col py-8 z-50 transition-all duration-300">
        <div className="px-8 mb-10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-primary font-bold">directions_car</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-black text-on-primary">Amar Admin</h1>
            <p className="font-label-sm text-label-sm text-on-primary/60">Fleet Manager</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center px-8 py-4 text-on-primary/70 hover:text-white hover:bg-white/5 transition-all duration-300">
            <span className="material-symbols-outlined mr-4">dashboard</span>
            <span className="font-label-sm text-label-sm">Dashboard</span>
          </Link>
          <Link href="/admin/armada" className="flex items-center px-8 py-4 text-on-primary/70 hover:text-white hover:bg-white/5 transition-all duration-300">
            <span className="material-symbols-outlined mr-4">directions_car</span>
            <span className="font-label-sm text-label-sm">Kelola Armada</span>
          </Link>
          <Link href="/admin/transactions" className="flex items-center px-8 py-4 bg-white/10 border-l-4 border-on-tertiary-fixed-variant text-white font-bold">
            <span className="material-symbols-outlined mr-4">receipt_long</span>
            <span className="font-label-sm text-label-sm">Riwayat Transaksi</span>
          </Link>
        </nav>

        <div className="px-8 pt-8 border-t border-white/10 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/20 overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxQp5md_3DU2tp86_54UeqqUX82Mrb4nBLgcCM74PsT2SqE1ggLFjdR9UY8QewEgPLcE2k2d6GJYi6I2nvwu19xJ8j2M009JR3yUsWHGhwCNT_SOS0c34FQ848AUXmCag_uEXuTSGUwxnGWfygQJGuEX9Y07ReAVNTE7NP1eKqKPMLnn251k0bapF5MC6Y7I-6bIwgvAmZrUJhiq1jFDfC1HiRmg5LGPNGLddJdFuUN0Iqzi5J5hAhz4Ts1kcRa8QsS3aChCBzjSIk" alt="Admin Profile" />
            </div>
            <div className="overflow-hidden">
              <p className="font-label-sm text-label-sm font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-on-primary/50 uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-72 min-h-screen p-margin-desktop space-y-12 bg-surface">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Riwayat Transaksi</h2>
            <p className="font-body-md text-body-md text-secondary mt-1">Seluruh data pesanan pelanggan yang masuk ke dalam sistem.</p>
          </div>
        </header>

        {/* Filters */}
        <div className="space-y-4 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-secondary mr-2 min-w-[80px]">Status:</span>
            {['all', 'pending', 'confirmed', 'returned', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full font-label-sm font-bold whitespace-nowrap transition-colors ${
                  filterStatus === status 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-secondary hover:bg-surface-container-low border border-outline-variant'
                }`}
              >
                {status === 'all' ? 'Semua' :
                 status === 'pending' ? 'Pending' :
                 status === 'confirmed' ? 'Disetujui' :
                 status === 'returned' ? 'Dikembalikan' : 'Ditolak'}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-secondary mr-2 min-w-[80px]">Layanan:</span>
            {['all', 'dengan_supir', 'lepas_kunci'].map(driver => (
              <button
                key={driver}
                onClick={() => setFilterDriver(driver)}
                className={`px-4 py-2 rounded-full font-label-sm font-bold whitespace-nowrap transition-colors ${
                  filterDriver === driver 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-secondary hover:bg-surface-container-low border border-outline-variant'
                }`}
              >
                {driver === 'all' ? 'Semua Layanan' :
                 driver === 'dengan_supir' ? 'Dengan Supir' : 'Lepas Kunci'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-secondary mr-2 min-w-[80px]">Deadline:</span>
            {['all', 'h-1'].map(deadline => (
              <button
                key={deadline}
                onClick={() => setFilterDeadline(deadline)}
                className={`px-4 py-2 rounded-full font-label-sm font-bold whitespace-nowrap transition-colors ${
                  filterDeadline === deadline 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-white text-secondary hover:bg-surface-container-low border border-outline-variant'
                }`}
              >
                {deadline === 'all' ? 'Semua Waktu' : 'H-1 (Jatuh Tempo Besok)'}
              </button>
            ))}
          </div>
        </div>

        {/* Full Transactions Table */}
        <section className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Mobil</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Mulai Sewa</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Jatuh Tempo</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Total Pembayaran</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {bookings.map((booking) => (
                <tr key={booking.id} className={`hover:bg-surface-container-lowest transition-colors ${booking.is_h_minus_1 ? 'bg-red-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="font-body-md text-body-md text-primary font-bold block">{booking.order_id}</span>
                    {booking.is_h_minus_1 && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest border border-red-200">
                        <span className="material-symbols-outlined text-[12px]">warning</span>
                        Deadline Besok
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface">{booking.customer_name}</td>
                  <td className="px-6 py-4">
                    <span className="font-body-md text-body-md text-secondary block">{booking.car_name}</span>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${booking.with_driver ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {booking.with_driver ? 'Sopir' : 'Lepas Kunci'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-label-md text-label-md text-secondary">{booking.start_date}</td>
                  <td className={`px-6 py-4 font-label-md text-label-md font-bold ${booking.is_h_minus_1 ? 'text-red-600' : 'text-on-tertiary-fixed-variant'}`}>{booking.end_date}</td>
                  <td className="px-6 py-4 font-body-md text-body-md text-primary font-bold">
                    Rp {booking.total_price?.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'returned' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                      className="bg-surface-container-low border border-outline-variant text-primary text-label-sm font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Disetujui</option>
                      <option value="returned">Dikembalikan</option>
                      <option value="rejected">Ditolak</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="p-10 text-center text-secondary">Belum ada transaksi di database dengan status ini.</div>
          )}
        </section>
      </main>
    </div>
  );
}
