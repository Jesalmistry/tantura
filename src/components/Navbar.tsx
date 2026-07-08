"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  Sun, 
  Moon, 
  Sparkles, 
  User, 
  LogOut, 
  X, 
  Mail, 
  Lock, 
  Phone, 
  UserPlus, 
  LogIn, 
  ChevronRight, 
  FileText,
  CheckCircle,
  HelpCircle,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, user, login, register, logout, designRequests } = useApp();
  
  // Drawer & Auth State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Form inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter design requests for the logged-in user
  const userRequests = user ? designRequests.filter(req => req.customerId === user.id) : [];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        setLoginEmail("");
        setLoginPassword("");
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Invalid email or password coordinates.");
      }
    } catch (err) {
      setErrorMsg("An error occurred during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const success = await register(registerName, registerEmail, registerPhone, registerPassword);
      if (success) {
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPhone("");
        setRegisterPassword("");
        setSuccessMsg("Account registered successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Registration failed. Email coordinates might already exist.");
      }
    } catch (err) {
      setErrorMsg("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b border-card-border select-none">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Home Link */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl border border-gold/35 overflow-hidden bg-[#0A0A0A] p-0.5 flex items-center justify-center shadow-[0_4px_12px_rgba(212,175,55,0.05)] transition-all duration-300 group-hover:border-gold group-hover:shadow-[0_4px_16px_rgba(212,175,55,0.12)]">
              <img src="/logo.jpg" alt="Tantura Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="font-serif font-light text-base tracking-[0.18em] text-gold-shine uppercase transition-opacity duration-300">
              Tantura
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-sans font-semibold">
            <Link href="/" className="text-foreground hover:text-gold transition-colors duration-200">
              Customizer Studio
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-gold transition-colors duration-200">
              About Us
            </Link>
          </nav>

          {/* Controls (Auth trigger & Mobile Menu) */}
          <div className="flex items-center gap-2.5 text-foreground">
            
            {/* Auth Drawer Toggle Button */}
            {user ? (
              <button
                onClick={() => { setIsDrawerOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-card-border transition-all duration-200 border border-gold/30 text-gold cursor-pointer text-xs font-semibold uppercase tracking-wider bg-gold-light/5"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[80px] sm:max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => { setAuthMode("login"); setIsDrawerOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-card-border transition-all duration-200 border border-card-border cursor-pointer text-xs font-semibold uppercase tracking-wider"
              >
                <LogIn className="w-3.5 h-3.5 text-foreground/75" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Navigation Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-card-border hover:border-gold hover:text-gold cursor-pointer transition-all text-foreground"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Mobile Menu Panel Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-card-border bg-[#0A0A0A] overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-3.5 text-xs uppercase tracking-widest font-mono font-bold text-foreground">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-gold transition-colors py-2 flex items-center justify-between border-b border-card-border/40 text-gold-shine"
                >
                  <span>Customizer Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-gold transition-colors py-2 flex items-center justify-between border-b border-card-border/40"
                >
                  <span>About Us</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gold" />
                </Link>
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-gold transition-colors py-2 flex items-center justify-between"
                >
                  <span>Admin Center</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Slide-over Drawer Portal */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Panel drawer body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background/95 border-l border-card-border shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-card-border flex justify-between items-center bg-card-bg/20">
                <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold" />
                  {user ? "Bespoke coordinates" : authMode === "login" ? "Secure Studio Login" : "Create Studio Account"}
                </span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-full border border-card-border hover:bg-card-border text-foreground transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {/* Feedback notifications */}
                {errorMsg && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/35 text-red-500 text-xs rounded-xl font-mono text-center">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3.5 bg-green-500/10 border border-green-500/35 text-green-500 text-xs rounded-xl font-mono text-center animate-pulse">
                    {successMsg}
                  </div>
                )}

                {/* AUTHENTICATED STATE: Profile Coordinates */}
                {user ? (
                  <div className="space-y-6">
                    {/* User Identity Details */}
                    <div className="glass rounded-2xl border border-card-border p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-bold uppercase tracking-wider">{user.name}</h3>
                          <p className="text-xs text-foreground/50">{user.email}</p>
                        </div>
                        <span className="px-3 py-1 bg-gold/15 border border-gold/45 text-gold text-[9px] uppercase tracking-widest font-mono font-bold rounded-full">
                          {user.tier} Tier
                        </span>
                      </div>
                      
                      <div className="border-t border-card-border pt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="p-2.5 bg-card-bg/20 rounded-xl">
                          <p className="text-[9px] uppercase text-foreground/50 tracking-wider">Loyalty Balance</p>
                          <p className="text-base font-bold font-mono text-gold mt-1">{user.loyaltyPoints} PTS</p>
                        </div>
                        <div className="p-2.5 bg-card-bg/20 rounded-xl">
                          <p className="text-[9px] uppercase text-foreground/50 tracking-wider">Contact Phone</p>
                          <p className="text-xs font-semibold font-mono mt-1.5">{user.phone || "Not Set"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Submitted Design Requests */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase font-mono tracking-widest text-gold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Submitted Design Requests ({userRequests.length})
                      </h4>

                      {userRequests.length === 0 ? (
                        <div className="p-5 border border-dashed border-card-border rounded-2xl text-center bg-card-bg/10">
                          <p className="text-xs text-foreground/50 leading-relaxed font-light">
                            You haven't submitted any custom designs yet. Launch the canvas tool on the homepage to start designing!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {userRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-4 rounded-xl border border-card-border bg-card-bg/30 text-xs space-y-2 hover:border-gold/40 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-foreground uppercase tracking-wider">{req.garmentType}</span>
                                <span className="text-[9px] font-mono text-gold-hover uppercase">{req.status.replace("_", " ")}</span>
                              </div>
                              <div className="text-[10px] text-foreground/60 space-y-1">
                                <p><strong>Specifications:</strong> {req.notes.length > 50 ? `${req.notes.substring(0, 50)}...` : req.notes}</p>
                                <p><strong>Transmitted coordinates:</strong> {req.placement} view</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // GUEST STATE: Authentication Forms
                  <div className="space-y-6">
                    {authMode === "login" ? (
                      // LOGIN FORM
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest font-mono text-foreground/50">Email Coordinate</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-foreground/40">
                              <Mail className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="email"
                              required
                              placeholder="enter your email..."
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full bg-card-bg border border-card-border text-foreground pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest font-mono text-foreground/50">Password Lock</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-foreground/40">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="password"
                              required
                              placeholder="enter your password..."
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full bg-card-bg border border-card-border text-foreground pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-3 py-3 bg-gold disabled:bg-card-border text-luxury-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold-hover hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {isSubmitting ? (
                            <span className="animate-spin h-3.5 w-3.5 border-2 border-luxury-black border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <LogIn className="w-3.5 h-3.5" /> Secure Authentication
                            </>
                          )}
                        </button>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
                            className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-gold-hover cursor-pointer"
                          >
                            Create a new bespoke account
                          </button>
                        </div>
                      </form>
                    ) : (
                      // REGISTER FORM
                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest font-mono text-foreground/50">Full Name</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-foreground/40">
                              <User className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="enter your name..."
                              value={registerName}
                              onChange={(e) => setRegisterName(e.target.value)}
                              className="w-full bg-card-bg border border-card-border text-foreground pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest font-mono text-foreground/50">Email Coordinate</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-foreground/40">
                              <Mail className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="email"
                              required
                              placeholder="enter email address..."
                              value={registerEmail}
                              onChange={(e) => setRegisterEmail(e.target.value)}
                              className="w-full bg-card-bg border border-card-border text-foreground pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest font-mono text-foreground/50">Phone Coordinate</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-foreground/40">
                              <Phone className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="enter phone coordinates..."
                              value={registerPhone}
                              onChange={(e) => setRegisterPhone(e.target.value)}
                              className="w-full bg-card-bg border border-card-border text-foreground pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest font-mono text-foreground/50">Password Lock</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-foreground/40">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="password"
                              required
                              placeholder="choose secure password..."
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              className="w-full bg-card-bg border border-card-border text-foreground pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-3 py-3 bg-gold disabled:bg-card-border text-luxury-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold-hover hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {isSubmitting ? (
                            <span className="animate-spin h-3.5 w-3.5 border-2 border-luxury-black border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" /> Generate Bespoke Account
                            </>
                          )}
                        </button>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
                            className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-gold-hover cursor-pointer"
                          >
                            Already have an account? Sign In
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-card-border bg-card-bg/10 flex justify-between items-center text-[10px] font-mono text-foreground/50">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-gold" /> Encrypted coordinates
                </span>
                
                {user && (
                  <button
                    onClick={() => { logout(); setIsDrawerOpen(false); }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
