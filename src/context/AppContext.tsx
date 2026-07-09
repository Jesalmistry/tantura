"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  variants: {
    colors: { name: string; hex: string }[];
    sizes: string[];
  };
  stock: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  id: string; // unique item id (id + size + color + customId)
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: { name: string; hex: string };
  selectedSize: string;
  customDesignId?: string;
  isCustom?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "designer" | "customer";
  loyaltyPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface DesignRequest {
  id: string;
  customerId: string;
  garmentType: "T-Shirt" | "Shirt" | "Hoodie";
  garmentColor: string;
  placement: "Front" | "Back" | "Both" | "Left Chest";
  notes: string;
  canvasState?: string; // canvas state JSON or base64 data URL
  mockupUrl?: string; // designer-sent mockup
  price?: number;
  status: "submitted" | "under_review" | "chatting" | "quote_sent" | "approved" | "production" | "shipped" | "delivered";
  assignedDesignerId: string;
  designerName: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  designRequestId: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "designer";
  text: string;
  attachmentUrl?: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
  category: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: {
    productId?: string;
    customDesignId?: string;
    title: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentMethod: string;
  paymentStatus: "paid" | "unpaid";
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery: string;
  createdAt: string;
}

interface AppContextProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string, phone?: string) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  discountAmount: number;
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => boolean;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  designRequests: DesignRequest[];
  submitDesignRequest: (request: Omit<DesignRequest, "id" | "customerId" | "createdAt" | "status" | "assignedDesignerId" | "designerName">) => string;
  updateDesignStatus: (id: string, status: DesignRequest["status"], price?: number, mockupUrl?: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (designRequestId: string, text: string, attachmentUrl?: string, roleOverride?: "customer" | "designer") => void;
  orders: Order[];
  placeOrder: (paymentMethod: string, address: Address) => Order;
  blogPosts: BlogPost[];
  designers: { id: string; name: string; role: string; avatar: string }[];
  rewardPoints: number;
  loyaltyTier: string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Rich Mock Data Initializers
const initialProducts: Product[] = [
  {
    id: "p1",
    title: "Tantura Signature Oversized Hoodie",
    description: "Crafted from ultra-heavyweight 450GSM French terry cotton. Featuring a custom boxy fit, dropped shoulders, double-layered hood without drawstrings for a clean luxury look, and subtle embroidered Tantura logo on the chest. Designed to drape perfectly.",
    price: 14900,
    category: "Hoodies",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Luxury Black", hex: "#111111" },
        { name: "Soft Beige", hex: "#F5F1EB" },
        { name: "Slate Grey", hex: "#4A4A4A" }
      ],
      sizes: ["S", "M", "L", "XL"]
    },
    stock: 25,
    rating: 4.9,
    reviewsCount: 42,
    reviews: [
      { id: "r1", userName: "Julian V.", rating: 5, comment: "The weight of this hoodie is unbelievable. It hangs exactly how a premium hoodie should.", date: "2026-05-12" },
      { id: "r2", userName: "Marcus K.", rating: 5, comment: "Pure luxury. Reminds me of Fear of God style but with better tailored fit.", date: "2026-06-01" }
    ],
    isFeatured: true
  },
  {
    id: "p2",
    title: "Eclipse Utility Cargo Jacket",
    description: "Technical street-style cargo jacket made from a water-resistant ripstop nylon shell. Features matte black hardware, gold zipper accents, six utility multi-pockets, and adjustable strap sleeves. Fully lined with breathable premium mesh.",
    price: 26500,
    category: "Jackets",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Obsidian Black", hex: "#151515" },
        { name: "Military Olive", hex: "#3B4032" }
      ],
      sizes: ["M", "L", "XL"]
    },
    stock: 12,
    rating: 4.8,
    reviewsCount: 18,
    reviews: [
      { id: "r3", userName: "Ethan W.", rating: 5, comment: "Attention to detail on the buckles and pockets is flawless. Worth every penny.", date: "2026-04-20" }
    ],
    isFeatured: true
  },
  {
    id: "p3",
    title: "Minimalist Mulberry Silk Shirt",
    description: "Flowing luxury relaxed-fit button-down shirt tailored from 100% pure Mulberry Silk. Clean hidden placket, structured collar, and mother-of-pearl buttons. Provides an extremely smooth, premium feel with a subtle natural sheen.",
    price: 19900,
    category: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Ivory White", hex: "#FAFAFA" },
        { name: "Midnight Black", hex: "#111111" }
      ],
      sizes: ["S", "M", "L"]
    },
    stock: 15,
    rating: 4.7,
    reviewsCount: 11,
    reviews: [],
    isFeatured: true
  },
  {
    id: "p4",
    title: "Heavyweight Studio Box Tee",
    description: "Premium Box Tee woven from 320GSM heavy carded cotton. Strict ribbed high mock-neck collar, wide sleeves, and dropped shoulders. Features a structured drape that stays clean and resists wrinkling.",
    price: 7000,
    category: "T-Shirts",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Soft Beige", hex: "#F5F1EB" },
        { name: "Luxury Black", hex: "#111111" },
        { name: "Sage Green", hex: "#7E8F7A" }
      ],
      sizes: ["S", "M", "L", "XL"]
    },
    stock: 45,
    rating: 4.9,
    reviewsCount: 30,
    reviews: [],
    isFeatured: false
  },
  {
    id: "p5",
    title: "Fallen Angel Distressed Tee",
    description: "Vintage-washed graphic t-shirt featuring a detailed Renaissance-inspired fallen angel print on the back. Acid-washed treatment gives a worn grey tint with carefully placed distressed micro-tears on the hem and collar.",
    price: 7900,
    category: "T-Shirts",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Acid Wash Charcoal", hex: "#2C2C2C" }
      ],
      sizes: ["S", "M", "L", "XL"]
    },
    stock: 20,
    rating: 4.9,
    reviewsCount: 22,
    reviews: [],
    isFeatured: true
  },
  {
    id: "p6",
    title: "Tantura Knit Cashmere Sweater",
    description: "Luxurious heavy knit sweater crafted from an premium blend of 30% organic Cashmere and 70% Extra Fine Merino Wool. Clean dropped shoulder, structured rib knit cuffs and bottom band, and an elegant small gold emblem plate at the back collar.",
    price: 23000,
    category: "Designer Collection",
    images: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Cream Oatmeal", hex: "#EBE6DD" },
        { name: "Deep Charcoal", hex: "#292929" }
      ],
      sizes: ["S", "M", "L", "XL"]
    },
    stock: 8,
    rating: 5.0,
    reviewsCount: 8,
    reviews: [],
    isFeatured: false
  },
  {
    id: "p7",
    title: "Tantura Limitless Hooded Cloak",
    description: "A showpiece streetwear accessory featuring a draped aesthetic. Engineered with double-face wool jersey, asymmetrical front wrap, deep oversized hood, and raw clean-cut edges. Perfect for avant-garde layering.",
    price: 31500,
    category: "Limited Edition",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800"
    ],
    variants: {
      colors: [
        { name: "Luxury Black", hex: "#111111" }
      ],
      sizes: ["Oversized Fit"]
    },
    stock: 5,
    rating: 4.9,
    reviewsCount: 5,
    reviews: [],
    isFeatured: true
  }
];

const initialBlogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "The Evolution of Luxury Streetwear",
    excerpt: "How high fashion and skateboarding subcultures merged to dominate the global runways.",
    content: "Streetwear has undergone a monumental shift, evolving from a niche subculture born on the streets of California, New York, and Tokyo into the defining visual language of 21st-century luxury. Today, legacy European luxury houses like Balenciaga, Louis Vuitton, and Dior routinely collaborate with streetwear icons and adopt urban aesthetics. In this article, we trace this fascinating evolution, exploring how boxy hoodies, oversized tees, and utility cargo pants became the new luxury uniform...",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    author: "Sophia Carter",
    readTime: "5 min read",
    date: "June 25, 2026",
    category: "Trends"
  },
  {
    id: "b2",
    title: "French Terry vs. Fleece: The Heavyweight Guide",
    excerpt: "Why the fabric loop structure of premium French Terry defines high-end hoodies.",
    content: "When selecting a high-end hoodie, the type of fabric used dictates not just how warm it keeps you, but more importantly, how it drapes and breathes. Many fast-fashion brands use polyester fleece which is soft initially but pills and traps heat. In contrast, Tantura relies on high-grade 100% French Terry cotton. This guide explains the technical knit difference: the loop structure, weight grades (GSM), and how it retains its structured boxy shape through countless washes...",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    author: "Marcus Vance",
    readTime: "4 min read",
    date: "May 18, 2026",
    category: "Style Guides"
  },
  {
    id: "b3",
    title: "Crafting Custom Apparel: From Sketch to Runway",
    excerpt: "A behind-the-scenes look at how Tantura collaborates with customers to bring bespoke ideas to life.",
    content: "Bespoke fashion is no longer reserved for historic Savile Row tailors. At Tantura, we've merged custom craftsmanship with digital co-creation. When you submit an artwork or reference, it doesn't just go to a printing machine. It starts a collaborative design cycle with a professional garment designer. We discuss fabric choices, print techniques (screen-printing vs. high-density embroidery), and scale mockups until you approve the perfect piece...",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    author: "Isabella Rossi",
    readTime: "7 min read",
    date: "April 30, 2026",
    category: "Designer Stories"
  }
];

