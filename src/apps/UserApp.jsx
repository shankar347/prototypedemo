import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Bell,
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Star,
  LogOut,
  Settings,
  Package,
  CreditCard,
  ChevronRight,
  X,
  Heart,
  Filter,
  Grid2X2,
  Camera,
  Mic,
  Zap,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Clock3,
  LocateFixed,
  Shirt,
  Footprints,
  Gem,
  CheckCircle2,
  ShoppingBag,
  Store,
  Shield,
  Award,
  RotateCcw,
  HelpCircle,
  Ruler,
  ChevronUp,
  Compass,
} from 'lucide-react'
import { PhoneShell, BottomNav, GeometricAccent, Stars, BrandLogo } from '../components/ui'
import { useApp } from '../context/AppContext'
import {
  BANNERS,
  CATEGORIES,
  QUICK_CATEGORIES,
  COMBOS,
  BRANDS,
  COUPONS,
  FEATURED_SHOPS,
  WEAR_CATEGORIES,
  DARK_STORE_CATEGORIES,
  PRODUCT_REVIEWS,
  SIZE_CHARTS,
  getProductSpecGrid,
  formatINR,
} from '../data/mockData'
import './userApp.css'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'categories', label: 'Categories', icon: Grid2X2 },
  { id: 'search', label: 'Discover', icon: Compass },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
]

