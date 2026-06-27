"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Car, fetchCarsFromAPI } from '@/lib/data';

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-surface-variant overflow-hidden animate-pulse flex flex-col">
      <div className="h-56 bg-surface-container-high" />
      <div className="p-6 flex flex-col gap-4">
        <div className="h-6 bg-surface-container-high rounded-lg w-3/4" />
        <div className="flex gap-4">
          <div className="h-4 bg-surface-container-high rounded w-20" />
          <div className="h-4 bg-surface-container-high rounded w-20" />
        </div>
        <div className="h-px bg-surface-container-high mt-2" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-surface-container-high rounded w-32" />
        </div>
        <div className="h-11 bg-surface-container-high rounded-lg mt-2" />
      </div>
    </div>
  );
}

// ─── Filter Panel (reused in both sidebar & drawer) ───────────────────────────
interface FilterPanelProps {
  selectedTypes: string[];
  selectedBrands: string[];
  selectedTransmission: string;
  maxPrice: number;
  toggleType: (t: string) => void;
  toggleBrand: (b: string) => void;
  setSelectedTransmission: (v: string) => void;
  setMaxPrice: (v: number) => void;
  handleReset: () => void;
  onClose?: () => void;
}

function FilterPanel({
  selectedTypes, selectedBrands, selectedTransmission, maxPrice,
  toggleType, toggleBrand, setSelectedTransmission, setMaxPrice,
  handleReset, onClose
}: FilterPanelProps) {
  const types = ['Sedan', 'SUV', 'MPV'];
  const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Mitsubishi', 'Hyundai', 'Suzuki', 'Wuling'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">tune</span>Filter
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-secondary hover:text-primary p-1" aria-label="Tutup filter">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Tipe Mobil */}
      <div className="space-y-3">
        <p className="font-label-md text-primary uppercase tracking-wider">Tipe Mobil</p>
        <div className="flex flex-col gap-3">
          {types.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className={`font-body-md transition-colors ${selectedTypes.includes(type) ? 'text-primary font-semibold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-3">
        <p className="font-label-md text-primary uppercase tracking-wider">Merek</p>
        <div className="flex flex-wrap gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedBrands.includes(brand)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-secondary border-outline-variant hover:border-primary hover:text-primary'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Transmisi */}
      <div className="space-y-3">
        <p className="font-label-md text-primary uppercase tracking-wider">Transmisi</p>
        <div className="flex flex-col gap-3">
          {['manual', 'matic'].map(t => (
            <label key={t} className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={selectedTransmission === t}
                onChange={() => setSelectedTransmission(selectedTransmission === t ? '' : t)}
                className="w-5 h-5 border-outline-variant text-primary focus:ring-primary accent-primary"
                type="checkbox"
              />
              <span className={`font-body-md ${selectedTransmission === t ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <p className="font-label-md text-primary uppercase tracking-wider">Harga Maksimal</p>
        <div className="space-y-2">
          <input
            className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
            max="20000000"
            min="300000"
            step="500000"
            type="range"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <div className="flex justify-between font-label-sm text-secondary">
            <span>Rp 300rb</span>
            <span className="font-bold text-primary">Rp {(maxPrice / 1000000).toFixed(1)}jt</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => { handleReset(); onClose?.(); }}
        className="w-full py-4 border border-outline text-primary font-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
      >
        Reset Filter
      </button>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-4 bg-primary text-white font-label-md rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
        >
          Tampilkan Hasil
        </button>
      )}
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function KatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedTransmission, setSelectedTransmission] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(20000000);
  const [sortOption, setSortOption] = useState<string>('Terpopuler');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchCarsFromAPI().then(data => {
      setCars(data);
      setLoading(false);
    });
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isFilterDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFilterDrawerOpen]);

  const toggleType = (type: string) => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  const toggleBrand = (brand: string) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedTransmission('');
    setMaxPrice(20000000);
    setSortOption('Terpopuler');
    setSearchQuery('');
  };

  const activeFilterCount = selectedTypes.length + selectedBrands.length + (selectedTransmission ? 1 : 0) + (maxPrice < 20000000 ? 1 : 0);

  const filteredCars = cars.filter(car => {
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(car.type);
    const matchBrand = selectedBrands.length === 0 || (car.brand && selectedBrands.some(b => car.brand!.toLowerCase() === b.toLowerCase()));
    const matchTransmission = selectedTransmission === '' || car.transmission.toLowerCase().includes(selectedTransmission.toLowerCase());
    const matchPrice = car.price <= maxPrice;
    const matchSearch = searchQuery === '' || car.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchBrand && matchTransmission && matchPrice && matchSearch;
  }).sort((a, b) => {
    if (sortOption === 'Harga Terendah') return a.price - b.price;
    if (sortOption === 'Harga Tertinggi') return b.price - a.price;
    return 0;
  });

  const filterProps = {
    selectedTypes, selectedBrands, selectedTransmission, maxPrice,
    toggleType, toggleBrand, setSelectedTransmission, setMaxPrice, handleReset,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[200] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto w-[85vw] max-w-sm h-full bg-white shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-right-full duration-300">
            <FilterPanel {...filterProps} onClose={() => setIsFilterDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-gutter flex-1 w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-full md:w-[280px] shrink-0">
          <div className="sticky top-32 space-y-8 bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-surface-variant">
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 space-y-8 w-full min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-outline-variant pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Mobil Tersedia di Jakarta</h1>
                <p className="font-body-md text-secondary">
                  Menampilkan <span className="font-bold text-primary">{loading ? '...' : filteredCars.length}</span> armada premium pilihan.
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-4">
                <span className="font-label-sm text-secondary">Urutkan:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent border-none font-label-md text-primary focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="Terpopuler">Terpopuler</option>
                  <option value="Harga Terendah">Harga Terendah</option>
                  <option value="Harga Tertinggi">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Search + Mobile Filter Button */}
            <div className="flex gap-3">
              {/* Search bar */}
              <div className="flex-1 flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <span className="material-symbols-outlined text-secondary text-xl">search</span>
                <input
                  type="text"
                  placeholder="Cari nama mobil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none border-none focus:ring-0 flex-1 font-body-md text-on-surface placeholder:text-secondary/60"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-secondary hover:text-primary">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                className="md:hidden relative flex items-center gap-2 bg-white border border-outline-variant rounded-xl px-4 py-3 font-label-md text-primary hover:bg-surface-container-low transition-colors"
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                <span className="material-symbols-outlined text-xl">tune</span>
                Filter
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <Link
                  href={`/pembayaran/${car.id}`}
                  key={car.id}
                  className="group bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-surface-variant overflow-hidden hover:shadow-[0px_12px_32px_rgba(0,45,98,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer block"
                >
                  <div className="relative h-56 bg-[#F2F2F2] flex items-center justify-center p-6 overflow-hidden">
                    <img
                      className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                      src={car.imageUrl}
                      alt={car.name}
                    />
                    {(car.stock ?? 0) > 0 ? (
                      <span className="absolute top-4 left-4 bg-[#E8F5E9] text-[#2E7D32] font-label-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-pulse" />
                        Tersedia (Sisa: {car.stock ?? 0})
                      </span>
                    ) : (
                      <span className="absolute top-4 left-4 bg-surface-container-highest text-secondary font-label-sm px-3 py-1 rounded-full">
                        Stok Habis
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-headline-md text-headline-md text-primary mb-4">{car.name}</h4>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                        <span className="font-label-sm">{car.seats} Kursi</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-[20px]">settings_input_component</span>
                        <span className="font-label-sm">{car.transmission}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-outline-variant mt-auto">
                      <div className={(car.stock ?? 0) <= 0 ? "opacity-60" : ""}>
                        <p className="text-secondary font-label-sm">Mulai dari</p>
                        <p className="text-primary font-headline-md font-bold">
                          Rp {car.price.toLocaleString('id-ID')} <span className="text-secondary font-body-md font-normal">/ hari</span>
                        </p>
                      </div>
                    </div>
                    {(car.stock ?? 0) > 0 ? (
                      <div className="w-full mt-6 bg-[#D32F2F] group-hover:bg-[#B71C1C] text-white py-3.5 rounded-lg font-label-md font-bold uppercase tracking-widest transition-colors shadow-lg active:scale-[0.98] text-center block">
                        Pesan Sekarang
                      </div>
                    ) : (
                      <button className="w-full mt-6 bg-secondary text-white py-3.5 rounded-lg font-label-md font-bold uppercase tracking-widest cursor-not-allowed" disabled>
                        Stok Habis
                      </button>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
                <h3 className="font-headline-md text-primary mb-2">Mobil tidak ditemukan</h3>
                <p className="text-secondary">Maaf, tidak ada armada yang sesuai dengan filter yang Anda terapkan.</p>
                <button onClick={handleReset} className="mt-6 text-primary font-bold hover:underline">
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function Katalog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <KatalogContent />
    </Suspense>
  );
}
