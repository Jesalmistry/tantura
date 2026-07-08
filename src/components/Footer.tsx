"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck,
  Truck,
  Sparkles,
  Scissors
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-black text-white pt-16 pb-12 border-t border-white/5 font-sans select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-wider uppercase">
            <img src="/logo.jpg" alt="Tantura Logo" className="w-8 h-8 rounded-full object-cover border border-gold/30" />
            <span>Tantura</span>
          </Link>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Tantura is a premium co-creation apparel design house. We build heavy oversized garments and bespoke streetwear silhouettes customized and structured specifically to your placements.
          </p>
        </div>

        {/* Column 2: Navigation Menu */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold font-mono">Navigation</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light">
            <li>
              <Link href="/" className="hover:text-gold transition-colors duration-150">
                Customizer Studio
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold transition-colors duration-150">
                About Us (Founders)
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Coordinates */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold font-mono">Contacts</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light font-mono">
            <li>
              <span className="text-foreground/50 block text-[9px] uppercase tracking-wider">Email</span>
              <a href="mailto:tantura1215@gmail.com" className="hover:text-gold transition-colors text-[11px]">
                tantura1215@gmail.com
              </a>
            </li>
            <li>
              <span className="text-foreground/50 block text-[9px] uppercase tracking-wider">Phone</span>
              <a href="tel:9265380619" className="hover:text-gold transition-colors text-[11px]">
                +91 92653 80619
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Tailoring details */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold font-mono">Tailoring</h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light">
            <li className="flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>Heavy French Terry & Combed Cottons</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>1-on-1 Designer Proof Verification</span>
            </li>
            <li className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>Courier Air Shipment Delivery</span>
            </li>
          </ul>
        </div>

      </div>

      <hr className="divider-sew max-w-7xl mx-auto my-10" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 gap-4">
        <p className="font-light">
          © {new Date().getFullYear()} Tantura Design House. All rights reserved. Custom Customizer Platform.
        </p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> SSL Secured & Encrypted</span>
          <span className="hover:text-white transition-colors duration-150 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors duration-150 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};
