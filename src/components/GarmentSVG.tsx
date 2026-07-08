"use client";

import React from "react";

interface GarmentSVGProps {
  type: "T-Shirt" | "Hoodie" | "Oversized T-Shirt";
  color: string;
  view: "front" | "back";
  className?: string;
}

export const GarmentSVG: React.FC<GarmentSVGProps> = ({ type, color, view, className = "" }) => {
  // Determine if the garment color is light or dark to style paths dynamically
  const isLightColor = 
    color.toLowerCase() === "#ffffff" || 
    color.toLowerCase() === "#fafafa" || 
    color.toLowerCase() === "#f5f1eb" || 
    color.toLowerCase() === "#e5e4e2";

  const strokeColor = isLightColor ? "rgba(17, 17, 17, 0.22)" : "rgba(255, 255, 255, 0.22)";
  const stitchColor = isLightColor ? "rgba(17, 17, 17, 0.12)" : "rgba(255, 255, 255, 0.12)";
  const shadowColor = isLightColor ? "rgba(17, 17, 17, 0.06)" : "rgba(255, 255, 255, 0.04)";
  const drawstringColor = isLightColor ? "#111111" : "#E5E4E2";

  // Dynamic garment render based on type and front/back view
  const renderGarment = () => {
    switch (type) {
      case "T-Shirt":
        if (view === "front") {
          return (
            <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-2xl">
              {/* Base Fabric Layer */}
              <path
                d="M 120 70 C 150 85, 250 85, 280 70 L 355 105 L 320 170 L 290 160 L 290 410 L 110 410 L 110 160 L 80 170 L 45 105 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Collar Ribbing Detail */}
              <path
                d="M 120 70 C 135 88, 265 88, 280 70"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3.5"
              />
              <path
                d="M 120 70 C 135 88, 265 88, 280 70"
                fill="none"
                stroke={stitchColor}
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              {/* Sleeve Seams */}
              <path d="M 110 160 L 140 100" fill="none" stroke={stitchColor} strokeWidth="1.5" />
              <path d="M 290 160 L 260 100" fill="none" stroke={stitchColor} strokeWidth="1.5" />
              {/* Sleeve Hems */}
              <path d="M 45 105 L 80 170" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 355 105 L 320 170" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Underarm Shadow crease */}
              <path d="M 110 160 C 115 190, 130 200, 140 220" fill="none" stroke={shadowColor} strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 290 160 C 285 190, 270 200, 260 220" fill="none" stroke={shadowColor} strokeWidth="4.5" strokeLinecap="round" />
              {/* Bottom Hem Stitching */}
              <line x1="110" y1="400" x2="290" y2="400" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,2" />
            </svg>
          );
        } else {
          return (
            <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-2xl">
              {/* Base Fabric Layer */}
              <path
                d="M 120 70 C 150 74, 250 74, 280 70 L 355 105 L 320 170 L 290 160 L 290 410 L 110 410 L 110 160 L 80 170 L 45 105 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Back Neck Line */}
              <path
                d="M 120 70 C 145 74, 255 74, 280 70"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
              />
              {/* Sleeve Seams & Back Yoke Stitching */}
              <path d="M 110 160 L 140 100" fill="none" stroke={stitchColor} strokeWidth="1.5" />
              <path d="M 290 160 L 260 100" fill="none" stroke={stitchColor} strokeWidth="1.5" />
              <path d="M 140 100 C 180 105, 220 105, 260 100" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Bottom Hem Stitching */}
              <line x1="110" y1="400" x2="290" y2="400" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,2" />
            </svg>
          );
        }

      case "Oversized T-Shirt":
        if (view === "front") {
          return (
            <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-2xl">
              {/* Boxy Fabric Outline (Drop shoulder, wider sleeves, looser bottom) */}
              <path
                d="M 110 75 C 140 92, 260 92, 290 75 L 380 115 L 345 200 L 305 185 L 305 425 L 95 425 L 95 185 L 55 200 L 20 115 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Crewneck Rib detail */}
              <path
                d="M 110 75 C 130 96, 270 96, 290 75"
                fill="none"
                stroke={strokeColor}
                strokeWidth="4"
              />
              <path
                d="M 110 75 C 130 96, 270 96, 290 75"
                fill="none"
                stroke={stitchColor}
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              {/* Drop Shoulder Seam */}
              <path d="M 95 185 L 155 93" fill="none" stroke={stitchColor} strokeWidth="1.8" />
              <path d="M 305 185 L 245 93" fill="none" stroke={stitchColor} strokeWidth="1.8" />
              {/* Wide sleeve hem */}
              <path d="M 20 115 L 55 200" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 380 115 L 345 200" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Subtle fabric drape shadow crease */}
              <path d="M 130 220 C 135 270, 145 320, 150 360" fill="none" stroke={shadowColor} strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 270 220 C 265 270, 255 320, 250 360" fill="none" stroke={shadowColor} strokeWidth="4.5" strokeLinecap="round" />
              {/* Bottom Hem Stitching */}
              <line x1="95" y1="415" x2="305" y2="415" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,2" />
            </svg>
          );
        } else {
          return (
            <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-2xl">
              {/* Boxy Fabric Outline */}
              <path
                d="M 110 75 C 140 79, 260 79, 290 75 L 380 115 L 345 200 L 305 185 L 305 425 L 95 425 L 95 185 L 55 200 L 20 115 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Back collar neck line */}
              <path
                d="M 110 75 C 135 79, 265 79, 290 75"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
              />
              {/* Drop Shoulder Seam */}
              <path d="M 95 185 L 155 93" fill="none" stroke={stitchColor} strokeWidth="1.8" />
              <path d="M 305 185 L 245 93" fill="none" stroke={stitchColor} strokeWidth="1.8" />
              <path d="M 155 93 C 185 96, 215 96, 245 93" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Bottom Hem Stitching */}
              <line x1="95" y1="415" x2="305" y2="415" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,2" />
            </svg>
          );
        }

      case "Hoodie":
        if (view === "front") {
          return (
            <svg viewBox="0 0 400 460" className="w-full h-full drop-shadow-2xl">
              {/* Base Hoodie Fabric Layer */}
              <path
                d="M 130 95 C 150 95, 250 95, 270 95 L 360 135 L 320 250 L 290 235 L 290 410 C 290 425, 280 435, 265 435 L 135 435 C 120 435, 110 425, 110 410 L 110 235 L 80 250 L 40 135 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Front Kangaroo Pocket */}
              <path
                d="M 145 315 L 255 315 L 275 375 L 275 410 L 125 410 L 125 375 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Kangaroo Pocket Openings (Santed details) */}
              <path d="M 145 315 L 125 375" stroke={stitchColor} strokeWidth="1.5" />
              <path d="M 255 315 L 275 375" stroke={stitchColor} strokeWidth="1.5" />

              {/* Hood Outline details (Crossed collar hood folds) */}
              <path
                d="M 130 95 C 100 80, 115 15, 200 15 C 285 15, 300 80, 270 95 C 260 115, 140 115, 130 95"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path d="M 130 95 C 150 115, 175 110, 195 102" fill="none" stroke={strokeColor} strokeWidth="2" />
              <path d="M 270 95 C 250 115, 225 110, 205 102" fill="none" stroke={strokeColor} strokeWidth="2" />

              {/* Ribbed Hem & Cuffs */}
              {/* Cuffs */}
              <path d="M 40 135 L 52 142" stroke={strokeColor} strokeWidth="2" />
              <path d="M 360 135 L 348 142" stroke={strokeColor} strokeWidth="2" />
              {/* Bottom Rib hem lines */}
              <path d="M 110 420 L 290 420" stroke={strokeColor} strokeWidth="1.5" />
              <path d="M 110 425 L 290 425" stroke={strokeColor} strokeWidth="1.5" />
              <path d="M 110 430 L 290 430" stroke={strokeColor} strokeWidth="1.5" />

              {/* Premium Drawstrings hanging */}
              <path d="M 180 108 C 175 150, 180 180, 175 220" fill="none" stroke={drawstringColor} strokeWidth="3" strokeLinecap="round" />
              <circle cx="175" cy="220" r="2.5" fill={drawstringColor} />

              <path d="M 220 108 C 225 140, 218 190, 222 230" fill="none" stroke={drawstringColor} strokeWidth="3" strokeLinecap="round" />
              <circle cx="222" cy="230" r="2.5" fill={drawstringColor} />

              {/* Shoulder & Arm Details */}
              <path d="M 130 95 L 110 235" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 270 95 L 290 235" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Shadow folds */}
              <path d="M 135 150 C 150 170, 150 190, 140 220" fill="none" stroke={shadowColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M 265 150 C 250 170, 250 190, 260 220" fill="none" stroke={shadowColor} strokeWidth="4" strokeLinecap="round" />
            </svg>
          );
        } else {
          return (
            <svg viewBox="0 0 400 460" className="w-full h-full drop-shadow-2xl">
              {/* Base Hoodie Fabric Layer */}
              <path
                d="M 130 95 C 150 95, 250 95, 270 95 L 360 135 L 320 250 L 290 235 L 290 410 C 290 425, 280 435, 265 435 L 135 435 C 120 435, 110 425, 110 410 L 110 235 L 80 250 L 40 135 Z"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Hood pulled back view on back */}
              <path
                d="M 130 95 C 110 75, 130 20, 200 20 C 270 20, 290 75, 270 95 C 265 130, 135 130, 130 95"
                fill={color}
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M 155 105 C 175 125, 225 125, 245 105"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.8"
              />

              {/* Bottom Rib hem lines */}
              <path d="M 110 420 L 290 420" stroke={strokeColor} strokeWidth="1.5" />
              <path d="M 110 425 L 290 425" stroke={strokeColor} strokeWidth="1.5" />
              <path d="M 110 430 L 290 430" stroke={strokeColor} strokeWidth="1.5" />

              {/* Sleeve Seams */}
              <path d="M 130 95 L 110 235" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 270 95 L 290 235" fill="none" stroke={stitchColor} strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: "100%", height: "100%" }}>
      {/* Neutral Canvas grid background lines inside garment frame for premium blueprint feel */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <div className="w-[85%] h-[85%] border border-foreground rounded-xl grid grid-cols-6 grid-rows-6">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-foreground/30 border-dashed" />
          ))}
        </div>
      </div>
      
      {/* Render SVG */}
      <div className="w-[80%] h-[80%] flex items-center justify-center">
        {renderGarment()}
      </div>
    </div>
  );
};
