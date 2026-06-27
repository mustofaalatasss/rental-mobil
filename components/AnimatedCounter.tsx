"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
  title: string;
  icon: string;
}

export default function AnimatedCounter({ end, suffix = "", duration = 2000, title, icon }: Props) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    // 60fps = ~16ms per frame
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 group">
      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
      </div>
      <div className="font-headline-xl text-5xl md:text-6xl text-white font-black drop-shadow-md mb-2 flex items-baseline">
        {count.toLocaleString('id-ID')}
        <span className="text-3xl text-primary-container ml-1">{suffix}</span>
      </div>
      <div className="text-white/80 font-label-lg uppercase tracking-widest text-center mt-2">{title}</div>
    </div>
  );
}
