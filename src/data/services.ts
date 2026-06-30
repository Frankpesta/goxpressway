export interface ServiceData {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  accent: string;
  description: string;
  longDescription: string;
  features: string[];
  price: string;
  deliveryTime: string;
}

export const SERVICES: Record<string, ServiceData> = {
  express: {
    slug: "express",
    name: "Express Delivery",
    tagline: "Delivered in 1–2 business days",
    icon: "Zap",
    accent: "#d97706",
    description:
      "When time is critical, our Express Delivery service moves your package to the front of the queue.",
    longDescription:
      "GOxpress Way Express is our fastest domestic and international service, designed for time-sensitive shipments. Every Express parcel receives priority handling at every stage — from pickup to doorstep — backed by real-time SMS and email updates so both sender and receiver always know where their package is.",
    features: [
      "1–2 business day guaranteed delivery",
      "Priority pickup within 2 hours of booking",
      "Real-time SMS + email notifications",
      "Dedicated express courier team",
      "Full shipment insurance included",
      "Proof of delivery with digital signature",
    ],
    price: "From $29.99",
    deliveryTime: "1–2 business days",
  },
  standard: {
    slug: "standard",
    name: "Standard Shipping",
    tagline: "Reliable delivery in 3–5 business days",
    icon: "Package",
    accent: "#2563eb",
    description:
      "Our most popular service — affordable, reliable, and fully tracked from pickup to delivery.",
    longDescription:
      "GOxpress Way Standard is the ideal balance between cost and speed. Your package is collected, processed through our global hub network, and delivered within 3–5 business days with complete end-to-end tracking. Perfect for regular business shipments, e-commerce orders, and personal packages.",
    features: [
      "3–5 business day delivery",
      "Full tracking with live map updates",
      "Flexible pickup scheduling",
      "Insurance up to $500 included",
      "Weekend delivery available",
      "Contactless delivery option",
    ],
    price: "From $9.99",
    deliveryTime: "3–5 business days",
  },
  freight: {
    slug: "freight",
    name: "Freight Services",
    tagline: "Large cargo solutions by land, sea & air",
    icon: "Truck",
    accent: "#16a34a",
    description:
      "Purpose-built for oversized, heavy, or bulk cargo that needs specialist handling and documentation.",
    longDescription:
      "GOxpress Way Freight handles the heavy lifting — from consolidated LCL sea freight to full charter air cargo and overland trucking across continents. Our freight specialists manage all customs paperwork, dangerous goods declarations, and special handling requirements so your cargo arrives safely and on schedule.",
    features: [
      "Sea freight (LCL & FCL)",
      "Air freight & charter options",
      "Overland trucking & intermodal",
      "Customs brokerage & documentation",
      "Hazardous and oversized cargo clearance",
      "Dedicated account manager",
    ],
    price: "Custom quote",
    deliveryTime: "Varies by route",
  },
  international: {
    slug: "international",
    name: "International Shipping",
    tagline: "Reach 50+ countries with a single booking",
    icon: "Globe",
    accent: "#7c3aed",
    description:
      "Cross borders with confidence — door-to-door international delivery with full customs handling.",
    longDescription:
      "GOxpress Way International connects businesses and individuals to a worldwide network spanning 50+ countries. We handle import/export documentation, duties calculation, and last-mile delivery in the destination country through our network of trusted local partners. Whether you're shipping to the next continent or across the world, we make it seamless.",
    features: [
      "Delivery to 50+ countries worldwide",
      "Import & export customs clearance",
      "Duties & tax calculation upfront",
      "Multi-language tracking page",
      "Last-mile delivery via local partners",
      "UN-certified dangerous goods handling",
    ],
    price: "From $49.99",
    deliveryTime: "3–14 business days",
  },
};

export const SERVICE_LIST = Object.values(SERVICES);
