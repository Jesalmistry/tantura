"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Type, 
  Move, 
  Info, 
  Check, 
  Trash2, 
  RotateCw, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  RefreshCw, 
  FileText, 
  MapPin, 
  Mail, 
  User, 
  Phone,
  HelpCircle,
  X,
  FileDown
} from "lucide-react";
import confetti from "canvas-confetti";
import { GarmentSVG } from "./GarmentSVG";

const COLOR_SWATCHES = [
  { name: "Obsidian Black", hex: "#111111" },
  { name: "Ivory White", hex: "#FFFFFF" },
  { name: "Forest Emerald", hex: "#3A4F41" },
  { name: "Charcoal Slate", hex: "#4A4A4A" }
];

const FONTS = [
  { name: "Luxury Serif", val: "Georgia, serif" },
  { name: "Helvetica Sans", val: "var(--font-geist-sans), sans-serif" },
  { name: "Signature Script", val: "'Brush Script MT', cursive" },
  { name: "Modernist Mono", val: "var(--font-geist-mono), monospace" },
  { name: "Street Impact", val: "Impact, sans-serif" },
  { name: "Chancery Cursive", val: "'Apple Chancery', cursive" },
  { name: "Geometric Black", val: "'Arial Black', sans-serif" },
  { name: "Futuristic Tech", val: "'Segoe UI', Roboto, sans-serif" },
  { name: "Antique Roman", val: "'Times New Roman', Times, serif" },
  { name: "Classic Groovy", val: "'Trebuchet MS', sans-serif" },
  { name: "Gothic Metal", val: "fantasy" },
  { name: "Console Code", val: "Courier, monospace" }
];

const TEXT_COLORS = [
  { name: "Liquid Gold", hex: "#D4AF37" },
  { name: "Pure Silver", hex: "#E5E4E2" },
  { name: "Studio Chalk", hex: "#FFFFFF" },
  { name: "Obsidian", hex: "#111111" },
  { name: "Crimson Silk", hex: "#8B0000" }
];

const FINISH_METHODS = [
  { id: "screen", name: "Vintage Screen Print", surcharge: 0, desc: "Classic soft-hand discharge ink flat finish" },
  { id: "puff", name: "3D High-Density Puff Print", surcharge: 400, desc: "Raised tactile ink for premium streetwear depth" },
  { id: "embroidered", name: "Tailored Satin Embroidery", surcharge: 600, desc: "High-density satin stitching with metallic threads" },
  { id: "dtg", name: "High-Res Direct Graphic (DTG)", surcharge: 150, desc: "Full-color photo-realistic ink fusion" }
];

interface LiveCanvasEditorProps {
  onSubmit?: (config: any) => void;
}

