import { Wrench, Zap, Droplets, PaintBucket, Hammer, Fence, Package, Building2 } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: any;
  productCount: number;
}

export interface Shop {
  id: string;
  name: string;
  image: string;
  categories: string[];
  distance: string;
  deliveryTime: string;
  deliveryAvailable: boolean;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  address: string;
  phone: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  description: string;
  inStock: boolean;
  category: string;
  specs?: string[];
}

export interface CartItem {
  product: Product;
  shop: Shop;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "ready_for_pickup" | "completed";
  type: "delivery" | "pickup";
  time: string;
}

export const categories: Category[] = [
  { id: "cement", name: "Cement & Construction", icon: Building2, productCount: 48 },
  { id: "bricks", name: "Bricks, Sand & Aggregates", icon: Package, productCount: 32 },
  { id: "electrical", name: "Electrical Items", icon: Zap, productCount: 65 },
  { id: "plumbing", name: "Plumbing Supplies", icon: Droplets, productCount: 41 },
  { id: "tools", name: "Hand & Power Tools", icon: Hammer, productCount: 78 },
  { id: "paint", name: "Paint & Accessories", icon: PaintBucket, productCount: 36 },
  { id: "garden", name: "Garden Tools", icon: Fence, productCount: 24 },
  { id: "hardware", name: "Hardware & Fasteners", icon: Wrench, productCount: 92 },
];

export const shops: Shop[] = [
  {
    id: "1",
    name: "Sri Lakshmi Hardware",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
    categories: ["Cement & Construction", "Hardware & Fasteners", "Plumbing Supplies"],
    distance: "0.8 km",
    deliveryTime: "30–45 min",
    deliveryAvailable: true,
    rating: 4.5,
    reviewCount: 128,
    isOpen: true,
    address: "12, Main Road, Near Bus Stand",
    phone: "+91 98765 43210",
  },
  {
    id: "2",
    name: "Balaji Electrical & Hardware",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
    categories: ["Electrical Items", "Hand & Power Tools", "Hardware & Fasteners"],
    distance: "1.2 km",
    deliveryTime: "45–60 min",
    deliveryAvailable: true,
    rating: 4.2,
    reviewCount: 86,
    isOpen: true,
    address: "45, Gandhi Nagar, 2nd Cross",
    phone: "+91 98765 43211",
  },
  {
    id: "3",
    name: "New Modern Paints",
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=300&fit=crop",
    categories: ["Paint & Accessories", "Hardware & Fasteners"],
    distance: "1.5 km",
    deliveryTime: "1–2 hrs",
    deliveryAvailable: true,
    rating: 4.7,
    reviewCount: 203,
    isOpen: true,
    address: "78, Market Street",
    phone: "+91 98765 43212",
  },
  {
    id: "4",
    name: "Raju Building Materials",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    categories: ["Cement & Construction", "Bricks, Sand & Aggregates"],
    distance: "2.1 km",
    deliveryTime: "1–2 hrs",
    deliveryAvailable: true,
    rating: 4.0,
    reviewCount: 64,
    isOpen: false,
    address: "23, Industrial Area, Ring Road",
    phone: "+91 98765 43213",
  },
  {
    id: "5",
    name: "Sai Plumbing Centre",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
    categories: ["Plumbing Supplies", "Hardware & Fasteners"],
    distance: "0.5 km",
    deliveryTime: "20–30 min",
    deliveryAvailable: false,
    rating: 4.3,
    reviewCount: 95,
    isOpen: true,
    address: "5, Temple Street",
    phone: "+91 98765 43214",
  },
];

