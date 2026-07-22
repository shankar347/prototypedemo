import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  UserCog,
  Tags,
  Package,
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
  Upload,
  Download,
  Bell,
  BarChart3,
  Edit,
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
  DARKSTORE_ZONES,
  VENDOR_ZONE_INVENTORY,
  FEATURED_SHOPS,
  formatINR,
} from '../data/mockData'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'drivers', label: 'Drivers', icon: Bike },
  { id: 'darkstore', label: 'Darkstore', icon: Store },
  { id: 'users', label: 'Manage Users', icon: UserCog },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'vendor-stock', label: 'Vendor Zone Stock', icon: Package },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'commission', label: 'Commission', icon: Percent },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const ADMIN_MODULES = [
  'Dashboard',
  'Vendors',
  'Drivers',
  'Customers',
  'Orders',
  'Dark Stores',
  'Inventory',
  'Categories',
  'Products',
  'Zones',
  'Coupons',
  'Reports',
  'Settings',
  'Notifications',
  'Roles & Permissions',
]

const PERMISSION_ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Manage']

const INVENTORY_SAMPLE_CSV = `sku,name,category,zone,quantity,price
SKU-001,Aqua Linen Shirt,men,Zone A,45,1299
SKU-002,Trail Runner Sneakers,footwear,Zone B,28,3299
SKU-003,Noir Eau de Parfum,fragrances,Zone A,12,1899`

function StatusBadge({ status }) {
  const cls =
    status === 'Active' || status === 'Verified'
      ? 'badge-teal'
      : status === 'Suspended'
        ? 'badge-danger'
        : status === 'Pending'
          ? 'badge-warn'
          : 'badge-slate'
  return <span className={`badge ${cls}`}>{status}</span>
}

