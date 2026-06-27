"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [detailModal, setDetailModal] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    fetch(`${apiUrl}/api/dashboard/stats`, { headers })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => setStats(data))
      .catch(() => {});

    fetch(`${apiUrl}/api/bookings`, { headers })
      .then(res => res.json())
      .then(data => {
        // Handle berbagai format response: array langsung, {data:[]}, {bookings:[]}
        if (Array.isArray(data)) {
          setAllBookings(data);
        } else if (Array.isArray(data?.data)) {
          setAllBookings(data.data);
        } else if (Array.isArray(data?.bookings)) {
          setAllBookings(data.bookings);
        } else {
          setAllBookings([]);
        }
      })
      .catch(() => setAllBookings([]));

    // Micro-interactions and simple animation trigger
    const bars = document.querySelectorAll('.animate-bar');
    bars.forEach((bar) => {
      const el = bar as HTMLElement;
      const targetWidth = el.getAttribute('data-width') || '0%';
      el.style.width = '0%';
      setTimeout(() => {
        el.style.width = targetWidth;
      }, 300);
    });

    // Smooth reveal for cards
    const cards = document.querySelectorAll('.animate-card');
    cards.forEach((card, index) => {
      const el = card as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-primary dark:bg-primary-container shadow-xl flex flex-col py-8 z-50 transition-transform duration-300">
        <div className="px-8 mb-10">
          <h1 className="font-headline-md text-headline-md font-black text-on-primary tracking-tighter">Amar Admin</h1>
          <div className="flex items-center mt-6 gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY-vMxUNRf2q7DgRyqoJzbAFR_XvtddwpRvBxn-SQN6o3WKDAzcq0nBnwN5K9XWYro9wwhBoBfT86e7jcrd0T1EOhPyqpJDv5ObdMoH9oelq4wn4mo10hOybpDTpMaGRDN2HdfZoy5FJFSC-4MLO_aDSbQwPEXg3nBntyHyH4qT-3ESRjBCPdY55HsFF6tTPFqBwcBKxJDYgyfNKRPCHQhhiLp3G5So0Wjm_ZhFf_edTZMmaTb7Vt8hLnU7eqPRyBsZCOgtJZRiLtT" alt="Admin Profile" />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-primary">Fleet Manager</p>
              <p className="font-label-sm text-label-sm text-on-primary/60">Amar Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {/* Active Tab: Dashboard */}
          <Link href="/admin/dashboard" className="flex items-center gap-4 px-8 py-4 bg-white/10 border-l-4 border-on-tertiary-fixed-variant text-white font-bold transition-all duration-300 active:scale-95 group">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link href="/admin/armada" className="flex items-center gap-4 px-8 py-4 text-on-primary/70 hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-95 group">
            <span className="material-symbols-outlined">directions_car</span>
            <span className="font-label-md text-label-md">Kelola Armada</span>
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-4 px-8 py-4 text-on-primary/70 hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-95 group">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-label-md text-label-md">Riwayat Transaksi</span>
          </Link>
        </nav>

        <div className="px-8 mt-auto">
          <Link href="/admin/armada" className="block text-center w-full py-4 bg-on-tertiary-fixed-variant text-white font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer">
            Tambah Mobil Baru
          </Link>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-72 min-h-screen p-margin-desktop">
        {/* Header / Top Bar */}
        <header className="flex justify-between items-center mb-10 animate-card">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Overview Dashboard</h2>
            <p className="text-secondary font-body-md mt-1">Selamat datang kembali, Amar. Pantau performa armada Anda hari ini.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined text-primary p-2 bg-white rounded-full shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200">notifications</span>
              <span className="absolute top-0 right-0 w-3 h-3 bg-on-tertiary-fixed-variant border-2 border-background rounded-full"></span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-outline-variant">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              <span className="font-label-md text-label-md text-primary">Oktober 24, 2024</span>
            </div>
          </div>
        </header>

        {/* Summary Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-10">
          {/* Total Pendapatan */}
          <div onClick={() => setDetailModal('revenue')} className="animate-card bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-primary group hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Total Pendapatan</p>
                <h3 className="font-headline-md text-headline-md text-primary">Rp {stats && stats.totalRevenue != null ? (stats.totalRevenue / 1000000).toFixed(1) : '0.0'}M</h3>
              </div>
              <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-green-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="font-label-sm text-label-sm font-bold">+12% dari bulan lalu</span>
            </div>
          </div>

          {/* Mobil Disewa Hari Ini */}
          <div onClick={() => setDetailModal('orders')} className="animate-card bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-on-tertiary-fixed-variant group hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Total Pesanan</p>
                <h3 className="font-headline-md text-headline-md text-primary">{stats && stats.totalRentals != null ? stats.totalRentals : '0'} Pesanan</h3>
              </div>
              <div className="p-2 bg-on-tertiary-fixed-variant/5 rounded-lg text-on-tertiary-fixed-variant group-hover:bg-on-tertiary-fixed-variant group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="font-label-sm text-label-sm font-bold">Terus meningkat</span>
            </div>
          </div>

          {/* Pesanan Baru */}
          <div onClick={() => setDetailModal('pending')} className="animate-card bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-secondary group hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Pesanan (Pending)</p>
                <h3 className="font-headline-md text-headline-md text-primary">{allBookings && allBookings.length > 0 ? allBookings.filter((b:any) => b.status === 'pending').length : 0} Pesanan</h3>
              </div>
              <div className="p-2 bg-secondary/5 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="font-label-sm text-label-sm font-bold">Perlu verifikasi segera</span>
            </div>
          </div>

          {/* Total Armada */}
          <div onClick={() => setDetailModal('fleet')} className="animate-card bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-primary-container group hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Total Armada</p>
                <h3 className="font-headline-md text-headline-md text-primary">{stats && stats.totalCars != null ? stats.totalCars : '0'} Unit</h3>
              </div>
              <div className="p-2 bg-primary-container/5 rounded-lg text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">garage</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-primary-container">
              <span className="material-symbols-outlined text-sm">build</span>
              <span className="font-label-sm text-label-sm font-bold">Semua dalam kondisi prima</span>
            </div>
          </div>
        </section>

        {/* Charts & Widgets Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter animate-card">
          {/* Revenue Chart (Large) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-outline-variant/30">
            <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">Grafik Pendapatan Bulanan</h3>
                <p className="text-secondary font-label-sm mt-1">Estimasi pendapatan kotor tahun 2024</p>
              </div>
              <select className="bg-surface-container-low border-none rounded-lg font-label-md text-primary focus:ring-primary outline-none">
                <option>Tahun 2024</option>
                <option>Tahun 2023</option>
              </select>
            </div>
            <div className="p-8 flex-1 relative min-h-[350px] flex items-end gap-2">
              {stats?.monthlyRevenue ? stats.monthlyRevenue.map((item: any, i: number) => {
                const maxRev = Math.max(...stats.monthlyRevenue.map((m: any) => m.revenue));
                const height = maxRev > 0 ? (item.revenue / maxRev) * 100 : 0;
                
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 relative ${item.revenue > 0 ? 'bg-primary-container group-hover:bg-primary' : 'bg-surface-container-high'}`}
                      style={{ height: `${Math.max(height, 5)}%` }} // Minimum height 5% for visibility
                    >
                      {item.revenue > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                          Rp {(item.revenue / 1000000).toFixed(1)}M
                        </div>
                      )}
                    </div>
                    <span className="font-label-sm text-[10px] text-center text-secondary">{item.month}</span>
                  </div>
                );
              }) : (
                <div className="flex-1 h-full flex items-center justify-center text-secondary">Memuat grafik...</div>
              )}
            </div>
          </div>

          {/* Popular Cars Widget */}
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col border border-outline-variant/30">
            <div className="p-8 border-b border-outline-variant/20">
              <h3 className="font-headline-md text-headline-md text-primary">Mobil Paling Populer</h3>
              <p className="text-secondary font-label-sm mt-1">Berdasarkan frekuensi sewa</p>
            </div>
            <div className="p-8 flex-1 space-y-6">
              {stats?.popularCars?.length > 0 ? stats.popularCars.map((car: any, i: number) => {
                const maxBookings = Math.max(...stats.popularCars.map((c: any) => c.total_bookings));
                const width = (car.total_bookings / maxBookings) * 100;
                // Alternate colors
                const colors = ['bg-primary', 'bg-on-tertiary-fixed-variant', 'bg-secondary', 'bg-primary-container'];
                const color = colors[i % colors.length];

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-label-md text-label-md text-primary">{car.car_name}</span>
                      <span className="font-label-sm text-label-sm text-primary font-bold">{car.total_bookings} Sewa</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className={`animate-bar ${color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} data-width={`${width}%`}></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-secondary text-center py-8">Belum ada data sewa</div>
              )}
            </div>
            <div className="p-8 border-t border-outline-variant/20">
              <button className="w-full py-2 text-primary font-label-md text-label-md hover:bg-surface-container-low transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                Lihat Semua Armada <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity Table */}
        <section className="animate-card mt-10 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary">Riwayat Seluruh Transaksi</h3>
              <p className="text-secondary font-label-sm mt-1">Daftar lengkap pesanan pelanggan</p>
            </div>
            <button className="px-4 py-2 border border-outline-variant text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-all cursor-pointer">Export Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Order ID</th>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Customer</th>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Mobil</th>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Mulai Sewa</th>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Jatuh Tempo</th>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Status</th>
                  <th className="px-8 py-4 font-label-md text-label-md text-primary uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {allBookings.map((booking: any, index: number) => (
                  <tr key={index} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-8 py-4 font-label-md text-label-md text-primary">{booking.order_id}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary text-xs">
                          {booking.customer_name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-body-md text-on-surface">{booking.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-on-surface">{booking.car_name}</td>
                    <td className="px-8 py-4 text-secondary">{booking.start_date}</td>
                    <td className="px-8 py-4 text-on-tertiary-fixed-variant font-bold">{booking.end_date}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-bold text-primary">Rp {booking.total_price.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col md:flex-row justify-between items-center py-12 w-full max-w-container-max mx-auto border-t border-outline-variant/30">
          <p className="font-body-md text-body-md text-secondary">© 2024 Amar Rental Mobil Jakarta. Premium Urban Mobility.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a className="font-label-sm text-label-sm text-on-primary/60 hover:text-primary transition-all" href="#">Tentang Kami</a>
            <a className="font-label-sm text-label-sm text-on-primary/60 hover:text-primary transition-all" href="#">Syarat & Ketentuan</a>
            <a className="font-label-sm text-label-sm text-on-primary/60 hover:text-primary transition-all" href="#">Kebijakan Privasi</a>
            <a className="font-label-sm text-label-sm text-on-primary/60 hover:text-primary transition-all" href="#">Bantuan</a>
          </div>
        </footer>
      </main>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl zoom-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-md text-headline-md text-primary">
                {detailModal === 'revenue' && 'Detail Pendapatan'}
                {detailModal === 'orders' && 'Statistik Pesanan'}
                {detailModal === 'pending' && 'Pesanan Menunggu Verifikasi'}
                {detailModal === 'fleet' && 'Status Armada'}
              </h3>
              <button onClick={() => setDetailModal(null)} className="text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {detailModal === 'revenue' && (
                <div>
                  <p className="text-secondary mb-4">Rincian pendapatan kotor berdasarkan mobil yang disewa:</p>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {Array.from(allBookings.reduce((acc, b) => {
                      if (b.status === 'confirmed') {
                        acc.set(b.car_name, (acc.get(b.car_name) || 0) + b.total_price);
                      }
                      return acc;
                    }, new Map())).sort((a: any, b: any) => b[1] - a[1]).map(([carName, total]: any, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                        <span className="font-bold text-primary">{carName}</span>
                        <span className="font-black text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    {allBookings.length === 0 && <div className="text-center text-secondary py-4">Belum ada data pendapatan.</div>}
                  </div>
                </div>
              )}

              {detailModal === 'orders' && (
                <div>
                  <p className="text-secondary mb-4">Distribusi status dari total {stats?.totalRentals} pesanan yang masuk ke sistem:</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <span className="block text-3xl font-black text-green-600">{allBookings.filter(b => b.status === 'confirmed').length}</span>
                      <span className="text-xs uppercase tracking-wider font-bold text-green-800 mt-2 block">Disetujui</span>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                      <span className="block text-3xl font-black text-yellow-600">{allBookings.filter(b => b.status === 'pending').length}</span>
                      <span className="text-xs uppercase tracking-wider font-bold text-yellow-800 mt-2 block">Menunggu</span>
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                      <span className="block text-3xl font-black text-red-600">{allBookings.filter(b => b.status === 'rejected').length}</span>
                      <span className="text-xs uppercase tracking-wider font-bold text-red-800 mt-2 block">Ditolak</span>
                    </div>
                  </div>
                </div>
              )}

              {detailModal === 'pending' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl">warning</span>
                  </div>
                  <h4 className="text-xl font-black text-primary mb-3">Ada {allBookings.filter(b => b.status === 'pending').length} Pesanan Butuh Review</h4>
                  <p className="text-secondary font-body-md mb-8 px-4">Anda perlu memeriksa dokumen KTP dan SIM pelanggan secara manual sebelum menyetujui pesanan ini agar kunci mobil bisa diserahkan.</p>
                  <Link href="/admin/transactions?status=pending" className="inline-block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-container transition-colors cursor-pointer shadow-lg active:scale-95">
                    Pergi ke Halaman Verifikasi
                  </Link>
                </div>
              )}

              {detailModal === 'fleet' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl">garage</span>
                  </div>
                  <h4 className="text-xl font-black text-primary mb-3">Total {stats?.totalCars} Mobil Terdaftar</h4>
                  <p className="text-secondary font-body-md mb-8 px-4">Pantau jadwal ketersediaan masing-masing mobil dan kelola penambahan armada baru (tambah/hapus unit) di menu Kelola Armada.</p>
                  <Link href="/admin/armada" className="inline-block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-container transition-colors cursor-pointer shadow-lg active:scale-95">
                    Kelola Garasi Mobil
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
