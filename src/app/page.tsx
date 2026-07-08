"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LiveCanvasEditor } from "@/components/LiveCanvasEditor";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Scissors, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Check if the preloader has already played in this browser session
    const hasPlayed = sessionStorage.getItem("tantura_intro_played");
    if (hasPlayed) {
      setShowIntro(false);
    } else {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 4) + 1;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          setTimeout(() => {
            setShowIntro(false);
            sessionStorage.setItem("tantura_intro_played", "true");
          }, 600); // Hold at 100% briefly
        }
        setCount(current);
      }, 65); // Ticks up to 100 over ~2.5 seconds
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      {/* Cinematic Animated Splash Preloader */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              y: "-100%", 
              opacity: 0,
              transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 h-[100dvh] w-screen bg-[#0A0A0A] z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
          >
            {/* Fine Drafting Grid backdrop shifting and fading */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 0.15 }}
              transition={{ duration: 3.5, ease: "easeOut" }}
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)`,
                backgroundSize: "30px 30px"
              }}
            />

            {/* Glowing gold backlight */}
            <div className="absolute w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="flex flex-col items-center max-w-md px-6 text-center space-y-6 sm:space-y-10 relative z-10">
              
              {/* Spinning tailored drafting stitches circular overlay */}
              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute w-[130px] h-[130px] sm:w-[170px] sm:h-[170px] rounded-full border border-dashed border-gold/25"
                />
                
                {/* Logo Frame: Luxury Gold Squircle Badge */}
                <motion.div
                  initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 40, damping: 12, delay: 0.2 }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-[22px] sm:rounded-[28px] border border-gold p-1 bg-luxury-black overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.18)] flex items-center justify-center relative group"
                >
                  <img
                    src="/logo.jpg"
                    alt="Tantura Premium Logo"
                    className="w-full h-full object-cover rounded-[16px] sm:rounded-[22px]"
                  />
                  {/* Subtle inner gold frame highlight */}
                  <div className="absolute inset-2 border border-gold/10 rounded-[14px] sm:rounded-[20px] pointer-events-none" />
                </motion.div>
              </div>

              {/* Title and details */}
              <div className="space-y-3.5">
                <motion.h2
                  initial={{ letterSpacing: "0.8em", opacity: 0 }}
                  animate={{ letterSpacing: "0.22em", opacity: 1 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-4xl font-serif font-light text-gold-shine tracking-[0.22em] uppercase"
                >
                  TANTURA
                </motion.h2>

                {/* Animated sewing stitch separator */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100px", opacity: 0.35 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-[1px] bg-gold/50 mx-auto"
                  style={{
                    backgroundImage: "linear-gradient(to right, #D4AF37 60%, transparent 40%)",
                    backgroundSize: "7px 1px",
                    backgroundRepeat: "repeat-x"
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/90 font-bold"
                >
                  Woven with Identity, Designed for You
                </motion.p>
              </div>

              {/* Monospace percentage counter */}
              <div className="flex flex-col items-center space-y-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg font-mono font-bold text-gold tracking-widest"
                >
                  {String(count).padStart(2, "0")}%
                </motion.span>
                <span className="text-[7px] font-mono text-foreground/45 uppercase tracking-widest">
                  Loading coordinates
                </span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      
      <main className="flex-grow overflow-x-hidden select-none pb-12 bg-background">
        {/* Cinematic Background Lights */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/5 blur-[130px] rounded-full pointer-events-none z-0" />
        
        {/* Premium Mini-Hero Intro */}
        <section className="relative pt-16 pb-12 text-center px-6 max-w-4xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-gold/35 text-gold text-[10px] uppercase tracking-widest font-semibold font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" /> High-End Streetwear Studio
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-light tracking-tight text-foreground uppercase mt-6 leading-none"
          >
            Bespoke <span className="text-gold font-semibold text-gold-shine">Co-Creation</span> Suite
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm text-foreground/70 font-light max-w-xl mx-auto leading-relaxed mt-4"
          >
            Design and configure heavyweight box tees, oversized streetwear fits, and loopback cotton hoodies. Upload your designs, adjust lettering coordinates, and submit specifications directly to our tailoring lab.
          </motion.p>
        </section>

        {/* Live Canvas Customizer Section */}
        <section className="max-w-7xl mx-auto px-6 mb-16 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <LiveCanvasEditor />
          </motion.div>
        </section>

        {/* Studio Craftsmanship Pillars */}
        <section className="py-12 border-t border-dashed border-gold/25 max-w-7xl mx-auto px-6 z-10 relative">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[9px] text-gold uppercase tracking-widest font-bold font-mono">Bespoke Protocol</span>
            <h2 className="text-xl sm:text-2xl font-light uppercase tracking-widest text-foreground">Manufacture Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Scissors className="w-5 h-5 text-gold" />,
                title: "Premium Heavyweight Blanks",
                desc: "We exclusively craft on 450GSM loopback cotton hoodies and double-combed long-staple cotton luxury tees designed for structured streetwear drapes."
              },
              {
                icon: <Cpu className="w-5 h-5 text-gold" />,
                title: "Digital proof allocation",
                desc: "Every custom request generates high-fidelity production vectors. A professional apparel designer verifies files and placement coordinates before fabric cutting."
              },
              {
                icon: <Truck className="w-5 h-5 text-gold" />,
                title: "Doorstep Courier Delivery",
                desc: "Direct shipping tracking codes provided instantly. Production and fulfillment status are sent transparently to your registered email address."
              }
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-5 rounded-2xl border border-card-border"
              >
                <div className="p-2.5 bg-gold-light/10 border border-gold/15 rounded-xl w-fit mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[11px] text-foreground/70 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
