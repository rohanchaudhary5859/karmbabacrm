import React from 'react'
import { Link } from 'react-router-dom'

function NavLink({ to, children }) {
  return <Link to={to} className="block px-3 py-2 rounded hover:bg-gray-100">{children}</Link>
}

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <div className="text-xl font-bold mb-6">Karm Baba</div>
        <nav className="space-y-1">
          <NavLink to="/manager/dashboard">Manager</NavLink>
          <NavLink to="/supplier/dashboard">Supplier</NavLink>
          <NavLink to="/buyer/dashboard">Buyer</NavLink>
          <NavLink to="/matchmaking">Matchmaking</NavLink>
          <NavLink to="/export/invoice">Export Docs</NavLink>
          <NavLink to="/subscription">Subscription</NavLink>
          <NavLink to="/whatsapp">WhatsApp</NavLink>
          <NavLink to="/chat">In-app Chat</NavLink>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
            <div className="font-semibold text-lg">Dashboard</div>
          </div>
          <div className="flex items-center gap-3">
            <input placeholder="Search leads, suppliers..." className="hidden sm:block border p-2 rounded" />
            <div className="px-3 py-2 bg-gray-100 rounded">Rohan</div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
