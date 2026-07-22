import { useEffect, useMemo, useState } from 'react'
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
  IndianRupee,
  Bike,
  TrendingUp,
  CalendarDays,
  Zap,
} from 'lucide-react'
import { PhoneShell, BottomNav, GeometricAccent } from '../components/ui'
import {
  DRIVER_REQUESTS,
  DRIVER_TODAY_RIDES,
  DRIVER_WEEKLY,
  DRIVER_MONTHLY,
  formatINR,
} from '../data/mockData'

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
  const [completedToday, setCompletedToday] = useState(DRIVER_TODAY_RIDES)
  const [analyticsTab, setAnalyticsTab] = useState('today')

  const notify = (m) => {
    setToast(m)
    setTimeout(() => setToast(''), 2000)
  }

  const setApproval = (status) => {
    setApprovalStatus(status)
    sessionStorage.setItem('driverApproval', status)
  }

  const goTab = (id) => {
    setTab(id)
    setScreen(id)
  }

  // Auto-assign first available request when online, approved, and idle
  useEffect(() => {
    if (!authed || approvalStatus !== 'approved' || !online || active || requests.length === 0) return undefined
    const timer = window.setTimeout(() => {
      const next = requests[0]
      setActive(next)
      setRequests((rs) => rs.filter((r) => r.id !== next.id))
      setStage(0)
      setScreen('home')
      setTab('home')
      notify(`Order ${next.id} auto-assigned to you`)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [authed, approvalStatus, online, active, requests])

  // Avoid blank screen if detail has no active order
  useEffect(() => {
    if (authed && approvalStatus === 'approved' && screen === 'detail' && !active) {
      setScreen('home')
      setTab('home')
    }
  }, [authed, approvalStatus, screen, active])

  if (!authed) {
    return (
      <PhoneShell>
        {screen === 'otp' ? (
          <DriverOtp
            onBack={() => setScreen('login')}
            onVerify={() => {
              setAuthed(true)
              const next = approvalStatus === 'approved' ? 'home' : 'approval'
              setScreen(next)
              setTab('home')
            }}
          />
        ) : (
          <DriverLogin onSend={() => setScreen('otp')} />
        )}
      </PhoneShell>
    )
  }

  if (approvalStatus !== 'approved') {
    return (
      <PhoneShell overlay={toast ? <div className="toast">{toast}</div> : null}>
        <DriverApprovalGate
          status={approvalStatus}
          onSubmitDocs={() => {
            setApproval('pending_review')
            notify('Documents submitted — waiting for admin approval')
          }}
          onSimulateApprove={() => {
            setApproval('approved')
            setScreen('home')
            setTab('home')
            notify('Admin approved your documents')
          }}
          onLogout={() => {
            setAuthed(false)
            setScreen('login')
          }}
        />
      </PhoneShell>
    )
  }

  const showHome = screen === 'home' || (screen === 'detail' && !active)

  return (
    <PhoneShell
      overlay={toast ? <div className="toast">{toast}</div> : null}
      nav={
        <BottomNav
          items={NAV}
          active={tab}
          onChange={goTab}
        />
      }
    >
      {showHome && (
        <DriverHome
          online={online}
          setOnline={setOnline}
          active={active}
          stage={stage}
          completedToday={completedToday}
          analyticsTab={analyticsTab}
          setAnalyticsTab={setAnalyticsTab}
          onAdvance={() => {
            if (stage < DRIVER_STAGES.length - 1) {
              setStage(stage + 1)
              notify(DRIVER_STAGES[stage + 1])
              return
            }
            if (active) {
              setCompletedToday((list) => [
                {
                  id: active.id,
                  shop: active.shop,
                  time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
                  distance: active.distance,
                  earn: active.earn,
                  incentive: active.incentive || 10,
                  status: 'Delivered',
                },
                ...list,
              ])
            }
            setActive(null)
            setStage(0)
            setScreen('home')
            setTab('home')
            notify('Delivery confirmed')
          }}
          onOpenDetail={() => setScreen('detail')}
        />
      )}
      {screen === 'detail' && active && (
        <OrderDetail
          order={active}
          onBack={() => {
            setScreen('home')
            setTab('home')
          }}
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
    </PhoneShell>
  )
}

function DriverApprovalGate({ status, onSubmitDocs, onSimulateApprove, onLogout }) {
  return (
    <div className="fade-in" style={{ padding: 24, minHeight: '100%', background: 'var(--bg)' }}>
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
  return (
    <div className="fade-in" style={{ padding: 28, minHeight: '100%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <GeometricAccent position="tr" size={140} />
      <img src="/logo.png" alt="KudiCart" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--slate)', marginBottom: 8 }}>Driver Login</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Sign in to start receiving auto-assigned orders.</p>
      <div className="field" style={{ marginBottom: 12 }}><label>Phone</label><input placeholder="+91 98888 77777" defaultValue="9888877777" /></div>
      <button type="button" className="btn btn-primary btn-block" onClick={onSend}>Send OTP</button>
      <Link to="/" style={{ display: 'block', marginTop: 16, textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>← Portal</Link>
    </div>
  )
}

function DriverOtp({ onBack, onVerify }) {
  return (
    <div className="fade-in" style={{ padding: 28, minHeight: '100%', background: 'var(--bg)' }}>
      <button type="button" onClick={onBack} style={{ marginBottom: 20, color: 'var(--slate)' }}><ArrowLeft size={20} /></button>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--slate)', marginBottom: 8 }}>Enter OTP</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Demo OTP: any 4 digits</p>
      <div className="field" style={{ marginBottom: 16 }}><label>OTP</label><input placeholder="1234" defaultValue="1234" /></div>
      <button type="button" className="btn btn-primary btn-block" onClick={onVerify}>Verify & Continue</button>
    </div>
  )
}

function DriverHome({
  online,
  setOnline,
  active,
  stage,
  onAdvance,
  onOpenDetail,
  completedToday,
  analyticsTab,
  setAnalyticsTab,
}) {
  const todayEarn = useMemo(
    () => completedToday.reduce((sum, ride) => sum + ride.earn + (ride.incentive || 0), 0),
    [completedToday],
  )
  const todayBase = useMemo(
    () => completedToday.reduce((sum, ride) => sum + ride.earn, 0),
    [completedToday],
  )
  const todayIncentive = useMemo(
    () => completedToday.reduce((sum, ride) => sum + (ride.incentive || 0), 0),
    [completedToday],
  )
  const weekTotal = DRIVER_WEEKLY.reduce((sum, d) => sum + d.earn, 0)
  const weekRides = DRIVER_WEEKLY.reduce((sum, d) => sum + d.rides, 0)
  const monthTotal = DRIVER_MONTHLY.reduce((sum, d) => sum + d.earn, 0)
  const monthRides = DRIVER_MONTHLY.reduce((sum, d) => sum + d.rides, 0)
  const maxWeekEarn = Math.max(...DRIVER_WEEKLY.map((d) => d.earn), 1)
  const maxMonthEarn = Math.max(...DRIVER_MONTHLY.map((d) => d.earn), 1)

  return (
    <div className="fade-in" style={{ minHeight: '100%', background: 'var(--bg)' }}>
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

      <div style={{ padding: 16, paddingBottom: 28 }}>
        <div className="stat-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 14 }}>
          <div className="stat-card" style={{ padding: 14 }}>
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bike size={14} /> Today rides</div>
            <div className="value" style={{ fontSize: 24 }}>{completedToday.length}</div>
          </div>
          <div className="stat-card" style={{ padding: 14 }}>
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IndianRupee size={14} /> Today earned</div>
            <div className="value" style={{ fontSize: 24 }}>{formatINR(todayEarn)}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--muted)' }}>Base pay</span>
            <strong>{formatINR(todayBase)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--muted)' }}>Incentives</span>
            <strong style={{ color: 'var(--teal-dark)' }}>+{formatINR(todayIncentive)}</strong>
          </div>
          <div style={{ borderTop: '1px dashed var(--line)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <strong>Total today</strong>
            <strong style={{ color: 'var(--teal-dark)' }}>{formatINR(todayEarn)}</strong>
          </div>
        </div>

        {!online && (
          <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', marginBottom: 14 }}>
            You are offline. Go online to receive auto-assigned deliveries.
          </div>
        )}

        {online && !active && (
          <div className="card" style={{ padding: 20, textAlign: 'center', marginBottom: 14 }}>
            <Clock3 size={28} color="var(--teal)" style={{ margin: '0 auto 10px' }} />
            <strong style={{ display: 'block', marginBottom: 6 }}>Waiting for auto-assign…</strong>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              Orders are assigned automatically. Accept and Reject are not available.
            </p>
          </div>
        )}

        {active && (
          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>Auto-assigned · {active.id}</strong>
              <span className="badge badge-teal">+₹{active.earn + (active.incentive || 0)}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
              Pay ₹{active.earn} · Incentive ₹{active.incentive || 10}
            </p>
            <button type="button" onClick={onOpenDetail} style={{ color: 'var(--teal-dark)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              View details
            </button>
            <p style={{ fontSize: 13, marginBottom: 4 }}><strong>Shop:</strong> {active.shop}</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{active.shopAddr}</p>
            <p style={{ fontSize: 13, marginBottom: 12 }}><strong>Drop:</strong> {active.dropAddr} · {active.distance}</p>
            <div className="progress-steps" style={{ marginBottom: 20 }}>
              {DRIVER_STAGES.map((s, i) => (
                <div key={s} className={`step ${i < stage ? 'done' : ''} ${i === stage ? 'active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
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

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[
            { id: 'today', label: 'Today', icon: Zap },
            { id: 'week', label: 'Week', icon: TrendingUp },
            { id: 'month', label: 'Month', icon: CalendarDays },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                className={`chip ${analyticsTab === item.id ? 'active' : ''}`}
                onClick={() => setAnalyticsTab(item.id)}
                style={{ flex: 1, justifyContent: 'center', gap: 6 }}
              >
                <Icon size={14} /> {item.label}
              </button>
            )
          })}
        </div>

        {analyticsTab === 'today' && (
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12, color: 'var(--slate)' }}>
              Today&apos;s completed rides
            </h3>
            {completedToday.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>No completed rides yet today.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {completedToday.map((ride) => (
                  <div
                    key={ride.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 8,
                      paddingBottom: 10,
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: 13 }}>{ride.shop}</strong>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{ride.id} · {ride.time} · {ride.distance}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ display: 'block', fontSize: 13 }}>{formatINR(ride.earn + (ride.incentive || 0))}</strong>
                      <span style={{ fontSize: 11, color: 'var(--teal-dark)' }}>Incentive +₹{ride.incentive || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {analyticsTab === 'week' && (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: 0, color: 'var(--slate)' }}>This week</h3>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ display: 'block' }}>{formatINR(weekTotal)}</strong>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{weekRides} rides</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 8 }}>
              {DRIVER_WEEKLY.map((day) => (
                <div key={day.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)' }}>{formatINR(day.earn).replace('₹', '')}</span>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(8, (day.earn / maxWeekEarn) * 100)}%`,
                      borderRadius: '8px 8px 4px 4px',
                      background: 'linear-gradient(180deg, #fb7185, #e11d48)',
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 700 }}>{day.day}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>Daily earnings with ride counts across the week.</p>
          </div>
        )}

        {analyticsTab === 'month' && (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, margin: 0, color: 'var(--slate)' }}>This month</h3>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ display: 'block' }}>{formatINR(monthTotal)}</strong>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{monthRides} rides</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {DRIVER_MONTHLY.map((week) => (
                <div key={week.week}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <strong>{week.week}</strong>
                    <span>{week.rides} rides · {formatINR(week.earn)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: 'var(--line)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(week.earn / maxMonthEarn) * 100}%`,
                        height: '100%',
                        borderRadius: 99,
                        background: 'linear-gradient(90deg, #fb7185, #e11d48)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderDetail({ order, onBack }) {
  return (
    <div className="fade-in" style={{ minHeight: '100%', background: 'var(--bg)' }}>
      <header style={{ padding: '16px', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--teal)', color: 'white' }}>
        <button type="button" onClick={onBack}><ArrowLeft color="white" /></button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Order Details</h2>
      </header>
      <div style={{ padding: 16 }}>
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Items ({order.items})</h4>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Apparel parcels from {order.shop}</p>
          <p style={{ marginTop: 8, fontSize: 13 }}>
            Pay {formatINR(order.earn)} · Incentive {formatINR(order.incentive || 10)}
          </p>
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
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--bg)' }}>
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
              key={`${c.from}-${i}`}
              style={{
                alignSelf: c.from === 'me' ? 'flex-end' : 'flex-start',
                background: c.from === 'me' ? 'var(--teal)' : 'var(--paper)',
                color: c.from === 'me' ? 'white' : 'var(--slate)',
                padding: '8px 12px',
                borderRadius: 12,
                maxWidth: '80%',
                fontSize: 13,
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
            placeholder="Type a message"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ height: 42 }}
            onClick={() => {
              if (!msg.trim()) return
              setChat((list) => [...list, { from: 'me', text: msg.trim() }])
              setMsg('')
              notify('Message sent')
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
    <div className="fade-in" style={{ padding: 16, minHeight: '100%', background: 'var(--bg)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--slate)', marginBottom: 16 }}>Profile</h2>
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <img src="/logo.png" alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <strong>Kiran P</strong>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Bike · KA01AB1234 · Approved</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span>Availability</span>
          <button type="button" className={`toggle ${online ? 'on' : ''}`} onClick={() => setOnline(!online)} />
        </div>
        <div className="field" style={{ marginBottom: 10 }}><label>Phone</label><input defaultValue="9888877777" /></div>
        <div className="field" style={{ marginBottom: 10 }}><label>Zone</label><input defaultValue="East Chennai" /></div>
        <button type="button" className="btn btn-primary btn-block" style={{ marginBottom: 10 }} onClick={() => notify('Profile saved')}>
          Save Profile
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
      <Link to="/" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>← Back to portal</Link>
    </div>
  )
}
