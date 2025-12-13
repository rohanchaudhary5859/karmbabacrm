import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'

// Pages
import Login from './pages/auth/Login'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import SupplierDashboard from './pages/supplier/SupplierDashboard'
import SupplierPerformance from './pages/performance/SupplierPerformance'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import InvoiceGenerator from './pages/export/InvoiceGenerator'
import EscrowPanel from './pages/escrow/EscrowPanel'
import MatchmakingPage from './pages/matchmaking/MatchmakingPage'
import SubscriptionPage from './pages/payments/Subscription'
import WhatsAppPage from './pages/whatsapp/WhatsAppPage'
import Catalog from './pages/supplier/Catalog'
import CategoryManager from './pages/manager/CategoryManager'
import ChatPanel from './pages/chat/ChatPanel'

import Layout from './components/Layout'

const RootRoutes = () => (
  <Layout>
    <Routes>
      <Route path='/' element={<ManagerDashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/manager/dashboard' element={<ManagerDashboard />} />
      <Route path='/manager/categories' element={<CategoryManager />} />
      <Route path='/supplier/dashboard' element={<SupplierDashboard />} />
      <Route path='/supplier/performance' element={<SupplierPerformance />} />
      <Route path='/supplier/catalog' element={<Catalog />} />
      <Route path='/buyer/dashboard' element={<BuyerDashboard />} />
      <Route path='/export/invoice' element={<InvoiceGenerator />} />
      <Route path='/escrow/panel' element={<EscrowPanel />} />
      <Route path='/matchmaking' element={<MatchmakingPage />} />
      <Route path='/subscription' element={<SubscriptionPage />} />
      <Route path='/whatsapp' element={<WhatsAppPage />} />
      <Route path='/chat' element={<ChatPanel />} />
    </Routes>
  </Layout>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<RootRoutes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
