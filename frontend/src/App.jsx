import React, { useState, useEffect } from 'react';

function App() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching clients:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ backgroundColor: '#f8f9fa', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Karm Baba CRM</h1>
      </header>
      <main>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Welcome to Karm Baba CRM</h2>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>Your CRM application is running successfully!</p>
          
          <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '15px' }}>Sample Clients</h3>
            {loading ? (
              <p style={{ color: '#6c757d' }}>Loading clients...</p>
            ) : (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #dee2e6' }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px' }}>{client.name}</td>
                        <td style={{ padding: '12px' }}>{client.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;