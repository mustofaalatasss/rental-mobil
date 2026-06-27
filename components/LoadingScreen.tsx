"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Mulai animasi fade-out di detik ke 2.5 (1.5 detik sebelum dihapus)
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2500);

    // Hapus total dari DOM di detik ke 4.0 (saat opasitas sudah 0)
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-all duration-[1500ms] ease-in-out ${
        fade ? "opacity-0 invisible scale-105 pointer-events-none" : "opacity-100 visible scale-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/loading-screen-rental.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
