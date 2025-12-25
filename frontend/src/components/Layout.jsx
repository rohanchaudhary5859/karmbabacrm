import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavLink({ to, children, exact = false }) {
  return (
    <Link 
      to={to} 
      className={({ isActive }) => 
        `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-blue-100 text-blue-700' : ''}`
      }
    >
      {children}
    </Link>
  );
}

export default function Layout({ children }){
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <div className="text-xl font-bold mb-6">Karm Baba CRM</div>
        <nav className="space-y-1">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/clients">Clients</NavLink>
          <NavLink to="/interactions">Interactions</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
        </nav>
      </aside>
      
      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
            <div className="font-semibold text-lg">Dashboard</div>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              placeholder="Search..." 
              className="hidden sm:block border p-2 rounded" 
            />
            
            <div className="relative group">
              <div className="px-3 py-2 bg-gray-100 rounded cursor-pointer">
                {user?.name || 'User'}
              </div>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded shadow-lg py-2 hidden group-hover:block z-10">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}