export const products: Product[] = [
  // Sri Lakshmi Hardware
  { id: "p1", shopId: "1", name: "UltraTech Cement (OPC 53)", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop", price: 420, unit: "bag (50kg)", description: "High-quality OPC 53 grade cement for all construction needs. Ideal for RCC, plastering, and masonry work.", inStock: true, category: "cement", specs: ["Grade: OPC 53", "Weight: 50 kg", "Setting Time: 30 min", "Shelf Life: 3 months"] },
  { id: "p2", shopId: "1", name: "GI Pipe 1 inch", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop", price: 380, unit: "per 6ft piece", description: "Galvanized iron pipe, 1 inch diameter. Corrosion resistant, suitable for water supply lines.", inStock: true, category: "plumbing", specs: ["Diameter: 1 inch", "Length: 6 feet", "Material: GI", "Pressure Rating: Medium"] },
  { id: "p3", shopId: "1", name: "Door Lock (Godrej)", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", price: 850, unit: "piece", description: "Godrej Nav-tal 6 lever door lock with 3 keys. High security for main doors.", inStock: true, category: "hardware", specs: ["Brand: Godrej", "Levers: 6", "Keys: 3", "Type: Deadbolt"] },
  { id: "p4", shopId: "1", name: "TMT Steel Rod 8mm", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop", price: 62, unit: "per kg", description: "Fe 500D grade TMT reinforcement bar. Superior bendability and weldability.", inStock: true, category: "cement" },

  // Balaji Electrical
  { id: "p5", shopId: "2", name: "Havells Wire 1.5 sqmm", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", price: 1850, unit: "90m coil", description: "Havells Lifeline Plus FR-LSH cable. Flame retardant, low smoke, halogen free.", inStock: true, category: "electrical", specs: ["Brand: Havells", "Size: 1.5 sqmm", "Length: 90m", "Type: FR-LSH"] },
  { id: "p6", shopId: "2", name: "Bosch Drill Machine", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", price: 3200, unit: "piece", description: "Bosch GSB 501 Professional impact drill. 500W motor, variable speed, forward/reverse.", inStock: true, category: "tools", specs: ["Brand: Bosch", "Power: 500W", "Speed: 2800 RPM", "Chuck: 13mm"] },
  { id: "p7", shopId: "2", name: "MCB 16A Single Pole", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop", price: 145, unit: "piece", description: "Havells 16A single pole MCB. Type C curve, suitable for residential wiring.", inStock: false, category: "electrical" },
  { id: "p8", shopId: "2", name: "LED Bulb 9W (Pack of 3)", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop", price: 280, unit: "pack", description: "Philips 9W LED bulb, cool daylight. Energy efficient, long lasting.", inStock: true, category: "electrical" },

  // New Modern Paints
  { id: "p9", shopId: "3", name: "Asian Paints Apex (20L)", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=400&fit=crop", price: 4200, unit: "20L bucket", description: "Asian Paints Apex Ultima exterior emulsion. Weather-proof, anti-algal, long lasting finish.", inStock: true, category: "paint", specs: ["Brand: Asian Paints", "Type: Exterior Emulsion", "Volume: 20L", "Finish: Matt"] },
  { id: "p10", shopId: "3", name: "Paint Roller Set", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=400&fit=crop", price: 350, unit: "set", description: "9 inch paint roller with tray and handle. Suitable for all emulsion paints.", inStock: true, category: "paint" },

  // Sai Plumbing
  { id: "p11", shopId: "5", name: "CPVC Pipe 1/2 inch", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop", price: 85, unit: "per 3ft", description: "Astral CPVC pipe for hot and cold water supply. Lead-free, corrosion resistant.", inStock: true, category: "plumbing" },
  { id: "p12", shopId: "5", name: "Basin Mixer Tap", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop", price: 1450, unit: "piece", description: "Jaquar chrome finish basin mixer tap. Single lever, quarter turn ceramic disc.", inStock: true, category: "plumbing" },
];

export const vendorOrders: Order[] = [
  { id: "ORD-1001", customerName: "Ramesh K.", items: [{ name: "UltraTech Cement (OPC 53)", quantity: 10, price: 420 }, { name: "TMT Steel Rod 8mm", quantity: 50, price: 62 }], total: 7300, status: "pending", type: "delivery", time: "10 min ago" },
  { id: "ORD-1002", customerName: "Suresh M.", items: [{ name: "GI Pipe 1 inch", quantity: 4, price: 380 }, { name: "Door Lock (Godrej)", quantity: 2, price: 850 }], total: 3220, status: "confirmed", type: "pickup", time: "25 min ago" },
  { id: "ORD-1003", customerName: "Venkat R.", items: [{ name: "UltraTech Cement (OPC 53)", quantity: 20, price: 420 }], total: 8400, status: "preparing", type: "delivery", time: "1 hr ago" },
  { id: "ORD-1004", customerName: "Prasad L.", items: [{ name: "Door Lock (Godrej)", quantity: 1, price: 850 }], total: 850, status: "completed", type: "pickup", time: "3 hrs ago" },
];
