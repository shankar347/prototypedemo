import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  UserCog,
  Tags,
  Shirt,
  Ticket,
  Settings,
  Wallet,
  ShoppingBag,
  Percent,
  Menu,
  LogOut,
  Check,
  X,
  Plus,
} from 'lucide-react'
import { GeometricAccent } from '../components/ui'
import {
  ADMIN_CUSTOMERS,
  ADMIN_VENDORS,
  ADMIN_DRIVERS,
  COUPONS,
  ORDERS,
  CATEGORIES,
  PRODUCTS,
  formatINR,
} from '../data/mockData'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'drivers', label: 'Drivers', icon: Bike },
  { id: 'users', label: 'Manage Users', icon: UserCog },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'apparels', label: 'Apparels', icon: Shirt },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'commission', label: 'Commission', icon: Percent },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vendors, setVendors] = useState(ADMIN_VENDORS)
  const [drivers, setDrivers] = useState(ADMIN_DRIVERS)
  const [coupons, setCoupons] = useState(COUPONS)
  const [commission, setCommission] = useState(12)
  const [toast, setToast] = useState('')
  const [customerDetail, setCustomerDetail] = useState(null)

  const notify = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return (
    <div className="panel-layout">
      <aside className={`panel-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 10px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>QApparel Admin</div>
          <div style={{ fontSize: 12, opacity: 0.55 }}>Super Admin</div>
        </div>
        {NAV.map((n) => {
          const Icon = n.icon
          return (
            <button
              key={n.id}
              type="button"
              className={`panel-nav-item ${section === n.id ? 'active' : ''}`}
              onClick={() => {
                setSection(n.id)
                setSidebarOpen(false)
                setCustomerDetail(null)
              }}
            >
              <Icon size={18} /> {n.label}
            </button>
          )
        })}
        <button type="button" className="panel-nav-item" style={{ marginTop: 'auto' }} onClick={() => setAuthed(false)}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="panel-main">
        <div className="panel-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" id="admin-menu" className="btn btn-ghost" style={{ height: 40, padding: '0 12px', display: 'none' }} onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <style>{`@media(max-width:900px){#admin-menu{display:inline-flex !important}}`}</style>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--slate)' }}>
                {NAV.find((n) => n.id === section)?.label}
              </h1>
              <Link to="/" style={{ fontSize: 12, color: 'var(--muted)' }}>← Portal</Link>
            </div>
          </div>
          <span className="badge badge-teal">Live</span>
        </div>

        <div className="panel-content fade-in">
          {section === 'dashboard' && <AdminDashboard />}
          {section === 'customers' && (
            <Customers
              detail={customerDetail}
              setDetail={setCustomerDetail}
            />
          )}
          {section === 'vendors' && <Vendors vendors={vendors} setVendors={setVendors} notify={notify} />}
          {section === 'drivers' && <Drivers drivers={drivers} setDrivers={setDrivers} notify={notify} />}
          {section === 'users' && <ManageUsers notify={notify} />}
          {section === 'categories' && <AdminCategories notify={notify} />}
          {section === 'apparels' && <ApparelsMgmt />}
          {section === 'coupons' && <CouponMgmt coupons={coupons} setCoupons={setCoupons} notify={notify} />}
          {section === 'orders' && <AdminOrders />}
          {section === 'payments' && <AdminPayments notify={notify} />}
          {section === 'commission' && (
            <CommissionMgmt commission={commission} setCommission={setCommission} notify={notify} />
          )}
          {section === 'settings' && <AdminSettings notify={notify} />}
        </div>
      </main>
      {toast && <div className="toast">{toast}</div>}
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

function AdminLogin({ onLogin }) {
  return (
    <div className="paper-bg" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <GeometricAccent position="tr" size={200} />
      <GeometricAccent position="bl" size={140} />
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32, zIndex: 1 }}>
        <Link to="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← Portal</Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--slate)', margin: '16px 0 8px' }}>Admin Login</h1>
        <div className="field" style={{ marginBottom: 12 }}><label>Username</label><input placeholder="admin" /></div>
        <div className="field" style={{ marginBottom: 20 }}><label>Password</label><input type="password" placeholder="••••••••" /></div>
        <button type="button" className="btn btn-primary btn-block" onClick={onLogin}>Login</button>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="stat-grid">
      {[
        ['Customers', '1,284'],
        ['Active Vendors', '46'],
        ['Drivers Online', '28'],
        ['Orders Today', '192'],
        ['GMV', '₹4.8L'],
        ['Pending KYC', '7'],
      ].map(([label, value]) => (
        <div key={label} className="stat-card">
          <div className="label">{label}</div>
          <div className="value" style={{ fontSize: 26 }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

function Customers({ detail, setDetail }) {
  if (detail) {
    return (
      <div className="card" style={{ padding: 24, maxWidth: 640 }}>
        <button type="button" onClick={() => setDetail(null)} style={{ marginBottom: 16, color: 'var(--teal-dark)', fontWeight: 600 }}>← Back</button>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>{detail.name}</h3>
        <p><strong>Email:</strong> {detail.email}</p>
        <p><strong>Phone:</strong> {detail.phone}</p>
        <p style={{ marginTop: 12 }}><strong>Order history:</strong> {detail.orders} orders</p>
        <p><strong>Payment methods:</strong> UPI, Card ending 4242</p>
        <p><strong>Addresses:</strong> Home (default), Work</p>
      </div>
    )
  }
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {ADMIN_CUSTOMERS.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.orders}</td>
              <td><span className={`badge ${c.status === 'Active' ? 'badge-teal' : 'badge-slate'}`}>{c.status}</span></td>
              <td><button type="button" className="btn btn-secondary" style={{ height: 34 }} onClick={() => setDetail(c)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Vendors({ vendors, setVendors, notify }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr><th>Vendor</th><th>Owner</th><th>Docs</th><th>Sales</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.owner}</td>
              <td><span className={`badge ${v.docs === 'Approved' ? 'badge-teal' : 'badge-warn'}`}>{v.docs}</span></td>
              <td>{v.sales}</td>
              <td>{v.status}</td>
              <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {v.docs === 'Pending' && (
                  <>
                    <button type="button" className="btn btn-primary" style={{ height: 32, padding: '0 10px' }} onClick={() => {
                      setVendors((list) => list.map((x) => x.id === v.id ? { ...x, docs: 'Approved', status: 'Active' } : x))
                      notify('Vendor approved')
                    }}><Check size={14} /></button>
                    <button type="button" className="btn btn-danger" style={{ height: 32, padding: '0 10px' }} onClick={() => notify('Vendor rejected')}><X size={14} /></button>
                  </>
                )}
                {v.status === 'Active' && (
                  <button type="button" className="btn btn-ghost" style={{ height: 32 }} onClick={() => {
                    setVendors((list) => list.map((x) => x.id === v.id ? { ...x, status: 'Suspended' } : x))
                    notify('Vendor suspended')
                  }}>Suspend</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Drivers({ drivers, setDrivers, notify }) {
  const [reason, setReason] = useState('')
  return (
    <>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr><th>Driver</th><th>Vehicle</th><th>KYC</th><th>Zone</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.name}<br /><span style={{ fontSize: 12, color: 'var(--muted)' }}>{d.phone}</span></td>
                <td>{d.vehicle}</td>
                <td><span className={`badge ${d.kyc === 'Verified' ? 'badge-teal' : 'badge-warn'}`}>{d.kyc}</span></td>
                <td>
                  <select
                    value={d.zone}
                    onChange={(e) => setDrivers((list) => list.map((x) => x.id === d.id ? { ...x, zone: e.target.value } : x))}
                    style={{ height: 34, borderRadius: 8, border: '1px solid var(--line)', padding: '0 8px' }}
                  >
                    {['East', 'West', 'South', 'Central', 'North'].map((z) => <option key={z}>{z}</option>)}
                  </select>
                </td>
                <td>{d.status}</td>
                <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {d.kyc === 'Pending' && (
                    <button type="button" className="btn btn-primary" style={{ height: 32 }} onClick={() => {
                      setDrivers((list) => list.map((x) => x.id === d.id ? { ...x, kyc: 'Verified', status: 'Active' } : x))
                      notify('Driver KYC approved')
                    }}>Approve</button>
                  )}
                  <button type="button" className="btn btn-ghost" style={{ height: 32 }} onClick={() => notify(`Assigned task to ${d.name}`)}>Assign Task</button>
                  <button type="button" className="btn btn-danger" style={{ height: 32 }} onClick={() => {
                    const r = reason || prompt('Blacklist / suspend reason:')
                    if (r) {
                      setReason(r)
                      setDrivers((list) => list.map((x) => x.id === d.id ? { ...x, status: 'Suspended' } : x))
                      notify(`Suspended: ${r}`)
                    }
                  }}>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>KYC covers ID, license & insurance · document uploads tracked per driver</p>
    </>
  )
}

function ManageUsers({ notify }) {
  const [users, setUsers] = useState([
    { name: 'Asha (Ops)', role: 'Orders + Vendors' },
    { name: 'Dev (Support)', role: 'Customers only' },
  ])
  return (
    <div className="card" style={{ padding: 24, maxWidth: 520 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Sub-admins & Roles</h3>
      {users.map((u, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
          <span>{u.name}</span>
          <span className="badge badge-slate">{u.role}</span>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 16 }}
        onClick={() => {
          setUsers((u) => [...u, { name: 'New Sub-admin', role: 'Custom permissions' }])
          notify('Sub-admin created')
        }}
      >
        <Plus size={16} /> Create Sub-admin
      </button>
    </div>
  )
}

function AdminCategories({ notify }) {
  const [cats, setCats] = useState(CATEGORIES)
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= cats.length) return
    const next = [...cats]
    ;[next[i], next[j]] = [next[j], next[i]]
    setCats(next)
    notify('Category order updated')
  }
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Order</th><th>Category</th><th>Subcategories</th><th>Reorder</th></tr></thead>
        <tbody>
          {cats.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td>{c.sub.join(', ')}</td>
              <td>
                <button type="button" className="btn btn-ghost" style={{ height: 32, marginRight: 6 }} onClick={() => move(i, -1)}>↑</button>
                <button type="button" className="btn btn-ghost" style={{ height: 32 }} onClick={() => move(i, 1)}>↓</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ApparelsMgmt() {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Apparel</th><th>Brand</th><th>Category</th><th>Price</th><th>Vendor Package</th></tr></thead>
        <tbody>
          {PRODUCTS.map((p) => (
            <tr key={p.id}>
              <td style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={p.image} alt="" style={{ width: 36, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                {p.title}
              </td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>{formatINR(p.price)}</td>
              <td><span className="badge badge-teal">Reviewed</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CouponMgmt({ coupons, setCoupons, notify }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button type="button" className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShow(true)}>
        <Plus size={16} /> Create Coupon
      </button>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Code</th><th>Type</th><th>Min Purchase</th><th>Limit</th><th>Expires</th><th>Active</th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.code}</strong></td>
                <td>{c.type}</td>
                <td>{formatINR(c.min)}</td>
                <td>{c.limit}</td>
                <td>{c.expires}</td>
                <td>
                  <button
                    type="button"
                    className={`toggle ${c.active ? 'on' : ''}`}
                    onClick={() => setCoupons((list) => list.map((x) => x.id === c.id ? { ...x, active: !x.active } : x))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>New Coupon</h3>
            {['Code', 'Discount type', 'Min purchase', 'Usage limit', 'Exclusions', 'Expiry'].map((f) => (
              <div className="field" key={f} style={{ marginBottom: 10 }}>
                <label>{f}</label>
                <input />
              </div>
            ))}
            <button type="button" className="btn btn-primary btn-block" onClick={() => { setShow(false); notify('Coupon created') }}>Save</button>
          </div>
        </div>
      )}
    </>
  )
}

function AdminOrders() {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Order</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>
          {ORDERS.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.date}</td>
              <td>{formatINR(o.amount)}</td>
              <td>{o.payment}</td>
              <td><span className="badge badge-teal">{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminPayments({ notify }) {
  const steps = ['Customer paid', 'In admin account', 'Commission deducted', 'Disburse to vendor', 'Status updated']
  const [step, setStep] = useState(1)
  return (
    <div className="card" style={{ padding: 24, maxWidth: 560 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Payment Workflow</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>TX-901 · Order VO-881 · {formatINR(3197)}</p>
      <div className="progress-steps" style={{ marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={s} className={`step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={step >= steps.length - 1}
        onClick={() => {
          setStep((s) => Math.min(s + 1, steps.length - 1))
          notify(steps[Math.min(step + 1, steps.length - 1)])
        }}
      >
        Advance Workflow
      </button>
    </div>
  )
}

function CommissionMgmt({ commission, setCommission, notify }) {
  return (
    <div className="card" style={{ padding: 24, maxWidth: 420 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Vendor Commission</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Percentage on each sale</p>
      <div className="field" style={{ marginBottom: 16 }}>
        <label>Commission %</label>
        <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} />
      </div>
      <button type="button" className="btn btn-primary" onClick={() => notify(`Commission set to ${commission}%`)}>
        Save Commission
      </button>
    </div>
  )
}

function AdminSettings({ notify }) {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>SEO Settings</h3>
        <div className="field" style={{ marginBottom: 12 }}><label>Meta Title</label><input defaultValue="QApparel — Quick Apparel Delivery" /></div>
        <div className="field" style={{ marginBottom: 12 }}><label>Meta Description</label><textarea defaultValue="Browse and order apparel with fast delivery." /></div>
        <div className="field"><label>Keywords</label><input defaultValue="apparel, fashion, q-commerce" /></div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Branding</h3>
        <div className="field" style={{ marginBottom: 12 }}><label>Logo</label><input type="file" accept="image/*" /></div>
        <div className="field" style={{ marginBottom: 16 }}><label>Favicon</label><input type="file" accept="image/*" /></div>
        <button type="button" className="btn btn-primary" onClick={() => notify('Settings saved')}>Save Settings</button>
      </div>
    </div>
  )
}
