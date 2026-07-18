import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Wallet,
  Layers,
  Bell,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Phone,
  ArrowLeft,
  Menu,
  Check,
} from 'lucide-react'
import { GeometricAccent } from '../components/ui'
import { VENDOR_ORDERS, VENDOR_ITEMS, formatINR, CATEGORIES } from '../data/mockData'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'items', label: 'Item Management', icon: Package },
  { id: 'orders', label: 'Order Management', icon: ShoppingBag },
  { id: 'track', label: 'Track Orders', icon: Truck },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'combos', label: 'Combo Management', icon: Layers },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const STAGES = ['Packed', 'Ready to pick up', 'Out for Delivery', 'Delivered']

export default function VendorApp() {
  const [authed, setAuthed] = useState(false)
  const [screen, setScreen] = useState('login')
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState(VENDOR_ORDERS)
  const [items, setItems] = useState(VENDOR_ITEMS)
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState(null)

  const notify = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  if (!authed) {
    if (screen === 'forgot') {
      return <ForgotPassword onBack={() => setScreen('login')} onDone={() => { setScreen('login'); notify('Password reset via email OTP') }} />
    }
    if (screen === 'profile-create') {
      return (
        <ProfileCreate
          onDone={() => {
            setAuthed(true)
            notify('Profile submitted for admin approval')
          }}
        />
      )
    }
    return (
      <VendorLogin
        onLogin={() => setAuthed(true)}
        onForgot={() => setScreen('forgot')}
        onCreate={() => setScreen('profile-create')}
        toast={toast}
      />
    )
  }

  return (
    <div className="panel-layout">
      <aside className={`panel-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 24px' }}>
          <img
            src="/logo.png"
            alt="KudiCart"
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#FFF1F2',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Vendor Panel</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Coastline Boutique</div>
          </div>
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
                setSelected(null)
              }}
            >
              <Icon size={18} /> {n.label}
            </button>
          )
        })}
        <button
          type="button"
          className="panel-nav-item"
          style={{ marginTop: 'auto' }}
          onClick={() => {
            setAuthed(false)
            setScreen('login')
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="panel-main">
        <div className="panel-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" className="btn btn-ghost" style={{ height: 40, padding: '0 12px', display: 'none' }} id="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <style>{`@media(max-width:900px){#menu-btn{display:inline-flex !important}}`}</style>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--slate)' }}>
                {NAV.find((n) => n.id === section)?.label}
              </h1>
              <Link to="/" style={{ fontSize: 12, color: 'var(--muted)' }}>← Back to portal</Link>
            </div>
          </div>
          <span className="badge badge-teal">Shop Open · 10:00–21:00</span>
        </div>

        <div className="panel-content fade-in">
          {section === 'dashboard' && <VendorDashboard orders={orders} onOpen={(o) => { setSelected(o); setSection('orders') }} />}
          {section === 'items' && <ItemManagement items={items} setItems={setItems} notify={notify} />}
          {section === 'orders' && (
            <OrderManagement
              orders={orders}
              setOrders={setOrders}
              selected={selected}
              setSelected={setSelected}
              notify={notify}
            />
          )}
          {section === 'track' && <TrackOrders orders={orders} />}
          {section === 'payments' && <PaymentMgmt />}
          {section === 'combos' && <ComboMgmt notify={notify} />}
          {section === 'notifications' && <VendorNotifs />}
          {section === 'settings' && <VendorSettings notify={notify} />}
        </div>
      </main>
      {toast && <div className="toast">{toast}</div>}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

function VendorLogin({ onLogin, onForgot, onCreate, toast }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  return (
    <div className="paper-bg" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <GeometricAccent position="tr" size={200} />
      <GeometricAccent position="bl" size={160} />
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 32, position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← Portal</Link>
        <div style={{ margin: '16px 0 8px' }}>
          <img
            src="/logo.png"
            alt="KudiCart"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#FFF1F2',
            }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--slate)', margin: '0 0 8px' }}>Vendor Login</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>Sign in with username & password</p>
        <div className="field" style={{ marginBottom: 14 }}>
          <label>Username</label>
          <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="vendor@coastline" />
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label>Password</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={onLogin}>Login</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
          <button type="button" style={{ color: 'var(--teal-dark)', fontWeight: 600 }} onClick={onForgot}>Forgot Password?</button>
          <button type="button" style={{ color: 'var(--slate)', fontWeight: 600 }} onClick={onCreate}>Create Shop Profile</button>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function ForgotPassword({ onBack, onDone }) {
  const [step, setStep] = useState(1)
  return (
    <div className="paper-bg" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        <button type="button" onClick={onBack} style={{ marginBottom: 16, color: 'var(--slate)' }}><ArrowLeft size={20} /></button>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Forgot Password</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Verify identity via email OTP</p>
        {step === 1 ? (
          <>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Registered Email</label>
              <input placeholder="owner@shop.com" />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={() => setStep(2)}>Send Email OTP</button>
          </>
        ) : (
          <>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Email OTP</label>
              <input placeholder="Enter OTP" />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>New Password</label>
              <input type="password" />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={onDone}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  )
}

function ProfileCreate({ onDone }) {
  const [step, setStep] = useState(1)
  return (
    <div className="paper-bg" style={{ minHeight: '100vh', padding: 24, display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 560, padding: 32, margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--slate)' }}>Create Shop Profile</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '8px 0 24px' }}>Step {step} of 3 — submitted for admin approval</p>
        {step === 1 && (
          <>
            <div className="field" style={{ marginBottom: 12 }}><label>Shop Name</label><input placeholder="Coastline Boutique" /></div>
            <div className="field" style={{ marginBottom: 12 }}><label>Owner Name</label><input /></div>
            <div className="field" style={{ marginBottom: 12 }}><label>Address</label><textarea /></div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="field" style={{ marginBottom: 12 }}><label>GST / Documents</label><input type="file" /></div>
            <div className="field" style={{ marginBottom: 12 }}><label>Shop Photo</label><input type="file" accept="image/*" /></div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field"><label>Opening Time</label><input type="time" defaultValue="10:00" /></div>
              <div className="field"><label>Closing Time</label><input type="time" defaultValue="21:00" /></div>
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {step > 1 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => (step < 3 ? setStep(step + 1) : onDone())}
          >
            {step < 3 ? 'Continue' : 'Submit for Approval'}
          </button>
        </div>
      </div>
    </div>
  )
}

function VendorDashboard({ orders, onOpen }) {
  const neu = orders.filter((o) => o.status === 'New')
  return (
    <>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="label">New Orders</div><div className="value">{neu.length}</div></div>
        <div className="stat-card"><div className="label">Ongoing</div><div className="value">{orders.filter((o) => o.status === 'Ongoing').length}</div></div>
        <div className="stat-card"><div className="label">Delivered Today</div><div className="value">{orders.filter((o) => o.status === 'Delivered').length}</div></div>
        <div className="stat-card"><div className="label">Revenue</div><div className="value" style={{ fontSize: 22 }}>₹12.4k</div></div>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12, color: 'var(--slate)' }}>New Order Details</h3>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Qty</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {neu.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.items.map((i) => i.title).join(', ')}</td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>{o.address}</td>
                <td><button type="button" className="btn btn-secondary" style={{ height: 36 }} onClick={() => onOpen(o)}>View</button></td>
              </tr>
            ))}
            {neu.length === 0 && <tr><td colSpan={6}>No new orders</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}

function ItemManagement({ items, setItems, notify }) {
  const [show, setShow] = useState(false)
  const [cats] = useState(CATEGORIES.map((c) => ({ ...c, active: true })))
  const [tab, setTab] = useState('items')

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button type="button" className={`chip ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>Items</button>
        <button type="button" className={`chip ${tab === 'cats' ? 'active' : ''}`} onClick={() => setTab('cats')}>Categories</button>
        <button type="button" className="btn btn-primary" style={{ marginLeft: 'auto', height: 40 }} onClick={() => setShow(true)}>
          <Plus size={16} /> Add {tab === 'items' ? 'Item' : 'Category'}
        </button>
      </div>

      {tab === 'cats' ? (
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Category</th><th>Subcategories</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.sub.join(', ')}</td>
                  <td><span className="badge badge-teal">Active</span></td>
                  <td><button type="button" className="btn btn-ghost" style={{ height: 32 }}><Pencil size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Size / Color</th>
                <th>Stock</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={it.image} alt="" style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    {it.title}
                  </td>
                  <td>{it.category}</td>
                  <td>{formatINR(it.price)}</td>
                  <td>{it.size} · {it.color}</td>
                  <td>
                    <button
                      type="button"
                      className={`toggle ${it.stock ? 'on' : ''}`}
                      onClick={() => setItems((list) => list.map((x) => (x.id === it.id ? { ...x, stock: !x.stock } : x)))}
                    />
                    <span style={{ marginLeft: 8, fontSize: 12 }}>{it.stock ? 'In Stock' : 'Out of Stock'}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`toggle ${it.active ? 'on' : ''}`}
                      onClick={() => {
                        setItems((list) => list.map((x) => (x.id === it.id ? { ...x, active: !x.active } : x)))
                        notify('Item status updated')
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Add Item</h3>
            {['Title', 'Description', 'Price', 'Size', 'Color'].map((f) => (
              <div className="field" key={f} style={{ marginBottom: 10 }}>
                <label>{f}</label>
                {f === 'Description' ? <textarea /> : <input />}
              </div>
            ))}
            <div className="field" style={{ marginBottom: 16 }}><label>Image</label><input type="file" accept="image/*" /></div>
            <button type="button" className="btn btn-primary btn-block" onClick={() => { setShow(false); notify('Item added') }}>Save Item</button>
          </div>
        </div>
      )}
    </>
  )
}

function OrderManagement({ orders, setOrders, selected, setSelected, notify }) {
  const [filter, setFilter] = useState('All')
  const list = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  if (selected) {
    return (
      <div className="card" style={{ padding: 24, maxWidth: 640 }}>
        <button type="button" onClick={() => setSelected(null)} style={{ marginBottom: 16, color: 'var(--slate)' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)' }}>{selected.id}</h3>
          <span className="badge badge-warn">{selected.status}</span>
        </div>
        <p style={{ marginBottom: 8 }}><strong>Customer:</strong> {selected.customer}</p>
        <p style={{ marginBottom: 8 }}><strong>Address:</strong> {selected.address}</p>
        <p style={{ marginBottom: 16 }}><strong>Phone:</strong> {selected.phone}</p>
        <h4 style={{ marginBottom: 8 }}>Items</h4>
        {selected.items.map((i, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <span>{i.title} ×{i.qty}</span>
            <span>{formatINR(i.price * i.qty)}</span>
          </div>
        ))}
        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selected.status === 'New' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setOrders((os) => os.map((o) => (o.id === selected.id ? { ...o, status: 'Ongoing', stage: 'Packed' } : o)))
                setSelected({ ...selected, status: 'Ongoing', stage: 'Packed' })
                notify('Order accepted')
              }}
            >
              <Check size={16} /> Accept Order
            </button>
          )}
          {selected.status === 'Ongoing' &&
            STAGES.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${selected.stage === s ? 'active' : ''}`}
                onClick={() => {
                  const done = s === 'Delivered'
                  setOrders((os) =>
                    os.map((o) =>
                      o.id === selected.id ? { ...o, stage: s, status: done ? 'Delivered' : 'Ongoing' } : o,
                    ),
                  )
                  setSelected({ ...selected, stage: s, status: done ? 'Delivered' : 'Ongoing' })
                  notify(`Status → ${s}`)
                }}
              >
                {s}
              </button>
            ))}
          <a className="btn btn-secondary" href={`tel:${selected.phone}`}>
            <Phone size={16} /> Contact Customer
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['All', 'New', 'Ongoing', 'Delivered'].map((f) => (
          <button key={f} type="button" className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Stage</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{formatINR(o.total)}</td>
                <td><span className={`badge ${o.status === 'Delivered' ? 'badge-teal' : o.status === 'New' ? 'badge-warn' : 'badge-slate'}`}>{o.status}</span></td>
                <td>{o.stage || '—'}</td>
                <td><button type="button" className="btn btn-secondary" style={{ height: 34 }} onClick={() => setSelected(o)}>Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function TrackOrders({ orders }) {
  return (
    <div className="stat-grid">
      {orders.filter((o) => o.status !== 'Delivered').map((o) => (
        <div key={o.id} className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>{o.id}</strong>
            <span className="badge badge-teal">{o.stage || o.status}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>{o.customer} · {o.address}</p>
          <div className="progress-steps" style={{ marginTop: 20 }}>
            {STAGES.map((s, i) => {
              const idx = STAGES.indexOf(o.stage || 'Packed')
              return <div key={s} className={`step ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}><span>{s.split(' ')[0]}</span></div>
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function PaymentMgmt() {
  const rows = [
    { id: 'TX-901', order: 'VO-881', amount: 3197, status: 'Pending payout', note: 'Awaiting admin commission cut' },
    { id: 'TX-880', order: 'VO-872', amount: 3299, status: 'Settled', note: 'Disbursed to vendor' },
  ]
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Txn</th><th>Order</th><th>Amount</th><th>Status</th><th>Note</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.order}</td>
              <td>{formatINR(r.amount)}</td>
              <td><span className={`badge ${r.status === 'Settled' ? 'badge-teal' : 'badge-warn'}`}>{r.status}</span></td>
              <td>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ComboMgmt({ notify }) {
  return (
    <div className="card" style={{ padding: 24, maxWidth: 520 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Create Apparel Combo</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Admin/vendor discounted bundles</p>
      <div className="field" style={{ marginBottom: 12 }}><label>Combo Title</label><input placeholder="Summer Essentials Kit" /></div>
      <div className="field" style={{ marginBottom: 12 }}><label>Items (comma separated)</label><input placeholder="Shirt, Tee, Cap" /></div>
      <div className="field" style={{ marginBottom: 12 }}><label>Combo Price</label><input type="number" placeholder="2499" /></div>
      <div className="field" style={{ marginBottom: 16 }}><label>Discount %</label><input type="number" placeholder="15" /></div>
      <button type="button" className="btn btn-primary" onClick={() => notify('Combo saved')}>Save Combo</button>
    </div>
  )
}

function VendorNotifs() {
  const notes = ['New order VO-881 received', 'Stock low: Midnight Denim Jacket', 'Payout TX-880 settled']
  return notes.map((n, i) => (
    <div key={i} className="card" style={{ padding: 16, marginBottom: 10 }}>{n}</div>
  ))
}

function VendorSettings({ notify }) {
  return (
    <div className="card" style={{ padding: 24, maxWidth: 480 }}>
      <div className="field" style={{ marginBottom: 12 }}><label>Shop Name</label><input defaultValue="Coastline Boutique" /></div>
      <div className="field" style={{ marginBottom: 12 }}><label>Opening</label><input type="time" defaultValue="10:00" /></div>
      <div className="field" style={{ marginBottom: 16 }}><label>Closing</label><input type="time" defaultValue="21:00" /></div>
      <button type="button" className="btn btn-primary" onClick={() => notify('Settings saved')}>Save Settings</button>
    </div>
  )
}
