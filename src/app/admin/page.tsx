"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Settings, 
  FileText, 
  DollarSign, 
  Check, 
  Layers, 
  Cpu, 
  Activity, 
  User, 
  Clock, 
  CheckCircle,
  Truck,
  RotateCw,
  X
} from "lucide-react";

export default function AdminPage() {
  const { user, designRequests, updateDesignStatus } = useApp();
  
  // Local state for editing request details
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<any>("submitted");
  const [editPrice, setEditPrice] = useState<number>(0);

  // Compute Admin Stats
  const totalRequests = designRequests.length;
  const inReviewRequests = designRequests.filter(r => r.status === "submitted" || r.status === "under_review").length;
  const inProductionRequests = designRequests.filter(r => r.status === "approved" || r.status === "production").length;
  
  // Total pricing revenue
  const totalRevenue = designRequests.reduce((sum, r) => sum + (r.price || 0), 0);

  const handleStartEdit = (req: any) => {
    setEditingId(req.id);
    setEditStatus(req.status);
    setEditPrice(req.price || 0);
  };

  const handleSaveEdit = (id: string) => {
    updateDesignStatus(id, editStatus, editPrice);
    setEditingId(null);
    alert(`Request ${id} updated successfully.`);
  };

  // Helper to color statuses
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "under_review":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "approved":
      case "production":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "shipped":
      case "delivered":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      default:
        return "bg-card-border text-foreground/60";
    }
  };

  const isAuthorized = user && user.role === "admin";

  if (!isAuthorized) {
    return (
      <>
        <Navbar />

        <main className="flex-grow select-none bg-[#0A0A0A] pb-20 relative flex items-center justify-center min-h-[75vh]">
          {/* Ambient gold glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

          <section className="relative z-10 max-w-md mx-auto px-6 py-12 text-center space-y-8 glass rounded-3xl border border-card-border shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl w-fit">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-light uppercase tracking-widest text-foreground text-gold-shine">
                Access Denied
              </h2>
              <div className="h-[1px] bg-card-border w-24 mx-auto" />
            </div>

            <p className="text-xs text-foreground/70 font-light leading-relaxed">
              The Tantura Admin Control Center is restricted to authorized personnel only. You must be authenticated as an Administrator to manage design pipelines and upload quotes.
            </p>

            <div className="p-4 rounded-2xl border border-card-border bg-[#0D0D0D] text-[10px] font-mono text-foreground/50 space-y-1.5 max-w-[280px] mx-auto">
              <span className="block text-gold/80 font-bold uppercase tracking-wider">Authorized Demo login</span>
              <p>Email: <span className="text-white">admin@ajstudio.com</span></p>
              <p className="italic">(Any password hash accepted)</p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <a 
                href="/"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-card-border text-xs uppercase tracking-widest font-bold text-foreground hover:bg-card-border transition-all cursor-pointer"
              >
                Return to Customizer
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow select-none bg-background pb-20 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <section className="pt-16 pb-10 px-6 max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-light/10 border border-gold/30 text-gold text-[9px] uppercase tracking-widest font-mono font-bold rounded-full">
                <Settings className="w-3.5 h-3.5" /> Tantura Control Center
              </span>
              <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-tight">
                Admin Control <span className="text-gold font-semibold text-gold-shine">Center</span>
              </h1>
              <p className="text-xs text-foreground/60 max-w-md font-light">
                Monitor live custom clothing upload coordinates, modify production pipeline statuses, and assign tailoring quotes.
              </p>
            </div>
            
            {/* Clock stamp */}
            <div className="text-[10px] font-mono text-foreground/50 border border-card-border px-4 py-2 bg-card-bg/20 rounded-xl w-fit">
              System Active: {new Date().toLocaleDateString()}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Uploads", val: totalRequests, icon: <FileText className="w-5 h-5 text-gold" /> },
              { label: "In Review Queue", val: inReviewRequests, icon: <Clock className="w-5 h-5 text-yellow-500 animate-pulse" /> },
              { label: "Active Production", val: inProductionRequests, icon: <Cpu className="w-5 h-5 text-orange-400" /> },
              { label: "Pricing Forecast", val: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign className="w-5 h-5 text-green-500" /> }
            ].map((stat, idx) => (
              <div 
                key={stat.label}
                className="glass p-5 rounded-2xl border border-card-border flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-foreground/50 font-mono tracking-wider">{stat.label}</span>
                  <p className="text-xl font-bold font-mono text-foreground">{stat.val}</p>
                </div>
                <div className="p-3 bg-card-bg/25 border border-card-border rounded-xl">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requests Management Grid */}
        <section className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass rounded-3xl border border-card-border overflow-hidden">
            
            {/* Table Header */}
            <div className="p-6 border-b border-card-border bg-card-bg/25 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-gold flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Live Upload Coordinates Queue
              </span>
              <span className="text-[9px] font-mono text-foreground/45">
                Table records: {designRequests.length}
              </span>
            </div>

            {/* Table Body / Grid */}
            <div className="overflow-x-auto">
              {designRequests.length === 0 ? (
                <div className="p-12 text-center text-foreground/55 text-xs font-light">
                  No design requests currently found.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-card-border text-[9px] uppercase tracking-wider text-foreground/50 font-mono">
                      <th className="p-5 font-bold">Request Coordinates</th>
                      <th className="p-5 font-bold">Client / Contact</th>
                      <th className="p-5 font-bold">Apparel Configuration</th>
                      <th className="p-5 font-bold">Placement / Fabrication</th>
                      <th className="p-5 font-bold">Status Coordination</th>
                      <th className="p-5 font-bold">Quote Price</th>
                      <th className="p-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designRequests.map((req) => {
                      const isEditing = editingId === req.id;
                      
                      return (
                        <tr 
                          key={req.id}
                          className="border-b border-card-border hover:bg-card-bg/10 transition-all font-light"
                        >
                          {/* ID */}
                          <td className="p-5 font-mono font-bold text-gold">
                            {req.id}
                          </td>

                          {/* Client info */}
                          <td className="p-5">
                            <div className="font-bold text-foreground flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-foreground/45" /> {req.designerName || "Mock Client"}
                            </div>
                            <span className="text-[10px] text-foreground/50 block font-mono mt-0.5">client_id: {req.customerId}</span>
                          </td>

                          {/* Apparel Type & Color */}
                          <td className="p-5">
                            <span className="font-bold text-foreground">{req.garmentType}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-card-border block" 
                                style={{ backgroundColor: req.garmentColor }}
                              />
                              <span className="text-[9px] text-foreground/50 font-mono uppercase">{req.garmentColor}</span>
                            </div>
                          </td>

                          {/* Placements & Notes */}
                          <td className="p-5 max-w-xs">
                            <span className="px-2.5 py-0.5 bg-card-border text-[9px] font-bold uppercase rounded font-mono">
                              {req.placement}
                            </span>
                            <p className="text-[10px] text-foreground/60 line-clamp-2 mt-1.5">
                              {req.notes}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="p-5">
                            {isEditing ? (
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="bg-card-bg border border-card-border rounded-lg p-2 text-foreground focus:outline-none focus:border-gold font-mono text-[10px] uppercase font-bold"
                              >
                                <option value="submitted">Submitted</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="production">Production</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            ) : (
                              <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full border ${getStatusBadgeClass(req.status)}`}>
                                {req.status.replace("_", " ")}
                              </span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="p-5 font-mono">
                            {isEditing ? (
                              <div className="relative w-24">
                                <span className="absolute left-2.5 top-2.5 text-foreground/50">$</span>
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-full bg-card-bg border border-card-border pl-6 pr-2 py-2 rounded-lg text-foreground focus:outline-none focus:border-gold font-bold text-xs"
                                />
                              </div>
                            ) : (
                              <span className="font-bold text-foreground">
                                {req.price ? `$${req.price.toFixed(2)}` : "Pending Quote"}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-5 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveEdit(req.id)}
                                  className="p-2 bg-gold text-luxury-black rounded-lg hover:bg-gold-hover transition-all cursor-pointer"
                                  title="Save Changes"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-2 border border-card-border hover:bg-card-border rounded-lg text-foreground transition-all cursor-pointer"
                                  title="Cancel Edit"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(req)}
                                className="px-3.5 py-2 border border-card-border bg-card-bg/50 hover:border-gold hover:text-gold rounded-xl transition-all cursor-pointer font-semibold uppercase tracking-wider text-[9px]"
                              >
                                Edit Spec
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
