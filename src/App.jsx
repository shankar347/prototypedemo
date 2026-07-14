import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Portal from './pages/Portal'
import UserApp from './apps/UserApp'
import VendorApp from './apps/VendorApp'
import DriverApp from './apps/DriverApp'
import AdminApp from './apps/AdminApp'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/user/*" element={<UserApp />} />
        <Route path="/vendor/*" element={<VendorApp />} />
        <Route path="/driver/*" element={<DriverApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </AppProvider>
  )
}
