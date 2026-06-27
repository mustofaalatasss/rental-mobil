"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminArmada() {
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isEditCarModalOpen, setIsEditCarModalOpen] = useState(false);

  const [newCar, setNewCar] = useState({
    name: '',
    brand: 'Toyota',
    type: '',
    price: '',
    seats: '',
    transmission: 'Automatic',
    baggage: '',
    image: '',
    stock: 10
  });

  const [editingCar, setEditingCar] = useState<any>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const carsRes = await fetch(`${apiUrl}/api/cars`); // Public route
      const carsData = await carsRes.json();
      setCars(Array.isArray(carsData) ? carsData : []);

      const bookingsRes = await fetch(`${apiUrl}/api/bookings`, { headers });
      if (bookingsRes.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }
      
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setCars([]);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccess = () => setIsSuccessModalOpen(true);
  const closeModal = () => setIsSuccessModalOpen(false);

  const handleDeleteCar = async (id: number) => {
    if (confirm('Yakin ingin menghapus mobil ini?')) {
      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      await fetch(`${apiUrl}/api/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
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
    if (status === 'confirmed') {
      showSuccess();
    }
    fetchData();
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const formData = new FormData();
    formData.append('name', newCar.name);
    formData.append('brand', newCar.brand);
    formData.append('type', newCar.type);
    formData.append('price', newCar.price.toString());
    formData.append('seats', newCar.seats.toString());
    formData.append('transmission', newCar.transmission);
    formData.append('baggage', newCar.baggage.toString());
    formData.append('stock', newCar.stock.toString());
    formData.append('is_available', '1');
    
    if ((newCar.image as any) instanceof File) {
      formData.append('image', newCar.image as any);
    } else if (newCar.image && typeof newCar.image === 'string') {
      formData.append('image', newCar.image);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    await fetch(`${apiUrl}/api/cars`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    setIsAddCarModalOpen(false);
    setNewCar({ name: '', brand: 'Toyota', type: '', price: '', seats: '', transmission: 'Automatic', baggage: '', image: '', stock: 10 });
    fetchData();
  };

  const openEditModal = (car: any) => {
    setEditingCar({ ...car });
    setIsEditCarModalOpen(true);
  };

  const handleEditCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel requires this for multipart PUT
    formData.append('name', editingCar.name);
    formData.append('brand', editingCar.brand);
    formData.append('type', editingCar.type);
    formData.append('price', editingCar.price.toString());
    formData.append('seats', editingCar.seats.toString());
    formData.append('transmission', editingCar.transmission);
    formData.append('baggage', editingCar.baggage.toString());
    formData.append('stock', editingCar.stock.toString());
    formData.append('is_available', editingCar.is_available ? '1' : '0');
    
    if (editingCar.image instanceof File) {
      formData.append('image', editingCar.image);
    } else if (editingCar.image && typeof editingCar.image === 'string') {
      formData.append('image', editingCar.image);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    await fetch(`${apiUrl}/api/cars/${editingCar.id}`, {
      method: 'POST', // Use POST with _method=PUT to support multipart file upload in Laravel
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    setIsEditCarModalOpen(false);
    fetchData();
    showSuccess();
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');

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
          <Link href="/admin/armada" className="flex items-center px-8 py-4 bg-white/10 border-l-4 border-on-tertiary-fixed-variant text-white font-bold">
            <span className="material-symbols-outlined mr-4">directions_car</span>
            <span className="font-label-sm text-label-sm">Kelola Armada</span>
          </Link>
          <Link href="/admin/transactions" className="flex items-center px-8 py-4 text-on-primary/70 hover:text-white hover:bg-white/5 transition-all duration-300">
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
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Kelola Armada</h2>
            <p className="font-body-md text-body-md text-secondary mt-1">Pantau status kendaraan dan ketersediaan unit real-time.</p>
          </div>
          <button 
            onClick={() => setIsAddCarModalOpen(true)}
            className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined">add</span>
            <span className="font-label-md text-label-md">Tambah Mobil Baru</span>
          </button>
        </header>

        {/* Fleet Table */}
        <section className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Mobil</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Harga/Hari</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider">Stok</th>
                <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                        <img className="w-full h-full object-cover" src={car.image || 'https://via.placeholder.com/150'} alt={car.name} />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold text-primary">{car.name}</p>
                        <p className="font-label-sm text-label-sm text-secondary">{car.brand} • {car.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant font-mono">
                    Rp {car.price?.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 font-label-md text-label-md">
                    <span className="bg-surface-container px-3 py-1 rounded-full text-primary font-bold">
                      {car.stock} Unit
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openEditModal(car)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Mobil"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteCar(car.id)}
                        className="p-2 text-on-tertiary-fixed-variant hover:bg-tertiary/5 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Mobil"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Incoming Transactions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Transaksi Masuk</h2>
              <p className="font-body-md text-body-md text-secondary mt-1">Review dokumen identitas penyewa sebelum konfirmasi pesanan.</p>
            </div>
            <div className="flex space-x-4">
              <span className="flex items-center space-x-2 text-secondary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
                <span>Menunggu: {pendingBookings.length} Pesanan</span>
              </span>
            </div>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-secondary border border-outline-variant/20">
              Tidak ada transaksi masuk yang menunggu verifikasi.
            </div>
          ) : (
            pendingBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl p-gutter shadow-[0px_12px_32px_rgba(0,45,98,0.12)] border border-outline-variant/20 grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-6">
                <div className="space-y-6">
                  <div className="bg-surface-container-low p-6 rounded-2xl">
                    <h4 className="font-label-md text-label-md text-secondary mb-4 uppercase">Data Penyewa ({booking.order_id})</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant font-body-md text-body-md">Nama</span>
                        <span className="font-bold text-primary font-body-md text-body-md">{booking.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant font-body-md text-body-md">Mobil</span>
                        <span className="font-bold text-primary font-body-md text-body-md">{booking.car_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant font-body-md text-body-md">Mulai Sewa</span>
                        <span className="font-bold text-primary font-body-md text-body-md">{booking.start_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant font-body-md text-body-md">Jatuh Tempo</span>
                        <span className="font-bold text-on-tertiary-fixed-variant font-body-md text-body-md">{booking.end_date}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-outline-variant/30">
                        <span className="text-on-surface-variant font-body-md text-body-md">Total Tagihan</span>
                        <span className="font-black text-on-tertiary-fixed-variant font-headline-md text-headline-md">Rp {booking.total_price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>Setujui Pesanan</span>
                    </button>
                    <button 
                      onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                      className="w-full border-2 border-on-tertiary-fixed-variant text-on-tertiary-fixed-variant hover:bg-tertiary/5 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      <span>Tolak Pesanan</span>
                    </button>
                    {/* Note: Menandai selesai dan mengembalikan stok biasanya dilakukan dari menu transaksi terpisah, namun sebagai shortcut bisa ditambahkan di sini jika dibutuhkan. Saat ini hanya Setujui/Tolak untuk pesanan masuk. */}
                  </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-primary font-bold ml-1">KTP (Identitas)</label>
                    <div className="relative group aspect-[1.58/1] rounded-2xl overflow-hidden bg-surface-container shadow-inner border border-outline-variant/30">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-FG9lE_7OMGOVeiGjAfZx-8V3RoJdYVKOLDEh308TQlmSdT08zQ3ywiyAAmOLyI8NdDJnExDHS6KuzLd5s3niHgILcArKQLW3EBpt_repO8j2_cQ711DLlH43MwpNOZnskP-dMQ_XAziHquurYueED5VJ3Pe_YvrAORr32gjyA9gbK0PdSM8Q59lkopyVBoT8Y0zriqXleABnwLMTUHhlFKZaO5JMgWoq3HBRerH8VbDrJvM16XlDh5y-0OKqxCgX8i1tyKPnRen5" alt="KTP" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-primary font-bold ml-1">SIM A (Driving License)</label>
                    <div className="relative group aspect-[1.58/1] rounded-2xl overflow-hidden bg-surface-container shadow-inner border border-outline-variant/30">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-EoPcbDV1Q3a2954E77Sq6xYYkzZ9I-5L67JzWow9p-WXU1rVAkHiT3R2qUX5OjGxmJsxICfkdMFivlqqGBijfjDTEQ8KmCj9HsY8L4ykVxP0MmMAmRvLfLYSXmBwOMWf5KxUia61IywqWg1xWZmtDkuGdZ6fY98IZlVY0gJQ0SdKVDYK8wVnCbYZWGfARh20nOmtFPfk3_McRVCtEtqygE8sz0ab2mK_LJA8BCoNY_QejyL-afv4ZlThBaNLSSpjCmMf8o8mwpTr" alt="SIM" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Add Car Modal */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Tambah Mobil Baru</h3>
              <button onClick={() => setIsAddCarModalOpen(false)} className="text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Merk (Brand)</label>
                  <select required value={newCar.brand} onChange={e => setNewCar({...newCar, brand: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Daihatsu">Daihatsu</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="BMW">BMW</option>
                    <option value="Wuling">Wuling</option>
                    <option value="Chery">Chery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Nama Mobil</label>
                  <input required value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" placeholder="Misal: Fortuner GR Sport" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Tipe (Kategori)</label>
                  <select required value={newCar.type} onChange={e => setNewCar({...newCar, type: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="" disabled>Pilih Tipe</option>
                    <option value="MPV">MPV</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="City Car">City Car</option>
                    <option value="Electric Vehicle">Electric Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Harga per Hari (Rp)</label>
                  <input required type="number" value={newCar.price} onChange={e => setNewCar({...newCar, price: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" placeholder="500000" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Kapasitas Penumpang</label>
                  <select required value={newCar.seats} onChange={e => setNewCar({...newCar, seats: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="" disabled>Pilih Kapasitas</option>
                    <option value="4">4 Orang</option>
                    <option value="5">5 Orang</option>
                    <option value="7">7 Orang</option>
                    <option value="8">8 Orang</option>
                    <option value="14">14 Orang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Transmisi</label>
                  <select value={newCar.transmission} onChange={e => setNewCar({...newCar, transmission: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Kapasitas Bagasi (Koper)</label>
                  <select required value={newCar.baggage} onChange={e => setNewCar({...newCar, baggage: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="" disabled>Pilih Kapasitas</option>
                    <option value="1">1 Koper</option>
                    <option value="2">2 Koper</option>
                    <option value="3">3 Koper</option>
                    <option value="4">4 Koper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Jumlah Stok Mobil</label>
                  <input required type="number" min="0" value={newCar.stock} onChange={e => setNewCar({...newCar, stock: parseInt(e.target.value) || 0})} className="w-full border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" placeholder="10" />
                </div>
                <div className="col-span-2">
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Foto Mobil (Pilih File atau Masukkan URL)</label>
                  <div className="flex gap-2">
                    <input type="file" accept="image/*" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setNewCar({...newCar, image: e.target.files[0] as any});
                      }
                    }} className="w-1/2 border border-outline-variant rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-primary" />
                    <input type="url" value={typeof newCar.image === 'string' ? newCar.image : ''} onChange={e => setNewCar({...newCar, image: e.target.value})} className="w-1/2 border border-outline-variant rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-primary" placeholder="Atau paste URL Foto" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-bold mt-4">
                Simpan Mobil Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {isEditCarModalOpen && editingCar && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-primary">Edit Data Mobil</h3>
              <button onClick={() => setIsEditCarModalOpen(false)} className="text-secondary hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditCar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Merk (Brand)</label>
                  <select required value={editingCar.brand} onChange={e => setEditingCar({...editingCar, brand: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Daihatsu">Daihatsu</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="BMW">BMW</option>
                    <option value="Wuling">Wuling</option>
                    <option value="Chery">Chery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Nama Mobil</label>
                  <input required value={editingCar.name} onChange={e => setEditingCar({...editingCar, name: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Tipe (Kategori)</label>
                  <select required value={editingCar.type} onChange={e => setEditingCar({...editingCar, type: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="MPV">MPV</option>
                    <option value="SUV">SUV</option>
                    <option value="Medium SUV">Medium SUV</option>
                    <option value="Big SUV">Big SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="City Car">City Car</option>
                    <option value="Electric Vehicle">Electric Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Harga per Hari (Rp)</label>
                  <input required type="number" value={editingCar.price} onChange={e => setEditingCar({...editingCar, price: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Kapasitas Penumpang</label>
                  <select required value={editingCar.seats} onChange={e => setEditingCar({...editingCar, seats: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="4">4 Orang</option>
                    <option value="5">5 Orang</option>
                    <option value="7">7 Orang</option>
                    <option value="8">8 Orang</option>
                    <option value="14">14 Orang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Transmisi</label>
                  <select value={editingCar.transmission} onChange={e => setEditingCar({...editingCar, transmission: e.target.value})} className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-white outline-none focus:ring-1 focus:ring-primary">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Jumlah Stok Mobil</label>
                  <input required type="number" min="0" value={editingCar.stock} onChange={e => setEditingCar({...editingCar, stock: parseInt(e.target.value) || 0})} className="w-full border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-label-sm font-label-sm text-secondary mb-1">Foto Mobil (Pilih File atau Masukkan URL)</label>
                  <div className="flex gap-2">
                    <input type="file" accept="image/*" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setEditingCar({...editingCar, image: e.target.files[0]});
                      }
                    }} className="w-1/2 border border-outline-variant rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-primary" />
                    <input type="url" value={typeof editingCar.image === 'string' ? editingCar.image : ''} onChange={e => setEditingCar({...editingCar, image: e.target.value})} className="w-1/2 border border-outline-variant rounded-xl px-4 py-2 outline-none focus:ring-1 focus:ring-primary" placeholder="Atau paste URL Foto" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-bold mt-4">
                Update Data Mobil
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] flex items-center justify-center p-gutter">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">Aksi Berhasil</h3>
            <p className="font-body-md text-body-md text-secondary">Data telah berhasil diperbarui.</p>
            <button 
              className="w-full bg-primary text-white py-4 rounded-xl font-bold transition-all hover:bg-primary-container cursor-pointer" 
              onClick={closeModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
