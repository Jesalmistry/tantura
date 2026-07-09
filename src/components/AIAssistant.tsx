"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, X, Send, User, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  recommendedProducts?: string[]; // IDs of products to recommend
}

export const AIAssistant: React.FC = () => {
  const { products } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-init",
      sender: "ai",
      text: "Welcome to Tantura. I am your AI Fashion Assistant. Ask me for outfit pairings, sizing help, or streetwear style recommendations!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let replyText = "That sounds intriguing! For a sophisticated luxury street look, I recommend layering an oversized hoodie with a tactical cargo jacket and keeping accessories minimal.";
      let recommendations: string[] = [];

      const query = text.toLowerCase();

      if (query.includes("hoodie") || query.includes("sweatshirt")) {
        replyText = "Our signature French Terry hoodies pair beautifully with slim fit jeans or technical cargo vests. French Terry provides a heavy boxy structure that holds its drape.";
        const hoodie = products.find(p => p.category === "Hoodies");
        if (hoodie) recommendations.push(hoodie.id);
      } else if (query.includes("shirt") || query.includes("formal") || query.includes("silk")) {
        replyText = "For high-end events or modern draping, our Minimalist Silk Shirt is exceptional. Pair it with structured trousers and premium leather boots.";
        const shirt = products.find(p => p.category === "Shirts");
        if (shirt) recommendations.push(shirt.id);
      } else if (query.includes("jacket") || query.includes("coat") || query.includes("outerwear")) {
        replyText = "Outerwear defines the silhouette of luxury streetwear. The Eclipse Utility Cargo Jacket offers rain resistance and an avant-garde pocket design.";
        const jacket = products.find(p => p.category === "Jackets");
        if (jacket) recommendations.push(jacket.id);
      } else if (query.includes("size") || query.includes("fit") || query.includes("oversized")) {
        replyText = "Tantura garments are tailored with an intentional boxy, dropped-shoulder aesthetic. If you prefer a true-to-size standard fit, we recommend sizing down one level. If you love the streetwear silhouette, order your standard size!";
      } else if (query.includes("summer") || query.includes("hot") || query.includes("warm")) {
        replyText = "For summer heat, stick to our 320GSM Heavyweight Box Tees. High-weight cotton is counter-intuitively cooler because it stands off the skin, encouraging airflow.";
        const tee = products.find(p => p.category === "T-Shirts" && p.title.includes("Box"));
        if (tee) recommendations.push(tee.id);
      } else if (query.includes("outfit") || query.includes("pair") || query.includes("recommend")) {
        replyText = "Here is a curated outfit combination: The Fallen Angel Distressed Tee layered under the Eclipse Utility Cargo Jacket, matching with soft neutral tones.";
        const tee = products.find(p => p.id === "p5");
        const jacket = products.find(p => p.id === "p2");
        if (tee) recommendations.push(tee.id);
        if (jacket) recommendations.push(jacket.id);
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg-ai-" + Date.now(),
          sender: "ai",
          text: replyText,
          recommendedProducts: recommendations.length > 0 ? recommendations : undefined
        }
      ]);
    }, 1500);
  };

  const quickPrompts = [
    "Suggest a complete outfit",
    "Pairings for black hoodie",
    "How does the sizing work?",
    "Show new summer wear"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gold text-luxury-black shadow-lg hover:shadow-gold/20 flex items-center justify-center cursor-pointer border border-gold"
        aria-label="Toggle AI Assistant"
      >
        <Sparkles className="w-6 h-6 animate-pulse-slow" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="absolute bottom-18 right-0 w-80 sm:w-96 h-[500px] glass rounded-2xl border border-card-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-card-border bg-luxury-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase">Style Assistant</h3>
                  <p className="text-[10px] text-gray-400 font-light">Online & Ready to Design</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-gold" />
                    </div>
                  )}
                  <div className="max-w-[75%] space-y-2">
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-gold text-luxury-black font-semibold rounded-tr-none" 
                        : "bg-card-bg border border-card-border text-foreground rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>

                    {/* Recommend Cards inside Chat */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {msg.recommendedProducts.map((pId) => {
                          const prod = products.find(p => p.id === pId);
                          if (!prod) return null;
                          return (
                            <Link 
                              key={pId}
                              href={`/shop/${pId}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-xl bg-card-bg border border-gold/30 hover:border-gold hover:bg-card-hover transition-all"
                            >
                              <div className="w-12 h-14 bg-luxury-light-gray dark:bg-luxury-gray rounded-lg overflow-hidden flex-shrink-0">
                                <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-foreground font-semibold uppercase truncate">{prod.title}</p>
                                <p className="text-[10px] text-gold font-bold mt-0.5">₹{prod.price.toLocaleString('en-IN')}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gold" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div className="p-3 bg-card-bg border border-card-border rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={scrollToBottom} />
            </div>

            {/* Quick Prompts Panel */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-card-border flex flex-wrap gap-1.5 bg-card-bg/20">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] bg-card-bg hover:bg-gold-light/20 hover:text-gold border border-card-border text-foreground/80 px-2.5 py-1.5 rounded-full transition-all cursor-pointer font-light"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Panel */}
            <div className="p-4 border-t border-card-border flex items-center gap-2 bg-card-bg/10">
              <input
                type="text"
                placeholder="Ask your fashion consultant..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(inputValue);
                }}
                className="flex-1 bg-card-bg border border-card-border text-foreground px-4 py-2.5 rounded-full text-xs focus:outline-none focus:border-gold"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="p-2.5 rounded-full bg-gold hover:bg-gold-hover text-luxury-black transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