function ConfirmDialog({ open, title, message, confirmLabel, loading, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" disabled={loading} onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-primary" disabled={loading} onClick={onConfirm}>
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const [vendorFocus, setVendorFocus] = useState(null)

  const notify = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return (
    <div className="panel-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="panel-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`panel-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>KudiCart Admin</div>
            <div style={{ fontSize: 12, opacity: 0.55 }}>Super Admin</div>
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
        <div className="panel-sidebar-version">v 1.0</div>
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
          {section === 'dashboard' && (
            <AdminDashboard
              onActiveVendors={() => {
                setVendorFocus(null)
                setSection('vendors')
              }}
            />
          )}
          {section === 'customers' && (
            <Customers
              detail={customerDetail}
              setDetail={setCustomerDetail}
            />
          )}
          {section === 'vendors' && (
            <Vendors
              vendors={vendors}
              setVendors={setVendors}
              notify={notify}
              focusVendorId={vendorFocus}
              onFocusVendor={setVendorFocus}
            />
          )}
          {section === 'drivers' && <Drivers drivers={drivers} setDrivers={setDrivers} notify={notify} />}
          {section === 'darkstore' && <DarkStoreMonitor />}
          {section === 'users' && <ManageUsers notify={notify} />}
          {section === 'categories' && <AdminCategories notify={notify} />}
          {section === 'vendor-stock' && <VendorZoneStockMgmt vendors={vendors} />}
          {section === 'coupons' && <CouponMgmt coupons={coupons} setCoupons={setCoupons} notify={notify} />}
          {section === 'orders' && <AdminOrders />}
          {section === 'payments' && <AdminPayments notify={notify} />}
          {section === 'reports' && <AdminReports />}
          {section === 'commission' && (
            <CommissionMgmt commission={commission} setCommission={setCommission} notify={notify} />
          )}
          {section === 'notifications' && <AdminNotifications notify={notify} />}
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
              boxShadow: '0 6px 16px rgba(47,143,212,0.2)',
            }}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--slate)', margin: '0 0 8px' }}>Admin Login</h1>
        <div className="field" style={{ marginBottom: 12 }}><label>Username</label><input placeholder="admin" /></div>
        <div className="field" style={{ marginBottom: 20 }}><label>Password</label><input type="password" placeholder="••••••••" /></div>
        <button type="button" className="btn btn-primary btn-block" onClick={onLogin}>Login</button>
      </div>
    </div>
  )
}

function AdminDashboard({ onActiveVendors }) {
  return (
    <div className="stat-grid">
      {[
        ['Customers', '1,284', null],
        ['Active Vendors', '46', onActiveVendors],
        ['Drivers Online', '28', null],
        ['Orders Today', '192', null],
        ['GMV', '₹4.8L', null],
        ['Pending KYC', '7', null],
      ].map(([label, value, onClick]) => (
        <button
          key={label}
          type="button"
          className={`stat-card${onClick ? ' stat-card-clickable' : ''}`}
          onClick={onClick || undefined}
          style={onClick ? { cursor: 'pointer', textAlign: 'left' } : undefined}
        >
          <div className="label">{label}</div>
          <div className="value" style={{ fontSize: 26 }}>{value}</div>
        </button>
      ))}
    </div>
  )
}

const DARK_ZONE_ORDERS_SEED = [
  { id: 'ORD-A01', zone: 'Zone A', status: 'Current', items: 4, driver: 'Kiran P', placedAt: '10:12 AM', pickedAt: '10:18 AM', packedAt: '10:22 AM', deliveredAt: '—', eta: '12 min', sla: 'On track' },
  { id: 'ORD-A02', zone: 'Zone A', status: 'Completed', items: 2, driver: 'Ravi S', placedAt: '09:40 AM', pickedAt: '09:46 AM', packedAt: '09:51 AM', deliveredAt: '10:08 AM', eta: '28 min', sla: 'Met' },
  { id: 'ORD-A03', zone: 'Zone A', status: 'Pending', items: 3, driver: '—', placedAt: '10:31 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '18 min', sla: 'Queued' },
  { id: 'ORD-A04', zone: 'Zone A', status: 'Cancelled', items: 1, driver: '—', placedAt: '09:05 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '—', sla: 'Customer cancel' },
  { id: 'ORD-B01', zone: 'Zone B', status: 'Current', items: 5, driver: 'Imran A', placedAt: '10:05 AM', pickedAt: '10:11 AM', packedAt: '10:16 AM', deliveredAt: '—', eta: '15 min', sla: 'On track' },
  { id: 'ORD-B02', zone: 'Zone B', status: 'Completed', items: 2, driver: 'Kiran P', placedAt: '08:55 AM', pickedAt: '09:01 AM', packedAt: '09:06 AM', deliveredAt: '09:24 AM', eta: '29 min', sla: 'Met' },
  { id: 'ORD-B03', zone: 'Zone B', status: 'Pending', items: 1, driver: '—', placedAt: '10:28 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '20 min', sla: 'Queued' },
  { id: 'ORD-B04', zone: 'Zone B', status: 'Cancelled', items: 2, driver: '—', placedAt: '08:20 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '—', sla: 'OOS cancel' },
  { id: 'ORD-C01', zone: 'Zone C', status: 'Current', items: 3, driver: 'Ravi S', placedAt: '10:20 AM', pickedAt: '10:27 AM', packedAt: '—', deliveredAt: '—', eta: '22 min', sla: 'At risk' },
  { id: 'ORD-C02', zone: 'Zone C', status: 'Completed', items: 4, driver: 'Imran A', placedAt: '09:10 AM', pickedAt: '09:18 AM', packedAt: '09:25 AM', deliveredAt: '09:48 AM', eta: '38 min', sla: 'Breached' },
  { id: 'ORD-C03', zone: 'Zone C', status: 'Pending', items: 2, driver: '—', placedAt: '10:35 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '25 min', sla: 'Queued' },
  { id: 'ORD-C04', zone: 'Zone C', status: 'Cancelled', items: 1, driver: '—', placedAt: '09:50 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '—', sla: 'Payment fail' },
  { id: 'ORD-D01', zone: 'Zone D', status: 'Current', items: 2, driver: 'Kiran P', placedAt: '10:08 AM', pickedAt: '10:14 AM', packedAt: '10:19 AM', deliveredAt: '—', eta: '14 min', sla: 'On track' },
  { id: 'ORD-D02', zone: 'Zone D', status: 'Completed', items: 3, driver: 'Ravi S', placedAt: '08:40 AM', pickedAt: '08:47 AM', packedAt: '08:53 AM', deliveredAt: '09:12 AM', eta: '32 min', sla: 'Met' },
  { id: 'ORD-D03', zone: 'Zone D', status: 'Pending', items: 1, driver: '—', placedAt: '10:33 AM', pickedAt: '—', packedAt: '—', deliveredAt: '—', eta: '16 min', sla: 'Queued' },
  { id: 'ORD-D04', zone: 'Zone D', status: 'Completed', items: 2, driver: 'Imran A', placedAt: '09:22 AM', pickedAt: '09:28 AM', packedAt: '09:34 AM', deliveredAt: '09:55 AM', eta: '33 min', sla: 'Met' },
]

function orderBadgeClass(status) {
  if (status === 'Completed') return 'badge-teal'
  if (status === 'Current') return 'badge-warn'
  if (status === 'Pending') return 'badge-slate'
  if (status === 'Cancelled') return 'badge-danger'
  return 'badge-slate'
}

function DarkStoreMonitor() {
  const [live, setLive] = useState(true)
  const [tab, setTab] = useState('monitor')
  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [zoneDetailTab, setZoneDetailTab] = useState('orders')
  const [orderFilter, setOrderFilter] = useState('All')
  const [zones, setZones] = useState([
    { id: 'Zone A', stock: 1240, capacity: 1600, pickers: 6, autoPick: true, lowThreshold: 260, storeCount: 8, driverCount: 12, ridersOnline: 9, enabled: true, oosSkus: 4, avgEtaMin: 26, fillRate: 97, pickRate: 48 },
    { id: 'Zone B', stock: 860, capacity: 1400, pickers: 4, autoPick: true, lowThreshold: 240, storeCount: 6, driverCount: 9, ridersOnline: 7, enabled: true, oosSkus: 8, avgEtaMin: 29, fillRate: 94, pickRate: 42 },
    { id: 'Zone C', stock: 210, capacity: 900, pickers: 3, autoPick: false, lowThreshold: 220, storeCount: 4, driverCount: 5, ridersOnline: 3, enabled: true, oosSkus: 21, avgEtaMin: 38, fillRate: 86, pickRate: 31 },
    { id: 'Zone D', stock: 980, capacity: 1400, pickers: 5, autoPick: true, lowThreshold: 240, storeCount: 7, driverCount: 11, ridersOnline: 8, enabled: false, oosSkus: 6, avgEtaMin: 30, fillRate: 95, pickRate: 44 },
  ])
  const [editZone, setEditZone] = useState(null)
  const [zoneOrders] = useState(DARK_ZONE_ORDERS_SEED)
  const [inventory, setInventory] = useState([
    { sku: 'SKU-001', name: 'Aqua Linen Shirt', category: 'men', zone: 'Zone A', quantity: 45, price: 1299, reserved: 6, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=240&fit=crop' },
    { sku: 'SKU-002', name: 'Trail Runner Sneakers', category: 'footwear', zone: 'Zone B', quantity: 28, price: 3299, reserved: 3, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=240&fit=crop' },
    { sku: 'SKU-003', name: 'Noir Eau de Parfum', category: 'fragrances', zone: 'Zone A', quantity: 12, price: 1899, reserved: 2, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=240&fit=crop' },
    { sku: 'SKU-004', name: 'Classic Tote Bag', category: 'bags', zone: 'Zone C', quantity: 18, price: 2499, reserved: 4, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=240&fit=crop' },
    { sku: 'SKU-005', name: 'Banarasi Silk Saree', category: 'ethnic', zone: 'Zone A', quantity: 9, price: 499, reserved: 2, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=240&fit=crop' },
    { sku: 'SKU-006', name: 'Sequin Party Gown', category: 'party', zone: 'Zone B', quantity: 5, price: 499, reserved: 1, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=240&fit=crop' },
    { sku: 'SKU-007', name: 'Formal Blazer Set', category: 'formal', zone: 'Zone D', quantity: 14, price: 499, reserved: 0, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=240&fit=crop' },
    { sku: 'SKU-008', name: 'Cotton Co-ord Set', category: 'casual', zone: 'Zone C', quantity: 2, price: 499, reserved: 1, image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=200&h=240&fit=crop' },
  ])
  const [uploadState, setUploadState] = useState({ loading: false, result: null, error: '' })
  const [tasks, setTasks] = useState([
    { id: 'T1', order: 'ORD-A01', zone: 'Zone A', eta: '12 min', status: 'Picking' },
    { id: 'T2', order: 'ORD-B01', zone: 'Zone B', eta: '15 min', status: 'Packed' },
    { id: 'T3', order: 'ORD-C01', zone: 'Zone C', eta: '22 min', status: 'Queued' },
    { id: 'T4', order: 'ORD-D01', zone: 'Zone D', eta: '14 min', status: 'Picking' },
  ])

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => {
          const wiggle = Math.round((Math.random() - 0.35) * 40)
          const nextStock = Math.max(0, Math.min(z.capacity, z.stock + wiggle))
          return { ...z, stock: nextStock }
        }),
      )
      setTasks((prev) =>
        prev.map((task) => {
          if (task.status === 'Dispatched') return task
          if (Math.random() < 0.18) {
            const nextStatus =
              task.status === 'Queued' ? 'Picking' : task.status === 'Picking' ? 'Packed' : task.status === 'Packed' ? 'Dispatched' : task.status
            return { ...task, status: nextStatus }
          }
          return task
        }),
      )
    }, 2600)
    return () => clearInterval(t)
  }, [live])

  const zoneOrderStats = (zoneId) => {
    const list = zoneOrders.filter((o) => o.zone === zoneId)
    return {
      total: list.length,
      current: list.filter((o) => o.status === 'Current').length,
      completed: list.filter((o) => o.status === 'Completed').length,
      pending: list.filter((o) => o.status === 'Pending').length,
      cancelled: list.filter((o) => o.status === 'Cancelled').length,
    }
  }

  const totalStock = zones.reduce((s, z) => s + z.stock, 0)
  const pickersOnline = zones.reduce((s, z) => s + z.pickers, 0)
  const ridersOnline = zones.reduce((s, z) => s + (z.enabled ? z.ridersOnline : 0), 0)
  const dispatchInProgress = tasks.filter((t) => ['Picking', 'Packed'].includes(t.status)).length
  const lowZones = zones.filter((z) => z.stock <= z.lowThreshold)
  const allOrdersToday = zoneOrders.length
  const completedToday = zoneOrders.filter((o) => o.status === 'Completed').length
  const cancelledToday = zoneOrders.filter((o) => o.status === 'Cancelled').length
  const selectedZoneData = zones.find((z) => z.id === selectedZoneId)
  const selectedStats = selectedZoneId ? zoneOrderStats(selectedZoneId) : null
  const filteredOrders = selectedZoneId
    ? zoneOrders.filter((o) => {
        if (o.zone !== selectedZoneId) return false
        if (orderFilter === 'All') return true
        return o.status === orderFilter
      })
    : []
  const zoneStockItems = selectedZoneId ? inventory.filter((i) => i.zone === selectedZoneId) : []

  const advanceTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const nextStatus =
          t.status === 'Queued' ? 'Picking' : t.status === 'Picking' ? 'Packed' : t.status === 'Packed' ? 'Dispatched' : t.status
        return { ...t, status: nextStatus }
      }),
    )
  }

  const downloadSampleTemplate = () => {
    const blob = new Blob([INVENTORY_SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory_sample_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportInventory = () => {
    const header = 'sku,name,category,zone,quantity,price'
    const rows = inventory.map((item) => `${item.sku},${item.name},${item.category},${item.zone},${item.quantity},${item.price}`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'darkstore_inventory_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const parseInventoryFile = (text, fileName) => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) {
      throw new Error('File must contain a header row and at least one data row.')
    }
    const header = lines[0].toLowerCase().split(',').map((h) => h.trim())
    const required = ['sku', 'name', 'category', 'zone', 'quantity', 'price']
    const missing = required.filter((col) => !header.includes(col))
    if (missing.length) {
      throw new Error(`Missing columns: ${missing.join(', ')}`)
    }
    const idx = Object.fromEntries(required.map((col) => [col, header.indexOf(col)]))
    const existingSkus = new Set(inventory.map((i) => i.sku))
    const seen = new Set()
    const success = []
    const failed = []

    lines.slice(1).forEach((line, rowIndex) => {
      const cols = line.split(',').map((c) => c.trim())
      const rowNum = rowIndex + 2
      const sku = cols[idx.sku]
      const name = cols[idx.name]
      const category = cols[idx.category]
      const zone = cols[idx.zone]
      const quantity = Number(cols[idx.quantity])
      const price = Number(cols[idx.price])

      if (!sku || !name || !category || !zone) {
        failed.push({ row: rowNum, sku: sku || '—', reason: 'Missing required field(s)' })
        return
      }
      if (Number.isNaN(quantity) || quantity < 0) {
        failed.push({ row: rowNum, sku, reason: 'Invalid quantity' })
        return
      }
      if (Number.isNaN(price) || price <= 0) {
        failed.push({ row: rowNum, sku, reason: 'Invalid price' })
        return
      }
      if (seen.has(sku)) {
        failed.push({ row: rowNum, sku, reason: 'Duplicate SKU in file' })
        return
      }
      seen.add(sku)

      const item = {
        sku,
        name,
        category,
        zone,
        quantity,
        price,
        reserved: 0,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=240&fit=crop',
      }
      if (existingSkus.has(sku)) {
        failed.push({ row: rowNum, sku, reason: 'Duplicate SKU already in inventory' })
        return
      }
      success.push(item)
    })

    return { success, failed, fileName }
  }

  const handleInventoryUpload = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setUploadState({ loading: false, result: null, error: 'Only CSV or Excel files are supported.' })
      return
    }
    setUploadState({ loading: true, result: null, error: '' })
    const reader = new FileReader()
    reader.onload = () => {
      setTimeout(() => {
        try {
          const text = String(reader.result || '')
          const result = parseInventoryFile(text, file.name)
          if (result.success.length) {
            setInventory((prev) => [...prev, ...result.success])
          }
          setUploadState({ loading: false, result, error: '' })
        } catch (err) {
          setUploadState({ loading: false, result: null, error: err.message || 'Upload failed' })
        }
      }, 600)
    }
    reader.onerror = () => setUploadState({ loading: false, result: null, error: 'Could not read file.' })
    reader.readAsText(file)
  }

  const saveZoneEdit = () => {
    if (!editZone) return
    setZones((prev) => prev.map((z) => (z.id === editZone.id ? { ...z, ...editZone } : z)))
    setEditZone(null)
  }

  const openZone = (zoneId) => {
    setSelectedZoneId(zoneId)
    setZoneDetailTab('orders')
    setOrderFilter('All')
  }

  // Zone detail page — neat separate view
  if (selectedZoneId && selectedZoneData && selectedStats) {
    const pct = Math.max(0, Math.min(1, selectedZoneData.stock / selectedZoneData.capacity))
    const isLow = selectedZoneData.stock <= selectedZoneData.lowThreshold

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ height: 40, borderRadius: 12, fontWeight: 700 }}
            onClick={() => setSelectedZoneId(null)}
          >
            ← All Zones
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--slate)' }}>
              {selectedZoneData.id}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              Stores {selectedZoneData.storeCount} · Drivers {selectedZoneData.driverCount} · Riders online {selectedZoneData.ridersOnline}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!selectedZoneData.enabled && <span className="badge badge-slate">Disabled</span>}
            {isLow ? <span className="badge badge-danger">Low stock</span> : <span className="badge badge-teal">Stock OK</span>}
            <button
              type="button"
              className={selectedZoneData.autoPick ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ height: 40, borderRadius: 12, fontWeight: 700 }}
              onClick={() =>
                setZones((prev) =>
                  prev.map((x) => (x.id === selectedZoneId ? { ...x, autoPick: !x.autoPick } : x)),
                )
              }
            >
              {selectedZoneData.autoPick ? 'Auto Accept: ON' : 'Auto Accept: OFF'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ height: 40, borderRadius: 12, fontWeight: 700 }}
              onClick={() => setEditZone({ ...selectedZoneData })}
            >
              <Edit size={14} /> Edit
            </button>
            <button
              type="button"
              className={selectedZoneData.enabled ? 'btn btn-danger' : 'btn btn-primary'}
              style={{ height: 40, borderRadius: 12, fontWeight: 700 }}
              onClick={() =>
                setZones((prev) =>
                  prev.map((x) => (x.id === selectedZoneId ? { ...x, enabled: !x.enabled } : x)),
                )
              }
            >
              {selectedZoneData.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: 16 }}>
          <DarkStat label="Current Orders" value={selectedStats.current} />
          <DarkStat label="Completed" value={selectedStats.completed} />
          <DarkStat label="Pending" value={selectedStats.pending} />
          <DarkStat label="Cancelled" value={selectedStats.cancelled} />
          <DarkStat label="Available Stock" value={selectedZoneData.stock.toLocaleString('en-IN')} />
          <DarkStat label="Fill Rate" value={`${selectedZoneData.fillRate}%`} />
          <DarkStat label="Avg ETA" value={`${selectedZoneData.avgEtaMin}m`} />
          <DarkStat label="OOS SKUs" value={selectedZoneData.oosSkus} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={zoneDetailTab === 'orders' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ height: 40, borderRadius: 12, fontWeight: 700 }}
            onClick={() => setZoneDetailTab('orders')}
          >
            Orders
          </button>
          <button
            type="button"
            className={zoneDetailTab === 'stock' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ height: 40, borderRadius: 12, fontWeight: 700 }}
            onClick={() => setZoneDetailTab('stock')}
          >
            Stock
          </button>
        </div>

        {zoneDetailTab === 'orders' ? (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {['All', 'Current', 'Completed', 'Pending', 'Cancelled'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={orderFilter === f ? 'btn btn-primary' : 'btn btn-ghost'}
                  style={{ height: 34, borderRadius: 10, fontWeight: 700, padding: '0 12px' }}
                  onClick={() => setOrderFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Driver</th>
                    <th>Placed</th>
                    <th>Picked</th>
                    <th>Packed</th>
                    <th>Delivered</th>
                    <th>ETA</th>
                    <th>SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td><span className={`badge ${orderBadgeClass(o.status)}`}>{o.status}</span></td>
                      <td>{o.items}</td>
                      <td>{o.driver}</td>
                      <td>{o.placedAt}</td>
                      <td>{o.pickedAt}</td>
                      <td>{o.packedAt}</td>
                      <td>{o.deliveredAt}</td>
                      <td>{o.eta}</td>
                      <td>{o.sla}</td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={10} style={{ color: 'var(--muted)' }}>No orders for this filter</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div style={{ height: 10, borderRadius: 999, background: 'var(--line)', overflow: 'hidden', marginBottom: 16, maxWidth: 420 }}>
              <div
                style={{
                  width: `${Math.round(pct * 100)}%`,
                  height: '100%',
                  background: 'var(--brand-grad)',
                  borderRadius: 999,
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {zoneStockItems.map((item) => {
                const sellable = Math.max(0, item.quantity - (item.reserved || 0))
                const status = sellable <= 0 ? 'OOS' : sellable <= 3 ? 'Low' : 'Available'
                return (
                  <div key={item.sku} className="card" style={{ padding: 12, overflow: 'hidden' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 10, background: 'var(--paper)' }}
                    />
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{item.sku}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--slate)', marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 12 }}>{formatINR(item.price)}</span>
                      <span className={`badge ${status === 'Available' ? 'badge-teal' : status === 'Low' ? 'badge-warn' : 'badge-danger'}`}>
                        {status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      On hand {item.quantity} · Reserved {item.reserved || 0} · <strong style={{ color: 'var(--ink)' }}>Sellable {sellable}</strong>
                    </div>
                  </div>
                )
              })}
              {zoneStockItems.length === 0 && (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>No stock items for this zone yet.</p>
              )}
            </div>
          </>
        )}

        {editZone && (
          <div className="modal-backdrop" onClick={() => setEditZone(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Edit {editZone.id}</h3>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Store Count</label>
                <input type="number" value={editZone.storeCount} onChange={(e) => setEditZone({ ...editZone, storeCount: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Driver Count</label>
                <input type="number" value={editZone.driverCount} onChange={(e) => setEditZone({ ...editZone, driverCount: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Riders Online</label>
                <input type="number" value={editZone.ridersOnline} onChange={(e) => setEditZone({ ...editZone, ridersOnline: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Low Stock Threshold</label>
                <input type="number" value={editZone.lowThreshold} onChange={(e) => setEditZone({ ...editZone, lowThreshold: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Pickers</label>
                <input type="number" value={editZone.pickers} onChange={(e) => setEditZone({ ...editZone, pickers: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ marginBottom: 16 }}>
                <label>Capacity</label>
                <input type="number" value={editZone.capacity} onChange={(e) => setEditZone({ ...editZone, capacity: Number(e.target.value) })} />
              </div>
              <button type="button" className="btn btn-primary btn-block" onClick={saveZoneEdit}>Save Zone</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--slate)' }}>
            Darkstore Monitor
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            Select a zone for orders & stock · live ops · inventory upload
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={tab === 'monitor' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ height: 42, borderRadius: 12, fontWeight: 700, padding: '0 16px' }}
            onClick={() => setTab('monitor')}
          >
            Zones
          </button>
          <button
            type="button"
            className={tab === 'inventory' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ height: 42, borderRadius: 12, fontWeight: 700, padding: '0 16px' }}
            onClick={() => setTab('inventory')}
          >
            Inventory Upload
          </button>
          {tab === 'monitor' && (
            <button
              type="button"
              className={live ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ height: 42, borderRadius: 12, fontWeight: 700, padding: '0 16px' }}
              onClick={() => setLive((v) => !v)}
            >
              {live ? 'Live: ON' : 'Live: OFF'}
            </button>
          )}
        </div>
      </div>

      {tab === 'inventory' ? (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--slate)', marginBottom: 12 }}>
              Upload Inventory
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <label className="btn btn-primary" style={{ height: 40, cursor: uploadState.loading ? 'wait' : 'pointer' }}>
                <Upload size={16} /> Import CSV / Excel
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                  disabled={uploadState.loading}
                  onChange={(e) => {
                    handleInventoryUpload(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
              </label>
              <button type="button" className="btn btn-ghost" style={{ height: 40 }} onClick={downloadSampleTemplate}>
                <Download size={16} /> Download Sample Template
              </button>
              <button type="button" className="btn btn-ghost" style={{ height: 40 }} onClick={exportInventory}>
                <Download size={16} /> Export Inventory
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              Supports CSV and Excel uploads · validates required columns · detects duplicate SKUs
            </p>
            {uploadState.loading && (
              <p style={{ fontSize: 13, color: 'var(--teal-dark)', marginTop: 12, fontWeight: 600 }}>Validating and importing…</p>
            )}
            {uploadState.error && (
              <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 12, fontWeight: 600 }}>{uploadState.error}</p>
            )}
            {uploadState.result && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'var(--paper)', border: '1px solid var(--line)' }}>
                <div style={{ fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>Import Summary — {uploadState.result.fileName}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
                  <span className="badge badge-teal">{uploadState.result.success.length} imported</span>
                  <span className={`badge ${uploadState.result.failed.length ? 'badge-danger' : 'badge-slate'}`}>
                    {uploadState.result.failed.length} failed
                  </span>
                </div>
                {uploadState.result.failed.length > 0 && (
                  <div className="table-wrap" style={{ marginTop: 12 }}>
                    <table className="data">
                      <thead><tr><th>Row</th><th>SKU</th><th>Reason</th></tr></thead>
                      <tbody>
                        {uploadState.result.failed.map((f) => (
                          <tr key={`${f.row}-${f.sku}`}>
                            <td>{f.row}</td>
                            <td>{f.sku}</td>
                            <td>{f.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead><tr><th></th><th>SKU</th><th>Product</th><th>Category</th><th>Zone</th><th>Qty</th><th>Reserved</th><th>Available</th><th>Price</th></tr></thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.sku}>
                    <td>
                      <img src={item.image} alt="" style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.zone}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reserved || 0}</td>
                    <td><strong>{Math.max(0, item.quantity - (item.reserved || 0))}</strong></td>
                    <td>{formatINR(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="stat-grid" style={{ marginBottom: 16 }}>
            <DarkStat label="Available Stock" value={totalStock.toLocaleString('en-IN')} />
            <DarkStat label="Pickers Online" value={pickersOnline} />
            <DarkStat label="Riders Online" value={ridersOnline} />
            <DarkStat label="Orders Today" value={allOrdersToday} />
            <DarkStat label="Completed" value={completedToday} />
            <DarkStat label="Cancelled" value={cancelledToday} />
            <DarkStat label="Dispatch In Progress" value={dispatchInProgress} />
            <DarkStat label="Low Stock Zones" value={lowZones.length} />
          </div>

          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--slate)' }}>
              Select a zone
            </div>
            {lowZones.length > 0 ? (
              <span className="badge badge-danger">{lowZones.length} low-stock alert(s)</span>
            ) : (
              <span className="badge badge-teal">Stock healthy</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
            {zones.map((z) => {
              const stats = zoneOrderStats(z.id)
              const isLow = z.stock <= z.lowThreshold
              return (
                <button
                  key={z.id}
                  type="button"
                  className="card"
                  onClick={() => openZone(z.id)}
                  style={{
                    padding: 18,
                    textAlign: 'left',
                    cursor: 'pointer',
                    opacity: z.enabled ? 1 : 0.72,
                    border: '1px solid var(--line)',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--slate)' }}>{z.id}</div>
                    {isLow ? <span className="badge badge-danger">Low</span> : <span className="badge badge-teal">OK</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
                    {stats.total} orders today · {z.storeCount} stores · {z.ridersOnline} riders
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Stock <strong style={{ color: 'var(--ink)' }}>{z.stock.toLocaleString('en-IN')}</strong> / {z.capacity.toLocaleString('en-IN')}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--teal-dark)' }}>
                    Open zone details →
                  </div>
                </button>
              )
            })}
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--slate)', marginBottom: 12 }}>
            Live ops snapshot
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
            {[
              ['SLA Met Today', `${Math.max(0, completedToday - 1)}/${completedToday || 1}`],
              ['Avg Delivery', '31 min'],
              ['OOS Auto-cancel', `${cancelledToday}`],
              ['Pick Accuracy', '98.2%'],
              ['Batching', 'Enabled'],
              ['Promise Window', '10–45 min'],
            ].map(([label, value]) => (
              <div key={label} className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--slate)' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--slate)', marginBottom: 12 }}>
            Fulfillment Tasks
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {tasks.map((t) => (
              <div key={t.id} className="card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--slate)' }}>
                    {t.order} · <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{t.zone}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                    ETA: {t.eta} · Status: <strong style={{ color: 'var(--ink)' }}>{t.status}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ height: 40, borderRadius: 12, fontWeight: 700, padding: '0 14px' }}
                  onClick={() => advanceTask(t.id)}
                  disabled={t.status === 'Dispatched'}
                >
                  {t.status === 'Queued' ? 'Start' : t.status === 'Picking' ? 'Mark Packed' : t.status === 'Packed' ? 'Dispatch' : 'Done'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DarkStat({ label, value }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value" style={{ fontSize: 26 }}>{value}</div>
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

function Vendors({ vendors, setVendors, notify, focusVendorId, onFocusVendor }) {
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(false)
  const selectedVendor = vendors.find((vendor) => vendor.id === focusVendorId) || null
  const vendorProducts = selectedVendor
    ? PRODUCTS.filter((product) => product.shopId === selectedVendor.shopId)
    : []

  const runAction = () => {
    if (!confirm) return
    setLoading(true)
    setTimeout(() => {
      if (confirm.type === 'suspend') {
        setVendors((list) => list.map((x) => (x.id === confirm.id ? { ...x, status: 'Suspended' } : x)))
        notify(`${confirm.name} suspended`)
      } else {
        setVendors((list) => list.map((x) => (x.id === confirm.id ? { ...x, status: 'Active' } : x)))
        notify(`${confirm.name} recovered — permissions restored`)
      }
      setLoading(false)
      setConfirm(null)
    }, 450)
  }

  return (
    <>
      {selectedVendor ? (
        <div>
          <button type="button" className="btn btn-ghost" style={{ marginBottom: 14 }} onClick={() => onFocusVendor?.(null)}>
            ← Back to vendors
          </button>
          <div className="card" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 6px' }}>{selectedVendor.name}</h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
              Owner: {selectedVendor.owner} · Shop status: {selectedVendor.online ? 'Online' : 'Offline'}
            </p>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Listing</th></tr>
              </thead>
              <tbody>
                {vendorProducts.length ? vendorProducts.map((product) => (
                  <tr key={product.id}>
                    <td style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <img src={product.image} alt="" style={{ width: 36, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                      {product.title}
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{formatINR(product.price)}</td>
                    <td><span className="badge badge-teal">Uploaded</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--muted)' }}>No products uploaded by this vendor yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr><th>Vendor</th><th>Owner</th><th>Docs</th><th>Sales</th><th>Shop</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ height: 'auto', padding: 0, fontWeight: 700 }}
                    onClick={() => onFocusVendor?.(v.id)}
                  >
                    {v.name}
                  </button>
                </td>
                <td>{v.owner}</td>
                <td><span className={`badge ${v.docs === 'Approved' ? 'badge-teal' : 'badge-warn'}`}>{v.docs}</span></td>
                <td>{v.sales}</td>
                <td>
                  <button
                    type="button"
                    className={`toggle ${v.online ? 'on' : ''}`}
                    aria-label={`${v.name} shop ${v.online ? 'online' : 'offline'}`}
                    onClick={() => {
                      setVendors((list) => list.map((x) => x.id === v.id ? { ...x, online: !x.online } : x))
                      notify(`${v.name} shop is now ${!v.online ? 'online' : 'offline'}`)
                    }}
                  />
                  <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: v.online ? 'var(--teal-dark)' : 'var(--muted)' }}>
                    {v.online ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td><StatusBadge status={v.status} /></td>
                <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {v.docs === 'Pending' && (
                    <>
                      <button type="button" className="btn btn-primary" style={{ height: 32, padding: '0 10px' }} onClick={() => {
                        setVendors((list) => list.map((x) => x.id === v.id ? { ...x, docs: 'Approved', status: 'Active' } : x))
                        notify('Vendor approved')
                      }}><Check size={14} /></button>
                      <button type="button" className="btn btn-danger" style={{ height: 32, padding: '0 10px' }} onClick={() => {
                        setVendors((list) => list.map((x) => x.id === v.id ? { ...x, docs: 'Rejected', status: 'Suspended' } : x))
                        notify('Vendor rejected')
                      }}><X size={14} /></button>
                    </>
                  )}
                  {v.docs === 'Approved' && v.status === 'Active' && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ height: 32 }}
                      onClick={() => setConfirm({ type: 'suspend', id: v.id, name: v.name })}
                    >
                      Suspend
                    </button>
                  )}
                  {v.docs === 'Approved' && v.status === 'Suspended' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ height: 32 }}
                      onClick={() => setConfirm({ type: 'recover', id: v.id, name: v.name })}
                    >
                      Recover
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.type === 'suspend' ? 'Suspend Vendor?' : 'Recover Vendor?'}
        message={
          confirm?.type === 'suspend'
            ? `${confirm?.name} will be suspended and lose vendor permissions until recovered.`
            : `${confirm?.name} will be restored to Active with full vendor permissions.`
        }
        confirmLabel={confirm?.type === 'suspend' ? 'Suspend' : 'Recover'}
        loading={loading}
        onConfirm={runAction}
        onCancel={() => !loading && setConfirm(null)}
      />
    </>
  )
}

function Drivers({ drivers, setDrivers, notify }) {
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assignLoading, setAssignLoading] = useState(null)

  const runAction = () => {
    if (!confirm) return
    setLoading(true)
    setTimeout(() => {
      if (confirm.type === 'suspend') {
        setDrivers((list) => list.map((x) => (x.id === confirm.id ? { ...x, status: 'Suspended' } : x)))
        notify(`${confirm.name} suspended`)
      } else {
        setDrivers((list) => list.map((x) => (x.id === confirm.id ? { ...x, status: 'Active' } : x)))
        notify(`${confirm.name} recovered — driver is Active again`)
      }
      setLoading(false)
      setConfirm(null)
    }, 450)
  }

  const assignTask = (driver) => {
    setAssignLoading(driver.id)
    setTimeout(() => {
      notify(`Task assigned to ${driver.name}`)
      setAssignLoading(null)
    }, 400)
  }

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
                    disabled={d.status === 'Suspended'}
                  >
                    {['East', 'West', 'South', 'Central', 'North'].map((z) => <option key={z}>{z}</option>)}
                  </select>
                </td>
                <td><StatusBadge status={d.status} /></td>
                <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {d.kyc === 'Pending' && (
                    <button type="button" className="btn btn-primary" style={{ height: 32 }} onClick={() => {
                      setDrivers((list) => list.map((x) => x.id === d.id ? { ...x, kyc: 'Verified', status: 'Active' } : x))
                      notify('Driver KYC approved')
                    }}>Approve</button>
                  )}
                  {d.status === 'Active' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ height: 32 }}
                        disabled={assignLoading === d.id}
                        onClick={() => assignTask(d)}
                      >
                        {assignLoading === d.id ? 'Assigning…' : 'Assign Task'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ height: 32 }}
                        onClick={() => setConfirm({ type: 'suspend', id: d.id, name: d.name })}
                      >
                        Suspend
                      </button>
                    </>
                  )}
                  {d.status === 'Suspended' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ height: 32 }}
                      onClick={() => setConfirm({ type: 'recover', id: d.id, name: d.name })}
                    >
                      Recover
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>KYC covers ID, license & insurance · document uploads tracked per driver</p>
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.type === 'suspend' ? 'Suspend Driver?' : 'Recover Driver?'}
        message={
          confirm?.type === 'suspend'
            ? `${confirm?.name} will be suspended and cannot receive new assignments until recovered.`
            : `${confirm?.name} will be restored to Active and can receive assignments again.`
        }
        confirmLabel={confirm?.type === 'suspend' ? 'Suspend' : 'Recover'}
        loading={loading}
        onConfirm={runAction}
        onCancel={() => !loading && setConfirm(null)}
      />
    </>
  )
}

function defaultPermissions() {
  return Object.fromEntries(
    ADMIN_MODULES.map((mod) => [mod, Object.fromEntries(PERMISSION_ACTIONS.map((a) => [a, mod === 'Dashboard' && a === 'View']))]),
  )
}

function ManageUsers({ notify }) {
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Asha (Ops)', title: 'Operations Lead', permissions: { ...defaultPermissions(), Vendors: { View: true, Create: false, Edit: true, Delete: false, Manage: true }, Orders: { View: true, Create: false, Edit: true, Delete: false, Manage: true } } },
    { id: 'u2', name: 'Dev (Support)', title: 'Support', permissions: { ...defaultPermissions(), Customers: { View: true, Create: false, Edit: true, Delete: false, Manage: false }, Orders: { View: true, Create: false, Edit: false, Delete: false, Manage: false } } },
  ])
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)

  const togglePermission = (mod, action) => {
    if (!selected) return
    setSelected((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [mod]: { ...prev.permissions[mod], [action]: !prev.permissions[mod][action] },
      },
    }))
  }

  const savePermissions = () => {
    setSaving(true)
    setTimeout(() => {
      setUsers((list) => list.map((u) => (u.id === selected.id ? selected : u)))
      notify(`Permissions saved for ${selected.name}`)
      setSaving(false)
    }, 450)
  }

  const permissionSummary = (user) => {
    const count = ADMIN_MODULES.reduce((sum, mod) => sum + PERMISSION_ACTIONS.filter((a) => user.permissions[mod]?.[a]).length, 0)
    return `${count} permissions`
  }

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Sub-admins & Roles</h3>
        {users.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() =>
              setSelected({
                ...u,
                permissions: Object.fromEntries(
                  ADMIN_MODULES.map((mod) => [mod, { ...defaultPermissions()[mod], ...(u.permissions[mod] || {}) }]),
                ),
              })
            }
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '12px 0',
              borderBottom: '1px solid var(--line)',
              background: 'none',
              border: 'none',
              borderBottomWidth: 1,
              borderBottomStyle: 'solid',
              borderBottomColor: 'var(--line)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>
              <strong>{u.name}</strong>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{u.title}</div>
            </span>
            <span className="badge badge-slate">{permissionSummary(u)}</span>
          </button>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 16 }}
          onClick={() => {
            const nu = { id: `u${Date.now()}`, name: 'New Sub-admin', title: 'Custom role', permissions: defaultPermissions() }
            setUsers((u) => [...u, nu])
            setSelected(nu)
            notify('Sub-admin created — configure permissions')
          }}
        >
          <Plus size={16} /> Create Sub-admin
        </button>
      </div>

      <div className="card" style={{ padding: 24 }}>
        {!selected ? (
          <p style={{ color: 'var(--muted)' }}>Select a sub-admin to manage module permissions.</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>{selected.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 0' }}>Roles & Permissions · {selected.title}</p>
              </div>
              <button type="button" className="btn btn-primary" disabled={saving} onClick={savePermissions}>
                {saving ? 'Saving…' : 'Save Permissions'}
              </button>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Module</th>
                    {PERMISSION_ACTIONS.map((a) => <th key={a}>{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_MODULES.map((mod) => (
                    <tr key={mod}>
                      <td><strong>{mod}</strong></td>
                      {PERMISSION_ACTIONS.map((action) => (
                        <td key={action}>
                          <button
                            type="button"
                            className={`toggle ${selected.permissions[mod]?.[action] ? 'on' : ''}`}
                            aria-label={`${mod} ${action}`}
                            onClick={() => togglePermission(mod, action)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
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

function VendorZoneStockMgmt({ vendors }) {
  const vendorRows = vendors.map((vendor) => {
    const lines = VENDOR_ZONE_INVENTORY.filter((item) => item.vendorId === vendor.id)
    const zoneTotals = DARKSTORE_ZONES.reduce((acc, zone) => {
      acc[zone] = lines.filter((item) => item.zone === zone).reduce((sum, item) => sum + item.quantity, 0)
      return acc
    }, {})
    const total = lines.reduce((sum, item) => sum + item.quantity, 0)
    const reserved = lines.reduce((sum, item) => sum + item.reserved, 0)
    const shopLogo = FEATURED_SHOPS.find((shop) => shop.id === vendor.shopId)?.logo
    const products = [...new Set(lines.map((item) => item.sku))].map((sku) => {
      const sample = lines.find((item) => item.sku === sku)
      return {
        sku,
        productName: sample.productName,
        image: sample.image,
        lines: lines.filter((item) => item.sku === sku),
      }
    })
    return { vendor, lines, zoneTotals, total, reserved, shopLogo, products }
  })

  return (
    <div>
      <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>
        Dark store stock by vendor with size-level counts in each zone.
      </p>

      {vendorRows.map(({ vendor, zoneTotals, total, reserved, shopLogo, products, lines }) => (
        <div key={vendor.id} className="card" style={{ padding: 18, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <img
              src={shopLogo || products[0]?.image}
              alt=""
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px' }}>{vendor.name}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
                {vendor.owner} · <StatusBadge status={vendor.status} />
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {DARKSTORE_ZONES.map((zone) => (
                <span key={zone} className="badge badge-slate">{zone}: {zoneTotals[zone] || 0}</span>
              ))}
              <span className="badge badge-teal">Total: {total}</span>
              <span className="badge badge-warn">Reserved: {reserved}</span>
            </div>
          </div>

          {products.length ? products.map((product) => (
            <div key={product.sku} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <img src={product.image} alt="" style={{ width: 44, height: 54, objectFit: 'cover', borderRadius: 8 }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--slate)' }}>{product.productName}</strong>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{product.sku}</span>
                </div>
              </div>
              <div className="table-wrap">
                <table className="data">
                  <thead>
                    <tr><th>Zone</th><th>Size</th><th>Count</th><th>Reserved</th><th>Available</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {product.lines.map((item) => (
                      <tr key={`${item.sku}-${item.zone}-${item.size}`}>
                        <td>{item.zone}</td>
                        <td><strong>{item.size}</strong></td>
                        <td>{item.quantity}</td>
                        <td>{item.reserved}</td>
                        <td>{item.quantity - item.reserved}</td>
                        <td>
                          <span className={`badge ${item.inStock && item.quantity > item.reserved ? 'badge-teal' : 'badge-danger'}`}>
                            {item.inStock && item.quantity > item.reserved ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )) : (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>No dark store stock allocated for this vendor yet.</p>
          )}
        </div>
      ))}
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

function AdminReports() {
  const reports = [
    { label: 'GMV Report', value: '₹4.8L', period: 'Today' },
    { label: 'Orders Report', value: '192', period: 'Today' },
    { label: 'Vendor Payouts', value: '₹1.2L', period: 'This week' },
    { label: 'Dark Store Fulfillment', value: '94%', period: 'SLA' },
    { label: 'Coupon Redemptions', value: '38', period: 'This week' },
    { label: 'Customer Retention', value: '68%', period: '30 days' },
  ]
  return (
    <div>
      <div className="stat-grid" style={{ marginBottom: 18 }}>
        {reports.map((r) => (
          <div key={r.label} className="stat-card">
            <div className="label">{r.label}</div>
            <div className="value" style={{ fontSize: 26 }}>{r.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{r.period}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Export Reports</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Download operational reports for vendors, orders, inventory, and payouts.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Orders CSV', 'Vendor Sales', 'Inventory Snapshot', 'Payout Summary'].map((label) => (
            <button key={label} type="button" className="btn btn-ghost" style={{ height: 40 }}>
              <Download size={16} /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminNotifications({ notify }) {
  const [items, setItems] = useState([
    { id: 'n1', title: 'Low stock alert — Zone C', body: 'Stock dropped below threshold', read: false, time: '12 min ago' },
    { id: 'n2', title: 'Vendor KYC pending', body: 'Bloom Closet awaiting document review', read: false, time: '1 hr ago' },
    { id: 'n3', title: 'Driver suspended', body: 'Imran A account suspended by admin', read: true, time: 'Yesterday' },
  ])
  return (
    <div className="card" style={{ padding: 24, maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>Notifications</h3>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ height: 36 }}
          onClick={() => {
            setItems((list) => list.map((n) => ({ ...n, read: true })))
            notify('All notifications marked read')
          }}
        >
          Mark all read
        </button>
      </div>
      {items.map((n) => (
        <div
          key={n.id}
          style={{
            padding: '14px 0',
            borderBottom: '1px solid var(--line)',
            opacity: n.read ? 0.65 : 1,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <strong style={{ color: 'var(--slate)' }}>{n.title}</strong>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{n.time}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0' }}>{n.body}</p>
          {!n.read && <span className="badge badge-teal" style={{ marginTop: 8 }}>New</span>}
        </div>
      ))}
    </div>
  )
}

function AdminSettings({ notify }) {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>SEO Settings</h3>
        <div className="field" style={{ marginBottom: 12 }}><label>Meta Title</label><input defaultValue="KudiCart — Quick Apparel Delivery" /></div>
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
