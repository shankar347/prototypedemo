import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  Map,
  User,
  MessageCircle,
  ArrowLeft,
  Phone,
  Navigation,
  Siren,
  LogOut,
  Check,
  Upload,
  FileText,
  Clock3,
} from 'lucide-react'
import { PhoneShell, BottomNav, GeometricAccent } from '../components/ui'
import { DRIVER_REQUESTS } from '../data/mockData'

const NAV = [
  { id: 'home', label: 'Orders', icon: Home },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'support', label: 'Support', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
]

const DRIVER_STAGES = ['Navigate to shop', 'Picked Up', 'En Route', 'Delivered']

export default function DriverApp() {
  const [authed, setAuthed] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState(() => sessionStorage.getItem('driverApproval') || 'pending_docs')
  const [screen, setScreen] = useState('login')
  const [tab, setTab] = useState('home')
  const [online, setOnline] = useState(true)
  const [requests, setRequests] = useState(DRIVER_REQUESTS)
  const [active, setActive] = useState(null)
  const [stage, setStage] = useState(0)
  const [toast, setToast] = useState('')

  const notify = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  const setApproval = (status) => {
    setApprovalStatus(status)
    sessionStorage.setItem('driverApproval', status)
  }

  // Auto-assign first available request when online, approved, and idle
  useEffect(() => {
    if (!authed || approvalStatus !== 'approved' || !online || active || requests.length === 0) return
    const timer = window.setTimeout(() => {
      const next = requests[0]
      setActive(next)
      setRequests((rs) => rs.filter((r) => r.id !== next.id))
      setStage(0)
      notify(`Order ${next.id} auto-assigned to you`)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [authed, approvalStatus, online, active, requests])

  if (!authed) {
    return (
      <PhoneShell>
        {screen === 'login' ? (
          <DriverLogin onSend={() => setScreen('otp')} />
        ) : (
          <DriverOtp
            onBack={() => setScreen('login')}
            onVerify={() => {
              setAuthed(true)
              setScreen(approvalStatus === 'approved' ? 'home' : 'approval')
            }}
          />
        )}
      </PhoneShell>
    )
  }

  if (approvalStatus !== 'approved') {
    return (
      <PhoneShell>
        <DriverApprovalGate
          status={approvalStatus}
          onSubmitDocs={() => {
            setApproval('pending_review')
            notify('Documents submitted — waiting for admin approval')
          }}
          onSimulateApprove={() => {
            setApproval('approved')
            setScreen('home')
            notify('Admin approved your documents')
          }}
          onLogout={() => {
            setAuthed(false)
            setScreen('login')
          }}
        />
        {toast && <div className="toast">{toast}</div>}
      </PhoneShell>
    )
  }

  return (
    <PhoneShell
      nav={
        <BottomNav
          items={NAV}
          active={tab}
          onChange={(id) => {
            setTab(id)
            setScreen(id)
          }}
        />
      }
    >
      {screen === 'home' && (
        <DriverHome
          online={online}
          setOnline={setOnline}
          active={active}
          stage={stage}
          onAdvance={() => {
            if (stage < DRIVER_STAGES.length - 1) {
              setStage(stage + 1)
              notify(DRIVER_STAGES[stage + 1])
            } else {
              setActive(null)
              setStage(0)
              notify('Delivery confirmed')
            }
          }}
          onOpenDetail={() => setScreen('detail')}
        />
      )}
      {screen === 'detail' && active && (
        <OrderDetail
          order={active}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'map' && <MapScreen active={active} />}
      {screen === 'support' && <SupportScreen notify={notify} />}
      {screen === 'profile' && (
        <DriverProfile
          online={online}
          setOnline={setOnline}
          onLogout={() => {
            setAuthed(false)
            setScreen('login')
          }}
          notify={notify}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </PhoneShell>
  )
}

function DriverApprovalGate({ status, onSubmitDocs, onSimulateApprove, onLogout }) {
  return (
    <div className="fade-in" style={{ padding: 24, minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="KudiCart" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          <strong style={{ fontFamily: 'var(--font-display)' }}>Driver Onboarding</strong>
        </div>
        <button type="button" className="btn btn-ghost" style={{ height: 36 }} onClick={onLogout}><LogOut size={16} /></button>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <FileText size={28} color="var(--teal)" style={{ marginBottom: 12 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8, color: 'var(--slate)' }}>
          {status === 'pending_docs' ? 'Upload documents' : 'Waiting for admin approval'}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.55, marginBottom: 16 }}>
          You can take orders only after document upload and admin approval. Accept / Reject is disabled — orders are auto-assigned once approved.
        </p>
        {status === 'pending_docs' ? (
          <>
            <div className="field" style={{ marginBottom: 10 }}><label>ID proof</label><input type="file" /></div>
            <div className="field" style={{ marginBottom: 10 }}><label>Driving license</label><input type="file" /></div>
            <div className="field" style={{ marginBottom: 16 }}><label>Vehicle insurance</label><input type="file" /></div>
            <button type="button" className="btn btn-primary btn-block" onClick={onSubmitDocs}>
              <Upload size={16} /> Submit for admin approval
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--muted)', fontSize: 13 }}>
              <Clock3 size={16} /> Review usually takes a few hours
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={onSimulateApprove}>
              <Check size={16} /> Simulate admin approve (demo)
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function DriverLogin({ onSend }) {
  const [phone, setPhone] = useState('')
  return (
    <div className="paper-bg" style={{ minHeight: '100%', position: 'relative', overflow: 'hidden', padding: '64px 28px' }}>
      <GeometricAccent position="tr" size={150} />
      <Link to="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← Portal</Link>
      <div style={{ marginBottom: 20 }}>
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
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--slate)', margin: '0 0 8px' }}>
        Driver Login
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>Enter registered phone — unique OTP will be generated</p>
      <div className="field" style={{ marginBottom: 20 }}>
        <label>Phone Number</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98888 77777" />
      </div>
      <button type="button" className="btn btn-primary btn-block" onClick={onSend}>Send OTP</button>
    </div>
  )
}

function DriverOtp({ onBack, onVerify }) {
  const [otp, setOtp] = useState('')
  return (
    <div style={{ padding: 28 }} className="fade-in">
      <button type="button" onClick={onBack} style={{ marginBottom: 24 }}><ArrowLeft /></button>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--slate)' }}>Enter OTP</h2>
      <p style={{ color: 'var(--muted)', margin: '8px 0 24px', fontSize: 14 }}>OTP: demo any 4 digits</p>
      <div className="field" style={{ marginBottom: 20 }}>
        <label>OTP</label>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} placeholder="••••" />
      </div>
      <button type="button" className="btn btn-primary btn-block" disabled={otp.length < 4} onClick={onVerify}>
        Verify & Login
      </button>
    </div>
  )
}

function DriverHome({ online, setOnline, active, stage, onAdvance, onOpenDetail }) {
  return (
    <div className="fade-in">
      <header
        style={{
          background: 'linear-gradient(135deg, #fb7185, #9f1239)',
          color: 'white',
          padding: '18px 16px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <GeometricAccent position="tr" size={100} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/logo.png"
              alt="KudiCart"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                background: '#FFF1F2',
              }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>KudiCart Driver</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Kiran P · Bike · Approved</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOnline(!online)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 12px',
              borderRadius: 99,
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span className={`toggle ${online ? 'on' : ''}`} style={{ transform: 'scale(0.85)' }} />
            {online ? 'Online' : 'Offline'}
          </button>
        </div>
      </header>

      <div style={{ padding: 16 }}>
        {!online && (
          <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>
            You are offline. Go online to receive auto-assigned deliveries.
          </div>
        )}

        {online && !active && (
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <Clock3 size={28} color="var(--teal)" style={{ margin: '0 auto 10px' }} />
            <strong style={{ display: 'block', marginBottom: 6 }}>Waiting for auto-assign…</strong>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              Orders are assigned automatically. Accept and Reject are not available.
            </p>
          </div>
        )}

        {active && (
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>Auto-assigned · {active.id}</strong>
              <span className="badge badge-teal">+₹{active.earn}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Assigned by system — no accept/reject needed</p>
            <button type="button" onClick={onOpenDetail} style={{ color: 'var(--teal-dark)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              View details
            </button>
            <p style={{ fontSize: 13, marginBottom: 4 }}><strong>Shop:</strong> {active.shop}</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{active.shopAddr}</p>
            <p style={{ fontSize: 13, marginBottom: 12 }}><strong>Drop:</strong> {active.dropAddr} · {active.distance}</p>
            <div className="progress-steps" style={{ marginBottom: 20 }}>
              {DRIVER_STAGES.map((s, i) => (
                <div key={s} className={`step ${i < stage ? 'done' : ''} ${i === stage ? 'active' : ''}`}>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, marginBottom: 16, color: 'var(--muted)' }}>
              Current: <strong style={{ color: 'var(--slate)' }}>{DRIVER_STAGES[stage]}</strong>
            </p>
            <button type="button" className="btn btn-primary btn-block" onClick={onAdvance}>
              {stage === DRIVER_STAGES.length - 1 ? 'Confirm Delivered' : `Mark: ${DRIVER_STAGES[Math.min(stage + 1, DRIVER_STAGES.length - 1)]}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderDetail({ order, onBack }) {
  return (
    <div className="fade-in">
      <header style={{ padding: '16px', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--teal)', color: 'white' }}>
        <button type="button" onClick={onBack}><ArrowLeft color="white" /></button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Order Details</h2>
      </header>
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Items ({order.items})</h4>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Apparel parcels from {order.shop}</p>
        </div>
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Pickup</h4>
          <p style={{ fontSize: 14 }}>{order.shopAddr}</p>
          <a href="tel:+918888888888" className="btn btn-secondary" style={{ marginTop: 12, height: 40 }}>
            <Phone size={16} /> Contact Shop
          </a>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Drop-off</h4>
          <p style={{ fontSize: 14 }}>{order.dropAddr}</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{order.customer}</p>
          <a href="tel:+919876543210" className="btn btn-secondary" style={{ marginTop: 12, height: 40 }}>
            <Phone size={16} /> Contact Customer
          </a>
        </div>
      </div>
    </div>
  )
}

function MapScreen({ active }) {
  return (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 16, background: 'white', borderBottom: '1px solid var(--line)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--slate)' }}>Navigation</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>GPS · traffic-aware ETA</p>
      </header>
      <div
        style={{
          flex: 1,
          minHeight: 420,
          background:
            'linear-gradient(160deg, #d4ebe6 0%, #b8d4cf 40%, #9ec4bc 100%)',
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="500" y2={i * 40} stroke="#9f1239" strokeWidth="1" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="500" stroke="#9f1239" strokeWidth="1" />
          ))}
          <path d="M40 360 Q120 200 200 280 T380 120" fill="none" stroke="#e11d48" strokeWidth="4" strokeDasharray="8 6" />
        </svg>
        <div className="card" style={{ padding: 16, zIndex: 1, textAlign: 'center', maxWidth: 280 }}>
          <Navigation size={28} color="var(--teal)" style={{ margin: '0 auto 8px' }} />
          <strong>{active ? 'Route optimized' : 'No active delivery'}</strong>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
            {active ? `${active.shopAddr} → ${active.dropAddr}` : 'Wait for an auto-assigned order to start navigation'}
          </p>
          {active && <p style={{ marginTop: 8, color: 'var(--teal-dark)', fontWeight: 700 }}>ETA 12 min · live traffic</p>}
        </div>
      </div>
    </div>
  )
}

function SupportScreen({ notify }) {
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState([
    { from: 'support', text: 'Hi Kiran! How can we help?' },
  ])
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <header style={{ padding: 16, background: 'linear-gradient(135deg, #fb7185, #9f1239)', color: 'white' }}>
        <h2 style={{ fontFamily: 'var(--font-display)' }}>Support & Safety</h2>
      </header>
      <div style={{ padding: 16, flex: 1 }}>
        <button
          type="button"
          className="btn btn-block"
          style={{ background: 'var(--danger)', color: 'white', marginBottom: 16, height: 52 }}
          onClick={() => notify('SOS sent to support (demo)')}
        >
          <Siren size={18} /> Emergency SOS
        </button>
        <div className="card" style={{ padding: 16, minHeight: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chat.map((c, i) => (
            <div
              key={i}
              style={{
                alignSelf: c.from === 'me' ? 'flex-end' : 'flex-start',
                background: c.from === 'me' ? 'var(--teal)' : 'var(--teal-light)',
                color: c.from === 'me' ? 'white' : 'var(--slate)',
                padding: '10px 14px',
                borderRadius: 14,
                maxWidth: '80%',
                fontSize: 14,
              }}
            >
              {c.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Message support…"
            style={{ flex: 1, height: 44, borderRadius: 12, border: '1.5px solid var(--line)', padding: '0 12px' }}
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ height: 44 }}
            onClick={() => {
              if (!msg.trim()) return
              setChat((c) => [...c, { from: 'me', text: msg }, { from: 'support', text: 'Thanks — we\'ll get back shortly.' }])
              setMsg('')
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function DriverProfile({ online, setOnline, onLogout, notify }) {
  return (
    <div className="fade-in">
      <header style={{ padding: 16, background: 'white', borderBottom: '1px solid var(--line)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--slate)' }}>Profile</h2>
      </header>
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Availability</span>
          <button type="button" className={`toggle ${online ? 'on' : ''}`} onClick={() => setOnline(!online)} />
        </div>
        {['Name', 'Phone', 'Email', 'Vehicle'].map((f, i) => (
          <div className="field" key={f} style={{ marginBottom: 12 }}>
            <label>{f}</label>
            <input defaultValue={['Kiran P', '9888877777', 'kiran@mail.com', 'Bike · KA01AB1234'][i]} />
          </div>
        ))}
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Upload ID / License</label>
          <input type="file" />
        </div>
        <button type="button" className="btn btn-primary btn-block" style={{ marginBottom: 10 }} onClick={() => notify('Profile saved')}>
          Save Profile
        </button>
        <button type="button" className="btn btn-danger btn-block" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}