const initialDesigners = [
  { id: "d1", name: "Sophia Carter", role: "Lead Designer & Trend Analyst", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
  { id: "d2", name: "Marcus Vance", role: "Streetwear & Outerwear Specialist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
  { id: "d3", name: "Isabella Rossi", role: "Custom Graphic & Typography Designer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" }
];

const mockAddresses: Address[] = [
  {
    id: "add1",
    name: "Alex Jordan",
    street: "742 Evergreen Terrace",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    phone: "+1 (555) 234-5678",
    isDefault: true
  }
];

const defaultMockUser: User = {
  id: "u1",
  name: "Alex Jordan",
  email: "alex@ajstudio.com",
  phone: "+1 (555) 234-5678",
  role: "customer",
  loyaltyPoints: 350,
  tier: "Gold",
  addresses: mockAddresses
};

const initialDesignRequests: DesignRequest[] = [
  {
    id: "dr1",
    customerId: "u1",
    garmentType: "Hoodie",
    garmentColor: "#111111",
    placement: "Both",
    notes: "I want an oversized black hoodie with a gold metallic Japanese calligraphy design on the back and a small gold Tantura monogram on the left chest.",
    canvasState: "",
    mockupUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    price: 17430,
    status: "quote_sent",
    assignedDesignerId: "d1",
    designerName: "Sophia Carter",
    createdAt: "2026-07-01T12:00:00Z"
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: "m1",
    designRequestId: "dr1",
    senderId: "u1",
    senderName: "Alex Jordan",
    senderRole: "customer",
    text: "Hi Sophia, I just submitted my idea for the custom calligraphy hoodie. I want the gold text to look very premium, perhaps using metallic embroidery or high-density gold print.",
    timestamp: "2026-07-01T12:05:00Z"
  },
  {
    id: "m2",
    designRequestId: "dr1",
    senderId: "d1",
    senderName: "Sophia Carter",
    senderRole: "designer",
    text: "Hello Alex! I love this idea. Gold metallic embroidery would look phenomenal on our heavy 450GSM French terry black hoodie. I am working on the initial typography mockup and will send a digital draft over shortly.",
    timestamp: "2026-07-01T14:30:00Z"
  },
  {
    id: "m3",
    designRequestId: "dr1",
    senderId: "d1",
    senderName: "Sophia Carter",
    senderRole: "designer",
    text: "Here is the first mockup draft. Let me know your thoughts on the sizing and font thickness on the back.",
    attachmentUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    timestamp: "2026-07-01T17:15:00Z"
  },
  {
    id: "m4",
    designRequestId: "dr1",
    senderId: "d1",
    senderName: "Sophia Carter",
    senderRole: "designer",
    text: "I have also calculated the custom pricing sheet. The base 450GSM hoodie + detailed gold metallic embroidery work on both chest and back comes out to ₹17,430 total. You can review the quotation, let me know if we need adjustments, or click Approve Quote to begin production!",
    timestamp: "2026-07-01T17:18:00Z"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [user, setUser] = useState<User | null>(defaultMockUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [designRequests, setDesignRequests] = useState<DesignRequest[]>(initialDesignRequests);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  // Sync theme with HTML class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("aj_cart");
    const savedWishlist = localStorage.getItem("aj_wishlist");
    const savedTheme = localStorage.getItem("aj_theme");
    const savedUser = localStorage.getItem("aj_user");
    const savedOrders = localStorage.getItem("aj_orders");
    const savedDesigns = localStorage.getItem("aj_designs");
    const savedMessages = localStorage.getItem("aj_messages");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedTheme) setTheme(savedTheme as "light" | "dark");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedDesigns) setDesignRequests(JSON.parse(savedDesigns));
    if (savedMessages) setChatMessages(JSON.parse(savedMessages));
  }, []);

  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("aj_theme", newTheme);
  };

  // Auth Operations
  const login = async (email: string, passwordHash: string): Promise<boolean> => {
    // Simple simulated authentication
    if (email === "admin@ajstudio.com") {
      const adminUser: User = {
        id: "admin",
        name: "Director AJ",
        email: "admin@ajstudio.com",
        role: "admin",
        loyaltyPoints: 9999,
        tier: "Platinum",
        addresses: []
      };
      setUser(adminUser);
      saveToLocal("aj_user", adminUser);
      return true;
    }
    if (email === "designer@ajstudio.com") {
      const designerUser: User = {
        id: "d1",
        name: "Sophia Carter",
        email: "designer@ajstudio.com",
        role: "designer",
        loyaltyPoints: 0,
        tier: "Bronze",
        addresses: []
      };
      setUser(designerUser);
      saveToLocal("aj_user", designerUser);
      return true;
    }
    // Standard mock user
    const mockUser: User = {
      id: "u1",
      name: email.split("@")[0].toUpperCase() || "Guest Member",
      email: email,
      role: "customer",
      loyaltyPoints: 100,
      tier: "Bronze",
      addresses: mockAddresses
    };
    setUser(mockUser);
    saveToLocal("aj_user", mockUser);
    return true;
  };

  const register = async (name: string, email: string, phone: string, passwordHash: string): Promise<boolean> => {
    const newUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      role: "customer",
      loyaltyPoints: 50, // welcome bonus points
      tier: "Bronze",
      addresses: []
    };
    setUser(newUser);
    saveToLocal("aj_user", newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aj_user");
  };

  const updateProfile = (name: string, email: string, phone?: string) => {
    if (!user) return;
    const updated = { ...user, name, email, phone };
    setUser(updated);
    saveToLocal("aj_user", updated);
  };

  const addAddress = (address: Omit<Address, "id">) => {
    if (!user) return;
    const newAddress: Address = {
      ...address,
      id: "add_" + Math.random().toString(36).substr(2, 9)
    };
    
    let updatedAddresses = [...user.addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
    }
    updatedAddresses.push(newAddress);
    
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    saveToLocal("aj_user", updatedUser);
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    saveToLocal("aj_user", updatedUser);
  };

  // Cart Operations
  const addToCart = (item: Omit<CartItem, "id">) => {
    const itemId = `${item.productId}-${item.selectedColor.name}-${item.selectedSize}-${item.customDesignId || ""}`;
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(cartItem => cartItem.id === itemId);

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += item.quantity;
    } else {
      newCart.push({ ...item, id: itemId });
    }
    setCart(newCart);
    saveToLocal("aj_cart", newCart);
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = cart.filter(item => item.id !== cartItemId);
    setCart(newCart);
    saveToLocal("aj_cart", newCart);
  };

  const updateCartQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const newCart = cart.map(item => item.id === cartItemId ? { ...item, quantity: qty } : item);
    setCart(newCart);
    saveToLocal("aj_cart", newCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("aj_cart");
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.isCustom ? (item.product.price) : item.product.price) * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round(cartSubtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === "TANTURA10") {
      setAppliedCoupon({ code: "TANTURA10", discountPercent: 10 });
      return true;
    }
    if (formatted === "GOLDVIP" && user?.tier === "Gold") {
      setAppliedCoupon({ code: "GOLDVIP", discountPercent: 20 });
      return true;
    }
    if (formatted === "PLATINUMVIP" && user?.tier === "Platinum") {
      setAppliedCoupon({ code: "PLATINUMVIP", discountPercent: 30 });
      return true;
    }
    return false;
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    let newWishlist = [...wishlist];
    if (newWishlist.includes(productId)) {
      newWishlist = newWishlist.filter(id => id !== productId);
    } else {
      newWishlist.push(productId);
    }
    setWishlist(newWishlist);
    saveToLocal("aj_wishlist", newWishlist);
  };

  // Products Admin CRUD
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: "p_" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveToLocal("aj_products", updated);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProducts(updated);
    saveToLocal("aj_products", updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveToLocal("aj_products", updated);
  };

  // Custom Studio Design submissions
  const submitDesignRequest = (request: Omit<DesignRequest, "id" | "customerId" | "createdAt" | "status" | "assignedDesignerId" | "designerName">): string => {
    const designId = "dr_" + Math.random().toString(36).substr(2, 9);
    
    // Auto-assign random designer
    const randomDesigner = initialDesigners[Math.floor(Math.random() * initialDesigners.length)];

    const newRequest: DesignRequest = {
      ...request,
      id: designId,
      customerId: user?.id || "guest",
      createdAt: new Date().toISOString(),
      status: "submitted",
      assignedDesignerId: randomDesigner.id,
      designerName: randomDesigner.name
    };

    const updated = [newRequest, ...designRequests];
    setDesignRequests(updated);
    saveToLocal("aj_designs", updated);

    // Initial system greetings in chat
    const systemGreeting: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      designRequestId: designId,
      senderId: randomDesigner.id,
      senderName: randomDesigner.name,
      senderRole: "designer",
      text: `Hello ${user?.name || "Client"}! I have been assigned to your custom design project. I will review your files and requirements and share an initial mockup sketch and custom quotation for production shortly! Feel free to upload any extra reference screenshots or details here.`,
      timestamp: new Date().toISOString()
    };
    
    const updatedMsgs = [...chatMessages, systemGreeting];
    setChatMessages(updatedMsgs);
    saveToLocal("aj_messages", updatedMsgs);

    return designId;
  };

  const updateDesignStatus = (id: string, status: DesignRequest["status"], price?: number, mockupUrl?: string) => {
    const updated = designRequests.map(req => {
      if (req.id === id) {
        const fields: Partial<DesignRequest> = { status };
        if (price !== undefined) fields.price = price;
        if (mockupUrl !== undefined) fields.mockupUrl = mockupUrl;
        return { ...req, ...fields };
      }
      return req;
    });
    setDesignRequests(updated);
    saveToLocal("aj_designs", updated);
  };

  // Chats
  const sendChatMessage = (designRequestId: string, text: string, attachmentUrl?: string, roleOverride?: "customer" | "designer") => {
    const sender = user;
    if (!sender) return;

    const newMessage: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      designRequestId,
      senderId: roleOverride === "designer" ? "d1" : sender.id,
      senderName: roleOverride === "designer" ? "Sophia Carter" : sender.name,
      senderRole: roleOverride || (sender.role === "designer" ? "designer" : "customer"),
      text,
      attachmentUrl,
      timestamp: new Date().toISOString()
    };

    const updated = [...chatMessages, newMessage];
    setChatMessages(updated);
    saveToLocal("aj_messages", updated);

    // Auto-respond for mock interactions when customer messages
    if ((roleOverride || sender.role) === "customer") {
      setTimeout(() => {
        const activeDesign = designRequests.find(dr => dr.id === designRequestId);
        const designerName = activeDesign?.designerName || "Sophia Carter";
        const designerId = activeDesign?.assignedDesignerId || "d1";
        
        let designerResponseText = "Thanks for the feedback. I am reviewing your notes and updating the project layout. I will notify you as soon as the next update is ready!";
        
        if (text.toLowerCase().includes("quote") || text.toLowerCase().includes("cost") || text.toLowerCase().includes("price")) {
          designerResponseText = `The quotation is currently active. You can approve the design quote on the side panel, which will move the design straight to our production workflow. Let me know if you need to adjust any fabric weights or positioning before doing so!`;
        } else if (text.toLowerCase().includes("change") || text.toLowerCase().includes("modify") || text.toLowerCase().includes("revision")) {
          designerResponseText = `Got it! I am marking this for revision. I will adjust the layout placement on the garment mockup and share the revised draft with you within the next 24 hours.`;
        }

        const autoMsg: ChatMessage = {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          designRequestId,
          senderId: designerId,
          senderName: designerName,
          senderRole: "designer",
          text: designerResponseText,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => {
          const next = [...prev, autoMsg];
          saveToLocal("aj_messages", next);
          return next;
        });
      }, 2000);
    }
  };

  // Orders
  const placeOrder = (paymentMethod: string, address: Address): Order => {
    const orderItems = cart.map(item => ({
      productId: item.isCustom ? undefined : item.productId,
      customDesignId: item.isCustom ? item.customDesignId : undefined,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor.name,
      image: item.product.images[0]
    }));

    // Calculate delivery date (7 days from now)
    const delDate = new Date();
    delDate.setDate(delDate.getDate() + 7);

    const newOrder: Order = {
      id: "ORD_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerId: user?.id || "guest",
      items: orderItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      status: "pending",
      paymentMethod,
      paymentStatus: "paid",
      shippingAddress: address,
      trackingNumber: "TRK" + Math.floor(100000000 + Math.random() * 900000000),
      estimatedDelivery: delDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveToLocal("aj_orders", updated);

    // Give loyalty reward points (1 point per ₹800 spent)
    if (user) {
      const earnedPoints = Math.floor(cartTotal / 800);
      const newPoints = user.loyaltyPoints + earnedPoints;
      
      // Tier upgrades
      let tier = user.tier;
      if (newPoints >= 1000) tier = "Platinum";
      else if (newPoints >= 500) tier = "Gold";
      else if (newPoints >= 200) tier = "Silver";

      const updatedUser = { ...user, loyaltyPoints: newPoints, tier };
      setUser(updatedUser);
      saveToLocal("aj_user", updatedUser);
    }

    // If order has custom designs, mark their status as 'production'
    cart.forEach(item => {
      if (item.isCustom && item.customDesignId) {
        updateDesignStatus(item.customDesignId, "production");
      }
    });

    clearCart();
    return newOrder;
  };

  // Loyalty Stats
  const rewardPoints = user ? user.loyaltyPoints : 0;
  const loyaltyTier = user ? user.tier : "Bronze";

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        cartTotal,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        wishlist,
        toggleWishlist,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        designRequests,
        submitDesignRequest,
        updateDesignStatus,
        chatMessages,
        sendChatMessage,
        orders,
        placeOrder,
        blogPosts: initialBlogPosts,
        designers: initialDesigners,
        rewardPoints,
        loyaltyTier
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
