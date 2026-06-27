"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navLinkClass = (href: string) =>
    `relative font-semibold transition-colors duration-200 ${
      isActive(href)
        ? 'text-primary after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
        : 'text-secondary hover:text-primary'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-outline-variant/20'
          : 'bg-surface border-b border-outline-variant shadow-md'
      }`}
    >
      <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto h-20">
        <Link href="/" className="flex items-center gap-4">
          <img
            alt="Amar Rental Mobil Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-hzgz3oyJfYx8BUtzL1vVR0_2C4C4dsY4UO2veHnQEGUPJnkH0zOWzFjCM0tF6xuHSCxxf45DRcrHyEuxrczMzMNyMZEyiJVlI9CjUP3Gh6pavyDl0g9V7BW1gH2xjuCsoP8Vxzm0DVk8HLohf6PH3qUtj-nf_woixKKZSpm4u_436cSn36ayY45MyKKn5KPUKOphOIHIwd5J51WvBoyIhRAh5STZHdp_Sfa2z_o8YjVWCC-KruY4hbBzGSyKyo2HByLyZ0G6tppa"
          />
          <span className="font-headline-md text-headline-md font-extrabold text-primary">
            Amar Rental
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <Link href="/katalog" className={navLinkClass('/katalog')}>
              Katalog Mobil
            </Link>
          </li>
          <li>
            <Link href="/promo" className={navLinkClass('/promo')}>
              Promo
            </Link>
          </li>
          <li>
            <a
              href="https://wa.me/6287868036735?text=Halo%20Amar%20Rental%2C%20saya%20ingin%20bertanya%20seputar%20sewa%20mobil."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-label-md text-label-md px-6 py-2.5 rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined font-bold text-[20px]">chat</span>
              Chat WhatsApp
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary p-2 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-b border-outline-variant py-4 px-margin-mobile flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link
            href="/katalog"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 border-b border-outline-variant/30 flex items-center gap-3 font-semibold ${isActive('/katalog') ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">directions_car</span>
            Katalog Mobil
            {isActive('/katalog') && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
          </Link>
          <Link
            href="/promo"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 border-b border-outline-variant/30 flex items-center gap-3 font-semibold ${isActive('/promo') ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">local_activity</span>
            Promo Khusus
            {isActive('/promo') && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
          </Link>
          <a
            href="https://wa.me/6287868036735"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-[#25D366] text-white font-bold py-3 mt-2 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined font-bold">chat</span>
            Hubungi via WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
