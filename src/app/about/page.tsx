"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Sparkles, Scissors, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function AboutPage() {
  const founders = [
    {
      name: "Archi Gandhi",
      role: "Founder & Fashion Designer",
      bio: "Archi guides the creative vision and custom collections at Tantura. She focuses on tailoring patterns, raw materials, and custom streetwear aesthetics.",
      initials: "AG",
      image: "/archi.jpg"
    },
    {
      name: "Jesal Mistry",
      role: "Founder & B.Tech CSE Engineer",
      bio: "Jesal leads the digital architecture and customizer engines at Tantura. He focuses on software logic, layout constraints, and logistics automation.",
      initials: "JM",
      image: "/jesal.jpg"
    }
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow select-none bg-background pb-20 relative">
        {/* Glow backdrop */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Hero title */}
        <section className="pt-20 pb-16 text-center max-w-3xl mx-auto px-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-gold/30 text-gold text-[10px] uppercase tracking-widest font-mono font-bold"
          >
            <Sparkles className="w-3 h-3 text-gold" /> The Tantura Heritage
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-light uppercase tracking-tight text-foreground"
          >
            About <span className="text-gold font-semibold text-gold-shine">The Studio</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xs sm:text-sm text-foreground/75 max-w-xl mx-auto leading-relaxed font-light"
          >
            Born from a desire to merge luxury fabrics with bespoke digital placement tools, Tantura has redesigned the custom clothing pipeline.
          </motion.p>
        </section>

        {/* Narrative & Story Section */}
        <section className="max-w-5xl mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-light uppercase tracking-wider text-foreground">
              Our Tailoring Mandate
            </h2>
            <p className="text-xs text-foreground/70 leading-relaxed font-light">
              We believe that streetwear is personal. Why wear an off-the-shelf garment when you can design your own? Our flatlay canvas editor represents raw tailoring blueprints, feeding high-fidelity placements directly into our laser cutters and sewing stations.
            </p>
            <p className="text-xs text-foreground/70 leading-relaxed font-light">
              Whether it is our signature 450GSM loopback cotton hoodie, or our boxy combed cotton tees, we select the premium fibers, weave them in certified mills, and customize them precisely to your branding specifications.
            </p>
            
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold hover:bg-gold-hover text-luxury-black font-bold text-xs uppercase tracking-widest rounded-full transition-all"
              >
                Launch Customizer Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-card-border shadow-2xl glass p-8 flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 text-gold/20">
              <Scissors className="w-24 h-24 stroke-[0.5]" />
            </div>
            
            <div className="space-y-4">
              <div className="h-2 w-12 bg-gold rounded-full" />
              <h3 className="text-lg font-semibold uppercase tracking-wider text-foreground">Bespoke Excellence</h3>
              <p className="text-xs text-foreground/60 leading-relaxed font-light">
                Every customized garment undergoes manual designer verification. If vector assets look pixelated or text overlays cross sewing seams, your personal designer coordinates adjustments before production releases.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-dashed border-gold/20 pt-4 text-[10px] uppercase font-mono text-foreground/50">
              <div>
                <span className="text-gold font-bold">100% Cotton</span>
                <span className="block font-light text-[8px]">Certified Sourcing</span>
              </div>
              <div>
                <span className="text-gold font-bold">Designer Vetted</span>
                <span className="block font-light text-[8px]">Quality Control</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Founders Profiles */}
        <section className="max-w-5xl mx-auto px-6 border-t border-dashed border-gold/25 pt-16">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold">The Visionaries</span>
            <h2 className="text-2xl font-light uppercase tracking-widest text-foreground">Founders Grid</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {founders.map((founder, idx) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 45, damping: 14, delay: idx * 0.2 }}
                whileHover={{ y: -8 }}
                className="glass rounded-[32px] border border-card-border p-5 sm:p-6 flex flex-col h-full hover:border-gold/35 hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)] transition-all duration-500 group"
              >
                {/* Large Portrait Image Wrapper */}
                <div className="relative overflow-hidden aspect-[4/5] rounded-[24px] w-full mb-6 border border-card-border/50">
                  {founder.image ? (
                    <motion.img
                      src={founder.image}
                      alt={founder.name}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gold-light/10 flex items-center justify-center text-4xl font-light tracking-wider font-mono text-gold">
                      {founder.initials}
                    </div>
                  )}
                  {/* Subtle luxury brand watermark overlay */}
                  <div className="absolute bottom-4 left-4 bg-luxury-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[8px] text-gold uppercase tracking-widest font-mono font-bold pointer-events-none">
                    Tantura co-founder
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-base font-bold text-foreground uppercase tracking-wider group-hover:text-gold transition-colors duration-300">
                        {founder.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest font-mono font-bold text-gold mt-0.5">
                        {founder.role}
                      </p>
                    </div>
                    <p className="text-xs text-foreground/75 leading-relaxed font-light">
                      {founder.bio}
                    </p>
                  </div>
                  
                  <div className="flex pt-2">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 border border-card-border hover:border-gold/30 rounded-full text-[9px] uppercase tracking-widest font-bold text-foreground flex items-center gap-1.5 cursor-pointer bg-card-bg/10 hover:bg-gold-light/5 transition-all duration-300"
                    >
                      <Mail className="w-3 h-3 text-gold" /> Contact {founder.name.split(" ")[0]}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
