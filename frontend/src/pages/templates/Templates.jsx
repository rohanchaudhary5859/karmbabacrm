import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await axios.get('/api/email/templates', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTemplates(res.data.templates);
    } catch (err) {
      setError('Error loading templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <button 
          onClick={() => {
            setActiveTab('create');
            document.getElementById('template-modal').showModal();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Template
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-4 rounded shadow">
        {templates.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{template.name}</td>
                  <td className="p-2">{template.subject}</td>
                  <td className="p-2">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button 
                      onClick={() => {
                        // Set template data in modal for editing
                        setActiveTab('edit');
                        document.getElementById('template-modal').showModal();
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this template?')) {
                          // Delete template
                        }
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No email templates created yet</p>
            <button 
              onClick={() => {
                setActiveTab('create');
                document.getElementById('template-modal').showModal();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Your First Template
            </button>
          </div>
        )}
      </div>
      
      {/* Template Modal */}
      <dialog id="template-modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">
            {activeTab === 'create' ? 'Create Email Template' : 'Edit Email Template'}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Follow-up Email"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                placeholder="e.g., Following up on our conversation"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Body *
              </label>
              <textarea
                rows="10"
                placeholder="Use {{client.name}} and {{client.company}} as placeholders"
                className="w-full p-2 border rounded font-mono text-sm"
              ></textarea>
              <div className="text-sm text-gray-500 mt-1">
                Available placeholders: {'{{client.name}}'}, {'{{client.company}}'}
              </div>
            </div>
            
            <div className="modal-action">
              <button 
                type="button" 
                className="btn"
                onClick={() => document.getElementById('template-modal').close()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                {activeTab === 'create' ? 'Create Template' : 'Update Template'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}