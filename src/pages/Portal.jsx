import { Link } from 'react-router-dom'
import { GeometricAccent } from '../components/ui'
import { ShoppingBag, Store, Bike, Shield } from 'lucide-react'

const apps = [
  {
    to: '/user',
    title: 'Customer App',
    desc: 'Browse apparel, cart, checkout, orders & profile',
    icon: ShoppingBag,
    color: '#00c09f',
  },
  {
    to: '/vendor',
    title: 'Vendor Panel',
    desc: 'Manage shop, inventory, orders & payouts',
    icon: Store,
    color: '#13b59d',
  },
  {
    to: '/driver',
    title: 'Driver App',
    desc: 'Accept deliveries, navigate & confirm drops',
    icon: Bike,
    color: '#1a535c',
  },
  {
    to: '/admin',
    title: 'Admin Panel',
    desc: 'Customers, vendors, drivers, coupons & more',
    icon: Shield,
    color: '#0d3b40',
  },
]

export default function Portal() {
  return (
    <div className="paper-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <GeometricAccent position="tr" size={220} />
      <GeometricAccent position="bl" size={180} />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 24px 80px', position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: 48 }} className="fade-in">
          <p style={{ color: 'var(--teal-dark)', fontWeight: 700, letterSpacing: '0.08em', fontSize: 13, textTransform: 'uppercase', marginBottom: 12 }}>
            Q-Commerce Platform
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              color: 'var(--slate)',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            QApparel
          </h1>
          <p style={{ maxWidth: 520, color: 'var(--muted)', fontSize: 17, lineHeight: 1.6 }}>
            Apparel ordering & delivery — browse, buy, and track. Pick a role below to explore the full UI experience.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {apps.map((app, i) => {
            const Icon = app.icon
            return (
              <Link
                key={app.to}
                to={app.to}
                className="card slide-up"
                style={{
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  animationDelay: `${i * 0.08}s`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,83,92,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${app.color}18`,
                    color: app.color,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Icon size={26} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--slate)', marginBottom: 6 }}>
                    {app.title}
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>{app.desc}</p>
                </div>
                <span style={{ marginTop: 'auto', color: 'var(--teal-dark)', fontWeight: 700, fontSize: 14 }}>Open →</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
