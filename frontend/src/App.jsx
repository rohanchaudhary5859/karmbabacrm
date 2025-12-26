import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main pages
import Dashboard from './pages/Dashboard';

// Client pages
import Clients from './pages/clients/Clients';
import ClientDetail from './pages/clients/ClientDetail';
import AddClient from './pages/clients/AddClient';
import EditClient from './pages/clients/EditClient';

// Interaction pages
import Interactions from './pages/interactions/Interactions';
import AddInteraction from './pages/interactions/AddInteraction';
import EditInteraction from './pages/interactions/EditInteraction';

// Task pages
import Tasks from './pages/tasks/Tasks';
import AddTask from './pages/tasks/AddTask';
import EditTask from './pages/tasks/EditTask';

// Segment pages
import Segments from './pages/segments/Segments';

// Report pages
import Reports from './pages/reports/Reports';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Client routes */}
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<AddClient />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/edit" element={<EditClient />} />
            
            {/* Interaction routes */}
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/interactions/new" element={<AddInteraction />} />
            <Route path="/interactions/:id/edit" element={<EditInteraction />} />
            
            {/* Task routes */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<AddTask />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            
            {/* Segment routes */}
            <Route path="/segments" element={<Segments />} />
            
            {/* Report routes */}
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;