const FASHION_CATEGORIES = [
  { id: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&h=500&fit=crop' },
  { id: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop' },
  { id: 'footwear', name: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' },
  { id: 'fragrances', name: 'Fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop' },
  { id: 'accessories', name: 'Handbags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop' },
  { id: 'oversized', name: 'Oversized', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop' },
  { id: 'streetwear', name: 'Streetwear', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500&h=500&fit=crop' },
  { id: 'ethnic', name: 'Ethnic', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=500&fit=crop' },
  { id: 'sports', name: 'Activewear', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop' },
  { id: 'kids', name: 'Kids', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop' },
  { id: 'luxury', name: 'Luxury', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop' },
]

const HERO_BANNERS = [
  {
    title: 'Wear it tonight.',
    copy: 'Latest drops, styled and delivered before your plans begin.',
    cta: 'Explore collections',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&h=720&fit=crop',
  },
  {
    title: 'Streetwear, right now.',
    copy: 'Fresh oversized fits and sneakers delivered while the trend is still hot.',
    cta: 'Shop new drops',
    category: 'streetwear',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1000&h=720&fit=crop',
  },
  {
    title: 'The finishing touch.',
    copy: 'Statement bags, scents and details that transform tonight’s look.',
    cta: 'Discover accessories',
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=1000&h=720&fit=crop',
  },
  {
    title: 'Step out sooner.',
    copy: 'Fresh pairs from nearby stores, at your door in under an hour.',
    cta: 'Shop sneakers',
    category: 'footwear',
    image: 'https://images.unsplash.com/photo-1554139844-af2fc8ad3a3a?w=1000&h=720&fit=crop',
  },
]

const CAMPAIGN_BANNERS = [
  {
    title: 'The new drop',
    copy: 'Trending streetwear',
    offer: 'MIN. 55% OFF',
    category: 'streetwear',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=520&fit=crop',
  },
  {
    title: 'Sole searching',
    copy: 'Sneakers & statement shoes',
    offer: 'UP TO 60% OFF',
    category: 'footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=520&fit=crop',
  },
  {
    title: 'Carry your mood',
    copy: 'Bags for every plan',
    offer: 'FROM ₹799',
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=520&fit=crop',
  },
  {
    title: 'A scent of you',
    copy: 'Signature fragrances',
    offer: 'UP TO 45% OFF',
    category: 'fragrances',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&h=520&fit=crop',
  },
  {
    title: 'Modern heritage',
    copy: 'Ethnic fits, reimagined',
    offer: 'UP TO 50% OFF',
    category: 'ethnic',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&h=520&fit=crop',
  },
  {
    title: 'After-dark edit',
    copy: 'Premium evening layers',
    offer: 'FROM ₹1,499',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&h=520&fit=crop',
  },
]

const TIMED_DEAL_BANNERS = [
  {
    title: 'Midnight scent sale',
    copy: 'Luxury fragrances',
    offer: 'UP TO 45% OFF',
    category: 'fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&h=520&fit=crop',
  },
  {
    title: 'The bag event',
    copy: 'Carry the latest',
    offer: 'FROM ₹799',
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&h=520&fit=crop',
  },
  {
    title: 'Occasion ready',
    copy: 'Modern ethnic edit',
    offer: 'MIN. 40% OFF',
    category: 'ethnic',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&h=520&fit=crop',
  },
  {
    title: 'After-hours heels',
    copy: 'Party pairs delivered fast',
    offer: 'UP TO 50% OFF',
    category: 'footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&h=520&fit=crop',
  },
]

const POPUP_OFFERS = [
  {
    label: 'APP-ONLY FLASH SALE',
    title: 'Tonight’s looks,\nprices gone soon.',
    copy: 'Up to 60% off selected new-season fashion.',
    category: 'streetwear',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=760&h=520&fit=crop',
  },
  {
    label: 'SNEAKER HOUR',
    title: 'Fresh pairs.\nFast prices.',
    copy: 'Extra markdowns on sneakers available near you.',
    category: 'footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=760&h=520&fit=crop',
  },
  {
    label: 'ACCESSORY DROP',
    title: 'Finish the look\nfor less.',
    copy: 'Limited prices on bags, watches and fragrances.',
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=760&h=520&fit=crop',
  },
]

const CATEGORY_COLLECTIONS = [
  {
    title: 'Trending fashion edits',
    items: [
      { name: 'Shirts', query: 'shirt', category: 'men', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=260&h=260&fit=crop' },
      { name: 'Dresses', query: 'dress', category: 'women', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=260&h=260&fit=crop' },
      { name: 'Oversized', query: '', category: 'oversized', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=260&h=260&fit=crop' },
      { name: 'Streetwear', query: '', category: 'streetwear', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=260&h=260&fit=crop' },
      { name: 'Ethnic wear', query: '', category: 'ethnic', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=260&h=260&fit=crop' },
      { name: 'Activewear', query: '', category: 'sports', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=260&h=260&fit=crop' },
    ],
  },
  {
    title: 'Footwear style ups',
    items: [
      { name: 'Sneakers', query: 'sneakers', category: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=260&h=260&fit=crop' },
      { name: 'Heels & flats', query: 'heels', category: 'footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=260&h=260&fit=crop' },
      { name: 'Sandals', query: '', category: 'footwear', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=260&h=260&fit=crop' },
      { name: 'Sports shoes', query: 'runner', category: 'footwear', image: 'https://images.unsplash.com/photo-1554139844-af2fc8ad3a3a?w=260&h=260&fit=crop' },
      { name: 'Court shoes', query: 'court', category: 'footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=260&h=260&fit=crop' },
      { name: 'Party heels', query: 'midnight', category: 'footwear', image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=260&h=260&fit=crop' },
    ],
  },
]

const FASHION_OFFERS = [
  { name: 'Ethnic Wear', offer: '50–80% OFF', category: 'ethnic', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=420&h=520&fit=crop' },
  { name: 'Casual Wear', offer: '40–80% OFF', category: 'men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=420&h=520&fit=crop' },
  { name: "Men's Activewear", offer: '30–70% OFF', category: 'sports', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=420&h=520&fit=crop' },
  { name: "Women's Activewear", offer: '30–70% OFF', category: 'sports', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=420&h=520&fit=crop' },
  { name: 'Western Wear', offer: '40–80% OFF', category: 'women', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=420&h=520&fit=crop' },
  { name: 'Sneakers', offer: '30–60% OFF', category: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=420&h=520&fit=crop' },
]

const GENDER_EDITS = {
  him: [
    { name: 'Shirts', price: 349, category: 'men', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=360&h=420&fit=crop' },
    { name: 'T-shirts', price: 299, category: 'oversized', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=360&h=420&fit=crop' },
    { name: 'Bottoms', price: 499, category: 'men', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=360&h=420&fit=crop' },
    { name: 'Footwear', price: 249, category: 'footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=360&h=420&fit=crop' },
    { name: 'Backpacks', price: 249, category: 'accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=360&h=420&fit=crop' },
  ],
  her: [
    { name: 'Dresses', price: 399, category: 'women', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=360&h=420&fit=crop' },
    { name: 'Topwear', price: 249, category: 'women', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=360&h=420&fit=crop' },
    { name: 'Ethnic', price: 499, category: 'ethnic', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=360&h=420&fit=crop' },
    { name: 'Footwear', price: 249, category: 'footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=360&h=420&fit=crop' },
    { name: 'Accessories', price: 199, category: 'accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=360&h=420&fit=crop' },
  ],
}

const DARK_STORE_HERO_BANNERS = [
  {
    title: 'Try before you decide.',
    copy: 'Pick up to 3 styles, try at home, and pay only for what you keep.',
    cta: 'Explore Try & Buy',
    category: 'ethnic-wear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&h=720&fit=crop',
  },
  {
    title: 'Dark Store drops.',
    copy: 'Premium occasion wear from top shops, delivered in under an hour.',
    cta: 'Shop party wear',
    category: 'party-wear',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&h=720&fit=crop',
  },
  {
    title: 'New saree collection.',
    copy: 'Handpicked silks and festive weaves from stores near you.',
    cta: 'Explore sarees',
    category: 'sarees',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&h=720&fit=crop',
  },
]

const FASHION_CATEGORY_IDS = ['men', 'women', 'kids', 'accessories', 'footwear', 'fragrances', 'sports', 'oversized', 'streetwear', 'ethnic', 'luxury']

const TRY_BUY_DELIVERY_POINTS = [
  'Look for Try & Buy eligible products in your cart.',
  'Our delivery partner will bring the products and you can try them at your doorstep.',
  'Only pay for the items you keep — no additional Try & Buy charges.',
  'Return what you do not like on the spot with no extra fees.',
]

const EXPRESS_DELIVERY_POINTS = [
  'Our delivery partner will deliver the products at your location.',
  'Exchange/returns allowed up to 7 days from date of delivery.',
]

const TRY_BUY_HOW_IT_WORKS = [
  { step: '1', title: 'Add Try & Buy items', copy: 'Choose up to 3 Dark Store products marked with Try & Buy and add them to your bag.' },
  { step: '2', title: 'Select Try & Buy delivery', copy: 'At checkout, pick the Try & Buy delivery option — no extra charges for trying at your doorstep.' },
  { step: '3', title: 'Try at home', copy: 'Our delivery partner brings the items. Try them on comfortably at home within the delivery window.' },
  { step: '4', title: 'Pay only for what you keep', copy: 'Keep what you love and pay only for those items. Return the rest on the spot with no additional fees.' },
]

const PAGE_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

const formatCountdown = (seconds) => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export default function UserApp() {
  const ctx = useApp()
  const [tab, setTab] = useState('home')
  const [screen, setScreen] = useState(ctx.user ? 'home' : 'login')
  const [stack, setStack] = useState([])
  const [splashDone, setSplashDone] = useState(false)

  const completeSplash = () => setSplashDone(true)

  const go = (next, push = true) => {
    if (push && screen !== next) setStack((s) => [...s, screen])
    setScreen(next)
    if (['home', 'categories', 'search', 'wishlist', 'cart', 'profile'].includes(next)) setTab(next)
  }

  const back = () => {
    setStack((s) => {
      const prev = s[s.length - 1]
      if (prev) {
        setScreen(prev)
        if (['home', 'categories', 'search', 'wishlist', 'cart', 'profile'].includes(prev)) setTab(prev)
        return s.slice(0, -1)
      }
      setScreen('home')
      setTab('home')
      return s
    })
  }

  const onNav = (id) => {
    setStack([])
    setTab(id)
    setScreen(id)
  }

  useEffect(() => {
    if (!ctx.user && screen !== 'login' && screen !== 'otp') {
      setScreen('login')
    }
  }, [ctx.user, screen])

  const showNav = ctx.user && ['home', 'categories', 'search', 'wishlist'].includes(screen)

  return (
    <PhoneShell
      className="fashion-app"
      overlay={ctx.toast ? <div className="toast">{ctx.toast}</div> : null}
      nav={
        showNav ? (
          <BottomNav
            items={NAV}
            active={tab}
            onChange={onNav}
          />
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          {...PAGE_MOTION}
          className="fashion-page"
          style={{ opacity: splashDone ? 1 : 0, pointerEvents: splashDone ? 'auto' : 'none' }}
        >
          {screen === 'login' && <LoginScreen onSend={() => go('otp', false)} />}
          {screen === 'otp' && (
            <OtpScreen
              onBack={() => setScreen('login')}
              onVerify={(phone) => {
                ctx.setUser({ name: 'Priya Sharma', phone, email: 'priya@mail.com' })
                go('home', false)
                setStack([])
              }}
            />
          )}
          {screen === 'home' && <HomeScreen go={go} splashDone={splashDone} />}
          {screen === 'categories' && <CategoriesScreen go={go} />}
          {screen === 'search' && <SearchScreen go={go} />}
          {screen === 'wishlist' && <WishlistScreen go={go} />}
          {screen === 'cart' && <CartScreen go={go} />}
          {screen === 'checkout' && <CheckoutScreen go={go} back={back} />}
          {screen === 'profile' && <ProfileScreen go={go} />}
          {screen === 'orders' && <OrdersScreen go={go} back={back} />}
          {screen === 'orderDetail' && <OrderDetailScreen go={go} back={back} />}
          {screen === 'addresses' && <AddressesScreen back={back} />}
          {screen === 'product' && <ProductScreen go={go} back={back} />}
          {screen === 'shop' && <ShopScreen go={go} back={back} />}
          {screen === 'notifications' && <NotificationsScreen back={back} />}
          {screen === 'settings' && <SettingsScreen back={back} />}
          {screen === 'review' && <ReviewScreen back={back} />}
          {screen === 'success' && (
            <SuccessScreen
              onDone={() => {
                setStack([])
                go('orders', false)
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {!splashDone && <SplashIntro onComplete={completeSplash} />}
    </PhoneShell>
  )
}

function AppHeader({ title, onBack, right, showLogo = true, eta }) {
  return (
    <header className="fashion-subheader">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
      ) : showLogo ? (
        <img src="/logo.png" alt="KudiCart" className="fashion-subheader-logo" />
      ) : (
        <span style={{ width: 38 }} />
      )}
      <h1>{title || 'KudiCart'}</h1>
      {eta ? <span className="fashion-subheader-eta">{eta}</span> : right}
    </header>
  )
}

const HEADER_SHOP_CATEGORIES = [
  { id: 'for-you', name: 'For You', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=500&fit=crop' },
  { id: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop' },
  { id: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&h=500&fit=crop' },
  { id: 'ethnic', name: 'Ethnic', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=500&fit=crop' },
  { id: 'beauty', name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop' },
]

function DeliveryHeader({ go, activeCategory = 'for-you', onCategoryChange, showBrandLogo = true }) {
  const ctx = useApp()
  const address = ctx.selectedAddress
  const addressLabel = address?.label?.toLowerCase() || 'home'
  const locationLine = address
    ? `${address.line.split(',')[0]}, ${address.city}`
    : 'Choose delivery location'
  const isDarkStore = ctx.storeMode === 'darkstore'
  const deliveryMins = isDarkStore ? '45' : '30'

  const handleCategory = (categoryId) => {
    onCategoryChange?.(categoryId)
    if (categoryId === 'for-you') return
    sessionStorage.setItem('searchCat', categoryId)
    go('search')
  }

  return (
    <header className="fashion-header fashion-header-slikk">
      <motion.div
        className="fashion-header-delivery-row"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {showBrandLogo && (
          <img src="/logo.png" alt="KudiCart" className="fashion-header-brand-logo" />
        )}
        <div className="fashion-delivery-badge" aria-label={`Delivered in ${deliveryMins} minutes`}>
          <strong>{deliveryMins}</strong>
          <span>Mins</span>
        </div>
        <button type="button" className="fashion-location-slikk" onClick={() => go('addresses')}>
          <strong>{addressLabel}:</strong> {locationLine} <ChevronRight size={14} />
        </button>
        <button type="button" className="fashion-profile-btn" onClick={() => go('profile')} aria-label="Profile">
          <User size={20} />
        </button>
      </motion.div>

      <motion.div
        className="fashion-header-search-row"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <button type="button" className="fashion-search fashion-search-inline" onClick={() => go('search')}>
          <Search size={18} />
          <span>{isDarkStore ? 'Search sarees, party wear, ethnic…' : 'Search for "Dresses"'}</span>
        </button>
        <button
          type="button"
          className={`fashion-trybuy-cta${isDarkStore ? ' active' : ''}`}
          onClick={() => ctx.setStoreMode(isDarkStore ? 'fashion' : 'darkstore')}
        >
          TRY & BUY
        </button>
      </motion.div>

      <motion.div
        className="fashion-header-category-rail"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {HEADER_SHOP_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`fashion-header-category-chip${activeCategory === category.id ? ' active' : ''}`}
            onClick={() => handleCategory(category.id)}
          >
            <span><img src={category.image} alt="" /></span>
            <small>{category.name}</small>
          </button>
        ))}
      </motion.div>
    </header>
  )
}

function HomePromoStrip() {
  return (
    <div className="fashion-promo-strip">
      <div className="fashion-promo-strip-left">
        <ShoppingBag size={15} />
        <span>GET <strong>₹200 OFF*</strong> on your first 3 orders</span>
      </div>
      <div className="fashion-promo-strip-right">
        <span><strong>FREE DELIVERY</strong> on ethnic & accessories</span>
      </div>
    </div>
  )
}

function HomeServiceRow() {
  return (
    // <div className="fashion-service-row">
    //   <div>
    //     <Clock3 size={17} />
    //     <span>60 Min Delivery</span>
    //   </div>
    //   <div>
    //     <Shirt size={17} />
    //     <span>Try & Buy</span>
    //   </div>
    //   <div>
    //     <RotateCcw size={17} />
    //     <span>Instant Refund</span>
    //   </div>
    // </div>
    <div></div>
  )
}

function ViewCartPill({ go }) {
  const ctx = useApp()
  if (!ctx.cartCount) return null
  const thumbs = ctx.cart.slice(0, 2)

  return (
    <button type="button" className="fashion-view-cart-pill" onClick={() => go('cart')}>
      <span className="fashion-view-cart-thumbs">
        {thumbs.map((item) => (
          <img key={item.product.id} src={item.product.image} alt="" />
        ))}
      </span>
      <span className="fashion-view-cart-copy">
        <strong>View Cart</strong>
        <small>{ctx.cartCount} Item{ctx.cartCount > 1 ? 's' : ''}</small>
      </span>
    </button>
  )
}

function LocationGate({ go, onDismiss }) {
  return (
    <div className="fashion-location-gate">
      <div className="fashion-location-gate-card">
        <MapPin size={28} color="var(--fashion-accent)" />
        <h3>Choose your delivery location</h3>
        <p>Select an address to see products and delivery times available near you. We won&apos;t change your location without your confirmation.</p>
        <button type="button" className="fashion-primary" onClick={() => go('addresses')}>Select location</button>
        {onDismiss && (
          <button type="button" className="fashion-secondary" style={{ marginTop: 10, width: '100%' }} onClick={onDismiss}>
            Use saved address
          </button>
        )}
      </div>
    </div>
  )
}

function SareeBanner({ onExplore }) {
  return (
    <button type="button" className="fashion-saree-banner" onClick={onExplore}>
      <Sparkles size={16} />
      <span><strong>New Saree Collection Available</strong> · Explore now</span>
      <ArrowRight size={16} />
    </button>
  )
}

function SplashIntro({ onComplete }) {
  const [phase, setPhase] = useState('intro')

  useEffect(() => {
    const growTimer = window.setTimeout(() => setPhase('grow'), 280)
    const holdTimer = window.setTimeout(() => setPhase('hold'), 900)
    const exitTimer = window.setTimeout(() => setPhase('exit'), 1500)
    const doneTimer = window.setTimeout(onComplete, 1950)
    return () => {
      window.clearTimeout(growTimer)
      window.clearTimeout(holdTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete])

  const logoMotion = {
    intro: { opacity: 1, scale: 0.42, width: 112, height: 112 },
    grow: { opacity: 1, scale: 1.08, width: 112, height: 112 },
    hold: { opacity: 1, scale: 1, width: 112, height: 112 },
    exit: { opacity: 0, scale: 1.18, width: 112, height: 112 },
  }

  return (
    <motion.div
      className="fashion-splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: phase === 'exit' ? 0.4 : 0 }}
      aria-hidden={phase === 'exit'}
    >
      <motion.div
        className="fashion-splash-bg"
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.img
        src="/logo.png"
        alt="KudiCart"
        className="fashion-splash-logo fashion-splash-logo-center"
        initial={{ opacity: 0, scale: 0.28, top: '46%', left: '50%', x: '-50%', y: '-50%', width: 112, height: 112 }}
        animate={{
          ...logoMotion[phase],
          top: '46%',
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
        transition={{
          duration: phase === 'grow' ? 0.7 : phase === 'exit' ? 0.4 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      {(phase === 'grow' || phase === 'hold') && (
        <motion.div
          className="fashion-splash-copy"
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <strong>KudiCart</strong>
          <span>Fashion · Try & Buy at your doorstep</span>
        </motion.div>
      )}
    </motion.div>
  )
}

function ModalSheet({ title, onClose, children }) {
  return (
    <div className="fashion-modal-backdrop" onClick={onClose} role="presentation">
      <motion.div
        className="fashion-modal-sheet"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="fashion-modal-head">
          <strong>{title}</strong>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="fashion-modal-body">{children}</div>
      </motion.div>
    </div>
  )
}

function SizeChartModal({ chartType, onClose }) {
  const chart = SIZE_CHARTS[chartType] || SIZE_CHARTS.women
  return (
    <ModalSheet title={chart.title} onClose={onClose}>
      <p className="fashion-size-note">{chart.note}</p>
      <div className="fashion-size-table-wrap">
        <table className="fashion-size-table">
          <thead>
            <tr>{chart.headers.map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row.join('-')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fashion-size-tip">Tip: If you are between sizes, we recommend choosing the larger size for ethnic and party wear.</p>
    </ModalSheet>
  )
}

function HowItWorksModal({ onClose }) {
  return (
    <ModalSheet title="How Try & Buy Works" onClose={onClose}>
      <div className="fashion-how-steps">
        {TRY_BUY_HOW_IT_WORKS.map((item) => (
          <div key={item.step} className="fashion-how-step">
            <span>{item.step}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </ModalSheet>
  )
}

function TrustIconsRow({ showTryBuy = false }) {
  const items = [
    { icon: Shield, label: 'Secure Payments' },
    { icon: Award, label: 'Genuine Product' },
    ...(showTryBuy ? [{ icon: Shirt, label: 'Try & Buy' }] : []),
    { icon: RotateCcw, label: showTryBuy ? 'Doorstep Trial' : '7 Day Return' },
  ]
  return (
    <div className="fashion-trust-row">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="fashion-trust-item">
          <span><Icon size={16} /></span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  )
}

function ProductSpecTabs({ product, selectedSize, isTryBuy }) {
  const [tab, setTab] = useState('specifications')
  const [expanded, setExpanded] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const specGrid = getProductSpecGrid(product, selectedSize)
  const visibleSpecs = expanded ? specGrid : specGrid.slice(0, 9)

  return (
    <>
      <TrustIconsRow showTryBuy={isTryBuy} />
      <div className="fashion-spec-tabs">
        <div className="fashion-spec-tab-head">
          <button type="button" className={tab === 'specifications' ? 'active' : ''} onClick={() => setTab('specifications')}>
            Specifications
          </button>
          <button type="button" className={tab === 'description' ? 'active' : ''} onClick={() => setTab('description')}>
            Description
          </button>
        </div>
        {tab === 'specifications' ? (
          <>
            <div className="fashion-spec-grid">
              {visibleSpecs.map((item) => (
                <div key={item.label} className="fashion-spec-cell">
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            {specGrid.length > 9 && (
              <button type="button" className="fashion-spec-toggle" onClick={() => setExpanded((value) => !value)}>
                {expanded ? 'View Less' : 'View More'} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </>
        ) : (
          <div className="fashion-spec-description">
            <p>{product.description}</p>
            {Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <ul>
                {product.specifications.map((spec) => <li key={spec}>{spec}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
      {(product.sizes?.length > 0 || isTryBuy) && (
        <button type="button" className="fashion-size-chart-btn" onClick={() => setShowSizeChart(true)}>
          <Ruler size={16} /> Size chart / Measurement chart
        </button>
      )}
      {(product.productCode || product.manufacturer) && (
        <div className="fashion-manufacturer-card">
          {product.productCode && <div><small>Product Code</small><strong>{product.productCode}</strong></div>}
          {product.originCountry && <div><small>Origin Country</small><strong>{product.originCountry}</strong></div>}
          {product.manufacturer && (
            <div className="full">
              <small>Manufactured By</small>
              <strong>{product.manufacturer}</strong>
            </div>
          )}
        </div>
      )}
      <AnimatePresence>
        {showSizeChart && (
          <SizeChartModal chartType={product.sizeChartType || 'women'} onClose={() => setShowSizeChart(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function DeliveryOptionSection({ ctx, setShowHowItWorks }) {
  const canTryBuy = ctx.hasTryBuyItems

  return (
    <div className="fashion-checkout-block">
      <div className="fashion-checkout-label">Delivery option</div>
      {canTryBuy && (
        <button
          type="button"
          className={`fashion-delivery-option ${ctx.deliveryOption === 'trybuy' ? 'active' : ''}`}
          onClick={() => ctx.setDeliveryOption('trybuy')}
        >
          <div className="fashion-delivery-option-head">
            <span className={`fashion-radio ${ctx.deliveryOption === 'trybuy' ? 'checked' : ''}`} />
            <strong>Try & Buy</strong>
          </div>
          <ul>
            {TRY_BUY_DELIVERY_POINTS.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <button
            type="button"
            className="fashion-how-btn"
            onClick={(event) => {
              event.stopPropagation()
              setShowHowItWorks(true)
            }}
          >
            <HelpCircle size={16} /> How It Works?
          </button>
        </button>
      )}
      <button
        type="button"
        className={`fashion-delivery-option ${ctx.deliveryOption === 'express' ? 'active' : ''}`}
        onClick={() => ctx.setDeliveryOption('express')}
      >
        <div className="fashion-delivery-option-head">
          <span className={`fashion-radio ${ctx.deliveryOption === 'express' ? 'checked' : ''}`} />
          <strong>EXPRESS</strong>
        </div>
        <ul>
          {EXPRESS_DELIVERY_POINTS.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </button>
    </div>
  )
}

function TryBuyPolicyBlock() {
  return null
}

function LoginScreen({ onSend }) {
  const [phone, setPhone] = useState('')
  return (
    <div
      className="fashion-auth"
      style={{
        minHeight: '100%',
        height: '100%',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GeometricAccent position="tr" size={160} />
      <GeometricAccent position="bl" size={120} />
      <div style={{ padding: '72px 28px 48px', position: 'relative', zIndex: 1, flex: 1 }} className="fade-in">
        <Link to="/" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>← All apps</Link>
        <div style={{ margin: '28px 0 12px' }}>
          <BrandLogo size={64} withName />
        </div>
        <div className="fashion-auth-promise"><Zap size={13} fill="currentColor" /> Premium fashion in 30–60 mins</div>
        <p style={{ color: 'var(--muted)', marginBottom: 36, lineHeight: 1.5 }}>
          Your next outfit is closer than you think. Sign in to shop styles available near you.
        </p>
        <div className="field" style={{ marginBottom: 20 }}>
          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={14}
          />
        </div>
        <button
          type="button"
          className="fashion-primary"
          disabled={phone.replace(/\D/g, '').length < 10}
          onClick={onSend}
          style={{ opacity: phone.replace(/\D/g, '').length < 10 ? 0.5 : 1, width: '100%', minHeight: 52 }}
        >
          Get OTP
        </button>
        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}

function OtpScreen({ onBack, onVerify }) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const code = otp.join('')
  return (
    <div
      className="fashion-auth fade-in"
      style={{
        minHeight: '100%',
        height: '100%',
        flex: 1,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GeometricAccent position="tr" size={140} />
      <GeometricAccent position="bl" size={100} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <button type="button" onClick={onBack} style={{ color: 'var(--slate)', marginBottom: 32 }}>
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--slate)' }}>Verify OTP</h2>
        <p style={{ color: 'var(--muted)', margin: '8px 0 28px' }}>Enter the 4-digit code sent to your mobile</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          {otp.map((d, i) => (
            <input
              key={i}
              value={d}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(-1)
                const next = [...otp]
                next[i] = v
                setOtp(next)
                if (v && e.target.nextSibling) e.target.nextSibling.focus()
              }}
              style={{
                width: 56,
                height: 56,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                border: '1.5px solid var(--line)',
                borderRadius: 12,
                outline: 'none',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="fashion-primary"
          disabled={code.length < 4}
          style={{ opacity: code.length < 4 ? 0.5 : 1, width: '100%', minHeight: 52 }}
          onClick={() => onVerify('+91 98765 43210')}
        >
          Verify & Continue
        </button>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
          Demo tip: enter any 4 digits
        </p>
      </div>
    </div>
  )
}

function HomeScreen({ go, splashDone = true }) {
  const ctx = useApp()
  const isDarkStore = ctx.storeMode === 'darkstore'
  const [heroIndex, setHeroIndex] = useState(0)
  const [campaignIndex, setCampaignIndex] = useState(0)
  const [timedDealIndex, setTimedDealIndex] = useState(0)
  const [saleSeconds, setSaleSeconds] = useState(14 * 60 + 32)
  const [showLaunchOffer, setShowLaunchOffer] = useState(false)
  const [popupOfferIndex, setPopupOfferIndex] = useState(0)
  const [showLocationGate, setShowLocationGate] = useState(false)
  const [headerCategory, setHeaderCategory] = useState('for-you')

  const fashionProducts = ctx.fashionProducts
  const darkStoreProducts = ctx.darkStoreProducts
  const activeProducts = isDarkStore ? darkStoreProducts : fashionProducts
  const heroBanners = isDarkStore ? DARK_STORE_HERO_BANNERS : HERO_BANNERS
  const categoryList = isDarkStore ? DARK_STORE_CATEGORIES : WEAR_CATEGORIES

  const byIds = (...ids) => ids.map((id) => activeProducts.find((item) => item.id === id)).filter(Boolean)
  const openProduct = (product) => {
    ctx.trackRecentlyViewed(product)
    sessionStorage.setItem('pid', product.id)
    go('product')
  }
  const openShop = (shopId) => {
    sessionStorage.setItem('shopId', shopId)
    go('shop')
  }
  const quickAdd = (product) => {
    ctx.addToCart(
      product,
      product.sizes?.[0] || 'Standard',
      product.colors?.[0] || 'Standard',
      1,
    )
  }
  const buyNow = (product) => {
    quickAdd(product)
    go('cart')
  }
  const browseCategory = (category, query = '') => {
    sessionStorage.setItem('searchCat', category)
    if (query) sessionStorage.setItem('searchQuery', query)
    go('search')
  }
  const viewed = ctx.recentlyViewed.filter((p) => (isDarkStore ? p.belongsToDarkStore : !p.belongsToDarkStore))
  const viewedFallback = isDarkStore ? byIds('ds1', 'ds2', 'ds5') : byIds('p3', 'p6', 'p9')
  const continueShopping = ctx.cart.length
    ? ctx.cart.map((item) => item.product).filter((p) => (isDarkStore ? p.belongsToDarkStore : !p.belongsToDarkStore))
    : isDarkStore ? byIds('ds1', 'ds4') : byIds('p1', 'p5', 'p10')
  const activeHero = heroBanners[heroIndex]
  const activePopupOffer = POPUP_OFFERS[popupOfferIndex]

  useEffect(() => {
    setHeroIndex(0)
    setCampaignIndex(0)
    setTimedDealIndex(0)
  }, [isDarkStore])

  useEffect(() => {
    if (!ctx.locationReady) setShowLocationGate(true)
  }, [ctx.locationReady])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroBanners.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [heroBanners.length])

  useEffect(() => {
    if (isDarkStore) return undefined
    const timer = window.setInterval(() => {
      setCampaignIndex((current) => (current + 1) % CAMPAIGN_BANNERS.length)
    }, 3800)
    return () => window.clearInterval(timer)
  }, [isDarkStore])

  useEffect(() => {
    if (isDarkStore) return undefined
    const timer = window.setInterval(() => {
      setTimedDealIndex((current) => (current + 1) % TIMED_DEAL_BANNERS.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [isDarkStore])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSaleSeconds((current) => (current > 0 ? current - 1 : 15 * 60))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isDarkStore) return undefined
    const nextOffer = Number(sessionStorage.getItem('fashionPopupRotation') || 0) % POPUP_OFFERS.length
    setPopupOfferIndex(nextOffer)
    sessionStorage.setItem('fashionPopupRotation', String((nextOffer + 1) % POPUP_OFFERS.length))
    const timer = window.setTimeout(() => setShowLaunchOffer(true), 700)
    return () => window.clearTimeout(timer)
  }, [isDarkStore])

  return (
    <div className="fashion-page">
      <DeliveryHeader go={go} activeCategory={headerCategory} onCategoryChange={setHeaderCategory} showBrandLogo={splashDone} />
      {showLocationGate && !ctx.locationReady && <LocationGate go={go} />}
      <main className="fashion-main fashion-main-slikk">
        <HomePromoStrip />
        <HomeServiceRow />
        <motion.section
          className="fashion-hero"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              className="fashion-hero-slide"
              key={activeHero.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <img src={activeHero.image} alt="" />
              <div className="fashion-hero-content">
                <h1>{activeHero.title}</h1>
                <p>{activeHero.copy}</p>
                <motion.button
                  type="button"
                  className="fashion-primary"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -2 }}
                  onClick={() => browseCategory(activeHero.category)}
                >
                  {activeHero.cta} <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="fashion-hero-dots" aria-label="Featured collections">
            {heroBanners.map((banner, index) => (
              <button
                type="button"
                key={banner.title}
                className={index === heroIndex ? 'active' : ''}
                onClick={() => setHeroIndex(index)}
                aria-label={`Show ${banner.title}`}
              />
            ))}
          </div>
        </motion.section>

        <SareeBanner onExplore={() => browseCategory(isDarkStore ? 'sarees' : 'ethnic-wear')} />

        <FashionSection title={isDarkStore ? 'Top shops · Dark Store' : 'Top shops'} subtitle="Popular fashion stores near you">
          <div className="fashion-shop-rail">
            {FEATURED_SHOPS.map((shop) => (
              <motion.button
                type="button"
                key={shop.id}
                className="fashion-shop-card"
                whileTap={{ scale: 0.96 }}
                onClick={() => openShop(shop.id)}
              >
                <span><img src={shop.logo} alt="" loading="lazy" /></span>
                <strong>{shop.name}</strong>
              </motion.button>
            ))}
          </div>
        </FashionSection>

        <FashionSection title="Shop by category" subtitle={isDarkStore ? 'Dark Store categories' : 'Fashion categories for every occasion'} action="See all" onAction={() => go('categories')}>
          <div className="fashion-category-grid">
            {categoryList.map((category, index) => (
              <motion.button
                key={category.id}
                type="button"
                className="fashion-category-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -4 }}
                onClick={() => browseCategory(category.id)}
              >
                <img src={category.image} alt="" loading="lazy" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </FashionSection>

        {!isDarkStore && (
          <>
            <FashionSection title="Biggest fashion offers" subtitle="Top edits at prices worth rushing for">
              <div className="fashion-offer-rail">
                {FASHION_OFFERS.map((offer) => (
                  <motion.button
                    type="button"
                    className="fashion-offer-card"
                    key={offer.name}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => browseCategory(offer.category)}
                  >
                    <img src={offer.image} alt={offer.name} loading="lazy" />
                    <span>{offer.name}</span>
                    <strong>{offer.offer}</strong>
                    <small>Shop now</small>
                  </motion.button>
                ))}
              </div>
            </FashionSection>

            <FashionSection title="Fresh campaigns" subtitle="New edits rolling in all day">
              <div className="fashion-campaign-slider">
                <div className="fashion-campaign-track" style={{ transform: `translateX(-${campaignIndex * 100}%)` }}>
                  {CAMPAIGN_BANNERS.map((banner) => (
                    <button type="button" className="fashion-campaign-slide" key={banner.title} onClick={() => browseCategory(banner.category)}>
                      <img src={banner.image} alt="" loading="lazy" />
                      <span><small>{banner.copy}</small><strong>{banner.title}</strong><b>{banner.offer}</b></span>
                    </button>
                  ))}
                </div>
                <div className="fashion-campaign-dots">
                  {CAMPAIGN_BANNERS.map((banner, index) => (
                    <button type="button" key={banner.title} className={index === campaignIndex ? 'active' : ''} onClick={() => setCampaignIndex(index)} aria-label={`Show ${banner.title}`} />
                  ))}
                </div>
              </div>
            </FashionSection>

            {CATEGORY_COLLECTIONS.map((collection) => (
              <FashionSection key={collection.title} title={collection.title} subtitle="Tap a style to shop the edit">
                <div className="fashion-mini-category-rail">
                  {collection.items.map((item) => (
                    <motion.button type="button" key={item.name} whileTap={{ scale: 0.96 }} onClick={() => browseCategory(item.category, item.query)}>
                      <span><img src={item.image} alt="" loading="lazy" /></span>
                      <strong>{item.name}</strong>
                    </motion.button>
                  ))}
                </div>
              </FashionSection>
            ))}

            {Object.entries(GENDER_EDITS).map(([audience, edits]) => (
              <FashionSection
                key={audience}
                title={audience === 'him' ? 'Men' : 'Women'}
                subtitle={`${audience === 'him' ? "Men's" : "Women's"} fashion, ready nearby`}
                action="See all"
                onAction={() => browseCategory(audience === 'him' ? 'men' : 'women')}
              >
                <div className="fashion-edit-rail">
                  {edits.map((edit) => (
                    <motion.button type="button" className="fashion-edit-card" key={edit.name} whileTap={{ scale: 0.96 }} onClick={() => browseCategory(edit.category)}>
                      <span className="fashion-edit-image"><img src={edit.image} alt="" loading="lazy" /></span>
                      <strong>{edit.name}</strong>
                      <small>FROM <b>{formatINR(edit.price)}</b></small>
                    </motion.button>
                  ))}
                </div>
              </FashionSection>
            ))}

            <ProductRail title="Trending now" subtitle="What Chennai is wearing today" products={byIds('p9', 'p11', 'p12', 'p10')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <ProductRail title="Sneaker station" subtitle="Fresh pairs, delivered before you step out" products={byIds('p6', 'p11', 'p19', 'p20')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <FashionSection title="Deals on the clock" subtitle="New image, new offer — every few seconds">
              <div className="fashion-campaign-slider fashion-timed-slider">
                <div className="fashion-campaign-track" style={{ transform: `translateX(-${timedDealIndex * 100}%)` }}>
                  {TIMED_DEAL_BANNERS.map((banner) => (
                    <button type="button" className="fashion-campaign-slide fashion-timed-slide" key={banner.title} onClick={() => browseCategory(banner.category)}>
                      <img src={banner.image} alt="" loading="lazy" />
                      <span><small>{banner.copy}</small><strong>{banner.title}</strong><b>{banner.offer}</b><em><Clock3 size={12} /> Ends in {formatCountdown(saleSeconds)}</em></span>
                    </button>
                  ))}
                </div>
                <div className="fashion-campaign-dots">
                  {TIMED_DEAL_BANNERS.map((banner, index) => (
                    <button type="button" key={banner.title} className={index === timedDealIndex ? 'active' : ''} onClick={() => setTimedDealIndex(index)} aria-label={`Show ${banner.title}`} />
                  ))}
                </div>
              </div>
            </FashionSection>
            <ProductRail title="Scents in sixty" subtitle="Signature fragrances from stores nearby" products={byIds('p17', 'p21', 'p23')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <ProductRail title="New arrivals" subtitle="Fresh drops, just landed" products={byIds('p12', 'p13', 'p15', 'p14')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <ProductRail title="Best sellers" subtitle="Most loved, rarely in stock" products={fashionProducts.filter((item) => item.bestseller).slice(0, 5)} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <ProductRail title="Flash deals" subtitle={`Sale refreshes in ${formatCountdown(saleSeconds)}`} products={byIds('p4', 'p9', 'p13', 'p8')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} badge="Limited time" />
            <ProductRail title="Under ₹999" subtitle="Big style, easy price" products={fashionProducts.filter((item) => item.price < 1000).slice(0, 5)} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <FashionSection title="Premium brands" subtitle="Elevated labels, express delivered" action="View edit" onAction={() => go('search')}>
              <div className="fashion-brand-grid">
                {byIds('p14', 'p16', 'p2', 'p12').map((product) => (
                  <motion.button key={product.id} type="button" className="fashion-brand-card" whileTap={{ scale: 0.97 }} onClick={() => openProduct(product)}>
                    <img src={product.image} alt="" loading="lazy" />
                    <strong>{product.brand}</strong>
                  </motion.button>
                ))}
              </div>
            </FashionSection>
          </>
        )}

        {isDarkStore && (
          <>
            <ProductRail title="Try & Buy picks" subtitle="Try at home · Pay only if you keep · Max 3 items" products={darkStoreProducts.slice(0, 4)} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} badge="Try & Buy" />
            <ProductRail title="Saree collection" subtitle="New festive weaves from top shops" products={byIds('ds1', 'ds6')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <ProductRail title="Party wear" subtitle="Occasion-ready styles delivered fast" products={byIds('ds2', 'ds5')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
            <ProductRail title="Everyday dark store" subtitle="Formal, casual and ethnic edits" products={byIds('ds3', 'ds4', 'ds6')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
          </>
        )}

        <ProductRail title="Recently viewed" subtitle="Pick up where you left off" products={viewed.length ? viewed : viewedFallback} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
        <ProductRail title="Continue shopping" subtitle="Your edit is waiting" products={continueShopping} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />
        <ProductRail title="Recommended for you" subtitle="Personal picks, available nearby" products={isDarkStore ? byIds('ds2', 'ds4', 'ds5', 'ds1') : byIds('p10', 'p11', 'p15', 'p5')} ctx={ctx} onOpen={openProduct} onQuickAdd={quickAdd} onBuyNow={buyNow} />

        <footer className="fashion-footer">
          <strong>KudiCart</strong>
          {isDarkStore ? 'Dark Store fashion with Try & Buy from shops near you.' : 'Premium fashion from stores near you, delivered in 30–60 minutes.'}
          <br />Authentic products · Easy returns · Live delivery tracking
        </footer>
      </main>
      <AnimatePresence>
        {!isDarkStore && showLaunchOffer && (
          <motion.div
            className="fashion-offer-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="fashion-offer-popup"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 260, damping: 23 }}
            >
              <button type="button" className="fashion-popup-close" onClick={() => setShowLaunchOffer(false)} aria-label="Close offer">
                <X size={18} />
              </button>
              <div className="fashion-popup-image">
                <img src={activePopupOffer.image} alt="" />
                <span>JUST DROPPED</span>
              </div>
              <div className="fashion-popup-copy">
                <small>{activePopupOffer.label}</small>
                <h2>
                  {activePopupOffer.title.split('\n').map((line, index) => (
                    <span key={line}>{line}{index === 0 && <br />}</span>
                  ))}
                </h2>
                <p>{activePopupOffer.copy}</p>
                <div className="fashion-popup-timer">
                  <Clock3 size={17} />
                  <span>Offer ends in</span>
                  <strong>{formatCountdown(saleSeconds)}</strong>
                </div>
                <button
                  type="button"
                  className="fashion-primary"
                  onClick={() => {
                    setShowLaunchOffer(false)
                    browseCategory(activePopupOffer.category)
                  }}
                >
                  Shop limited-time sale <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ViewCartPill go={go} />
    </div>
  )
}

function FashionSection({ title, subtitle, action, onAction, children }) {
  return (
    <section className="fashion-section">
      <div className="fashion-section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <button type="button" onClick={onAction}>{action}</button>}
      </div>
      {children}
    </section>
  )
}

function ProductRail({ title, subtitle, products, ctx, onOpen, onQuickAdd, onBuyNow, badge }) {
  if (!products?.length) return null
  return (
    <FashionSection title={title} subtitle={subtitle} action="See all">
      <div className="fashion-rail">
        {products.map((product, index) => (
          <FashionProductCard
            key={`${title}-${product.id}`}
            product={product}
            ctx={ctx}
            index={index}
            onOpen={() => onOpen(product)}
            onAddToCart={() => onQuickAdd(product)}
            onBuyNow={() => (onBuyNow ? onBuyNow(product) : onQuickAdd(product))}
            badge={badge}
          />
        ))}
      </div>
    </FashionSection>
  )
}

function FashionProductCard({ product, ctx, onOpen, onAddToCart, onBuyNow, index = 0, badge }) {
  const wished = ctx.wishlist.some((item) => item.id === product.id)
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const deliveryMins = 22 + ((index + product.id.length) % 4) * 3
  const showTryBuy = product.belongsToDarkStore === true
  const displayPrice = showTryBuy ? (product.tryAndBuyPrice || product.price) : product.price

  return (
    <motion.article
      className="fashion-product"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, delay: index * 0.035 }}
    >
      <div className="fashion-product-image" onClick={onOpen} role="button" tabIndex={0}>
        <img src={product.image} alt={product.title} loading="lazy" />
        <span className="fashion-delivery-chip"><Zap size={11} fill="currentColor" /> {deliveryMins} mins</span>
        {showTryBuy && <span className="fashion-trybuy-badge">Try & Buy</span>}
        {badge && !showTryBuy && <span className="fashion-kicker" style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>{badge}</span>}
      </div>
      <button
        type="button"
        className="fashion-wishlist"
        onClick={() => ctx.toggleWishlist(product)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={17} fill={wished ? '#e11d48' : 'none'} color={wished ? '#e11d48' : 'currentColor'} />
      </button>
      <div className="fashion-product-copy">
        <div className="fashion-product-brand">{product.brand}</div>
        <div className="fashion-product-name" onClick={onOpen}>{product.title}</div>
        <div className="fashion-product-rating"><Star size={11} fill="#111114" /> {product.rating} ({product.reviews})</div>
        <div className="fashion-price-row">
          <strong>{formatINR(displayPrice)}</strong>
          <del>{formatINR(product.mrp)}</del>
          <span>{discount}% off</span>
        </div>
        <div className="fashion-card-actions">
          <motion.button type="button" className="fashion-card-buy" whileTap={{ scale: 0.96 }} onClick={onBuyNow}>Buy Now</motion.button>
          <motion.button type="button" className="fashion-card-add" whileTap={{ scale: 0.96 }} onClick={onAddToCart}>Add to Cart</motion.button>
        </div>
      </div>
    </motion.article>
  )
}

function LegacyHomeScreen({ go }) {
  const ctx = useApp()
  const [banner, setBanner] = useState(0)
  const bestsellers = ctx.products.filter((p) => p.bestseller)

  useEffect(() => {
    const t = setInterval(() => setBanner((b) => (b + 1) % BANNERS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const b = BANNERS[banner]
  const bestElectronics = ctx.products
    .filter((p) => p.category === 'electronics')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
  const bestGroceries = ctx.products
    .filter((p) => p.category === 'groceries')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

  return (
    <div className="fade-in">
      <AppHeader
        right={
          <button type="button" onClick={() => go('notifications')} style={{ color: 'white', position: 'relative' }}>
            <Bell size={22} />
            <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ffd166', borderRadius: '50%' }} />
          </button>
        }
      />
      <div style={{ padding: 16 }}>
        <button
          type="button"
          onClick={() => go('search')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'white',
            border: '1.5px solid var(--line)',
            borderRadius: 14,
            padding: '14px 16px',
            color: 'var(--muted)',
            marginBottom: 16,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Search size={18} /> Search products, brands…
        </button>

        <div
          className="card"
          style={{
            padding: 0,
            marginBottom: 18,
            position: 'relative',
            overflow: 'hidden',
            minHeight: 148,
            border: 'none',
          }}
        >
          <img
            src={b.image}
            alt={b.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, rgba(15,36,56,0.82) 0%, rgba(15,36,56,0.45) 55%, rgba(15,36,56,0.2) 100%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, padding: '18px 16px 14px', color: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{b.title}</h3>
            <p style={{ opacity: 0.92, marginBottom: 12, fontSize: 13 }}>{b.subtitle}</p>
            <button
              type="button"
              className="btn"
              style={{
                height: 34,
                padding: '0 14px',
                background: 'white',
                color: 'var(--slate)',
                fontSize: 12,
                borderRadius: 10,
              }}
              onClick={() => go('search')}
            >
              {b.cta}
            </button>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              {BANNERS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i === banner ? 16 : 6,
                    height: 6,
                    borderRadius: 99,
                    background: i === banner ? 'white' : 'rgba(255,255,255,0.45)',
                    transition: 'width 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <SectionTitle title="Quick commerce" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            marginBottom: 20,
          }}
        >
          {QUICK_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                sessionStorage.setItem('searchCat', c.cat)
                go('search')
              }}
              style={{
                background: 'white',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '8px 4px 10px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {c.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    fontSize: 8,
                    fontWeight: 700,
                    background: '#ff6b6b',
                    color: 'white',
                    borderRadius: 6,
                    padding: '2px 4px',
                  }}
                >
                  {c.badge}
                </span>
              )}
              <img
                src={c.image}
                alt={c.name}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200&h=200&fit=crop'
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  objectFit: 'cover',
                  margin: '0 auto 6px',
                  display: 'block',
                }}
              />
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--slate)', lineHeight: 1.25 }}>{c.name}</div>
            </button>
          ))}
        </div>

        <SectionTitle title="Combo deals" action="View all" onAction={() => go('search')} />
        <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 18 }}>
          {COMBOS.map((combo) => (
            <button
              key={combo.id}
              type="button"
              className="card"
              onClick={() => go('search')}
              style={{
                flex: '0 0 auto',
                width: 220,
                padding: 0,
                overflow: 'hidden',
                textAlign: 'left',
                border: 'none',
              }}
            >
              <div style={{ position: 'relative', height: 96 }}>
                <img
                  src={combo.image}
                  alt={combo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: 'rgba(15,36,56,0.85)',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: '3px 8px',
                  }}
                >
                  {combo.tag}
                </span>
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate)' }}>{combo.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 6px' }}>{combo.subtitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--teal-dark)', fontSize: 13 }}>{formatINR(combo.price)}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'line-through' }}>{formatINR(combo.mrp)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <SectionTitle title="Shop by category" />
        <div className="filter-row" style={{ marginBottom: 22 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              onClick={() => {
                sessionStorage.setItem('searchCat', c.id)
                go('search')
              }}
              style={{ height: 44, padding: '8px 14px' }}
            >
              <img
                src={c.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop'
                }}
                style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              />
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        <SectionTitle title="Top Featured Brands" action="View all" onAction={() => go('search')} />
        <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 14, marginBottom: 22 }}>
          {BRANDS.map((br) => (
            <button
              key={br.id}
              type="button"
              className="card"
              onClick={() => {
                sessionStorage.setItem('searchBrand', br.filterBrand || br.name)
                go('search')
              }}
              style={{ flex: '0 0 auto', width: 140, padding: 10, textAlign: 'center' }}
            >
              <img
                src={br.image}
                alt={br.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=260&h=160&fit=crop'
                }}
                style={{ width: '100%', height: 74, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }}
              />              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)' }}>{br.name}</div>
            </button>
          ))}
        </div>

        <SectionTitle title="Best Electronics" action="View all" onAction={() => go('search')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 18 }}>
          {bestElectronics.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => {
                sessionStorage.setItem('pid', p.id)
                go('product')
              }}
            />
          ))}
        </div>

        <SectionTitle title="Best Groceries" action="View all" onAction={() => go('search')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 24 }}>
          {bestGroceries.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => {
                sessionStorage.setItem('pid', p.id)
                go('product')
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--slate)' }}>{title}</h3>
      {action && (
        <button type="button" onClick={onAction} style={{ color: 'var(--teal-dark)', fontSize: 13, fontWeight: 600 }}>
          {action}
        </button>
      )}
    </div>
  )
}

function ProductCard({ product, onClick }) {
  const fallbackByCategory = {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop',
    groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=500&fit=crop',
    home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop',
  }
  return (
    <button type="button" className="card" onClick={onClick} style={{ textAlign: 'left', overflow: 'hidden', padding: 0 }}>
      <div style={{ aspectRatio: '4/5', background: '#e8f0ef', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.title}
          onError={(e) => {
            e.currentTarget.src = fallbackByCategory[product.category] || fallbackByCategory.electronics
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{product.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>{product.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, color: 'var(--teal-dark)', fontSize: 14 }}>{formatINR(product.price)}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'line-through' }}>{formatINR(product.mrp)}</span>
        </div>
      </div>
    </button>
  )
}

function CategoriesScreen({ go }) {
  const ctx = useApp()
  const categoryList = ctx.storeMode === 'darkstore' ? DARK_STORE_CATEGORIES : WEAR_CATEGORIES

  const browseCategory = (category, query = '') => {
    sessionStorage.setItem('searchCat', category)
    if (query) sessionStorage.setItem('searchQuery', query)
    go('search')
  }

  return (
    <div className="fashion-page">
      <AppHeader title={ctx.storeMode === 'darkstore' ? 'Dark Store categories' : 'Shop categories'} />
      <main className="fashion-main">
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 28, lineHeight: 1.05, marginBottom: 7 }}>
            {ctx.storeMode === 'darkstore' ? 'Try & Buy categories.' : 'Find your next look.'}
          </h2>
          <p style={{ color: 'var(--fashion-muted)', fontSize: 12 }}>
            {ctx.storeMode === 'darkstore' ? 'Dark Store edits delivered in 30–60 minutes.' : 'Every edit below can reach you in 30–60 minutes.'}
          </p>
        </div>
        <div className="fashion-category-grid">
          {categoryList.map((category, index) => (
            <motion.button
              key={category.id}
              type="button"
              className="fashion-category-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => browseCategory(category.id)}
            >
              <img src={category.image} alt="" loading="lazy" />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
        {ctx.storeMode !== 'darkstore' && (
          <div className="fashion-category-collections">
            {CATEGORY_COLLECTIONS.map((collection) => (
              <FashionSection key={collection.title} title={collection.title} subtitle="Explore every style in this edit">
                <div className="fashion-mini-category-rail">
                  {collection.items.map((item) => (
                    <motion.button type="button" key={item.name} whileTap={{ scale: 0.96 }} onClick={() => browseCategory(item.category, item.query)}>
                      <span><img src={item.image} alt="" loading="lazy" /></span>
                      <strong>{item.name}</strong>
                    </motion.button>
                  ))}
                </div>
              </FashionSection>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function WishlistScreen({ go }) {
  const ctx = useApp()
  const openProduct = (product) => {
    ctx.trackRecentlyViewed(product)
    sessionStorage.setItem('pid', product.id)
    go('product')
  }

  return (
    <div className="fashion-page">
      <AppHeader title={`Wishlist${ctx.wishlist.length ? ` (${ctx.wishlist.length})` : ''}`} />
      {ctx.wishlist.length === 0 ? (
        <FashionEmpty
          icon={Heart}
          title="Your wishlist is waiting"
          message="Save pieces you love and we’ll keep their express-delivery status ready."
          action="Discover trending styles"
          onAction={() => go('home')}
        />
      ) : (
        <main className="fashion-main">
          <div className="fashion-grid">
            {ctx.wishlist.map((product, index) => (
              <FashionProductCard
                key={product.id}
                product={product}
                ctx={ctx}
                index={index}
                onOpen={() => openProduct(product)}
                onAddToCart={() => ctx.addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Standard', 1)}
                onBuyNow={() => { ctx.addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Standard', 1); go('cart') }}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  )
}

function FashionEmpty({ icon: Icon, title, message, action, onAction }) {
  return (
    <div className="fashion-empty">
      <motion.div className="fashion-empty-icon" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <Icon size={34} />
      </motion.div>
      <h2>{title}</h2>
      <p>{message}</p>
      <button type="button" className="fashion-primary" onClick={onAction}>{action}</button>
    </div>
  )
}

function SearchScreen({ go }) {
  const ctx = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const isDarkStore = ctx.storeMode === 'darkstore'
  const categoryOptions = isDarkStore ? DARK_STORE_CATEGORIES : WEAR_CATEGORIES

  useEffect(() => {
    const initCat = sessionStorage.getItem('searchCat')
    if (initCat) {
      setCat(initCat)
      sessionStorage.removeItem('searchCat')
    }
    const initBrand = sessionStorage.getItem('searchBrand')
    if (initBrand) {
      setQ(initBrand)
      sessionStorage.removeItem('searchBrand')
    }
    const initQuery = sessionStorage.getItem('searchQuery')
    if (initQuery) {
      setQ(initQuery)
      sessionStorage.removeItem('searchQuery')
    }
    const initShop = sessionStorage.getItem('searchShop')
    if (initShop) {
      setQ(initShop)
      sessionStorage.removeItem('searchShop')
    }
  }, [])

  const baseProducts = isDarkStore ? ctx.darkStoreProducts : ctx.fashionProducts

  const list = baseProducts.filter((product) => {
    const search = q.trim().toLowerCase()
    const matchesQuery =
      !search ||
      product.title.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      (product.shopId && product.shopId.toLowerCase().includes(search.replace(/\s+/g, '-')))
    const matchesCategory = cat === 'all' || product.category === cat || (cat === 'sarees' && product.title.toLowerCase().includes('saree'))
    return matchesQuery && matchesCategory
  })

  const openProduct = (product) => {
    ctx.trackRecentlyViewed(product)
    sessionStorage.setItem('pid', product.id)
    go('product')
  }

  return (
    <div className="fashion-page">
      <AppHeader title={isDarkStore ? 'Search Dark Store' : 'Search fashion'} />
      <main className="fashion-main">
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={19} style={{ position: 'absolute', left: 15, top: 15, color: '#77727d' }} />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={isDarkStore ? 'Search sarees, party wear, ethnic…' : 'T-Shirts, Sneakers, Hoodies...'}
            autoFocus
            style={{
              width: '100%',
              height: 50,
              padding: '0 76px 0 44px',
              border: '1px solid var(--fashion-line)',
              borderRadius: 16,
              background: '#fff',
              outline: 'none',
              boxShadow: '0 8px 22px rgba(20,17,25,0.06)',
            }}
          />
          <div style={{ position: 'absolute', right: 13, top: 15, display: 'flex', gap: 10, color: '#77727d' }}>
            <Mic size={18} />
            <Camera size={18} />
          </div>
        </div>
        <div className="fashion-filter-row">
          <button type="button" className={`fashion-filter ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>
            {isDarkStore ? 'All Dark Store' : 'All fashion'}
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`fashion-filter ${cat === category.id ? 'active' : ''}`}
              onClick={() => setCat(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0 12px' }}>
          <strong style={{ fontSize: 12 }}>{list.length} styles available nearby</strong>
          <span style={{ color: 'var(--fashion-accent)', fontSize: 10, fontWeight: 800 }}><Zap size={11} fill="currentColor" /> Express</span>
        </div>
        {list.length ? (
          <div className="fashion-grid">
            {list.map((product, index) => (
              <FashionProductCard
                key={product.id}
                product={product}
                ctx={ctx}
                index={index}
                onOpen={() => openProduct(product)}
                onAddToCart={() => ctx.addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Standard', 1)}
                onBuyNow={() => { ctx.addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Standard', 1); go('cart') }}
              />
            ))}
          </div>
        ) : (
          <FashionEmpty
            icon={Search}
            title="No styles found"
            message="Try another search or explore today’s trending fashion."
            action="Clear search"
            onAction={() => {
              setQ('')
              setCat('all')
            }}
          />
        )}
      </main>
    </div>
  )
}

function LegacySearchScreen({ go }) {
  const ctx = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  useEffect(() => {
    const initCat = sessionStorage.getItem('searchCat')
    if (initCat) {
      setCat(initCat)
      sessionStorage.removeItem('searchCat')
    }
    const initBrand = sessionStorage.getItem('searchBrand')
    if (initBrand) {
      setQ(initBrand)
      sessionStorage.removeItem('searchBrand')
    }
  }, [])

  const filters = useMemo(() => {
    if (!q) return []
    const s = q.toLowerCase()
    return [
      ...CATEGORIES.filter((c) => c.name.toLowerCase().includes(s) || c.sub.some((x) => x.toLowerCase().includes(s))).map((c) => c.name),
      ...ctx.products.filter((p) => p.brand.toLowerCase().includes(s)).map((p) => p.brand),
    ].slice(0, 5)
  }, [q, ctx.products])

  const list = ctx.products.filter((p) => {
    const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())
    const matchC = cat === 'all' || p.category === cat
    return matchQ && matchC
  })

  return (
    <div className="fade-in">
      <AppHeader title="Search" compact />
      <div style={{ padding: 16 }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--muted)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            style={{
              width: '100%',
              height: 48,
              paddingLeft: 42,
              borderRadius: 12,
              border: '1.5px solid var(--line)',
              outline: 'none',
            }}
            autoFocus
          />
        </div>
        {filters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {filters.map((f) => (
              <button key={f} type="button" className="chip active" onClick={() => setQ(f)}>
                <Filter size={12} /> {f}
              </button>
            ))}
          </div>
        )}
        <div className="filter-row">
          <button type="button" className={`chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={`chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => { sessionStorage.setItem('pid', p.id); go('product') }} />
          ))}
        </div>
        {list.length === 0 && <div className="empty">No items found</div>}
      </div>
    </div>
  )
}

function ShopScreen({ go, back }) {
  const ctx = useApp()
  const shopId = sessionStorage.getItem('shopId')
  const shop = FEATURED_SHOPS.find((item) => item.id === shopId) || FEATURED_SHOPS[0]
  const products = ctx.products.filter((p) => p.shopId === shop.id)

  const openProduct = (product) => {
    ctx.trackRecentlyViewed(product)
    sessionStorage.setItem('pid', product.id)
    go('product')
  }

  return (
    <div className="fashion-page">
      <AppHeader title={shop.name} onBack={back} />
      <main className="fashion-main">
        <div className="fashion-shop-hero">
          <img src={shop.logo} alt="" />
          <div>
            <h2>{shop.name}</h2>
            <p>{products.length} styles available · Express delivery</p>
          </div>
        </div>
        <div className="fashion-grid">
          {products.map((product, index) => (
            <FashionProductCard
              key={product.id}
              product={product}
              ctx={ctx}
              index={index}
              onOpen={() => openProduct(product)}
              onAddToCart={() => ctx.addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Standard', 1)}
              onBuyNow={() => { ctx.addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Standard', 1); go('cart') }}
            />
          ))}
        </div>
        {!products.length && (
          <FashionEmpty icon={Store} title="No products yet" message="This shop will have new styles soon." action="Back to home" onAction={() => go('home')} />
        )}
      </main>
    </div>
  )
}

function ProductDetailHeader({ back, brand, go, wished, onWishlist }) {
  return (
    <header className="fashion-pdp-header">
      <button type="button" onClick={back} aria-label="Back"><ArrowLeft size={20} /></button>
      <div className="fashion-pdp-brand">
        <img src="/logo.png" alt="" />
        <strong>{brand}</strong>
      </div>
      <div className="fashion-pdp-actions">
        <button type="button" onClick={() => go('search')} aria-label="Search"><Search size={20} /></button>
        <button type="button" onClick={onWishlist} aria-label="Wishlist">
          <Heart size={20} fill={wished ? 'var(--fashion-accent)' : 'none'} color={wished ? 'var(--fashion-accent)' : 'currentColor'} />
        </button>
      </div>
    </header>
  )
}

function ProductCategoryNav({ go }) {
  return (
    <div className="fashion-pdp-categories">
      {['Women', 'Men'].map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => {
            sessionStorage.setItem('searchCat', label.toLowerCase())
            go('search')
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function ProductScreen({ go, back }) {
  const ctx = useApp()
  const product = ctx.products.find((item) => item.id === sessionStorage.getItem('pid')) || ctx.products[0]
  const [size, setSize] = useState(product.sizes?.[0] || 'Standard')
  const [color, setColor] = useState(product.colors?.[0] || 'Standard')
  const [showSizeChart, setShowSizeChart] = useState(false)
  const wished = ctx.wishlist.some((item) => item.id === product.id)
  const similar = ctx.products
    .filter((item) => item.category === product.category && item.id !== product.id && item.belongsToDarkStore === product.belongsToDarkStore)
    .slice(0, 4)
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const isTryBuy = product.belongsToDarkStore === true
  const displayPrice = isTryBuy ? (product.tryAndBuyPrice || product.price) : product.price
  const addressLabel = ctx.selectedAddress ? `${ctx.selectedAddress.line.split(',')[0]}, ${ctx.selectedAddress.city}` : 'your location'

  useEffect(() => {
    ctx.trackRecentlyViewed(product)
  }, [product.id])

  const add = () => ctx.addToCart(product, size, color, 1)
  const buyNow = () => { add(); go('cart') }
  const offerPrice = Math.max(0, displayPrice - 200)

  return (
    <div className="fashion-page fashion-pdp-page">
      <ProductDetailHeader
        back={back}
        brand={product.brand}
        go={go}
        wished={wished}
        onWishlist={() => ctx.toggleWishlist(product)}
      />
      <ProductCategoryNav go={go} />
      <div className="fashion-detail-image">
        <img src={product.image} alt={product.title} />
        {isTryBuy && <span className="fashion-trybuy-badge detail">Try & Buy</span>}
        <span className="fashion-delivery-chip" style={{ bottom: 34 }}><Zap size={12} fill="currentColor" /> Arrives in {isTryBuy ? '45' : '28'} mins</span>
      </div>
      <div className="fashion-detail-body fashion-pdp-body">
        <h1 className="fashion-pdp-title">{product.title}</h1>
        <div className="fashion-pdp-rating">
          <Star size={12} fill="#111114" /> {product.rating} · {product.reviews} reviews · <span className="fashion-stock">Only 4 left</span>
        </div>
        <div className="fashion-pdp-price-block">
          <div className="fashion-pdp-price-row">
            <strong>{formatINR(displayPrice)}</strong>
            <del>{formatINR(product.mrp)}</del>
            <span className="fashion-pdp-discount">{discount}% OFF</span>
          </div>
          <small className="fashion-pdp-tax">(Inclusive of all taxes)</small>
        </div>

        <div className="fashion-pdp-meta">
          <div><span>COLOR:</span> <strong>{color}</strong></div>
          <div className="fashion-pdp-size-row">
            <span>SIZE: <strong>{size}</strong></span>
            <button type="button" onClick={() => setShowSizeChart(true)}>Size Chart</button>
          </div>
        </div>

        {product.sizes?.length > 0 && (
          <div className="fashion-pdp-size-grid">
            {product.sizes.map((item) => (
              <button key={item} type="button" className={size === item ? 'active' : ''} onClick={() => setSize(item)}>{item}</button>
            ))}
          </div>
        )}

        {product.colors?.length > 1 && (
          <div className="fashion-pdp-color-grid">
            {product.colors.map((item) => (
              <button key={item} type="button" className={color === item ? 'active' : ''} onClick={() => setColor(item)}>{item}</button>
            ))}
          </div>
        )}

        <div className="fashion-pdp-offers">
          <div className="fashion-pdp-offers-head"><Sparkles size={16} /> Offers</div>
          <div className="fashion-pdp-offer-row">
            <span>Get at {formatINR(offerPrice)}</span>
            <button type="button" className="fashion-pdp-coupon" onClick={() => ctx.setPromo('WELCOME50')}>WELCOME50</button>
          </div>
          <p><span className="fashion-pdp-steal">TOP STEAL</span> Get FLAT ₹200 on your first 3 orders above ₹500.</p>
        </div>

        <div className="fashion-speed-card">
          <span className="fashion-speed-icon"><Zap size={20} fill="currentColor" /></span>
          <span>
            <small>Deliver to {addressLabel}</small>
            <strong>Arrives in {isTryBuy ? '45' : '28'} mins · express delivery</strong>
          </span>
          <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
        </div>

        <ProductSpecTabs product={product} selectedSize={size} isTryBuy={isTryBuy} />

        {product.seller && (
          <div className="fashion-detail-panel">
            <strong>Seller information</strong>
            <p>{product.seller}</p>
          </div>
        )}

        <div className="fashion-detail-panel">
          <strong>Customer reviews</strong>
          {PRODUCT_REVIEWS.map((review) => (
            <div key={review.name} className="fashion-review-item">
              <div><strong>{review.name}</strong> · <Star size={11} fill="#111114" /> {review.rating} · <span>{review.date}</span></div>
              <p>{review.text}</p>
            </div>
          ))}
        </div>

        {similar.length > 0 && (
          <ProductRail
            title="Related products"
            subtitle="More styles you may like"
            products={similar}
            ctx={ctx}
            onOpen={(item) => {
              ctx.trackRecentlyViewed(item)
              sessionStorage.setItem('pid', item.id)
              go('product')
            }}
            onQuickAdd={(item) => ctx.addToCart(item, item.sizes?.[0] || 'Standard', item.colors?.[0] || 'Standard', 1)}
            onBuyNow={(item) => {
              ctx.addToCart(item, item.sizes?.[0] || 'Standard', item.colors?.[0] || 'Standard', 1)
              go('cart')
            }}
          />
        )}
      </div>

      {ctx.cartCount > 0 && (
        <button type="button" className="fashion-view-cart-pill" onClick={() => go('cart')}>
          <span className="fashion-view-cart-thumbs">
            {ctx.cart.slice(0, 2).map((item) => (
              <img key={item.product.id} src={item.product.image} alt="" />
            ))}
          </span>
          <span className="fashion-view-cart-copy">
            <strong>View Cart</strong>
            <small>{ctx.cartCount} Item{ctx.cartCount > 1 ? 's' : ''}</small>
          </span>
        </button>
      )}

      <div className="fashion-actions fashion-pdp-actions">
        <motion.button type="button" className="fashion-secondary" whileTap={{ scale: 0.97 }} onClick={buyNow}>Buy Now</motion.button>
        <motion.button type="button" className="fashion-primary fashion-pdp-add-bag" whileTap={{ scale: 0.97 }} onClick={add}>Add to Bag</motion.button>
      </div>

      <AnimatePresence>
        {showSizeChart && (
          <SizeChartModal chartType={product.sizeChartType || 'women'} onClose={() => setShowSizeChart(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function LegacyProductScreen({ go, back }) {
  const ctx = useApp()
  const product = ctx.products.find((p) => p.id === sessionStorage.getItem('pid')) || ctx.products[0]
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0
  const [size, setSize] = useState(() => (hasSizes ? product.sizes[0] : 'Standard'))
  const [color, setColor] = useState(() => (hasColors ? product.colors[0] : 'Standard'))

  return (
    <div className="fade-in">
      <AppHeader title="Details" onBack={back} right={<Heart size={20} />} />
      <div style={{ aspectRatio: '4/5', background: '#e8f0ef' }}>
        <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{product.brand}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--slate)' }}>{product.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 12px' }}>
          <Stars value={product.rating} />
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{product.rating} · {product.reviews} reviews</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal-dark)' }}>{formatINR(product.price)}</span>
          <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{formatINR(product.mrp)}</span>
          <span className="badge badge-teal">{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.55, marginBottom: 20 }}>{product.description}</p>
        {hasSizes && (
          <>
            <Label>Size</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {product.sizes.map((s) => (
                <button key={s} type="button" className={`chip ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {hasColors && (
          <>
            <Label>Color</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {product.colors.map((c) => (
                <button key={c} type="button" className={`chip ${color === c ? 'active' : ''}`} onClick={() => setColor(c)}>
                  {c}
                </button>
              ))}
            </div>
          </>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 24 }}>
          <button type="button" className="btn btn-secondary" onClick={() => ctx.addToCart(product, size, color)}>
            Add to Cart
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              ctx.addToCart(product, size, color)
              go('cart')
            }}
          >
            Buy Now
          </button>
        </div>
        <button type="button" className="btn btn-ghost btn-block" onClick={() => go('review')}>
          <Star size={16} /> Write a Review
        </button>
      </div>
    </div>
  )
}

function Label({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>{children}</div>
}

function CartScreen({ go }) {
  const ctx = useApp()
  const address = ctx.selectedAddress
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const deliveryEta = ctx.hasTryBuyItems ? '45 mins' : '30 mins'

  return (
    <div className="fashion-page">
      <AppHeader title={`Your bag${ctx.cartCount ? ` (${ctx.cartCount})` : ''}`} eta={deliveryEta} />
      {ctx.cart.length === 0 ? (
        <FashionEmpty
          icon={ShoppingBag}
          title="Your bag needs a look"
          message="Add a style now and we can have it at your door in under an hour."
          action="Shop trending fashion"
          onAction={() => go('home')}
        />
      ) : (
        <main className="fashion-main" style={{ paddingBottom: 30 }}>
          <div className="fashion-cart-eta">
            <div className="fashion-cart-eta-top">
              <span className="fashion-speed-icon"><Zap size={19} fill="currentColor" /></span>
              <span>
                <strong>{ctx.hasTryBuyItems ? 'Try & Buy order · arrives today' : 'Your order arrives by 4:15 PM'}</strong>
                <span>Express delivery to {address?.city || 'your address'}</span>
              </span>
            </div>
            <div className="fashion-timeline">
              {['Preparing', 'Packed', 'Out for delivery', 'Delivered'].map((step, index) => (
                <span key={step} className={`fashion-timeline-step ${index === 0 ? 'active' : ''}`}>{step}</span>
              ))}
            </div>
          </div>

          {ctx.hasTryBuyItems && (
            <div className="fashion-trybuy-summary">
              Try & Buy items: {ctx.tryBuyCount}/{ctx.tryBuyLimit}
            </div>
          )}

          {ctx.cart.map((item) => (
            <motion.div key={item.key} className="fashion-cart-item" layout>
              <div className="fashion-cart-thumb">
                {item.product.belongsToDarkStore && <span className="fashion-trybuy-strip">TRY &amp; BUY</span>}
                <img src={item.product.image} alt="" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="fashion-product-brand">{item.product.brand}</div>
                <div style={{ margin: '3px 0 5px', fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>{item.product.title}</div>
                <div style={{ color: 'var(--fashion-muted)', fontSize: 10 }}>
                  Size: {item.size} · Qty: {item.qty}{item.product.belongsToDarkStore ? ' · Try & Buy eligible' : ''}
                </div>
                <div className="fashion-price-row" style={{ margin: '8px 0' }}>
                  <strong style={{ fontSize: 14 }}>{formatINR(item.product.price)}</strong>
                  <del style={{ fontSize: 11 }}>{formatINR(item.product.mrp)}</del>
                  <span style={{ fontSize: 10 }}>{Math.round(((item.product.mrp - item.product.price) / item.product.mrp) * 100)}% Off</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="qty">
                    <button type="button" onClick={() => ctx.updateQty(item.key, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => ctx.updateQty(item.key, 1)}>+</button>
                  </div>
                  <button type="button" onClick={() => ctx.removeFromCart(item.key)} style={{ color: '#8c8791' }}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          <button
            type="button"
            className="fashion-checkout-block"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}
            onClick={() => go('addresses')}
          >
            <MapPin size={19} color="var(--fashion-accent)" />
            <span style={{ flex: 1 }}>
              <strong style={{ display: 'block', fontSize: 12 }}>Delivering to {address?.label || 'Home'}</strong>
              <span style={{ color: 'var(--fashion-muted)', fontSize: 10 }}>{address?.line}, {address?.city}</span>
            </span>
            <ChevronRight size={17} />
          </button>

          <DeliveryOptionSection ctx={ctx} setShowHowItWorks={setShowHowItWorks} />

          {ctx.hasTryBuyItems && ctx.deliveryOption === 'trybuy' && (
            <label className="fashion-trybuy-ack fashion-checkout-block">
              <input
                type="checkbox"
                checked={ctx.tryBuyAcknowledged}
                onChange={(e) => ctx.setTryBuyAcknowledged(e.target.checked)}
              />
              I understand the Try & Buy doorstep trial option before payment.
            </label>
          )}

          <div className="fashion-checkout-block">
            <div className="fashion-checkout-label">Bill details</div>
            <Row label="Item total" value={formatINR(ctx.subtotal)} />
            {ctx.discount > 0 && <Row label="Coupon discount" value={`−${formatINR(ctx.discount)}`} accent />}
            <Row label="Delivery charges" value={ctx.delivery === 0 ? 'FREE' : formatINR(ctx.delivery)} />
            <div style={{ borderTop: '1px dashed var(--fashion-line)', margin: '10px 0' }} />
            <Row label="Final total" value={formatINR(ctx.total)} bold />
            <p style={{ margin: '8px 0 0', color: 'var(--fashion-muted)', fontSize: 9 }}>Inc. all taxes and charges</p>
          </div>

          <motion.button
            type="button"
            className="fashion-primary"
            style={{ width: '100%', minHeight: 52 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (ctx.hasTryBuyItems && ctx.deliveryOption === 'trybuy' && !ctx.tryBuyAcknowledged) {
                ctx.showToast('Please acknowledge Try & Buy terms before checkout.')
                return
              }
              go('checkout')
            }}
          >
            Pay {formatINR(ctx.total)}
          </motion.button>
        </main>
      )}
      <AnimatePresence>
        {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      </AnimatePresence>
    </div>
  )
}

function LegacyCartScreen({ go }) {
  const ctx = useApp()
  return (
    <div className="fade-in">
      <AppHeader title={`My Cart (${ctx.cartCount})`} compact />
      <div style={{ padding: 16, paddingBottom: 120 }}>
        {ctx.cart.length === 0 ? (
          <div className="empty">
            <ShoppingCart size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            Your cart is empty
            <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => go('home')}>
              Browse Items
            </button>
          </div>
        ) : (
          <>
            {ctx.cart.map((item) => (
              <div key={item.key} className="card" style={{ display: 'flex', gap: 12, padding: 12, marginBottom: 12 }}>
                <img src={item.product.image} alt="" style={{ width: 80, height: 96, objectFit: 'cover', borderRadius: 10 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0' }}>
                    {item.size} · {item.color}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 8 }}>{formatINR(item.product.price)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="qty">
                      <button type="button" onClick={() => ctx.updateQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => ctx.updateQty(item.key, 1)}>+</button>
                    </div>
                    <button type="button" onClick={() => ctx.removeFromCart(item.key)} style={{ color: 'var(--danger)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="card" style={{ padding: 16, marginTop: 8 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, color: 'var(--slate)' }}>Bill Details</h4>
              <Row label="Item total" value={formatINR(ctx.subtotal)} />
              <Row label="Delivery" value={ctx.delivery === 0 ? 'FREE' : formatINR(ctx.delivery)} />
              {ctx.discount > 0 && <Row label="Discount" value={`−${formatINR(ctx.discount)}`} accent />}
              <div style={{ borderTop: '1px dashed var(--line)', margin: '10px 0' }} />
              <Row label="Grand Total" value={formatINR(ctx.total)} bold />
            </div>

            <div className="card" style={{ padding: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <MapPin size={16} color="var(--teal)" />
                <strong style={{ fontSize: 14 }}>Delivery Address</strong>
              </div>
              {(() => {
                const a = ctx.addresses.find((x) => x.default) || ctx.addresses[0]
                return a ? (
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {a.line}, {a.city} — {a.pincode}
                  </p>
                ) : null
              })()}
              <button type="button" onClick={() => go('addresses')} style={{ color: 'var(--teal-dark)', fontSize: 13, fontWeight: 600, marginTop: 8 }}>
                Change / Manage
              </button>
            </div>

            <div style={{ position: 'sticky', bottom: 8, marginTop: 20 }}>
              <button type="button" className="btn btn-primary btn-block" onClick={() => go('checkout')}>
                Proceed to Checkout · {formatINR(ctx.total)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: bold ? 15 : 14, fontWeight: bold ? 700 : 400, color: accent ? 'var(--teal-dark)' : 'var(--ink)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function CheckoutScreen({ go, back }) {
  const ctx = useApp()
  const [code, setCode] = useState('')
  const [pay, setPay] = useState('UPI')
  const [slot, setSlot] = useState('express')
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const address = ctx.selectedAddress

  const handlePlaceOrder = () => {
    if (ctx.hasTryBuyItems && ctx.deliveryOption === 'trybuy' && !ctx.tryBuyAcknowledged) {
      ctx.showToast('Please acknowledge Try & Buy terms before placing the order.')
      return
    }
    const order = ctx.placeOrder(pay)
    if (order) go('success')
  }

  return (
    <div className="fashion-page">
      <AppHeader title="Checkout" onBack={back} />
      <main className="fashion-main">
        <div className="fashion-speed-card" style={{ marginTop: 0 }}>
          <span className="fashion-speed-icon"><Zap size={20} fill="currentColor" /></span>
          <span>
            <small>Estimated arrival</small>
            <strong>Today, by 4:15 PM · {ctx.hasTryBuyItems && ctx.deliveryOption === 'trybuy' ? '45' : '28'} mins</strong>
          </span>
        </div>

        <button type="button" className="fashion-checkout-block" style={{ width: '100%', textAlign: 'left' }} onClick={() => go('addresses')}>
          <div className="fashion-checkout-label"><MapPin size={17} /> Delivery address</div>
          <strong style={{ display: 'block', fontSize: 12 }}>{address?.name} · {address?.label}</strong>
          <span style={{ display: 'block', marginTop: 4, color: 'var(--fashion-muted)', fontSize: 10, lineHeight: 1.5 }}>
            {address?.line}, {address?.city} — {address?.pincode}
          </span>
        </button>

        <DeliveryOptionSection ctx={ctx} setShowHowItWorks={setShowHowItWorks} />

        <div className="fashion-checkout-block">
          <div className="fashion-checkout-label"><Clock3 size={17} /> Delivery slot</div>
          <div className="fashion-slot-grid">
            <button type="button" className={`fashion-slot ${slot === 'express' ? 'active' : ''}`} onClick={() => setSlot('express')}>
              <Zap size={14} /> Express<br />{ctx.hasTryBuyItems && ctx.deliveryOption === 'trybuy' ? '45 mins' : '28 mins'}
            </button>
            <button type="button" className={`fashion-slot ${slot === 'evening' ? 'active' : ''}`} onClick={() => setSlot('evening')}>
              <Clock3 size={14} /> Evening<br />6–7 PM
            </button>
          </div>
        </div>

        {ctx.hasTryBuyItems && ctx.deliveryOption === 'trybuy' && (
          <label className="fashion-trybuy-ack fashion-checkout-block">
            <input
              type="checkbox"
              checked={ctx.tryBuyAcknowledged}
              onChange={(e) => ctx.setTryBuyAcknowledged(e.target.checked)}
            />
            I understand the Try & Buy doorstep trial option before payment.
          </label>
        )}

        <div className="fashion-checkout-block">
          <div className="fashion-checkout-label"><Sparkles size={17} /> Apply offer</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="Enter coupon"
              style={{ minWidth: 0, flex: 1, height: 44, padding: '0 12px', border: '1px solid var(--fashion-line)', borderRadius: 12, outline: 'none' }}
            />
            <button
              type="button"
              className="fashion-secondary"
              style={{ minHeight: 44, padding: '0 14px' }}
              onClick={() => {
                if (['TEAL100', 'SUMMER20', 'FREESHIP'].includes(code)) {
                  ctx.setPromo(code)
                  ctx.showToast('Offer applied')
                } else {
                  ctx.showToast('Try SUMMER20')
                }
              }}
            >
              Apply
            </button>
          </div>
          <button type="button" onClick={() => setCode('SUMMER20')} style={{ marginTop: 9, color: 'var(--fashion-accent)', fontSize: 10, fontWeight: 800 }}>
            Use SUMMER20 · 20% off
          </button>
        </div>

        <div className="fashion-checkout-block">
          <div className="fashion-checkout-label"><CreditCard size={17} /> Payment</div>
          {['UPI', 'Card', 'Cash on Delivery', 'Wallet'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPay(method)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--fashion-line)', textAlign: 'left' }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  border: `2px solid ${pay === method ? 'var(--fashion-accent)' : '#d8d4dd'}`,
                }}
              >
                {pay === method && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fashion-accent)' }} />}
              </span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{method}</span>
              {pay === method && <CheckCircle2 size={17} color="var(--fashion-accent)" />}
            </button>
          ))}
        </div>

        <div className="fashion-checkout-block">
          <div className="fashion-checkout-label">Bill details</div>
          <Row label="Item total" value={formatINR(ctx.subtotal)} />
          {ctx.discount > 0 && <Row label="Coupon discount" value={`−${formatINR(ctx.discount)}`} accent />}
          <Row label="Delivery charges" value={ctx.delivery === 0 ? 'FREE' : formatINR(ctx.delivery)} />
          <div style={{ borderTop: '1px dashed var(--fashion-line)', margin: '10px 0' }} />
          <Row label="Final total" value={formatINR(ctx.total)} bold />
          <p style={{ margin: '8px 0 0', color: 'var(--fashion-muted)', fontSize: 9 }}>Inc. all taxes and charges</p>
        </div>

        <motion.button
          type="button"
          className="fashion-primary"
          style={{ width: '100%', minHeight: 54 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceOrder}
        >
          Pay {formatINR(ctx.total)}
        </motion.button>
        <p style={{ marginTop: 10, color: 'var(--fashion-muted)', fontSize: 9, textAlign: 'center' }}>
          Authentic products · Secure payment · Easy returns
        </p>
      </main>
      <AnimatePresence>
        {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      </AnimatePresence>
    </div>
  )
}

function LegacyCheckoutScreen({ go, back }) {
  const ctx = useApp()
  const [code, setCode] = useState('')
  const [pay, setPay] = useState('UPI')
  const activeCoupons = COUPONS.filter((c) => c.active)

  return (
    <div className="fade-in">
      <AppHeader title="Checkout" onBack={back} />
      <div style={{ padding: 16 }}>
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 16,
            borderColor: 'rgba(91,44,255,0.25)',
            background: 'linear-gradient(180deg, rgba(91,44,255,0.07) 0%, rgba(255,255,255,0.9) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 0, color: 'var(--slate)' }}>Coupons</h4>
            {activeCoupons.length > 0 && (
              <span className="badge badge-slate" style={{ background: 'rgba(91,44,255,0.08)', color: '#5b2cff' }}>
                {activeCoupons.length} available
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter Coupon Code"
              style={{ flex: 1, height: 44, borderRadius: 12, border: '1.5px solid var(--line)', padding: '0 12px' }}
            />
            <button
              type="button"
              className="btn"
              style={{
                height: 44,
                borderRadius: 12,
                background: '#5b2cff',
                color: 'white',
                fontWeight: 800,
                padding: '0 16px',
              }}
              onClick={() => {
                const ok = ['TEAL100', 'SUMMER20', 'FREESHIP'].includes(code)
                if (ok) {
                  ctx.setPromo(code)
                  ctx.showToast('Coupon applied')
                } else ctx.showToast('Invalid coupon')
              }}
            >
              Check
            </button>
          </div>

          {ctx.promo && (
            <p style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#5b2cff' }}>
              Unlocked: {ctx.promo}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 10 }}>
            {activeCoupons.slice(0, 5).map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                style={{ padding: '9px 12px', borderColor: 'rgba(91,44,255,0.25)' }}
                onClick={() => setCode(c.code)}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12 }}>Payment Method</h4>
          {['UPI', 'Card', 'Cash on Delivery', 'Wallet'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPay(m)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 0',
                borderBottom: '1px solid var(--line)',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `2px solid ${pay === m ? 'var(--teal)' : 'var(--line)'}`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {pay === m && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />}
              </span>
              <CreditCard size={16} color="var(--muted)" />
              {m}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <Row label="Subtotal" value={formatINR(ctx.subtotal)} />
          <Row label="Delivery" value={ctx.delivery === 0 ? 'FREE' : formatINR(ctx.delivery)} />
          {ctx.discount > 0 && <Row label="Promo" value={`−${formatINR(ctx.discount)}`} accent />}
          <div style={{ borderTop: '1px dashed var(--line)', margin: '10px 0' }} />
          <Row label="To Pay" value={formatINR(ctx.total)} bold />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            ctx.placeOrder(pay)
            go('success')
          }}
        >
          Pay Securely · {formatINR(ctx.total)}
        </button>
      </div>
    </div>
  )
}

function SuccessScreen({ onDone }) {
  return (
    <div className="fashion-page" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.7, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        style={{ width: 88, height: 88, borderRadius: 28, background: 'var(--fashion-accent-soft)', display: 'grid', placeItems: 'center', marginBottom: 20, color: 'var(--fashion-accent)' }}
      >
        <Zap size={38} fill="currentColor" />
      </motion.div>
      <span className="fashion-kicker" style={{ color: 'var(--fashion-accent-dark)', background: 'var(--fashion-accent-soft)', borderColor: '#f0d8d2' }}>
        Express confirmed
      </span>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: 'var(--fashion-black)' }}>Your look is on the way.</h2>
      <p style={{ maxWidth: 270, color: 'var(--fashion-muted)', margin: '10px 0 24px', fontSize: 12, lineHeight: 1.6 }}>
        We’re preparing it now. Estimated arrival: <strong>today by 4:15 PM.</strong>
      </p>
      <button type="button" className="fashion-primary" onClick={onDone}>
        Track express order <ArrowRight size={16} />
      </button>
    </div>
  )
}

function ProfileScreen({ go }) {
  const ctx = useApp()
  const items = [
    { icon: Package, label: 'My Orders', screen: 'orders' },
    { icon: MapPin, label: 'Manage Addresses', screen: 'addresses' },
    { icon: Bell, label: 'Notifications', screen: 'notifications' },
    { icon: Star, label: 'Reviews & Ratings', screen: 'review' },
    { icon: Settings, label: 'Settings', screen: 'settings' },
  ]
  return (
    <div className="fade-in">
      <AppHeader compact />
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 20, marginBottom: 16, display: 'relative', overflow: 'hidden' }}>
          <GeometricAccent position="tr" size={90} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', position: 'relative' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--teal)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 20 }}>
              {ctx.user?.name?.[0] || 'P'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--slate)' }}>{ctx.user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{ctx.user?.phone}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{ctx.user?.email}</div>
            </div>
          </div>
        </div>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              type="button"
              className="card"
              onClick={() => go(item.screen)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 16, marginBottom: 10, textAlign: 'left' }}
            >
              <Icon size={20} color="var(--teal)" />
              <span style={{ flex: 1, fontWeight: 600 }}>{item.label}</span>
              <ChevronRight size={18} color="var(--muted)" />
            </button>
          )
        })}
        <button
          type="button"
          className="btn btn-danger btn-block"
          style={{ marginTop: 12 }}
          onClick={() => {
            ctx.setUser(null)
            ctx.showToast('Logged out securely')
          }}
        >
          <LogOut size={16} /> Secure Logout
        </button>
      </div>
    </div>
  )
}

function OrdersScreen({ go, back }) {
  const ctx = useApp()
  return (
    <div className="fade-in">
      <AppHeader title="My Orders" onBack={back} />
      <div style={{ padding: 16 }}>
        {ctx.orders.map((o) => (
          <button
            key={o.id}
            type="button"
            className="card"
            onClick={() => {
              sessionStorage.setItem('oid', o.id)
              go('orderDetail')
            }}
            style={{ width: '100%', textAlign: 'left', padding: 16, marginBottom: 12 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{o.id}</strong>
              <span className={`badge ${o.status === 'Delivered' ? 'badge-teal' : 'badge-warn'}`}>{o.status}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              {o.items.map((i) => i.title).join(', ')}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>{o.date} · {o.payment}</span>
              <strong>{formatINR(o.amount)}</strong>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function OrderDetailScreen({ back }) {
  const ctx = useApp()
  const order = ctx.orders.find((o) => o.id === sessionStorage.getItem('oid')) || ctx.orders[0]
  return (
    <div className="fade-in">
      <AppHeader title="Order Tracking" onBack={back} />
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>{order.id}</strong>
            <span className="badge badge-teal">{order.status}</span>
          </div>
          {order.eta && <p style={{ color: 'var(--teal-dark)', fontWeight: 600, fontSize: 14 }}>ETA · {order.eta}</p>}
          <div className="progress-steps" style={{ marginTop: 24 }}>
            {order.steps.map((s, i) => (
              <div key={s} className={`step ${i < order.stepIndex ? 'done' : ''} ${i === order.stepIndex ? 'active' : ''}`}>
                <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-display)' }}>Items</h4>
          {order.items.map((it, i) => (
            <Row key={i} label={`${it.title} ×${it.qty}`} value={formatINR(it.price * it.qty)} />
          ))}
          <div style={{ borderTop: '1px dashed var(--line)', margin: '10px 0' }} />
          <Row label="Paid via" value={order.payment} />
          <Row label="Total" value={formatINR(order.amount)} bold />
        </div>
      </div>
    </div>
  )
}

function AddressesScreen({ back }) {
  const ctx = useApp()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ label: 'Home', name: '', phone: '', line: '', city: '', pincode: '' })
  const [locating, setLocating] = useState(false)
  const [locationNote, setLocationNote] = useState('')

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote('Location is not supported on this device. Enter the address manually.')
      return
    }
    setLocating(true)
    setLocationNote('Finding your precise delivery location…')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          line: `Current location · ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
          city: current.city || 'Chennai',
        }))
        setLocationNote('Location detected. Add house number and landmark for a faster handoff.')
        setLocating(false)
      },
      () => {
        setLocationNote('We could not access your location. Allow location permission or enter it manually.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <div className="fade-in fashion-address-page">
      <AppHeader title="Delivery addresses" onBack={back} right={<button type="button" onClick={() => setShow(true)} aria-label="Add address"><Plus size={22} /></button>} />
      <div className="fashion-address-list">
        <button type="button" className="fashion-locate-card" onClick={() => setShow(true)}>
          <span><LocateFixed size={21} /></span>
          <div>
            <strong>Use current location</strong>
            <small>Tap to detect location only when you choose — never automatic</small>
          </div>
          <ChevronRight size={18} />
        </button>
        {ctx.addresses.map((a) => (
          <div key={a.id} className="fashion-saved-address">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <strong>{a.label}</strong>
              {a.default ? <span className="badge badge-teal">Default</span> : (
                <button
                  type="button"
                  style={{ color: 'var(--teal-dark)', fontSize: 12, fontWeight: 600 }}
                  onClick={() =>
                    ctx.setAddresses((list) => list.map((x) => ({ ...x, default: x.id === a.id })))
                  }
                >
                  Set Default
                </button>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {a.name} · {a.phone}<br />
              {a.line}<br />
              {a.city} — {a.pincode}
            </p>
          </div>
        ))}
      </div>
      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal fashion-address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fashion-address-modal-head">
              <div>
                <small>30–60 MIN DELIVERY</small>
                <h3>Add delivery address</h3>
              </div>
              <button type="button" onClick={() => setShow(false)}><X size={20} /></button>
            </div>

            <div className="fashion-location-map">
              <span className={locating ? 'locating' : ''}><MapPin size={24} fill="currentColor" /></span>
              <div className="fashion-map-road road-one" />
              <div className="fashion-map-road road-two" />
              <button type="button" onClick={useCurrentLocation} disabled={locating}>
                <LocateFixed size={16} /> {locating ? 'Locating…' : 'Use my current location'}
              </button>
            </div>
            {locationNote && <p className="fashion-location-note">{locationNote}</p>}

            <div className="fashion-address-labels">
              {['Home', 'Work', 'Other'].map((label) => (
                <button
                  type="button"
                  key={label}
                  className={form.label === label ? 'active' : ''}
                  onClick={() => setForm({ ...form, label })}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="fashion-address-fields">
              {[
                ['name', 'Receiver name', 'Who is receiving the order?'],
                ['phone', 'Mobile number', '10-digit mobile number'],
                ['line', 'House / flat / street', 'House no., building, street and landmark'],
                ['city', 'City', 'Chennai'],
                ['pincode', 'Pincode', '600040'],
              ].map(([key, label, placeholder]) => (
                <div className={`field ${key === 'line' ? 'wide' : ''}`} key={key}>
                  <label>{label}</label>
                  <input
                    value={form[key]}
                    placeholder={placeholder}
                    inputMode={key === 'phone' || key === 'pincode' ? 'numeric' : undefined}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="fashion-primary fashion-save-address"
              disabled={!form.name || !form.phone || !form.line || !form.city || !form.pincode}
              onClick={() => {
                ctx.setAddresses((list) => [...list, { ...form, id: `a${Date.now()}`, default: list.length === 0 }])
                setShow(false)
                setLocationNote('')
                ctx.showToast('Address added')
              }}
            >
              Save & deliver here
            </button>
            <p className="fashion-address-assurance">
              <Zap size={13} fill="currentColor" /> Precise addresses help us maintain your express ETA
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationsScreen({ back }) {
  const notes = [
    { t: 'Order ORD-20481 is out for delivery', time: '2 min ago' },
    { t: 'Flash sale ends tonight — 50% off linen', time: '1 hr ago' },
    { t: 'Your review was published', time: 'Yesterday' },
  ]
  return (
    <div className="fade-in">
      <AppHeader title="Notifications" onBack={back} />
      <div style={{ padding: 16 }}>
        {notes.map((n, i) => (
          <div key={i} className="card" style={{ padding: 16, marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{n.t}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsScreen({ back }) {
  const ctx = useApp()
  const [push, setPush] = useState(true)
  return (
    <div className="fade-in">
      <AppHeader title="Settings" onBack={back} />
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Push Notifications</span>
          <button type="button" className={`toggle ${push ? 'on' : ''}`} onClick={() => setPush(!push)} aria-label="Toggle notifications" />
        </div>
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Name</label>
            <input defaultValue={ctx.user?.name} />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input defaultValue={ctx.user?.email} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input defaultValue={ctx.user?.phone} readOnly />
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-block" style={{ marginBottom: 10 }} onClick={() => ctx.showToast('Account deactivated (demo)')}>
          Deactivate Account
        </button>
        <button type="button" className="btn btn-danger btn-block" onClick={() => ctx.showToast('Delete requested (demo)')}>
          Delete Account
        </button>
      </div>
    </div>
  )
}

function ReviewScreen({ back }) {
  const ctx = useApp()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  return (
    <div className="fade-in">
      <AppHeader title="Review & Rating" onBack={back} />
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ marginBottom: 12, color: 'var(--muted)', fontSize: 14 }}>Rate your apparels (1–5 stars)</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} style={{ color: n <= rating ? '#f5a524' : 'var(--line)' }}>
                <Star size={28} fill={n <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <div className="field">
            <label>Your review</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience…" />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            onClick={() => {
              ctx.showToast('Review submitted')
              back()
            }}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  )
}
