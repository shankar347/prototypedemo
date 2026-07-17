import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  formatINR,
} from '../data/mockData'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function UserApp() {
  const ctx = useApp()
  const [tab, setTab] = useState('home')
  const [screen, setScreen] = useState(ctx.user ? 'home' : 'login')
  const [stack, setStack] = useState([])

  const go = (next, push = true) => {
    if (push && screen !== next) setStack((s) => [...s, screen])
    setScreen(next)
    if (['home', 'search', 'cart', 'profile'].includes(next)) setTab(next)
  }

  const back = () => {
    setStack((s) => {
      const prev = s[s.length - 1]
      if (prev) {
        setScreen(prev)
        if (['home', 'search', 'cart', 'profile'].includes(prev)) setTab(prev)
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

  const showNav = ctx.user && ['home', 'search', 'cart', 'profile'].includes(screen)

  return (
    <PhoneShell
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
      {screen === 'home' && <HomeScreen go={go} />}
      {screen === 'search' && <SearchScreen go={go} />}
      {screen === 'cart' && <CartScreen go={go} />}
      {screen === 'checkout' && <CheckoutScreen go={go} back={back} />}
      {screen === 'profile' && <ProfileScreen go={go} />}
      {screen === 'orders' && <OrdersScreen go={go} back={back} />}
      {screen === 'orderDetail' && <OrderDetailScreen go={go} back={back} />}
      {screen === 'addresses' && <AddressesScreen back={back} />}
      {screen === 'product' && <ProductScreen go={go} back={back} />}
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
      {ctx.toast && <div className="toast">{ctx.toast}</div>}
    </PhoneShell>
  )
}

function AppHeader({ title, onBack, right, compact }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'linear-gradient(135deg, #7bd5f5 0%, #4db8e8 45%, #1e4a6e 160%)',
        color: 'white',
        padding: compact ? '14px 16px' : '18px 16px 20px',
        overflow: 'hidden',
      }}
    >
      <GeometricAccent position="tr" size={110} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
        {onBack ? (
          <button type="button" onClick={onBack} aria-label="Back" style={{ color: 'white', display: 'grid', placeItems: 'center' }}>
            <ArrowLeft size={22} />
          </button>
        ) : (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/logo.png"
              alt="KudiCart"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                background: '#EBF5FB',
                boxShadow: '0 4px 12px rgba(15, 36, 56, 0.2)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>
              KudiCart
            </span>
          </Link>
        )}
        {title && onBack && (
          <h1 style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{title}</h1>
        )}
        {!onBack && <div style={{ flex: 1 }} />}
        {right}
      </div>
    </header>
  )
}

function LoginScreen({ onSend }) {
  const [phone, setPhone] = useState('')
  return (
    <div
      className="paper-bg"
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
        <p style={{ color: 'var(--muted)', marginBottom: 36, lineHeight: 1.5 }}>
          Enter your mobile number to browse & order apparel with OTP verification.
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
          className="btn btn-primary btn-block"
          disabled={phone.replace(/\D/g, '').length < 10}
          onClick={onSend}
          style={{ opacity: phone.replace(/\D/g, '').length < 10 ? 0.5 : 1 }}
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
      className="paper-bg fade-in"
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
          className="btn btn-primary btn-block"
          disabled={code.length < 4}
          style={{ opacity: code.length < 4 ? 0.5 : 1 }}
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

function HomeScreen({ go }) {
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

function SearchScreen({ go }) {
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

function ProductScreen({ go, back }) {
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
    <div className="paper-bg fade-in" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--teal-light)', display: 'grid', placeItems: 'center', marginBottom: 20, color: 'var(--teal)' }}>
        <Package size={36} />
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--slate)' }}>Order Placed!</h2>
      <p style={{ color: 'var(--muted)', margin: '10px 0 28px', lineHeight: 1.5 }}>Your apparel is being packed. Track live status from My Orders.</p>
      <button type="button" className="btn btn-primary" onClick={onDone}>
        Track Order
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

  return (
    <div className="fade-in">
      <AppHeader title="Addresses" onBack={back} right={<button type="button" onClick={() => setShow(true)} style={{ color: 'white' }}><Plus size={22} /></button>} />
      <div style={{ padding: 16 }}>
        {ctx.addresses.map((a) => (
          <div key={a.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Add Address</h3>
              <button type="button" onClick={() => setShow(false)}><X size={20} /></button>
            </div>
            {['label', 'name', 'phone', 'line', 'city', 'pincode'].map((k) => (
              <div className="field" key={k} style={{ marginBottom: 12 }}>
                <label style={{ textTransform: 'capitalize' }}>{k}</label>
                <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                ctx.setAddresses((list) => [...list, { ...form, id: `a${Date.now()}`, default: false }])
                setShow(false)
                ctx.showToast('Address added')
              }}
            >
              Save Address
            </button>
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