export const LiveCanvasEditor: React.FC<LiveCanvasEditorProps> = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState<"garment" | "graphics" | "text" | "finish" | "checkout">("garment");
  const [garmentType, setGarmentType] = useState<"T-Shirt" | "Hoodie" | "Oversized T-Shirt">("Hoodie");
  const [garmentColor, setGarmentColor] = useState("#111111");
  const [activeView, setActiveView] = useState<"front" | "back">("front");

  // Custom UI Modals
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Multi-side asset placement state
  const [frontLogo, setFrontLogo] = useState<string | null>(null);
  const [frontLogoScale, setFrontLogoScale] = useState(120);
  const [frontLogoRotation, setFrontLogoRotation] = useState(0);
  const [frontLogoPos, setFrontLogoPos] = useState({ x: 0, y: -20 });

  const [backLogo, setBackLogo] = useState<string | null>(null);
  const [backLogoScale, setBackLogoScale] = useState(140);
  const [backLogoRotation, setBackLogoRotation] = useState(0);
  const [backLogoPos, setBackLogoPos] = useState({ x: 0, y: -10 });

  // Custom text per side
  const [frontText, setFrontText] = useState("");
  const [frontTextFont, setFrontTextFont] = useState("Georgia, serif");
  const [frontTextColor, setFrontTextColor] = useState("#D4AF37");
  const [frontTextSize, setFrontTextSize] = useState(24);
  const [frontTextRotation, setFrontTextRotation] = useState(0);
  const [frontTextPos, setFrontTextPos] = useState({ x: 0, y: 50 });

  const [backText, setBackText] = useState("");
  const [backTextFont, setBackTextFont] = useState("Georgia, serif");
  const [backTextColor, setBackTextColor] = useState("#D4AF37");
  const [backTextSize, setBackTextSize] = useState(24);
  const [backTextRotation, setBackTextRotation] = useState(0);
  const [backTextPos, setBackTextPos] = useState({ x: 0, y: 60 });

  // Selected element for detailed placement adjustments
  const [selectedElement, setSelectedElement] = useState<"logo" | "text" | null>(null);

  // Finishing method
  const [finishMethod, setFinishMethod] = useState("screen");

  // Quantity per sizes
  const [quantities, setQuantities] = useState({ S: 0, M: 1, L: 0, XL: 0, XXL: 0 });

  // Notes
  const [notes, setNotes] = useState("");

  // Checkout Wizard state
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Custom Silhouette Request Form State
  const [customRequest, setCustomRequest] = useState({
    garmentCategory: "Designer Dress",
    fabricMaterial: "Mulberry Silk",
    brief: "",
    name: "",
    email: "",
    phone: ""
  });
  const [isCustomSubmitted, setIsCustomSubmitted] = useState(false);
  const [customTicketId, setCustomTicketId] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic pricing
  const getPrices = () => {
    let basePrice = 2900;
    if (garmentType === "Hoodie") basePrice = 5400;
    if (garmentType === "Oversized T-Shirt") basePrice = 3500;

    const method = FINISH_METHODS.find(m => m.id === finishMethod);
    const finishSurcharge = method ? method.surcharge : 0;

    // Graphic surcharge (if both sides or premium graphics added)
    let graphicSurcharge = 0;
    if (frontLogo) graphicSurcharge += 400;
    if (backLogo) graphicSurcharge += 400;
    if (frontText) graphicSurcharge += 150;
    if (backText) graphicSurcharge += 150;

    const pricePerUnit = basePrice + finishSurcharge + graphicSurcharge;
    const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);

    return {
      base: basePrice,
      finish: finishSurcharge,
      graphics: graphicSurcharge,
      unit: pricePerUnit,
      qty: totalQty,
      total: pricePerUnit * totalQty
    };
  };

  const prices = getPrices();

  // Reset helper
  const handleReset = () => {
    if (confirm("Reset current design canvas? All placements will be cleared.")) {
      setFrontLogo(null);
      setBackLogo(null);
      setFrontText("");
      setBackText("");
      setFrontLogoPos({ x: 0, y: -20 });
      setBackLogoPos({ x: 0, y: -10 });
      setFrontTextPos({ x: 0, y: 50 });
      setBackTextPos({ x: 0, y: 60 });
      setSelectedElement(null);
    }
  };

  // Upload handlers
  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (activeView === "front") {
        setFrontLogo(url);
        setSelectedElement("logo");
      } else {
        setBackLogo(url);
        setSelectedElement("logo");
      }
    }
  };

  // Align elements center
  const centerElement = (type: "logo" | "text") => {
    if (activeView === "front") {
      if (type === "logo") setFrontLogoPos({ x: 0, y: -20 });
      if (type === "text") setFrontTextPos({ x: 0, y: 50 });
    } else {
      if (type === "logo") setBackLogoPos({ x: 0, y: -10 });
      if (type === "text") setBackTextPos({ x: 0, y: 60 });
    }
  };

  // Submit Order request
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.address) {
      alert("Please complete the required shipping details.");
      return;
    }
    if (prices.qty === 0) {
      alert("Please select at least 1 unit in the size breakdown.");
      return;
    }

    setIsSubmitting(true);

    // Simulate backend submission delay
    setTimeout(() => {
      const generatedId = "TANTURA-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setIsSubmitting(false);
      setIsOrdered(true);

      // Trigger Confetti
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#111111", "#FFFFFF"]
      });

      if (onSubmit) {
        onSubmit({
          orderId: generatedId,
          garmentType,
          garmentColor,
          finishMethod,
          price: prices.total,
          quantities,
          shipping: shippingDetails,
          notes
        });
      }
    }, 2000);
  };

  // Submit Custom Silhouette Request
  const handleCustomSilhouetteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest.brief || !customRequest.name || !customRequest.email) {
      alert("Please complete all required fields.");
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = "DS-" + Math.floor(100000 + Math.random() * 900000);
      setCustomTicketId(generatedId);
      setIsSubmitting(false);
      setIsCustomSubmitted(true);

      confetti({
        particleCount: 100,
        spread: 60,
        colors: ["#D4AF37", "#3A4F41", "#FFFFFF"]
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch select-none relative">
      
      {/* LEFT: Premium 2D Live Visualizer Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full glass rounded-3xl p-4 sm:p-6 relative flex flex-col items-center border border-card-border overflow-hidden h-full min-h-[440px] sm:min-h-[500px] justify-between">
          
          {/* Canvas Header Controls */}
          <div className="w-full flex justify-between items-center mb-4 z-10">
            <button
              onClick={() => setIsGuidelinesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-card-border hover:border-gold/40 hover:text-gold transition-all text-[9px] uppercase tracking-widest font-mono font-bold cursor-pointer bg-card-bg/20"
            >
              <HelpCircle className="w-3.5 h-3.5 text-gold" /> Guidelines
            </button>
            
            {/* Front / Back Toggle */}
            <div className="flex bg-card-bg rounded-full border border-card-border p-1">
              <button
                onClick={() => { setActiveView("front"); setSelectedElement(null); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeView === "front" 
                    ? "bg-gold text-luxury-black shadow-md" 
                    : "text-foreground hover:text-gold"
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => { setActiveView("back"); setSelectedElement(null); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeView === "back" 
                    ? "bg-gold text-luxury-black shadow-md" 
                    : "text-foreground hover:text-gold"
                }`}
              >
                Back View
              </button>
            </div>
          </div>

          {/* Interactive Garment Canvas Area */}
          <div 
            ref={canvasRef}
            className="w-full max-w-[440px] aspect-[4/5] rounded-2xl relative overflow-hidden flex items-center justify-center border border-card-border/85 bg-card-bg/15 group shadow-inner"
          >
            {/* Render dynamic background-free SVG vector garment */}
            <GarmentSVG
              type={garmentType}
              color={garmentColor}
              view={activeView}
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Design print zone guide boundary */}
            <div 
              className="absolute w-[45%] h-[50%] border-2 border-dashed border-gold/30 flex items-start justify-center pointer-events-none rounded-lg"
              style={{
                top: garmentType === "Hoodie" ? "28%" : garmentType === "T-Shirt" ? "22%" : "25%",
                left: "27.5%"
              }}
            >
              <span className="text-[7px] bg-luxury-black/90 text-gold border border-gold/25 px-1.5 py-0.5 rounded-full font-mono uppercase tracking-widest mt-2">
                Print Area
              </span>
            </div>

            {/* Absolute Overlays containing Drag/Scale Elements */}
            <div className="absolute inset-0 pointer-events-auto overflow-hidden">
              
              {/* Front Logo / Graphic */}
              {activeView === "front" && frontLogo && (
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDrag={(e, info) => setFrontLogoPos({ x: frontLogoPos.x + info.delta.x, y: frontLogoPos.y + info.delta.y })}
                  style={{
                    x: frontLogoPos.x,
                    y: frontLogoPos.y,
                    width: frontLogoScale,
                    rotate: frontLogoRotation,
                    cursor: "grab",
                    position: "absolute",
                    top: "40%",
                    left: "35%"
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement("logo"); }}
                  className={`z-20 group p-1 border rounded ${
                    selectedElement === "logo" ? "border-gold bg-gold/5 shadow-lg" : "border-transparent"
                  }`}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                >
                  <img 
                    src={frontLogo} 
                    alt="Front Artwork" 
                    className="w-full h-auto object-contain pointer-events-none"
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[7px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-widest">
                    Drag Logo
                  </div>
                </motion.div>
              )}

              {/* Back Logo / Graphic */}
              {activeView === "back" && backLogo && (
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDrag={(e, info) => setBackLogoPos({ x: backLogoPos.x + info.delta.x, y: backLogoPos.y + info.delta.y })}
                  style={{
                    x: backLogoPos.x,
                    y: backLogoPos.y,
                    width: backLogoScale,
                    rotate: backLogoRotation,
                    cursor: "grab",
                    position: "absolute",
                    top: "38%",
                    left: "33%"
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement("logo"); }}
                  className={`z-20 group p-1 border rounded ${
                    selectedElement === "logo" ? "border-gold bg-gold/5 shadow-lg" : "border-transparent"
                  }`}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                >
                  <img 
                    src={backLogo} 
                    alt="Back Artwork" 
                    className="w-full h-auto object-contain pointer-events-none"
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[7px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-widest">
                    Drag Logo
                  </div>
                </motion.div>
              )}

              {/* Front Text */}
              {activeView === "front" && frontText && (
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDrag={(e, info) => setFrontTextPos({ x: frontTextPos.x + info.delta.x, y: frontTextPos.y + info.delta.y })}
                  style={{
                    x: frontTextPos.x,
                    y: frontTextPos.y,
                    color: frontTextColor,
                    fontFamily: frontTextFont,
                    fontSize: frontTextSize,
                    rotate: frontTextRotation,
                    cursor: "grab",
                    position: "absolute",
                    top: "40%",
                    left: "30%"
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement("text"); }}
                  className={`z-20 group px-2 py-1 border rounded whitespace-nowrap font-semibold leading-none select-none ${
                    selectedElement === "text" ? "border-gold bg-gold/5 shadow-lg" : "border-transparent"
                  }`}
                  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                >
                  {frontText}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[7px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-widest">
                    Drag Lettering
                  </div>
                </motion.div>
              )}

              {/* Back Text */}
              {activeView === "back" && backText && (
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDrag={(e, info) => setBackTextPos({ x: backTextPos.x + info.delta.x, y: backTextPos.y + info.delta.y })}
                  style={{
                    x: backTextPos.x,
                    y: backTextPos.y,
                    color: backTextColor,
                    fontFamily: backTextFont,
                    fontSize: backTextSize,
                    rotate: backTextRotation,
                    cursor: "grab",
                    position: "absolute",
                    top: "38%",
                    left: "30%"
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement("text"); }}
                  className={`z-20 group px-2 py-1 border rounded whitespace-nowrap font-semibold leading-none select-none ${
                    selectedElement === "text" ? "border-gold bg-gold/5 shadow-lg" : "border-transparent"
                  }`}
                  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                >
                  {backText}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[7px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-widest">
                    Drag Lettering
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Canvas Footer Utilities */}
          <div className="w-full mt-4 flex justify-between items-center z-10 border-t border-card-border pt-4 text-[10px] uppercase font-mono text-foreground/50 tracking-wider">
            <div className="flex gap-4">
              <div>
                <span className="text-foreground font-bold">{garmentType}</span>
                <span className="block font-light text-[8px]">Apparel Specs</span>
              </div>
              <div>
                <span className="text-gold font-bold">
                  {garmentType === "Hoodie" ? "450GSM French Terry" : garmentType === "T-Shirt" ? "240GSM Combed" : "320GSM Heavyweight"}
                </span>
                <span className="block font-light text-[8px]">Fabric Density</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-gold hover:text-gold-hover hover:scale-102 transition-all cursor-pointer font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Canvas
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT: Dynamic Configurator Tool & Checkout Wizard */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="w-full glass rounded-3xl p-4 sm:p-6 border border-card-border flex flex-col justify-between h-full">
          
          {/* Configurator Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 border-b border-card-border mb-6 scrollbar-none">
            {[
              { id: "garment", label: "Silhouette" },
              { id: "graphics", label: "Branding" },
              { id: "text", label: "Typography" },
              { id: "finish", label: "Details" },
              { id: "checkout", label: "Submit Design", icon: <Sparkles className="w-3 h-3 text-gold" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gold-light/10 text-gold border border-gold/30"
                    : "text-foreground/75 hover:bg-card-bg hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Configurator Content Area */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Silhouette and Specs */}
              {activeTab === "garment" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block"></span>
                      1. Select Silhouette
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["T-Shirt", "Hoodie", "Oversized T-Shirt"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setGarmentType(type)}
                          className={`py-3 px-2 rounded-xl border text-[10px] uppercase tracking-widest transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                            garmentType === type
                              ? "border-gold bg-gold-light/10 text-gold font-bold"
                              : "border-card-border bg-card-bg hover:bg-card-hover text-foreground/80"
                          }`}
                        >
                          <span className="font-semibold block truncate w-full">{type}</span>
                          <span className="text-[8px] text-foreground/50 lowercase font-light">
                            {type === "Hoodie" ? "₹5,400" : type === "T-Shirt" ? "₹2,900" : "₹3,500"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated Fabric Colors + Custom Color Picker */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block"></span>
                      2. Fabric Color (Background-Free)
                    </label>
                    <div className="flex flex-wrap gap-3 items-center">
                      {COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.hex}
                          onClick={() => setGarmentColor(swatch.hex)}
                          className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center relative ${
                            garmentColor === swatch.hex ? "border-gold scale-110 shadow-lg shadow-gold/20" : "border-transparent opacity-85 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                        >
                          {garmentColor === swatch.hex && (
                            <Check className={`w-4 h-4 ${swatch.hex === "#FFFFFF" ? "text-luxury-black" : "text-white"}`} />
                          )}
                        </button>
                      ))}
                      
                      {/* Premium Custom Color Picker */}
                      <div className="relative flex items-center gap-1 bg-card-bg/35 border border-card-border pl-2 pr-3 py-1.5 rounded-full hover:border-gold transition-colors">
                        <input
                          type="color"
                          value={garmentColor}
                          onChange={(e) => setGarmentColor(e.target.value)}
                          className="w-6 h-6 border-0 bg-transparent rounded-full cursor-pointer overflow-hidden accent-transparent"
                          title="Choose Custom Color"
                        />
                        <span className="text-[9px] font-mono text-foreground font-semibold uppercase tracking-wider">
                          Custom Hex
                        </span>
                      </div>

                      <span className="text-[9px] text-foreground/50 font-mono font-bold uppercase tracking-widest ml-auto">
                        {garmentColor}
                      </span>
                    </div>
                  </div>

                  {/* Sizing Breakdown & Quantities */}
                  <div className="space-y-3 pt-2 border-t border-card-border">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block"></span>
                      3. Custom Quantity Breakdown
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {(["S", "M", "L", "XL", "XXL"] as const).map((sz) => (
                        <div key={sz} className="text-center space-y-1 bg-card-bg/25 border border-card-border p-2 rounded-xl">
                          <span className="text-[10px] font-bold block">{sz}</span>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setQuantities(prev => ({ ...prev, [sz]: Math.max(0, prev[sz] - 1) }))}
                              className="w-4 h-4 rounded bg-card-border text-[10px] flex items-center justify-center hover:bg-gold hover:text-luxury-black font-mono select-none"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono w-4">{quantities[sz]}</span>
                            <button
                              onClick={() => setQuantities(prev => ({ ...prev, [sz]: prev[sz] + 1 }))}
                              className="w-4 h-4 rounded bg-card-border text-[10px] flex items-center justify-center hover:bg-gold hover:text-luxury-black font-mono select-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Silhouette Request Section */}
                  <div className="p-4 bg-gold-light/5 border border-gold/15 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Need a Custom Designer Garment?
                      </p>
                      <p className="text-[10px] text-foreground/75 leading-relaxed font-light mt-1">
                        If you need a designer dress, special utility cloak, or custom silhouette coordinates not covered by our standard options, request our professional fashion designers directly.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCustomModalOpen(true)}
                      className="py-2.5 px-4 bg-gold text-luxury-black font-bold text-[9px] uppercase tracking-widest rounded-xl hover:bg-gold-hover transition-all cursor-pointer text-center w-full"
                    >
                      Request Custom Silhouette
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Branding Artwork Upload */}
              {activeTab === "graphics" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block"></span>
                        Graphic Branding - {activeView === "front" ? "Front Artwork" : "Back Artwork"}
                      </span>
                      <span className="text-[8px] bg-card-border px-2 py-0.5 rounded text-foreground/50">
                        PNG / SVG Recommended
                      </span>
                    </label>

                    {/* File Upload Zone */}
                    <div className="flex flex-col items-center justify-center border border-dashed border-card-border hover:border-gold/50 rounded-2xl p-6 bg-card-bg/25 transition-all relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadClick}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                      <p className="text-[11px] font-semibold text-foreground/80">
                        {activeView === "front" && frontLogo ? "Replace Front Graphic" : activeView === "back" && backLogo ? "Replace Back Graphic" : "Upload Artwork Vector"}
                      </p>
                      <p className="text-[8px] text-foreground/50 uppercase tracking-widest mt-1 font-mono">
                        Drag & Drop or Click to browse
                      </p>
                    </div>
                  </div>

                  {/* Logo Placement Adjustments */}
                  {((activeView === "front" && frontLogo) || (activeView === "back" && backLogo)) ? (
                    <div className="space-y-4 pt-4 border-t border-card-border">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono text-foreground/70">
                        <span>Modify Placement Spec</span>
                        <button
                          onClick={() => activeView === "front" ? setFrontLogo(null) : setBackLogo(null)}
                          className="text-red-500 hover:text-red-400 flex items-center gap-0.5 font-bold cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remove Artwork
                        </button>
                      </div>

                      {/* Align center */}
                      <button
                        onClick={() => centerElement("logo")}
                        className="w-full py-2 border border-card-border bg-card-bg rounded-xl text-[9px] uppercase font-bold tracking-widest hover:border-gold hover:text-gold transition-all cursor-pointer"
                      >
                        Recenter Graphic
                      </button>

                      {/* Scale Graphic */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] uppercase font-mono text-foreground/60">
                          <span>Scale Graphic Size</span>
                          <span>{activeView === "front" ? frontLogoScale : backLogoScale}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="220"
                          value={activeView === "front" ? frontLogoScale : backLogoScale}
                          onChange={(e) => {
                            if (activeView === "front") setFrontLogoScale(Number(e.target.value));
                            else setBackLogoScale(Number(e.target.value));
                          }}
                          className="w-full accent-gold bg-card-border h-1 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Rotation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] uppercase font-mono text-foreground/60">
                          <span>Rotation</span>
                          <span>{activeView === "front" ? frontLogoRotation : backLogoRotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={activeView === "front" ? frontLogoRotation : backLogoRotation}
                          onChange={(e) => {
                            if (activeView === "front") setFrontLogoRotation(Number(e.target.value));
                            else setBackLogoRotation(Number(e.target.value));
                          }}
                          className="w-full accent-gold bg-card-border h-1 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-card-border text-center bg-card-bg/10">
                      <p className="text-[10px] text-foreground/50 leading-relaxed">
                        No branding graphics uploaded for the <span className="text-gold font-bold font-mono uppercase">{activeView} view</span> yet. Upload a high-res image to start positioning it on the model.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: Custom Lettering & Typography */}
              {activeTab === "text" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center justify-between">
                      <span>
                        <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block mr-1.5"></span>
                        Custom Lettering ({activeView === "front" ? "Front" : "Back"})
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Input custom embroidery / print text..."
                      value={activeView === "front" ? frontText : backText}
                      onChange={(e) => {
                        if (activeView === "front") {
                          setFrontText(e.target.value);
                          setSelectedElement("text");
                        } else {
                          setBackText(e.target.value);
                          setSelectedElement("text");
                        }
                      }}
                      className="w-full bg-card-bg border border-card-border text-foreground px-4 py-3 rounded-xl text-xs uppercase tracking-wider focus:outline-none focus:border-gold font-semibold"
                    />
                  </div>

                  {((activeView === "front" && frontText) || (activeView === "back" && backText)) ? (
                    <div className="space-y-4 pt-3 border-t border-card-border">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono text-foreground/60">
                        <span>Typography Settings</span>
                        <button
                          onClick={() => activeView === "front" ? setFrontText("") : setBackText("")}
                          className="text-red-500 hover:text-red-400 flex items-center gap-0.5 font-bold cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Clear Text
                        </button>
                      </div>

                      {/* Recenter Text */}
                      <button
                        onClick={() => centerElement("text")}
                        className="w-full py-2 border border-card-border bg-card-bg rounded-xl text-[9px] uppercase font-bold tracking-widest hover:border-gold hover:text-gold transition-all cursor-pointer"
                      >
                        Recenter Text
                      </button>

                      {/* Font selector */}
                      <div>
                        <p className="text-[9px] uppercase font-mono text-foreground/60 mb-2 font-light">Select Typeface</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {FONTS.map((font) => (
                            <button
                              key={font.val}
                              onClick={() => {
                                if (activeView === "front") setFrontTextFont(font.val);
                                else setBackTextFont(font.val);
                              }}
                              className={`py-2 px-2.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer truncate ${
                                (activeView === "front" ? frontTextFont : backTextFont) === font.val
                                  ? "border-gold bg-gold-light/10 text-gold"
                                  : "border-card-border bg-card-bg hover:bg-card-hover text-foreground/80"
                              }`}
                              style={{ fontFamily: font.val }}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Color */}
                      <div>
                        <p className="text-[9px] uppercase font-mono text-foreground/60 mb-2 font-light">Text Finish Color</p>
                        <div className="flex gap-2">
                          {TEXT_COLORS.map((tc) => (
                            <button
                              key={tc.hex}
                              onClick={() => {
                                if (activeView === "front") setFrontTextColor(tc.hex);
                                else setBackTextColor(tc.hex);
                              }}
                              className={`w-6 h-6 rounded-full border border-card-border flex items-center justify-center transition-all cursor-pointer ${
                                (activeView === "front" ? frontTextColor : backTextColor) === tc.hex ? "scale-110 border-gold shadow-md" : "opacity-80"
                              }`}
                              style={{ backgroundColor: tc.hex }}
                              title={tc.name}
                            >
                              {(activeView === "front" ? frontTextColor : backTextColor) === tc.hex && (
                                <Check className="w-3 h-3 text-gold" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text size */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] uppercase font-mono text-foreground/60">
                          <span>Font Scale Size</span>
                          <span>{activeView === "front" ? frontTextSize : backTextSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="48"
                          value={activeView === "front" ? frontTextSize : backTextSize}
                          onChange={(e) => {
                            if (activeView === "front") setFrontTextSize(Number(e.target.value));
                            else setBackTextSize(Number(e.target.value));
                          }}
                          className="w-full accent-gold bg-card-border h-1 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Text rotation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] uppercase font-mono text-foreground/60">
                          <span>Text Angle Rotation</span>
                          <span>{activeView === "front" ? frontTextRotation : backTextRotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          value={activeView === "front" ? frontTextRotation : backTextRotation}
                          onChange={(e) => {
                            if (activeView === "front") setFrontTextRotation(Number(e.target.value));
                            else setBackTextRotation(Number(e.target.value));
                          }}
                          className="w-full accent-gold bg-card-border h-1 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-card-border text-center bg-card-bg/10">
                      <p className="text-[10px] text-foreground/50 leading-relaxed">
                        No custom text overlay entered for the <span className="text-gold font-bold font-mono uppercase">{activeView} view</span> yet. Input text above to design premium brand prints or embroidery coordinates.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: Finish Details */}
              {activeTab === "finish" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center gap-1.5 mb-2">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block"></span>
                    Print Finish & Texture Spec
                  </label>
                  <div className="space-y-3">
                    {FINISH_METHODS.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setFinishMethod(method.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-start gap-4 ${
                          finishMethod === method.id
                            ? "border-gold bg-gold-light/10"
                            : "border-card-border bg-card-bg/50 hover:bg-card-hover"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                            {finishMethod === method.id && <Check className="w-3.5 h-3.5 text-gold inline" />}
                            {method.name}
                          </p>
                          <p className="text-[9px] text-foreground/60 leading-relaxed font-light">{method.desc}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gold tracking-widest whitespace-nowrap font-mono">
                          {method.surcharge === 0 ? "Standard" : `+₹${method.surcharge.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Production notes */}
                  <div className="space-y-2 pt-3 border-t border-card-border">
                    <p className="text-[10px] uppercase font-mono text-foreground/60">Additional tailoring details / print notes</p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe custom features (distressed neck trims, metal tip draws, stitching colors, specific alignment, etc.)..."
                      rows={3}
                      className="w-full bg-card-bg border border-card-border text-foreground p-3 rounded-xl text-xs focus:outline-none focus:border-gold resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* TAB 5: Checkout Form & Wizard */}
              {activeTab === "checkout" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {isOrdered ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="h-16 w-16 bg-gold-light/10 border border-gold/40 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-gold animate-bounce" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                          Design Request Received!
                        </h4>
                        <p className="text-[10px] font-mono text-gold font-semibold">{orderId}</p>
                        <p className="text-xs text-foreground/75 font-light leading-relaxed max-w-xs mx-auto">
                          Thank you for choosing Tantura, **{shippingDetails.name}**. Your digital apparel assets and placement files have been securely transmitted to our design queue.
                        </p>
                      </div>
                      <div className="p-3.5 bg-card-bg/25 border border-card-border rounded-xl text-[10px] font-light leading-relaxed text-foreground/70 text-left space-y-1.5">
                        <p><strong>Design:</strong> {garmentType} ({garmentColor})</p>
                        <p><strong>Total Units:</strong> {prices.qty} (Estimated total: ₹{prices.total.toLocaleString('en-IN')})</p>
                        <p><strong>Status:</strong> Assigned to Personal Designer (Review within 2 hrs)</p>
                        <p><strong>Contact:</strong> {shippingDetails.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsOrdered(false);
                          setQuantities({ S: 0, M: 1, L: 0, XL: 0, XXL: 0 });
                          setFrontLogo(null);
                          setBackLogo(null);
                          setFrontText("");
                          setBackText("");
                          setActiveTab("garment");
                        }}
                        className="px-6 py-2.5 bg-gold text-luxury-black font-bold text-[10px] uppercase tracking-widest rounded-full hover:scale-102 transition-all cursor-pointer"
                      >
                        Design Another Garment
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-mono text-gold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 bg-gold rounded-full inline-block"></span>
                        Tailoring Coordinates & Shipping Details
                      </label>
                      
                      <div className="space-y-2.5">
                        {/* Name input */}
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-foreground/45">
                            <User className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={shippingDetails.name}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-card-bg border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                        </div>

                        {/* Email input */}
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-foreground/45">
                            <Mail className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="email"
                            required
                            placeholder="Email Address (for order updates)"
                            value={shippingDetails.email}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-card-bg border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                        </div>

                        {/* Phone input */}
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-foreground/45">
                            <Phone className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="tel"
                            placeholder="Contact Phone Number"
                            value={shippingDetails.phone}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-card-bg border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                        </div>

                        {/* Address input */}
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-foreground/45">
                            <MapPin className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Delivery Address"
                            value={shippingDetails.address}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-card-bg border border-card-border text-foreground pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                        </div>

                        {/* City, State, ZIP */}
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={shippingDetails.city}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                            className="bg-card-bg border border-card-border text-foreground px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                          <input
                            type="text"
                            required
                            placeholder="State"
                            value={shippingDetails.state}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, state: e.target.value }))}
                            className="bg-card-bg border border-card-border text-foreground px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                          <input
                            type="text"
                            required
                            placeholder="ZIP"
                            value={shippingDetails.zip}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, zip: e.target.value }))}
                            className="bg-card-bg border border-card-border text-foreground px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Submit Order Trigger Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || prices.qty === 0}
                        className="w-full mt-3 py-4 bg-gold disabled:bg-card-border text-luxury-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold-hover hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-gold/15"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-1.5">
                            <span className="animate-spin h-3.5 w-3.5 border-2 border-luxury-black border-t-transparent rounded-full" />
                            Transmitting Customizer Assets...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            Submit Tailoring & Print Specifications <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Pricing Summary Widget */}
          {!isOrdered && (
            <div className="border-t border-card-border pt-5 mt-6 space-y-3.5">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider">
                <span className="text-foreground/50">Base Silhouette Price</span>
                <span className="font-semibold text-foreground">₹{prices.base.toLocaleString('en-IN')}</span>
              </div>
              
              {prices.finish > 0 && (
                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider">
                  <span className="text-foreground/50">Print Finish Premium</span>
                  <span className="font-semibold text-gold">+₹{prices.finish.toLocaleString('en-IN')}</span>
                </div>
              )}

              {prices.graphics > 0 && (
                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider">
                  <span className="text-foreground/50">Branding / Graphics Fee</span>
                  <span className="font-semibold text-gold">+₹{prices.graphics.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider pt-2 border-t border-dashed border-card-border">
                <span className="text-foreground/60 font-bold">Estimated Unit Price</span>
                <span className="font-bold text-foreground">₹{prices.unit.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs uppercase font-mono tracking-widest pt-2 border-t border-card-border">
                <span className="text-gold font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 animate-pulse-slow text-gold" />
                  Final Custom Total
                </span>
                <span className="text-lg font-bold text-foreground">
                  ₹{prices.total.toLocaleString('en-IN')} <span className="text-[8px] text-foreground/50 font-normal">({prices.qty} units)</span>
                </span>
              </div>

              {activeTab !== "checkout" && (
                <button
                  onClick={() => {
                    if (prices.qty === 0) {
                      alert("Please select at least 1 unit in the Silhouette tab first.");
                      setActiveTab("garment");
                      return;
                    }
                    setActiveTab("checkout");
                  }}
                  className="w-full mt-2 py-3.5 bg-gold text-luxury-black font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-gold-hover hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Continue to Submit Specifications <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: Design Guidelines Slide-out Drawer */}
      <AnimatePresence>
        {isGuidelinesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGuidelinesOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 cursor-pointer backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full sm:w-[380px] bg-background/95 border-r border-card-border z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-card-border pb-4">
                  <span className="text-xs uppercase font-mono font-bold text-gold flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Design Guidelines
                  </span>
                  <button 
                    onClick={() => setIsGuidelinesOpen(false)}
                    className="p-1.5 border border-card-border rounded-full hover:bg-card-border text-foreground transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 text-xs font-light leading-relaxed text-foreground/80 overflow-y-auto max-h-[75vh] pr-2">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground font-mono uppercase text-[10px]">1. Vector Formats</p>
                    <p className="text-[11px]">Upload transparent PNG, SVG, or high-res JPG files. Clean backgrounds ensure the screen print or embroidery renders flawlessly.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-foreground font-mono uppercase text-[10px]">2. Print Boundary Zone</p>
                    <p className="text-[11px]">Keep your custom artwork and texts inside the dashed golden box. Placements overlapping the box boundaries will be flagged by our QC team.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-foreground font-mono uppercase text-[10px]">3. Custom Lettering sizes</p>
                    <p className="text-[11px]">Font sizes below 14px will automatically be routed as screen printing instead of heavy embroidery to prevent fabric bunching.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-foreground font-mono uppercase text-[10px]">4. Fabric Sizing Tips</p>
                    <p className="text-[11px]">Standard shirts have a tailored boxy profile. Oversized t-shirts are cut with a wide chest and drop shoulder – we recommend ordering your true size.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-card-border pt-4 text-[9px] font-mono text-foreground/50 text-center">
                Tantura Tailoring Blueprint Guidelines
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL 2: Custom Dress/Silhouette Request Dialog */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomModalOpen(false)}
              className="fixed inset-0 bg-black/70 z-50 cursor-pointer backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[480px] bg-background/98 border border-card-border rounded-3xl p-6 shadow-2xl z-50 overflow-hidden"
            >
              
              {isCustomSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-16 w-16 bg-gold-light/10 border border-gold/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <Sparkles className="w-8 h-8 text-gold" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                      Custom Request Received!
                    </h3>
                    <p className="text-[10px] font-mono text-gold font-semibold">{customTicketId}</p>
                    <p className="text-xs text-foreground/75 leading-relaxed max-w-sm mx-auto font-light">
                      Your custom design request has been assigned to founder & fashion designer **Archi Gandhi**. She will review your brief and contact you at **{customRequest.email}** within 2 hours with silhouette sketches.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCustomSubmitted(false);
                      setIsCustomModalOpen(false);
                      setCustomRequest({
                        garmentCategory: "Designer Dress",
                        fabricMaterial: "Mulberry Silk",
                        brief: "",
                        name: "",
                        email: "",
                        phone: ""
                      });
                    }}
                    className="px-6 py-2.5 bg-gold text-luxury-black font-bold text-[10px] uppercase tracking-widest rounded-full cursor-pointer hover:bg-gold-hover transition-all"
                  >
                    Return to Customizer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSilhouetteSubmit} className="space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-card-border pb-3.5">
                    <div>
                      <h3 className="text-xs uppercase font-mono font-bold text-gold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 animate-pulse-slow" /> Custom Silhouette Request
                      </h3>
                      <p className="text-[9px] text-foreground/50 mt-0.5 uppercase tracking-wide">
                        Request custom dresses, cargo jackets, or leather coordinates
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsCustomModalOpen(false)}
                      className="p-1.5 border border-card-border rounded-full hover:bg-card-border text-foreground transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1.5">
                    
                    {/* Category Selection */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-mono text-foreground/60">Garment Category</label>
                        <select
                          value={customRequest.garmentCategory}
                          onChange={(e) => setCustomRequest(prev => ({ ...prev, garmentCategory: e.target.value }))}
                          className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-gold font-semibold uppercase"
                        >
                          <option value="Designer Dress">Designer Dress</option>
                          <option value="Bespoke Jacket">Bespoke Jacket</option>
                          <option value="Bespoke Suit">Bespoke Suit</option>
                          <option value="Leather Coordinates">Leather Coordinates</option>
                          <option value="Other Silhouette">Other / Custom Cloak</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] uppercase font-mono text-foreground/60">Material / Fabric</label>
                        <select
                          value={customRequest.fabricMaterial}
                          onChange={(e) => setCustomRequest(prev => ({ ...prev, fabricMaterial: e.target.value }))}
                          className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-gold font-semibold uppercase"
                        >
                          <option value="Mulberry Silk">Mulberry Silk</option>
                          <option value="French Terry Cotton">French Terry Cotton</option>
                          <option value="Premium Suede/Leather">Premium Suede / Leather</option>
                          <option value="Distressed Denim">Distressed Denim</option>
                          <option value="Heavy Velvet">Heavy Velvet</option>
                        </select>
                      </div>
                    </div>

                    {/* Brief description */}
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-mono text-foreground/60">Custom Design Brief</label>
                      <textarea
                        required
                        value={customRequest.brief}
                        onChange={(e) => setCustomRequest(prev => ({ ...prev, brief: e.target.value }))}
                        placeholder="Detail the dress style, silhouette cuts, sleeve length, lining specs, stitching details, and sizing metrics..."
                        rows={3}
                        className="w-full bg-card-bg border border-card-border text-[11px] p-3 rounded-xl focus:outline-none focus:border-gold resize-none"
                      />
                    </div>

                    {/* Reference Art */}
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-mono text-foreground/60">Upload Reference Image (Optional)</label>
                      <div className="border border-dashed border-card-border p-3.5 rounded-xl bg-card-bg/10 flex items-center justify-center text-center cursor-pointer relative hover:border-gold/50 transition-colors">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                        <span className="text-[10px] font-bold text-foreground/60 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Upload File Reference
                        </span>
                      </div>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-2 pt-2 border-t border-card-border">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={customRequest.name}
                        onChange={(e) => setCustomRequest(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-card-bg border border-card-border text-[11px] px-3.5 py-2 rounded-xl focus:outline-none focus:border-gold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={customRequest.email}
                          onChange={(e) => setCustomRequest(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-card-bg border border-card-border text-[11px] px-3.5 py-2 rounded-xl focus:outline-none focus:border-gold"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Coordinates"
                          value={customRequest.phone}
                          onChange={(e) => setCustomRequest(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-card-bg border border-card-border text-[11px] px-3.5 py-2 rounded-xl focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 bg-gold disabled:bg-card-border text-luxury-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold-hover transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin h-3 w-3 border-2 border-luxury-black border-t-transparent rounded-full" />
                    ) : (
                      <span>Submit Silhouette Request to Archi Gandhi</span>
                    )}
                  </button>
                </form>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
