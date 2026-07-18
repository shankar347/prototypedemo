import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Portal from './pages/Portal'

const UserApp = lazy(() => import('./apps/UserApp'))
const VendorApp = lazy(() => import('./apps/VendorApp'))
const DriverApp = lazy(() => import('./apps/DriverApp'))
const AdminApp = lazy(() => import('./apps/AdminApp'))

function AppLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8f7fa' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 42, height: 42, margin: '0 auto 12px', border: '3px solid #ebe5df', borderTopColor: '#e11d48', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#73737f', fontSize: 12, fontWeight: 700 }}>Loading your edit…</span>
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<Portal />} />
          <Route path="/user/*" element={<UserApp />} />
          <Route path="/vendor/*" element={<VendorApp />} />
          <Route path="/driver/*" element={<DriverApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </AppProvider>
  )
}
