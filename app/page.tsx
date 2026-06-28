import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { fetchCarsFromAPI } from '@/lib/data';
import AnimatedCounter from '@/components/AnimatedCounter';
import HeroSearchBar from '@/components/HeroSearchBar';

export default async function Home() {
  const carsData = await fetchCarsFromAPI();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] lg:h-[90vh] w-full flex flex-col justify-center pt-28 pb-8 lg:pt-0 lg:pb-0">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url("/hero-bg.png")',
              }}
            ></div>
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex-1 flex flex-col justify-center mb-8 lg:mb-0 lg:block lg:flex-none">
            <div className="max-w-3xl lg:-mt-16">
              <h1 className="font-headline-xl text-headline-xl text-white mb-8 drop-shadow-2xl">
                Sewa Mobil Premium Jakarta Aman & Cepat
              </h1>
              <p className="text-white font-body-lg text-body-lg mb-14 max-w-xl opacity-90 leading-relaxed">
                Nikmati pengalaman berkendara kelas dunia dengan armada terbaru kami. Layanan profesional untuk kebutuhan bisnis dan personal Anda di Ibukota.
              </p>
            </div>
          </div>
          
          {/* Horizontal Search Bar (Client Component) */}
          <HeroSearchBar />
        </section>

        {/* Brand Logos Expand Cards */}
        <section className="pt-32 pb-16 bg-white border-b border-outline-variant/30">
          <div className="w-full mx-auto px-4 md:px-8">
            <h2 className="text-center font-headline-sm text-headline-sm text-secondary/60 mb-10 tracking-widest uppercase">Mitra Otomotif Kami</h2>
            <div className="flex w-full h-[200px] md:h-[350px] gap-2 md:gap-4 items-stretch justify-start md:justify-center max-w-[1800px] mx-auto overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { name: 'Toyota', img: '/brands/toyota.png', color: 'hover:bg-red-50 hover:shadow-red-200/50 hover:border-red-200 active:bg-red-50 active:shadow-red-200/50 active:border-red-200' },
                { name: 'Honda', img: '/brands/honda.png', color: 'hover:bg-slate-50 hover:shadow-slate-200/50 hover:border-slate-200 active:bg-slate-50 active:shadow-slate-200/50 active:border-slate-200' },
                { name: 'BMW', img: '/brands/bmw.png', color: 'hover:bg-blue-50 hover:shadow-blue-200/50 hover:border-blue-200 active:bg-blue-50 active:shadow-blue-200/50 active:border-blue-200' },
                { name: 'Mercedes', img: '/brands/mercedes.png', color: 'hover:bg-gray-50 hover:shadow-gray-200/50 hover:border-gray-200 active:bg-gray-50 active:shadow-gray-200/50 active:border-gray-200' },
                { name: 'Mitsubishi', img: '/brands/mitsubishi.png', color: 'hover:bg-red-50 hover:shadow-red-200/50 hover:border-red-200 active:bg-red-50 active:shadow-red-200/50 active:border-red-200' },
                { name: 'Hyundai', img: '/brands/hyundai.png', color: 'hover:bg-blue-50 hover:shadow-blue-200/50 hover:border-blue-200 active:bg-blue-50 active:shadow-blue-200/50 active:border-blue-200' },
                { name: 'Suzuki', img: '/brands/suzuki.png', color: 'hover:bg-blue-50 hover:shadow-blue-200/50 hover:border-blue-200 active:bg-blue-50 active:shadow-blue-200/50 active:border-blue-200' },
                { name: 'Wuling', img: '/brands/wuling.png', color: 'hover:bg-red-50 hover:shadow-red-200/50 hover:border-red-200 active:bg-red-50 active:shadow-red-200/50 active:border-red-200' },
                { name: 'Cherry', img: '/brands/cherry.png', color: 'hover:bg-pink-50 hover:shadow-pink-200/50 hover:border-pink-200 active:bg-pink-50 active:shadow-pink-200/50 active:border-pink-200' },
              ].map((brand, i) => (
                <Link 
                  href={`/katalog?brand=${brand.name}`}
                  key={i} 
                  className={`snap-center shrink-0 min-w-[70px] md:min-w-0 relative group flex-1 hover:flex-[3] active:flex-[3] focus:flex-[3] focus-within:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-surface-container-low overflow-hidden cursor-pointer rounded-2xl md:rounded-[40px] flex items-center justify-center border-2 border-transparent ${brand.color} shadow-sm hover:shadow-2xl active:shadow-2xl`}
                >
                  <img 
                    src={brand.img} 
                    alt={brand.name} 
                    className="w-12 md:w-28 h-12 md:h-28 object-contain z-10 group-hover:scale-125 group-active:scale-125 transition-all duration-700 ease-out grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100" 
                  />
                  
                  {/* Brand name fading in */}
                  <div className="absolute bottom-4 md:bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 group-active:opacity-100 translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 transition-all duration-500 delay-150 z-20">
                    <span className="text-primary font-black tracking-widest uppercase text-[10px] md:text-sm drop-shadow-sm">{brand.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Keunggulan Layanan Kami</h2>
              <div className="w-24 h-1.5 bg-on-tertiary-fixed-variant mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-white p-12 rounded-2xl shadow-xl border-b-8 border-primary hover:-translate-y-3 transition-all duration-300">
                <div className="w-20 h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>directions_car</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">Armada Terawat & Higienis</h3>
                <p className="text-secondary font-body-md text-body-md leading-relaxed">
                  Setiap unit melewati inspeksi 50 titik dan sanitasi rutin untuk menjamin kenyamanan maksimal serta keamanan perjalanan bisnis atau keluarga Anda.
                </p>
              </div>
              <div className="bg-white p-12 rounded-2xl shadow-xl border-b-8 border-primary hover:-translate-y-3 transition-all duration-300">
                <div className="w-20 h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">Proses Cepat & Aman</h3>
                <p className="text-secondary font-body-md text-body-md leading-relaxed">
                  Booking instan via WhatsApp dengan verifikasi data yang aman. Tanpa biaya tersembunyi, semua biaya diinformasikan secara transparan sejak awal.
                </p>
              </div>
              <div className="bg-white p-12 rounded-2xl shadow-xl border-b-8 border-primary hover:-translate-y-3 transition-all duration-300">
                <div className="w-20 h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>support_agent</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">Layanan 24 Jam</h3>
                <p className="text-secondary font-body-md text-body-md leading-relaxed">
                  Tim CS dan bantuan darurat kami siap melayani Anda kapan pun dibutuhkan. Tersedia pilihan supir profesional yang menguasai rute Jakarta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Preview Section */}
        <section className="py-24 bg-white">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Koleksi Armada Unggulan</h2>
                <p className="text-secondary font-body-lg">Pilihan mobil mewah terbaru untuk menunjang performa dan prestise Anda di Jakarta.</p>
              </div>
              <Link href="/katalog" className="text-primary font-label-md text-label-md flex items-center gap-3 group border-2 border-primary/10 px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
                Lihat Semua Armada <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {carsData.slice(0, 3).map((car) => (
                <Link href={`/pembayaran/${car.id}`} key={car.id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.08)] group border border-outline-variant/30 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer block">
                  <div className="h-72 bg-[#F8F9FA] flex items-center justify-center overflow-hidden p-6 relative">
                    <img className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" src={car.imageUrl} alt={car.name} />
                    {(car.stock ?? 0) > 0 ? (
                      <span className="absolute top-4 left-4 bg-[#E8F5E9] text-[#2E7D32] font-label-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-pulse"></span>
                        Tersedia ({car.stock} Unit)
                      </span>
                    ) : (
                      <span className="absolute top-4 left-4 bg-surface-container-highest text-secondary font-label-sm px-3 py-1 rounded-full flex items-center gap-1">
                        Habis Disewa
                      </span>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-headline-md text-headline-md text-primary">{car.name}</h4>
                      <span className="bg-primary text-white font-label-sm text-label-sm px-4 py-1.5 rounded-full">{car.type}</span>
                    </div>
                    <div className="flex gap-6 text-secondary mb-8">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">airline_seat_recline_normal</span>
                        <span className="text-label-md font-semibold">{car.seats} Kursi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">settings_input_component</span>
                        <span className="text-label-md font-semibold">{car.transmission}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant mt-auto">
                      <div>
                        <span className="block text-secondary text-label-sm uppercase tracking-tighter mb-1 font-bold">Harga Sewa</span>
                        <span className="font-headline-md text-headline-md text-primary">Rp {car.price.toLocaleString('id-ID')}<span className="text-body-md font-normal text-secondary">/hari</span></span>
                      </div>
                      {(car.stock ?? 0) > 0 ? (
                        <div className="bg-primary group-hover:bg-primary-container text-white px-6 py-4 rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
                          <span className="material-symbols-outlined text-xl">calendar_month</span> Pesan
                        </div>
                      ) : (
                        <button disabled className="bg-secondary text-white px-6 py-4 rounded-xl cursor-not-allowed flex items-center gap-2 font-bold shadow-lg shadow-secondary/20">
                          Habis
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Statistics Section */}
        <section className="py-24 bg-gradient-to-br from-[#0a2342] via-[#0d315c] to-[#154685] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-white mb-6">Pencapaian Amar Rental</h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedCounter end={10000} suffix="+" title="Pelanggan Puas" icon="groups" duration={2500} />
              <AnimatedCounter end={150} suffix="+" title="Armada Premium" icon="directions_car" duration={2000} />
              <AnimatedCounter end={8} suffix="+" title="Tahun Pengalaman" icon="workspace_premium" duration={1500} />
              <AnimatedCounter end={24} suffix="/7" title="Dukungan CS" icon="support_agent" duration={1000} />
            </div>
          </div>
        </section>

        {/* How to Rent Section */}
        <section className="py-24 bg-white">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-bold text-sm mb-6">
                <span className="material-symbols-outlined text-lg">route</span>
                Mudah & Cepat
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Cara Sewa Mobil</h2>
              <p className="text-secondary font-body-lg max-w-xl mx-auto">Proses pemesanan yang sederhana dan transparan, hanya dalam beberapa langkah.</p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
                {[
                  {
                    step: '01',
                    icon: 'search',
                    title: 'Pilih Mobil',
                    desc: 'Jelajahi koleksi armada premium kami dan pilih yang paling sesuai dengan kebutuhan Anda.',
                    color: 'bg-blue-50 text-blue-600',
                    border: 'border-blue-100',
                  },
                  {
                    step: '02',
                    icon: 'edit_note',
                    title: 'Isi Data',
                    desc: 'Lengkapi informasi pemesan, tanggal sewa, dan lokasi penjemputan dengan mudah.',
                    color: 'bg-purple-50 text-purple-600',
                    border: 'border-purple-100',
                  },
                  {
                    step: '03',
                    icon: 'whatsapp',
                    title: 'Konfirmasi via WA',
                    desc: 'Tim kami akan menghubungi Anda via WhatsApp untuk verifikasi dan instruksi pembayaran.',
                    color: 'bg-green-50 text-green-600',
                    border: 'border-green-100',
                  },
                  {
                    step: '04',
                    icon: 'emoji_transportation',
                    title: 'Nikmati Perjalanan',
                    desc: 'Mobil siap diantarkan ke lokasi Anda. Selamat menikmati perjalanan yang nyaman!',
                    color: 'bg-orange-50 text-orange-600',
                    border: 'border-orange-100',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    {/* Circle */}
                    <div className={`relative w-28 h-28 rounded-full ${item.color} border-2 ${item.border} flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>{item.icon}</span>
                      {/* Step badge */}
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-3">{item.title}</h3>
                    <p className="text-secondary font-body-md leading-relaxed max-w-[220px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-4xl mx-auto px-margin-mobile relative z-10">
            <h2 className="font-headline-lg text-headline-lg mb-8">Siap Menjelajahi Jakarta dengan Gaya?</h2>
            <p className="text-white/80 mb-14 font-body-lg text-body-lg max-w-2xl mx-auto leading-relaxed">
              Dapatkan penawaran khusus untuk pemesanan pertama Anda. Layanan 24/7 kami siap memastikan mobilitas Anda tetap lancar dan prestisius.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a href="https://wa.me/6287868036735?text=Halo%20Amar%20Rental%2C%20saya%20tertarik%20untuk%20pesan%20sekarang." target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-14 py-5 rounded-2xl font-extrabold text-xl hover:brightness-110 transition-all shadow-[0px_10px_30px_rgba(37,211,102,0.4)] flex items-center gap-3 floating-whatsapp">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg> Pesan via WhatsApp
              </a>
              <button className="border-2 border-white/40 px-14 py-5 rounded-2xl font-extrabold text-xl hover:bg-white/10 transition-all">
                Lihat Brosur Harga
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
