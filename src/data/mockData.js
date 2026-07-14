export const CATEGORIES = [
  { id: 'men', name: 'Men', icon: '👔', sub: ['Shirts', 'T-Shirts', 'Jeans', 'Jackets'] },
  { id: 'women', name: 'Women', icon: '👗', sub: ['Dresses', 'Tops', 'Kurtis', 'Sarees'] },
  { id: 'kids', name: 'Kids', icon: '🧒', sub: ['Boys', 'Girls', 'Infants'] },
  { id: 'accessories', name: 'Accessories', icon: '👜', sub: ['Bags', 'Belts', 'Caps'] },
  { id: 'footwear', name: 'Footwear', icon: '👟', sub: ['Sneakers', 'Formal', 'Sandals'] },
  { id: 'sports', name: 'Sportswear', icon: '🏃', sub: ['Activewear', 'Track pants'] },
]

export const PRODUCTS = [
  {
    id: 'p1',
    title: 'Aqua Linen Shirt',
    brand: 'Coastline',
    price: 1299,
    mrp: 1999,
    category: 'men',
    rating: 4.6,
    reviews: 128,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Teal', 'White', 'Navy'],
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    bestseller: true,
    description: 'Breathable linen blend shirt for all-day comfort.',
  },
  {
    id: 'p2',
    title: 'Midnight Denim Jacket',
    brand: 'UrbanEdge',
    price: 2499,
    mrp: 3499,
    category: 'men',
    rating: 4.8,
    reviews: 86,
    sizes: ['M', 'L', 'XL'],
    colors: ['Indigo', 'Black'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    bestseller: true,
    description: 'Classic denim jacket with modern fit.',
  },
  {
    id: 'p3',
    title: 'Florale Summer Dress',
    brand: 'Bloom',
    price: 1899,
    mrp: 2599,
    category: 'women',
    rating: 4.7,
    reviews: 214,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Coral', 'Mint'],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    bestseller: true,
    description: 'Flowy floral print dress perfect for weekends.',
  },
  {
    id: 'p4',
    title: 'Essential Cotton Tee',
    brand: 'Basics+',
    price: 599,
    mrp: 899,
    category: 'men',
    rating: 4.4,
    reviews: 512,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Teal', 'Grey'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    bestseller: false,
    description: 'Soft combed cotton everyday tee.',
  },
  {
    id: 'p5',
    title: 'Silk Touch Kurti',
    brand: 'Heritage',
    price: 1599,
    mrp: 2199,
    category: 'women',
    rating: 4.5,
    reviews: 97,
    sizes: ['S', 'M', 'L'],
    colors: ['Emerald', 'Maroon'],
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop',
    bestseller: true,
    description: 'Elegant kurti with soft silk-touch fabric.',
  },
  {
    id: 'p6',
    title: 'Trail Runner Sneakers',
    brand: 'Stride',
    price: 3299,
    mrp: 4499,
    category: 'footwear',
    rating: 4.9,
    reviews: 64,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Grey/Teal', 'Black'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    bestseller: true,
    description: 'Lightweight cushioned sneakers for daily runs.',
  },
  {
    id: 'p7',
    title: 'Kids Adventure Tee',
    brand: 'PlayDay',
    price: 449,
    mrp: 699,
    category: 'kids',
    rating: 4.3,
    reviews: 41,
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    colors: ['Yellow', 'Blue'],
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
    bestseller: false,
    description: 'Durable soft tee for active kids.',
  },
  {
    id: 'p8',
    title: 'Canvas Tote Bag',
    brand: 'CarryCo',
    price: 799,
    mrp: 1199,
    category: 'accessories',
    rating: 4.6,
    reviews: 155,
    sizes: ['One Size'],
    colors: ['Natural', 'Teal'],
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a67478a?w=400&h=500&fit=crop',
    bestseller: false,
    description: 'Spacious eco canvas tote for everyday carry.',
  },
]

export const BANNERS = [
  {
    id: 'b1',
    title: 'Summer Flash Sale',
    subtitle: 'Up to 50% off on linen & cottons',
    cta: 'Shop Now',
    tone: 'teal',
  },
  {
    id: 'b2',
    title: 'New Season Drop',
    subtitle: 'Fresh arrivals just delivered',
    cta: 'Explore',
    tone: 'slate',
  },
  {
    id: 'b3',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹999 today',
    cta: 'Order Now',
    tone: 'mint',
  },
]

export const ADDRESSES = [
  {
    id: 'a1',
    label: 'Home',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    line: '42 Palm Grove Apt, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    default: true,
  },
  {
    id: 'a2',
    label: 'Work',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    line: '8th Floor, Teal Tower, MG Road',
    city: 'Bengaluru',
    pincode: '560001',
    default: false,
  },
]

export const ORDERS = [
  {
    id: 'ORD-20481',
    date: '12 Jul 2026',
    items: [{ title: 'Aqua Linen Shirt', brand: 'Coastline', qty: 1, price: 1299 }],
    amount: 1429,
    payment: 'UPI',
    status: 'Out for Delivery',
    eta: '25 mins',
    steps: ['Placed', 'Packed', 'Picked Up', 'Out for Delivery', 'Delivered'],
    stepIndex: 3,
  },
  {
    id: 'ORD-20412',
    date: '05 Jul 2026',
    items: [
      { title: 'Florale Summer Dress', brand: 'Bloom', qty: 1, price: 1899 },
      { title: 'Canvas Tote Bag', brand: 'CarryCo', qty: 1, price: 799 },
    ],
    amount: 2898,
    payment: 'Card',
    status: 'Delivered',
    eta: null,
    steps: ['Placed', 'Packed', 'Picked Up', 'Out for Delivery', 'Delivered'],
    stepIndex: 4,
  },
]

export const VENDOR_ORDERS = [
  {
    id: 'VO-881',
    customer: 'Rahul Mehta',
    phone: '+91 90000 11111',
    address: '12 Lake View, Koramangala',
    items: [
      { title: 'Aqua Linen Shirt', qty: 2, size: 1299 },
      { title: 'Essential Cotton Tee', qty: 1, price: 599 },
    ],
    status: 'New',
    total: 3197,
  },
  {
    id: 'VO-880',
    customer: 'Ananya Das',
    phone: '+91 90000 22222',
    address: '88 Green Park, HSR',
    items: [{ title: 'Midnight Denim Jacket', qty: 1, price: 2499 }],
    status: 'Ongoing',
    total: 2499,
    stage: 'Packed',
  },
  {
    id: 'VO-872',
    customer: 'Vikram Rao',
    phone: '+91 90000 33333',
    address: '3 Palm Street, Whitefield',
    items: [{ title: 'Trail Runner Sneakers', qty: 1, price: 3299 }],
    status: 'Delivered',
    total: 3299,
    stage: 'Delivered',
  },
]

export const VENDOR_ITEMS = [
  {
    id: 'vi1',
    title: 'Aqua Linen Shirt',
    category: 'Men / Shirts',
    price: 1299,
    size: 'S-XL',
    color: 'Teal',
    stock: true,
    active: true,
    image: PRODUCTS[0].image,
  },
  {
    id: 'vi2',
    title: 'Essential Cotton Tee',
    category: 'Men / T-Shirts',
    price: 599,
    size: 'S-XXL',
    color: 'Multi',
    stock: true,
    active: true,
    image: PRODUCTS[3].image,
  },
  {
    id: 'vi3',
    title: 'Midnight Denim Jacket',
    category: 'Men / Jackets',
    price: 2499,
    size: 'M-XL',
    color: 'Indigo',
    stock: false,
    active: true,
    image: PRODUCTS[1].image,
  },
]

export const DRIVER_REQUESTS = [
  {
    id: 'DR-441',
    shop: 'Coastline Boutique',
    shopAddr: 'Indiranagar 100 Feet Rd',
    customer: 'Priya Sharma',
    dropAddr: '42 Palm Grove Apt',
    items: 3,
    distance: '4.2 km',
    earn: 85,
    status: 'Incoming',
  },
]

export const ADMIN_CUSTOMERS = [
  { id: 'C01', name: 'Priya Sharma', email: 'priya@mail.com', phone: '9876543210', orders: 12, status: 'Active' },
  { id: 'C02', name: 'Rahul Mehta', email: 'rahul@mail.com', phone: '9000011111', orders: 7, status: 'Active' },
  { id: 'C03', name: 'Ananya Das', email: 'ananya@mail.com', phone: '9000022222', orders: 3, status: 'Inactive' },
]

export const ADMIN_VENDORS = [
  { id: 'V01', name: 'Coastline Boutique', owner: 'Suresh K', docs: 'Approved', status: 'Active', sales: '₹2.4L' },
  { id: 'V02', name: 'Bloom Closet', owner: 'Meera P', docs: 'Pending', status: 'Pending', sales: '₹0' },
  { id: 'V03', name: 'Stride Foot Co', owner: 'Arjun N', docs: 'Approved', status: 'Active', sales: '₹1.1L' },
]

export const ADMIN_DRIVERS = [
  { id: 'D01', name: 'Kiran P', phone: '9888877777', vehicle: 'Bike · KA01AB1234', kyc: 'Verified', zone: 'East', status: 'Active' },
  { id: 'D02', name: 'Ravi S', phone: '9777766666', vehicle: 'Scooter · KA03CD5678', kyc: 'Pending', zone: 'South', status: 'Pending' },
  { id: 'D03', name: 'Imran A', phone: '9666655555', vehicle: 'Bike · KA05EF9012', kyc: 'Verified', zone: 'Central', status: 'Suspended' },
]

export const COUPONS = [
  { id: 'cp1', code: 'TEAL100', type: 'Flat ₹100', min: 999, limit: 2, expires: '31 Aug 2026', active: true },
  { id: 'cp2', code: 'SUMMER20', type: '20% off', min: 1499, limit: 1, expires: '15 Aug 2026', active: true },
  { id: 'cp3', code: 'FREESHIP', type: 'Free delivery', min: 499, limit: 5, expires: '30 Sep 2026', active: false },
]

export function formatINR(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}
